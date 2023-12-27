if (!Zotero.ExcalidrawUtils) Zotero.ExcalidrawUtils = {};

Zotero.ExcalidrawUtils = Object.assign(Zotero.ExcalidrawUtils, {

  addRectangleElement: function (document, defaultStyle, text, link, x, y, backgroundColor) {
    const rectangleWidth = defaultStyle.width
    const fontSize = defaultStyle.fontSize
    const fontFamily = defaultStyle.fontFamily
    const rectangleX = x ? x : document.getElementById('content').clientWidth / 2 - rectangleWidth / 2
    const rectangleY = y ? y : document.getElementById('content').clientHeight / 4

    return ExcalidrawLib.convertToExcalidrawElements([
      {
        type: "rectangle",
        x: rectangleX,
        y: rectangleY,
        width: rectangleWidth,
        fillStyle: defaultStyle.fillStyle,
        strokeWidth: defaultStyle.strokeWidth,
        strokeStyle: defaultStyle.strokeStyle,
        roughness: defaultStyle.roughness,
        opacity: defaultStyle.opacity,
        strokeColor: `#${defaultStyle.strokeColor}`,
        backgroundColor: defaultStyle.backgroundColor === 'actual' ? backgroundColor : (defaultStyle.backgroundColor === 'transparent' ? defaultStyle.backgroundColor : `#${defaultStyle.backgroundColor}`),
        roundness: defaultStyle.strokeSharpness === 'round' ? {
          type: 3
        } : undefined,
        link: link,
        label: {
          type: "text",
          strokeColor: `#${defaultStyle.fontColor}`,
          opacity: defaultStyle.opacity,
          text: text,
          fontSize: fontSize,
          fontFamily: fontFamily,
          textAlign: defaultStyle.textAlign,
          verticalAlign: defaultStyle.verticalAlign
        },
      }])
  },

  addImageElement: function(document, width, height, x, y, link, fileId) {
    const imageWidth = width
    const imageHeight = height
    const imageX = x ? x : document.getElementById('content').clientWidth / 2 - imageWidth / 2
    const imageY = y ? y : document.getElementById('content').clientHeight / 2  - imageHeight / 2
    return ExcalidrawLib.convertToExcalidrawElements([{
			type: "image",
			fileId: fileId,
			x: imageX,
			y: imageY,
			width: imageWidth,
			height: imageHeight,
      link: link,
		}]);
  },

  generateUUID: function () {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  },

  generateFile: function(dataURL) {
    const fileid = this.generateUUID()
    const time = new Date().getTime()
    return {
      "mimeType": "image/png",
      "id": fileid,
      "created": time,
      "dataURL": dataURL
    }
  },

})



