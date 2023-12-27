if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Messages) Zotero.ZoteroExcalidraw.Messages = {};

Zotero.ZoteroExcalidraw.Messages = Object.assign(Zotero.ZoteroExcalidraw.Messages, {
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Messages inited.');
	},

  warning(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.warning'), message);
  },

  success(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.success'), message);
  },

  error(window, message) {
    Zotero.alert(window || Zotero.getMainWindow(), Zotero.getString('general.error'), message);
  },

  confirm(window, message) {
    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    return ps.confirm(window || Zotero.getMainWindow(), Zotero.getString('general.warning'), message);
  }
});