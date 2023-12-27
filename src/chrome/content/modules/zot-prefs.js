'use strict'
if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Prefs) Zotero.ZoteroExcalidraw.Prefs = {};

Zotero.ZoteroExcalidraw.Prefs = Object.assign(Zotero.ZoteroExcalidraw.Prefs, {
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Prefs inited.');
	},

	get(pref, def) {
		let val = Zotero.Prefs.get(`${Zotero.ZoteroExcalidraw.Selfs.name}.${pref}`);
		// Zotero.ZoteroExcalidraw.Logger.log(`${pref} = ${val} `);
		return val !== undefined ? val : def;
	},

	set(pref, val) {
		Zotero.Prefs.set(`${Zotero.ZoteroExcalidraw.Selfs.name}.${pref}`, val);
	},

	clear(pref) {
		Zotero.Prefs.clear(`${Zotero.ZoteroExcalidraw.Selfs.name}.${pref}`);
	},

	getJson(pref, def) {
		let val = Zotero.Prefs.get(`${Zotero.ZoteroExcalidraw.Selfs.name}.${pref}`);
		// Zotero.ZoteroExcalidraw.Logger.log(`${pref} = ${val} `);
		return val !== undefined ? JSON.parse(val) : def;
	},

	getJsonValue(pref, key, def) {
		let json = this.getJson(pref);
		return json !== undefined && json[key] ? json[key] : def;
	},

	setJson(pref, val) {
		Zotero.Prefs.set(`${Zotero.ZoteroExcalidraw.Selfs.name}.${pref}`, JSON.stringify(val));
	},

	setJsonValue(pref, key, val) {
		let json = this.getJson(pref);
		if (!json) {
			json = {};
		}
		json[key] = val;
		this.setJson(pref, json);
	},
});