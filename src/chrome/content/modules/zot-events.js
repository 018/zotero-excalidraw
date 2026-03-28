if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Events) Zotero.ZoteroExcalidraw.Events = {};

Zotero.ZoteroExcalidraw.Events = Object.assign(Zotero.ZoteroExcalidraw.Events, {
	itemsViewOnSelect: null,
	noteEditorKeyup: null,
	refreshItemMenuPopup: null,
	refreshCollectionMenuPopup: null,
	refreshStandaloneMenuPopup: null,
	refreshPaneItemMenuPopup: null,

	init() {
		// 注册事件
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Events inited.');
	},

	register({itemsViewOnSelect, noteEditorKeyup, refreshCollectionMenuPopup, refreshItemMenuPopup, refreshStandaloneMenuPopup, refreshPaneItemMenuPopup}) {
        this.itemsViewOnSelect = itemsViewOnSelect.bind(this); // Bind it here once
        this.noteEditorKeyup = noteEditorKeyup;
        this.refreshCollectionMenuPopup = refreshCollectionMenuPopup;
        this.refreshItemMenuPopup = refreshItemMenuPopup;
        this.refreshStandaloneMenuPopup = refreshStandaloneMenuPopup;
        this.refreshPaneItemMenuPopup = refreshPaneItemMenuPopup;
        
        const win = Zotero.getMainWindow();
        if (!win) {
            Zotero.ZoteroExcalidraw.Logger.log('Main window not ready. Cannot register events.');
            return;
        }

        // 1. ZOTERO 7 WAY to handle item selection (Using the built-in API, not the DOM)
        const zoteroPane = Zotero.getActiveZoteroPane();
        if (zoteroPane && zoteroPane.itemsView) {
            zoteroPane.itemsView.onSelect.addListener(this.itemsViewOnSelect);
            Zotero.ZoteroExcalidraw.Logger.log('itemsViewOnSelect registered via JS API.');
        }

        const doc = win.document;

        // Helper function to safely add event listeners without crashing if ID is missing
        const safeAddListener = (id, event, callback) => {
            const el = doc.getElementById(id);
            if (el) {
                el.addEventListener(event, callback, false);
                Zotero.ZoteroExcalidraw.Logger.log(`${event} registered on ${id}.`);
            } else {
                Zotero.ZoteroExcalidraw.Logger.log(`WARNING: Element ${id} not found in Zotero 7 DOM.`);
            }
        };

        // 2. Safely register UI events
        safeAddListener('zotero-note-editor', 'keyup', this.noteEditorKeyup);
        safeAddListener('zotero-collectionmenu', 'popupshowing', this.refreshCollectionMenuPopup);
        safeAddListener('zotero-itemmenu', 'popupshowing', this.refreshItemMenuPopup);
        safeAddListener('zotero-tb-note-add', 'popupshowing', this.refreshStandaloneMenuPopup);
        safeAddListener('context-pane-add-child-note-button-popup', 'popupshowing', this.refreshPaneItemMenuPopup);

        Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Events registered.');
    },

    shutdown() {
        const win = Zotero.getMainWindow();
        if (!win) return;
        const doc = win.document;

        // 1. Unregister JS API listener
        const zoteroPane = Zotero.getActiveZoteroPane();
        if (zoteroPane && zoteroPane.itemsView && this.itemsViewOnSelect) {
            zoteroPane.itemsView.onSelect.removeListener(this.itemsViewOnSelect);
            Zotero.ZoteroExcalidraw.Logger.log('itemsViewOnSelect removed.');
        }

        // Helper function to safely remove listeners
        const safeRemoveListener = (id, event, callback) => {
            if (!callback) return;
            const el = doc.getElementById(id);
            if (el) {
                el.removeEventListener(event, callback, false);
                Zotero.ZoteroExcalidraw.Logger.log(`${event} removed from ${id}.`);
            }
        };

        // 2. Safely remove UI events
        safeRemoveListener('zotero-note-editor', 'keyup', this.noteEditorKeyup);
        safeRemoveListener('zotero-collectionmenu', 'popupshowing', this.refreshCollectionMenuPopup);
        safeRemoveListener('zotero-itemmenu', 'popupshowing', this.refreshItemMenuPopup);
        safeRemoveListener('zotero-tb-note-add', 'popupshowing', this.refreshStandaloneMenuPopup);
        safeRemoveListener('context-pane-add-child-note-button-popup', 'popupshowing', this.refreshPaneItemMenuPopup);
    }
});