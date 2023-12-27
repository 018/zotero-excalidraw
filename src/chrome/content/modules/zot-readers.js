if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Readers) Zotero.ZoteroExcalidraw.Readers = {};

Zotero.ZoteroExcalidraw.Readers = Object.assign(Zotero.ZoteroExcalidraw.Readers, {
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Readers inited.');
	},

  getSelectedReader() {
    return Zotero.Reader.getByTabID(Zotero.getMainWindow().Zotero_Tabs.selectedID);
  },

  getReaderSelectedText() {
    let currentReader = this.getSelectedReader();
    if (!currentReader) {
      return '';
    }
    let textareas = currentReader._iframeWindow.document.getElementsByTagName('textarea');

    for (let i = 0; i < textareas.length; i++) {
      if (textareas[i].style["z-index"] == -1 && textareas[i].style['width'] == '0px') {
        return textareas[i].value.replace(/(^\s*)|(\s*$)/g, '');
      }
    }
    return '';
  }
});