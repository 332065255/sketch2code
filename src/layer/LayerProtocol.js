/**
 * Layer 协议母类，供继承，子类需实现其方法
 */
let util = require('./../util') 
class LayerProtocol {
    constructor () {
        this.layer = {};
        this.parentLayer = {};
        this.selector = '';
        this.imagePath = '';
    }

    /**
     * 获取样式的 JSON Object
     * @returns {{}}
     */
    getStyle () {
        return {};
    }

    /**
     * 获取 html 片段
     * @param childString
     * @returns {string}
     */
    getHtml (childString) {
        return '';
    }
    getClass(name){
        return util.isReact?`className="${name}"`:`class="${name}"`
    }
}

module.exports = LayerProtocol;