const util = require('../util');
const GroupLayer = require('../layer/Group');

class Factory extends GroupLayer {
    constructor (tagname='div') {
        super();
        this._tagname = tagname;
        
    }

    getStyle () {
        let otherStyl;
        let frameStyle = {
            position: 'absolute',
            left: util.px2rem(this.layer.frame.x),
            top: util.px2rem(this.layer.frame.y),
            // width: util.px2rem(this.layer.frame.width),
            // height: util.px2rem(this.layer.frame.height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity,
        };
        return Object.assign({}, frameStyle);
    }

    getHtml (childString) {
        let layer = this.layer;
        let inDeep = layer.symbolJson.inDeep;
        delete layer.symbolJson['inDeep'];
        if(layer.overrides && !inDeep){
            layer.overrides.map(data=>{
                if(data.type == 'Override'){
                    childString = data.value;
                }
            })
        }
        
        layer.r_attribute = "";
        for(var name in layer.symbolJson){
            if(name == 'name') continue;
            const layerAttrValue = typeof layer.symbolJson[name] === 'string' ? `{'${layer.symbolJson[name]}'}` : `{${layer.symbolJson[name]}}`;
            layer.r_attribute += `${name} = ${layerAttrValue} `;
        }
        return inDeep?`
        <div style={{${util.getReactStyleString(layer.finalStyle)}}}>
            <${this._tagname} id="${layer.id}" ${layer.r_attribute} >${childString}</${this._tagname}>
        </div>`:
        `
            <div style={{${util.getReactStyleString(layer.finalStyle)}}}>
                <${this._tagname} id="${layer.id}" ${layer.r_attribute}  text="${childString}" ></${this._tagname}>
            </div>`;
    }
}

module.exports = Factory;