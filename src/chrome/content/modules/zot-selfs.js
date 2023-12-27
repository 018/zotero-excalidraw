if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Selfs) Zotero.ZoteroExcalidraw.Selfs = {};

Zotero.ZoteroExcalidraw.Selfs = Object.assign(Zotero.ZoteroExcalidraw.Selfs, {
	id: null,
  	name: null,
	version: null,
	rootURI: null,

	init({ id, version, rootURI }) {
		this.id = id;
		this.name = id.replace('@zotero.org', '');
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},
});