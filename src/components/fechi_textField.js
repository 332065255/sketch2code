const util = require('../util');
const GroupLayer = require('../layer/Group');

class TextField extends GroupLayer {
    constructor () {
        super();
    }

    getStyle () {
        let otherStyl;
        let frameStyle = {
            position: 'absolute',
            left: util.px2rem(this.layer.frame.x),
            top: util.px2rem(this.layer.frame.y),
            width: util.px2rem(this.layer.frame.width),
            height: util.px2rem(this.layer.frame.height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity,
        };
        return Object.assign({}, frameStyle);
    }

    getHtml (childString) {
        let layer = this.layer;
        if(layer.overrides){
            layer.overrides.map(data=>{
                if(data.type == 'Override'){
                    childString = data.value;
                }
            })
        }
        layer.r_attribute = "";
        for(var name in layer.symbolJson){
            if(name == 'name') continue;
            const layerAttrValue = typeof layer.symbolJson[name] === 'string' ? `'${layer.symbolJson[name]}'` : `{${layer.symbolJson[name]}}`;
            layer.r_attribute += `${name} = ${layerAttrValue} `;
        }
        return `
            <div style={{${util.getReactStyleString(layer.finalStyle)}}}>
                <TextField ${layer.r_attribute} className="${layer.name}" ></TextField>
            </div>`;
    }
}

module.exports = TextField;
