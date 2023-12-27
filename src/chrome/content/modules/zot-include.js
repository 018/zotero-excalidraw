(function() {
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/moment.min.js');

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-objects.js');
    Zotero.ZoteroExcalidraw.Objects.init();
	
    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-selfs.js');
    Zotero.ZoteroExcalidraw.Selfs.init({ id, version, rootURI });
	
	Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zot-logger.js');
	Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-logger.js");
	Zotero.ZoteroExcalidraw.Logger.init();

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-zeteros.js');
    Zotero.ZoteroExcalidraw.Zoteros.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-zeteros.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-l10ns.js');
    Zotero.ZoteroExcalidraw.L10ns.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-l10ns.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-messages.js');
    Zotero.ZoteroExcalidraw.Messages.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-messages.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-datetimes.js');
    Zotero.ZoteroExcalidraw.DateTimes.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-datetimes.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-moments.js');
    Zotero.ZoteroExcalidraw.Moments.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-moments.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-prefs.js');
    Zotero.ZoteroExcalidraw.Prefs.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-prefs.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-notes.js');
    Zotero.ZoteroExcalidraw.Notes.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-notes.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-doms.js');
    Zotero.ZoteroExcalidraw.Doms.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-doms.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-events.js');
    Zotero.ZoteroExcalidraw.Events.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-events.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-items.js');
    Zotero.ZoteroExcalidraw.Items.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-items.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-searches.js');
    Zotero.ZoteroExcalidraw.Items.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-searches.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-collections.js');
    Zotero.ZoteroExcalidraw.Collections.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-collections.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-groups.js');
    Zotero.ZoteroExcalidraw.Groups.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-groups.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-readers.js');
    Zotero.ZoteroExcalidraw.Readers.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-readers.js");

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-clipboards.js');
    Zotero.ZoteroExcalidraw.Clipboards.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-clipboards.js");
    
    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-utils.js');
    Zotero.ZoteroExcalidraw.Utils.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-utils.js");
    
    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-protocols.js');
    Zotero.ZoteroExcalidraw.Protocols.init();
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-protocols.js");
    
})();