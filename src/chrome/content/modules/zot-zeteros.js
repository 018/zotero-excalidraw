if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Zoteros) Zotero.ZoteroExcalidraw.Zoteros = {};

Zotero.ZoteroExcalidraw.Zoteros = Object.assign(Zotero.ZoteroExcalidraw.Zoteros, {
	mainTabID: 'zotero-pane',

	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Zoteros inited.');
	},

    debounce(fn, delay = 500) {
      var timer = null;
      return function () {
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(this, args);
        }.bind(this), delay);
      };
    },
});