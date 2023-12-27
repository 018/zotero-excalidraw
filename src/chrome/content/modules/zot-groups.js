if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Groups) Zotero.ZoteroExcalidraw.Groups = {};

Zotero.ZoteroExcalidraw.Groups = Object.assign(Zotero.ZoteroExcalidraw.Groups, {
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Groups inited.');
	},

  getZoteroItemUrl(key) {
    var groupID = this.getGroupIDByKey(key);
    return `zotero://select/groups/${groupID}/items/${key}`;
  },

  getZoteroCollectionUrl(key) {
    var groupID = this.getGroupIDByKey(key);
    return `zotero://select/groups/${groupID}/collections/${key}`;
  },

  getGroupIDByKey(key) {
    var groups = Zotero.Groups.getAll()
    var groupID
    for (let index = 0; index < groups.length; index++) {
      const element = groups[index];
      if (Zotero.Items.getIDFromLibraryAndKey(element.libraryID, key)) {
        groupID = element.id
        break
      }
    }

    return groupID
  },
  
});