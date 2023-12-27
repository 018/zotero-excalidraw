var chromeHandle;

function install() {
	Zotero.debug("🤪zotero-excalidraw@zotero.org installed.");
}

async function startup({ id, version, rootURI }) {
	Services.scriptloader.loadSubScript(rootURI + '/chrome/content/modules/zot-include.js', { id, version, rootURI });
	Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zot-include.js");
	
	Zotero.ZoteroExcalidraw.Logger.log(rootURI);
	
	Zotero.PreferencePanes.register({
		pluginID: id,
		label: 'ZoteroExcalidraw',
		image: 'chrome://zotero-excalidraw/content/images/zotero-excalidraw.png',
		src: rootURI + 'chrome/content/preferences/preferences.xhtml',
		scripts: [rootURI + 'chrome/content/preferences/preferences.js'],
		helpURL: 'https://github.com/018/zotero-excalidraw',
	});

	var aomStartup = Cc["@mozilla.org/addons/addon-manager-startup;1"].getService(Ci.amIAddonManagerStartup);
    var manifestURI = Services.io.newURI(rootURI + "manifest.json");
    chromeHandle = aomStartup.registerChrome(manifestURI, [
        ["content", "zotero-excalidraw", rootURI + "chrome/content/"]
    ]);

	Zotero.ZoteroExcalidraw.Utils.afterRun(() => {
		const data = {
			"app_name": id,
			"app_version": version,
			"machineid": Zotero.ZoteroExcalidraw.Utils.getCurrentUsername(),
			"machinename": Zotero.version,
			"os": Zotero.platform + `${Services.appinfo.is64Bit ? '(64bits)' : ''}`,
			"os_version": '0'
		};
		Zotero.ZoteroExcalidraw.Logger.log('submit to 018soft.com', data);
		Zotero.HTTP.request(
			"POST",
			'http://api.018soft.com/authorization/anon/client/submit',
			{
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
				timeout: 30000
			}
		);
	}, 50);

    Services.scriptloader.loadSubScript(rootURI + 'zotero-excalidraw-dialog.js');
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zotero-excalidraw-dialog.js");

    Services.scriptloader.loadSubScript(rootURI + 'zotero-excalidraw-utils.js');
    Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zotero-excalidraw-utils.js");
	
	Services.scriptloader.loadSubScript(rootURI + 'zotero-excalidraw.js');
	Zotero.ZoteroExcalidraw.Logger.log("loadSubScript zotero-excalidraw.js");
	Zotero.ZoteroExcalidraw.init({ id, version, rootURI });
	Zotero.ZoteroExcalidraw.addToAllWindows();
	await Zotero.ZoteroExcalidraw.main();
	
}

function onMainWindowLoad({ window }) {
	Zotero.ZoteroExcalidraw.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	Zotero.ZoteroExcalidraw.removeFromWindow(window);
}

function shutdown() {
	Zotero.ZoteroExcalidraw.Logger.log("Shutdown.");
	chromeHandle.destruct();
	chromeHandle = null;

	Zotero.ZoteroExcalidraw.removeFromAllWindows();
	Zotero.ZoteroExcalidraw.shutdown();
	Zotero.ZoteroExcalidraw = undefined;
}

function uninstall() {
	Zotero.debug("🤪zotero-excalidraw@zotero.org Uninstalled.");
}
