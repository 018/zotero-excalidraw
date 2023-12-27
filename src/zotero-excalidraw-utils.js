if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.ExcalidrawUtils) Zotero.ZoteroExcalidraw.ExcalidrawUtils = {};

Zotero.ZoteroExcalidraw.ExcalidrawUtils = Object.assign(Zotero.ZoteroExcalidraw.ExcalidrawUtils, {

  create: async function(libraryID, collection, parentItem, attachmentName) {
    // collection, item, attachment
    let initialData = {
      elements: [],
      appState: { viewBackgroundColor: "#ffffff", currentItemFontFamily: 1 },
      scrollToContent: true,
      libraryItems: []
    }

    attachmentName = attachmentName ? attachmentName : parentItem ? parentItem.getDisplayTitle() : (collection ? collection.name : Zotero.Libraries.get(libraryID).name);
    attachmentName += '.excalidraw';

    var tmpFile = Zotero.getTempDirectory();
    tmpFile.append(Zotero.isWin ? attachmentName.replace(/\\|\/|\:|\*|\?|\"|\<|\>|\|/g, '') : attachmentName);
    Zotero.File.putContents(tmpFile, JSON.stringify(initialData));
    attachment = await Zotero.Attachments.importFromFile({
      libraryID: libraryID,
      file: tmpFile,
      contentType: 'application/excalidraw',
      title: attachmentName,
      parentItemID: parentItem ? parentItem.id : undefined,
      collections: !parentItem && collection ? [collection.key] : undefined,
      moveFile: true
    });
    return attachment;
  },

  save: async function(attachment, content, imagebase64) {
    Zotero.File.putContents(Zotero.File.pathToFile(attachment.getFilePath()), JSON.stringify(content));
		if (imagebase64) {
			attachment.setNote(`<div data-schema-version=\"8\"><img src=\"${imagebase64}\" alt=\"\"></div>`);
			await attachment.saveTx();
    }
  },

  load: function(attachment) {
    return JSON.parse(Zotero.File.getContents(Zotero.File.pathToFile(attachment.getFilePath())));
  },

  viewExcalidraw: function(attachment) {
    if (attachment.parentItem) {
      Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, [{
        type: 'item',
        id: attachment.parentItem.id
      }]);
    } else {
      let items = [];
      let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
      if (collection) {
        items.push({
          type: 'collection',
          id: collection.id
        });
      } else if (items.getCollections().length > 0) {
        items.push({
          type: 'collection',
          id: items.getCollections()[0]
        });
      }
      Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, items);
    }
  }
})