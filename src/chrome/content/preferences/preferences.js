if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};

Zotero.ZoteroExcalidraw.Preferences = {
	_l10n: new Localization(["preferences.ftl", "zotero-excalidraw.ftl"], true),

	init: function() {
		Zotero.ZoteroExcalidraw.Logger.ding();
	},

	backup: function() {
		let now = Zotero.ZoteroExcalidraw.DateTimes.formatDate(new Date(), Zotero.ZoteroExcalidraw.DateTimes.yyyyMMddHHmmss);
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		fp.init(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-backup'), Ci.nsIFilePicker.modeSave);
		fp.appendFilter('ZoteroExcalidraw Backup', '*.zotero-excalidraw');
		fp.defaultString = now;
		fp.open(function (returnConstant) {
			if (returnConstant === 0) {
				let file = fp.file;
				file.QueryInterface(Ci.nsIFile);
				let backup = {
					last_updated: now,
					normal: Zotero.ZoteroExcalidraw.Prefs.getJson('normal'),
					itemDefaultStyle: Zotero.ZoteroExcalidraw.Prefs.getJson('itemDefaultStyle'),
					annotationDefaultStyle: Zotero.ZoteroExcalidraw.Prefs.getJson('annotationDefaultStyle'),
					noteDefaultStyle: Zotero.ZoteroExcalidraw.Prefs.getJson('noteDefaultStyle'),
				};

				Zotero.File.putContents(Zotero.File.pathToFile(file.path + '.zotero-excalidraw'), JSON.stringify(backup));
				Zotero.ZoteroExcalidraw.Messages.success(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-backup-successful'));
			}
		}.bind(this))
	},

	restore: function() {
		let fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		fp.init(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-restore'), Ci.nsIFilePicker.modeOpen);
		fp.appendFilter('ZoteroExcalidraw Backup', '*.zotero-excalidraw');
		fp.open(function (returnConstant) {
			if (returnConstant === 0) {
				let file = fp.file;
				file.QueryInterface(Ci.nsIFile);
				let content = Zotero.File.getContents(file.path);
				if (content) {
					try {
						let backup = JSON.parse(content);
						if (backup.last_updated) {
							if (backup.normal) {
								Zotero.ZoteroExcalidraw.Prefs.setJson('normal', backup.normal);
							} else {
								Zotero.ZoteroExcalidraw.Prefs.clear('normal');
							}
							if (backup.itemDefaultStyle) {
								Zotero.ZoteroExcalidraw.Prefs.setJson('itemDefaultStyle', backup.itemDefaultStyle);
							} else {
								Zotero.ZoteroExcalidraw.Prefs.clear('itemDefaultStyle');
							}
							if (backup.annotationDefaultStyle) {
								Zotero.ZoteroExcalidraw.Prefs.setJson('annotationDefaultStyle', backup.annotationDefaultStyle);
							} else {
								Zotero.ZoteroExcalidraw.Prefs.clear('annotationDefaultStyle');
							}
							if (backup.noteDefaultStyle) {
								Zotero.ZoteroExcalidraw.Prefs.setJson('noteDefaultStyle', backup.noteDefaultStyle);
							} else {
								Zotero.ZoteroExcalidraw.Prefs.clear('noteDefaultStyle');
							}

							Zotero.ZoteroExcalidraw.Messages.success(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-restore-successful', {last_updated: backup.last_updated}));
						} else {
							Zotero.ZoteroExcalidraw.Messages.warning(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-restore-error-file'));
						}
					} catch (e) {
						Zotero.ZoteroExcalidraw.Messages.warning(window, e);
					}
				} else {
					Zotero.ZoteroExcalidraw.Messages.warning(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-restore-error-file'));
				}
			}
		}.bind(this))
	},

	reset: function() {
		if (Zotero.ZoteroExcalidraw.Messages.confirm(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-reset-confirm'))) {
			Zotero.ZoteroExcalidraw.Prefs.clear('normal');
			Zotero.ZoteroExcalidraw.Prefs.clear('itemDefaultStyle');
			Zotero.ZoteroExcalidraw.Prefs.clear('annotationDefaultStyle');
			Zotero.ZoteroExcalidraw.Prefs.clear('noteDefaultStyle');

			Zotero.ZoteroExcalidraw.Notes.noteBGColor(undefined);

			Zotero.ZoteroExcalidraw.Messages.success(window, this._l10n.formatValueSync('zotero-excalidraw-preferences-reset-successful'));
		}
	}
}
