if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Dialogs) Zotero.ZoteroExcalidraw.Dialogs = {};
Components.utils.import('resource://gre/modules/Services.jsm');

Zotero.ZoteroExcalidraw.Dialogs = Object.assign(Zotero.ZoteroExcalidraw.Dialogs, {

	// http://udn.realityripple.com/docs/Web/API/Window/open#Window_features

	openExcalidraw(attachmentID, items) {
		let io = {
			dataIn: {attachmentID, items}
		};
		let win = Zotero.getMainWindow().openDialog('chrome://zotero-excalidraw/content/excalidraw/excalidraw.html', 'excalidraw', 'chrome,menubar=no,toolbar=no,dialog=no,resizable,centerscreen,height=' + Zotero.getMainWindow().screen.availHeight + ',width=' + Zotero.getMainWindow().screen.availWidth, io);
		win.focus();
	},

	findExcalidrawTab(attachmentID) {
		let tab;
		for (let index = 0; index < Zotero.getMainWindow().Zotero_Tabs._tabs.length; index++) {
			const element = Zotero.getMainWindow().Zotero_Tabs._tabs[index];
			if (element.id === 'zotero-excalidraw-' + attachmentID) {
				tab = element;
				break;
			}
		}
		return tab;
	},

	async openExcalidrawTab(attachmentID, items) {
		let tab = this.findExcalidrawTab(attachmentID);
		if (tab) {
			Zotero.getMainWindow().Zotero_Tabs.select(tab.id);
			return;
		}

		let { id, container } = Zotero.getMainWindow().Zotero_Tabs.add({
			id: 'zotero-excalidraw-' + attachmentID,
			type: 'library',
			title: Zotero.ZoteroExcalidraw.L10ns.getString('zotero-excalidraw-title'),
			index: Zotero.getMainWindow().Zotero_Tabs._tabs.length,
			data: {
				dataIn: {attachmentID, items}
			},
			select: true,
			preventJumpback: true,
			onClose: () => {
				Zotero.getMainWindow().Zotero_Tabs.select('zotero-pane');
			}
		});
		
		let iframe = Zotero.getMainWindow().document.createXULElement('browser');
		iframe.setAttribute('class', 'zotero-excalidraw');
		iframe.setAttribute('flex', '1');
		iframe.setAttribute('type', 'content');
		iframe.setAttribute('src', 'chrome://zotero-excalidraw/content/excalidraw/excalidraw.html');
		container.appendChild(iframe);

		iframe.docShell.windowDraggingAllowed = true;
	},

});