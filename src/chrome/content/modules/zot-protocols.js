'use strict'
if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Protocols) Zotero.ZoteroExcalidraw.Protocols = {};

Zotero.ZoteroExcalidraw.Protocols = Object.assign(Zotero.ZoteroExcalidraw.Protocols, {
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Protocols inited.');
	},

	select(url) {
		if (this.isOpenPdf(url)) {
			this.openPdf(url);
		} else if (this.isItem(url)) {
			this.selectItem(url);
		} else if (this.isCollection(url)) {
			this.selectCollection(url);
		} else if (this.isGroupItem(url)) {
			this.selectGroupItem(url);
		} else if (this.isGroupCollection(url)) {
			this.selectGroupCollection(url);
		} else {
			Zotero.ZoteroExcalidraw.Messages.warning(undefined, 'Not supported URL');
		}
	},

	isOpenPdf(url) {
		return /zotero\:\/\/open-pdf\/library\/items\/[0-9A-Z]{8}/.test(url);
	},

	// zotero://open-pdf/'
	// zotero://open-pdf/library/items/88NQT7E9?page=1&annotation=N9J9GZH3
	openPdf: async function (url) {
		var userLibraryID = Zotero.Libraries.userLibraryID;
		var itemKey, page, annotationKey;
		let matchs = url.match(/zotero\:\/\/open-pdf\/library\/items\/([0-9A-Z]{8})/);
		if (matchs) {
			itemKey = matchs[1];
		}
		matchs = url.match(/zotero\:\/\/open-pdf\/library\/items\/[0-9A-Z]{8}.*page=(\d*)/);
		if (matchs) {
			page = parseInt(matchs[1]);
		}
		matchs = url.match(/zotero\:\/\/open-pdf\/library\/items\/[0-9A-Z]{8}.*annotation=([0-9A-Z]{8})/);
		if (matchs) {
			annotationKey = matchs[1];
		}

		var item = Zotero.Items.getByLibraryAndKey(userLibraryID, itemKey);
		
		if (!item.isFileAttachment()) {
			Zotero.warn(`Item for ${uriPath} is not a file attachment`);
			return;
		}
		
		var path = await item.getFilePathAsync();
		if (!path) {
			Zotero.warn(`${path} not found`);
			return;
		}
		
		if (!path.toLowerCase().endsWith('.pdf')
				&& Zotero.MIME.sniffForMIMEType(await Zotero.File.getSample(path)) != 'application/pdf') {
			Zotero.warn(`${path} is not a PDF`);
			return;
		}
		
		var opened = false;
		if (page || annotationKey) {
			try {
				opened = await Zotero.OpenPDF.openToPage(item, page, annotationKey);
			}
			catch (e) {
				Zotero.logError(e);
			}
		}
		
		// If something went wrong, just open PDF without page
		if (!opened) {
			Zotero.debug("Launching PDF without page number");
			let zp = Zotero.getActiveZoteroPane();
			// TODO: Open pane if closed (macOS)
			if (zp) {
				zp.viewAttachment([item.id]);
			}
			return;
		}
		Zotero.Notifier.trigger('open', 'file', item.id);
	},
	
	isItem(url) {
		return /zotero\:\/\/select\/library\/items\/[0-9A-Z]{8}/.test(url);
	},

	// zotero://select/library/items/88NQT7E9
	selectItem: async function (url) {
		var userLibraryID = Zotero.Libraries.userLibraryID;
		var itemKey;
		let matchs = url.match(/zotero\:\/\/select\/library\/items\/([0-9A-Z]{8})/);
		if (matchs) {
			itemKey = matchs[1];
		}

		var item = Zotero.Items.getByLibraryAndKey(userLibraryID, itemKey);
		
		Zotero.ZoteroExcalidraw.Items.selectItem(undefined, item.id);
	},
	
	isCollection(url) {
		return /zotero\:\/\/select\/library\/collections\/[0-9A-Z]{8}/.test(url);
	},

	// zotero://select/library/collections/88NQT7E9
	selectCollection: async function (url) {
		var userLibraryID = Zotero.Libraries.userLibraryID;
		var collectionKey;
		let matchs = url.match(/zotero\:\/\/select\/library\/collections\/([0-9A-Z]{8})/);
		if (matchs) {
			collectionKey = matchs[1];
		}

		var collection = Zotero.Collections.getByLibraryAndKey(userLibraryID, itemKey);
		
		Zotero.ZoteroExcalidraw.Collections.selectCollection(collection.id);
	},
	
	isGroupItem(url) {
		return /zotero\:\/\/select\/groups\/\d*\/items\/[0-9A-Z]{8}/.test(url);
	},

	// zotero://select/groups/4657409/items/VEJS37IU
	selectGroupItem: async function (url) {
		let groupID, itemKey;
		let matchs = url.match(/zotero\:\/\/select\/groups\/(\d*)/);
		if (matchs) {
			groupID = matchs[1];
		}
		matchs = url.match(/zotero\:\/\/select\/groups\/\d*\/items\/([0-9A-Z]{8})/);
		if (matchs) {
			itemKey = matchs[1];
		}

		let libraryID = Zotero.Groups.getLibraryIDFromGroupID(groupID);
		let item = Zotero.Items.getByLibraryAndKey(libraryID, itemKey);
		
		Zotero.ZoteroExcalidraw.Items.selectItem(undefined, item.id);
	},
	
	isGroupCollection(url) {
		return /zotero\:\/\/select\/groups\/\d*\/collections\/[0-9A-Z]{8}/.test(url);
	},

	// zotero://select/groups/4657409/collections/VEJS37IU
	selectGroupCollection: async function (url) {
		let groupID, collectionKey;
		let matchs = url.match(/zotero\:\/\/select\/groups\/(\d*)/);
		if (matchs) {
			groupID = matchs[1];
		}
		matchs = url.match(/zotero\:\/\/select\/groups\/\d*\/collections\/([0-9A-Z]{8})/);
		if (matchs) {
			collectionKey = matchs[1];
		}

		let libraryID = Zotero.Groups.getLibraryIDFromGroupID(groupID);
		var collection = Zotero.Collections.getByLibraryAndKey(libraryID, itemKey);
		
		Zotero.ZoteroExcalidraw.Items.selectCollection(collection.id);
	},
});