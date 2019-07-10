const StyleStore = require('../store/StyleStore');
const Layer = require('../layer/LayerFactory');
const SymbolStore = require('../store/SymbolStore');
const htmlRender = function (layer, parentLayer, imagePath = '') {
    if (!layer.isVisible) {
        return '';
    }
    if (layer.type == 'symbolInstance') {
        if(SymbolStore.get(layer.symbolID))
        layer.childrens = SymbolStore.get(layer.symbolID).childrens;
    }
    let childString = '';
    if (layer.type === 'text') {
        childString = layer.text;
    } else if (layer.childrens) {
        layer.childrens.forEach((child) => {
            childString += htmlRender(child, layer, imagePath);
        });
    }
    // console.log('childString',childString,'layer.type',layer.type)
    let layerInstance = new Layer();
    layerInstance.layer = layer;
    // console.log(layer.name)
    layerInstance.parentLayer = parentLayer;
    
    layerInstance.imagePath = imagePath;
    return layerInstance.getHtml(childString);
};

module.exports = htmlRender;