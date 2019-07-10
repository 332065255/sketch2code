const util = require('../util');
const LayerProtocol = require('./LayerProtocol');

class GroupLayer extends LayerProtocol {
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
        if(layer.name.indexOf('HIDE')!=-1||layer.name.indexOf('hide')!=-1){
            return ``;
        }
        // console.log(layer.name,layer.name.indexOf('2html_Animation')!=-1)
        return `<div id="${layer.id}" ${layer.name.indexOf('2html_Animation')!=-1?this.getClass(`${layer.name} html_ant`):this.getClass(`${layer.name}`)} style=${util.getStyleString(layer.finalStyle)}>
            ${layer.name.indexOf('2html_Animation')!=-1?"{this.animation()}":childString}
        </div>
        `;
    }
}

module.exports = GroupLayer;