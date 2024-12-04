if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};

Zotero.ZoteroExcalidraw = Object.assign(Zotero.ZoteroExcalidraw, {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],
	addedWordElementIDs: [],
	_notifierID: 0,

	// ####### init #######
	
	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;

		// Add a stylesheet to the main Zotero pane
		let link1 = Zotero.getMainWindow().document.createElement('link');
		link1.id = 'zotero-excalidraw-stylesheet';
		link1.type = 'text/css';
		link1.rel = 'stylesheet';
		link1.href = this.rootURI + `style-${Zotero.isMac ? 'mac' : 'win'}.css`;
		Zotero.getMainWindow().document.documentElement.appendChild(link1);
		this.storeAddedElement(link1);

		// Use Fluent for localization
		Zotero.getMainWindow().MozXULElement.insertFTLIfNeeded("zotero-excalidraw.ftl");

		this.registerEvent();

		Zotero.getMainWindow().ZoteroPane.viewItems = Zotero.Promise.coroutine(function* (items, event) {
			Zotero.ZoteroExcalidraw.Logger.log('ZoteroPane.viewItems');
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (item.isRegularItem()) {
					// Prefer local file attachments
					let attachment = yield item.getBestAttachment();
					if (attachment) {
						yield Zotero.getMainWindow().ZoteroPane.viewAttachment(attachment.id, event);
						continue;
					}
					
					// Fall back to URI field, then DOI
					var uri = item.getField('url');
					if (!uri) {
						var doi = item.getField('DOI');
						if (doi) {
							// Pull out DOI, in case there's a prefix
							doi = Zotero.Utilities.cleanDOI(doi);
							if (doi) {
								uri = "http://dx.doi.org/" + Zotero.getMainWindow().ZoteroPane.encodeURIComponent(doi);
							}
						}
					}
					
					// Fall back to first attachment link
					if (!uri) {
						let attachmentID = item.getAttachments()[0];
						if (attachmentID) {
							let attachment = yield Zotero.Items.getAsync(attachmentID);
							if (attachment) uri = attachment.getField('url');
						}
					}
					
					if (uri) {
						this.loadURI(uri, event);
					}
				}
				else if (item.isNote()) {
					var type = Zotero.Libraries.get(item.libraryID).libraryType;
					if (!Zotero.getMainWindow().ZoteroPane.collectionsView.editable) {
						continue;
					}
					Zotero.getMainWindow().ZoteroItemPane.openNoteWindow();
				}
				else if (item.isAttachment()) {
					if (item.attachmentContentType === 'application/excalidraw') {
						Zotero.ZoteroExcalidraw.ExcalidrawUtils.viewExcalidraw(item);
					} else {
						yield Zotero.getMainWindow().ZoteroPane.viewAttachment(item.id, event);
					}
				}
			}
		});

		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw inited.');
	},
	
	createCollectionMenu() {
		let allowTypes = ['collection'];
		let type = Zotero.getMainWindow().ZoteroPane.getCollectionTreeRow().type;
		Zotero.ZoteroExcalidraw.Logger.log(type);

		let root = 'zotero-collectionmenu';
		let zotero_collectionmenu = Zotero.getMainWindow().document.getElementById(root);

		let menuseparator = Zotero.ZoteroExcalidraw.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotero-excalidraw-separator1`,
			parent: zotero_collectionmenu,
		});
		this.storeAddedElement(menuseparator);
		menuseparator.disabled = !allowTypes.includes(type) || Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID() !== Zotero.Libraries.userLibraryID;

		let zotero_excalidrawManager = Zotero.ZoteroExcalidraw.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotero-excalidraw`,
			attrs: {
				'data-l10n-id': 'zotero-excalidraw',
			},
			command: () => {
				this.collectionExcalidraw();
			},
			parent: zotero_collectionmenu,
		});
		zotero_excalidrawManager.lable = 'excalidraw';
		this.storeAddedElement(zotero_excalidrawManager);
		zotero_excalidrawManager.disabled = !allowTypes.includes(type) || Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID() !== Zotero.Libraries.userLibraryID;
	},

	createItemMenu() {
		let items = Zotero.ZoteroExcalidraw.Items.getSelectedItems();
		let enabled = items.find(item => item.isRegularItem() || item.isNote() ||
			(item.isFileAttachment() && ['application/excalidraw', 'application/pdf'].includes(item.attachmentContentType))) &&
			Zotero.getMainWindow().ZoteroPane.getSelectedLibraryID() === Zotero.Libraries.userLibraryID;

		let root = 'zotero-itemmenu';
		let zotero_itemmenu = Zotero.getMainWindow().document.getElementById(root);
		let menuseparator = Zotero.ZoteroExcalidraw.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotero-excalidraw-separator1`,
			parent: zotero_itemmenu
		});
		this.storeAddedElement(menuseparator);

		Zotero.ZoteroExcalidraw.Logger.ding();

		// ZoteroExcalidraw
		let zotero_excalidrawMenu = Zotero.ZoteroExcalidraw.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotero-excalidraw-menuitem`,
			command: () => {
				this.itemExcalidraw();
			},
			attrs: {
				'data-l10n-id': 'zotero-excalidraw',
			},
			parent: zotero_itemmenu
		});
		zotero_excalidrawMenu.lable = 'excalidraw';
		zotero_excalidrawMenu.disabled = !enabled;
		this.storeAddedElement(zotero_excalidrawMenu);
	},

	createPaneMenu() {
		let root = 'context-pane-add-child-note-button-popup';
		let elPanePopup = Zotero.getMainWindow().document.getElementById(root);
		let menuseparator1 = Zotero.ZotCard.Doms.createMainWindowXULMenuSeparator({
			id: `${root}-zotero-excalidraw-separator1`,
			parent: elPanePopup
		});
		this.storeAddedElement(menuseparator1);

		// zotero-excalidraw
		menuitem = Zotero.ZotCard.Doms.createMainWindowXULElement('menuitem', {
			id: `${root}-zotero-excalidraw`,
			command: () =>{
				this.attachmentExcalidraw();
			},
			attrs: {
				'data-l10n-id': 'zotero-excalidraw',
			},
			parent: elPanePopup
		});
		this.storeAddedElement(menuitem);
	},

	
	paneCardManager() {
		var reader = Zotero.ZotCard.Readers.getSelectedReader();
		if (reader) {
			let items = [{
				type: Zotero.ZotCard.Consts.cardManagerType.item,
				id: Zotero.Items.get(reader.itemID).parentID
			}];
			Zotero.ZotCard.Dialogs.openCardManager(items);
		}
	},

	createStandaloneMenu() {
		let root = 'zotero-tb-note-add-popup';
		let zotero_tb_note_add_menupopup = Zotero.ZoteroExcalidraw.Doms.getMainWindowQuerySelector('#zotero-tb-note-add menupopup');

	},

	registerEvent() {
		this._notifierID = Zotero.Notifier.registerObserver(this, ['tab'], 'zotero-excalidraw');

		Zotero.ZoteroExcalidraw.Events.register({
			itemsViewOnSelect: this.itemsViewOnSelect.bind(this),
			noteEditorKeyup: this.noteEditorKeyup.bind(this),
			refreshCollectionMenuPopup: this.refreshCollectionMenuPopup.bind(this),
			refreshItemMenuPopup: this.refreshItemMenuPopup.bind(this),
			refreshStandaloneMenuPopup: this.refreshStandaloneMenuPopup.bind(this),
			refreshPaneItemMenuPopup: this.refreshPaneItemMenuPopup.bind(this)
		});
	},

	// #####################


	// ####### menu event #######

	async collectionExcalidraw() {
		Zotero.ZoteroExcalidraw.Logger.ding();
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		if (!collection) {
			return;
		}

		Zotero.ZoteroExcalidraw.Logger.ding();
		let attachment = await Zotero.ZoteroExcalidraw.ExcalidrawUtils.create(collection.libraryID, collection);

		Zotero.ZoteroExcalidraw.Logger.ding();
		let items = [];
		items.push({
			type: 'collection',
			id: collection.id
		});
		Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, items);
	},

	async itemExcalidraw() {
		let selectedItems = Zotero.ZoteroExcalidraw.Items.getSelectedItems();
		let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
		if (selectedItems.length === 1) {
			let item = selectedItems[0];
			if (item.isFileAttachment()) {
				if (item.attachmentContentType === 'application/excalidraw') {
					Zotero.ZoteroExcalidraw.ExcalidrawUtils.viewExcalidraw(item);
				} else if (item.attachmentContentType === 'application/pdf') {
					let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
					let attachment = await Zotero.ZoteroExcalidraw.ExcalidrawUtils.create(collection.libraryID, collection, item.parentItem, item.parentItem ? item.parentItem.getDisplayTitle() : item.getDisplayTitle());
					Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, [{
						type: 'attachment',
						id: item.id
					}]);
				}
			} else if (item.isRegularItem()) {
				let attachment = await Zotero.ZoteroExcalidraw.ExcalidrawUtils.create(item.libraryID, collection, item);
				Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, [{
					type: 'item',
					id: item.id
				}]);
			} else if (item.isNote()) {
				let attachment = await Zotero.ZoteroExcalidraw.ExcalidrawUtils.create(collection.libraryID, collection, item.parentItem);
				Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, [{
					type: 'note',
					id: item.id
				}]);
			}
		} else {
			let attachment = await Zotero.ZoteroExcalidraw.ExcalidrawUtils.create(collection.libraryID, collection);
			let items = [];
			selectedItems.forEach(item => {
				if (item.isNote()) {
					items.push({
						type: 'note',
						id: item.id
					});
				} else if (item.isRegularItem()) {
					items.push({
						type: 'item',
						id: item.id
					});
				} else if (item.isFileAttachment() && item.attachmentContentType === 'application/pdf') {
					items.push({
						type: 'attachment',
						id: item.id
					});
				}
			});
			Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, items);
		}
	},

	async attachmentExcalidraw() {
		var reader = Zotero.ZotCard.Readers.getSelectedReader();
		if (reader) {
			let item = Zotero.Items.get(reader.itemID);
			if (item.isFileAttachment()) {
				if (item.attachmentContentType === 'application/excalidraw') {
					Zotero.ZoteroExcalidraw.ExcalidrawUtils.viewExcalidraw(item);
				} else if (item.attachmentContentType === 'application/pdf') {
					let collection = Zotero.getMainWindow().ZoteroPane.getSelectedCollection();
					let attachment = await Zotero.ZoteroExcalidraw.ExcalidrawUtils.create(collection.libraryID, collection, item.parentItem, item.parentItem ? item.parentItem.getDisplayTitle() : item.getDisplayTitle());
					Zotero.ZoteroExcalidraw.Dialogs.openExcalidrawTab(attachment.id, [{
						type: 'attachment',
						id: item.id
					}]);
				}
			}
		}
	},

	// #####################

	
	// ####### Zotero事件 #######

	notify: function (event, type, ids, extraData) {
		// 新增
		// Zotero.ZoteroExcalidraw.Logger.log(`event:${event}, type:${type}, ids:${JSON.stringify(ids)}`);
		switch (type) {
			case 'item':
				break;
		
			default:
				break;
		}
	},

	itemsViewOnSelect() {
		Zotero.ZoteroExcalidraw.Logger.ding();
	},

	noteEditorKeyup(e) {
		// You do not need to add it. It automatically triggers itemsViewOnSelect.
	},

	refreshCollectionMenuPopup () {
		this.createCollectionMenu();
	},

	refreshItemMenuPopup(e) {
		Zotero.ZoteroExcalidraw.Logger.log(e.target.id);

		if (e.target.id !== 'zotero-itemmenu') {
			return;
		}
		
		this.createItemMenu();
	},

	refreshPaneItemMenuPopup() {
		this.createPaneMenu();
	},

	refreshStandaloneMenuPopup() {
		this.createStandaloneMenu();
	},

	// #####################

	addToWindow(window) {
	},

	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},

	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		if (!this.addedElementIDs.includes(elem.id)) {
			this.addedElementIDs.push(elem.id);
		}
	},

	storeAddedWordElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		if (!this.addedWordElementIDs.includes(elem.id)) {
			this.addedWordElementIDs.push(elem.id);
		}
	},

	removeAddedWordElement(prefix) {
		let dels = [];
		for (let index = this.addedWordElementIDs.length - 1; index >= 0; index--) {
			let id = this.addedWordElementIDs[index];
			if (!prefix || id.startsWith(prefix)) {
				Zotero.getMainWindow().document.getElementById(id)?.remove();
				dels.push(index);
			}
		}
		dels.forEach(index => {
			this.addedWordElementIDs.splice(index, 1);
		});
	},
	
	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="zotero-excalidraw.ftl"]').remove();
		this.removeAddedWordElement();
		this._clearTabTimedRun();
	},

	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},

	shutdown() {
		Zotero.Notifier.unregisterObserver(this.notifierID);
		Zotero.ZoteroExcalidraw.Events.shutdown();
	},

	async main() {
		// Global properties are included automatically in Zotero 7
		var host = new URL('https://github.com/018/zotero-excalidraw').host;
		Zotero.ZoteroExcalidraw.Logger.log(`Host is ${host}`);

		// Retrieve a global pref
		Zotero.ZoteroExcalidraw.Logger.log(`Intensity is ${Zotero.Prefs.get('extensions.make-it-red.intensity', true)}`);
	},

	_clearTabTimedRun() {
		if (this._tab_timed_interval > 0) {
			Zotero.ZoteroExcalidraw.Utils.clearTimedRun(this._tab_timed_interval);
			Zotero.ZoteroExcalidraw.Logger.log('clear timedrun ' + this._tab_timed_interval);
			this._tab_timed_interval = 0;
		}
	},
});