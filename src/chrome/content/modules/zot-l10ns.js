if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.L10ns) Zotero.ZoteroExcalidraw.L10ns = {};

Zotero.ZoteroExcalidraw.L10ns = Object.assign(Zotero.ZoteroExcalidraw.L10ns, {
  _l10n: new Localization(["zotero-excalidraw.ftl"], true),
  
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.L10ns inited.');
	},
  
  getString(name, params) {
    if (params) {
      return this._l10n.formatValueSync(name, params);
    }

    return this._l10n.formatValueSync(name);
  },
  
  getStringFtl(ftl, name, params) {
    let l10n = new Localization([ftl], true);
    if (params) {
      return this.l10n.formatValueSync(name, params);
    }

    return this.l10n.formatValueSync(name);
  }
});