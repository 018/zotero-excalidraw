if (!Zotero.ZoteroExcalidraw) Zotero.ZoteroExcalidraw = {};
if (!Zotero.ZoteroExcalidraw.Searches) Zotero.ZoteroExcalidraw.Searches = {};

Zotero.ZoteroExcalidraw.Searches = Object.assign(Zotero.ZoteroExcalidraw.Searches, {
	init() {
		Zotero.ZoteroExcalidraw.Logger.log('Zotero.ZoteroExcalidraw.Searches inited.');
	},
  
  links(searchID) {
    let links = [];
    let search = Zotero.Searches.get(searchID);
    if (search) {
      links.push({type: 'library', dataObject: Zotero.Libraries.get(search.libraryID)});
      links.push({type: 'search', dataObject: search});
      return links;
    } else {
      return false;
    }
  }
});