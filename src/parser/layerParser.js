const util = require('./../util.js');
const SymbolStore = require('./../store/SymbolStore');
const styleParser = require('./styleParser');
const pathParser = require('./pathParser');
// const pinyin = require('node-pinyin');
const pinyin =require('pinyin');
const components = require('./../components/index');
const nameStore = [];
const rename = function (name) {
    let index = 1;
    let nextName = name;

    while (nameStore.indexOf(nextName) !== -1) {
        nextName = name + '_' + (index++);
    }
    return nextName;
};
const handleItem = function (item) {
    // console.log('item_name:',item.name)
    let result = {};
    result.id = item.do_objectID;
    result.frame = item.frame || {};
    result.style = styleParser(item.style, item.attributedString, item);
    
    result.path = pathParser(item);
    result.isVisible = item.isVisible;
    let name = item.name ? item.name : '未命名';
    if(name.indexOf('2html_Animation')==-1)
    {
        name = name.replace(/[\u4e00-\u9fa5]*/, function (m) {
            return pinyin(m, {
                style: 'STYLE_NORMAL'
            });
        }).replace(/^([^a-z_A-Z])/, '_$1').replace(/[^a-z_A-Z0-9-]/g, '_');
    
        result.name = rename(name);
    }else{
        result.name = name;
    }
    
    nameStore.push(result.name);
    result.type = item._class;
    
    if (item._class === 'oval') {
        result.isCircle = util.isCircle(item);
        if (result.isCircle) {
            const p1 = util.toPoint(item.points[0].point, item);
            const p2 = util.toPoint(item.points[1].point, item);
            const p3 = util.toPoint(item.points[2].point, item);
            const p4 = util.toPoint(item.points[3].point, item);
            result.style.borderRadius = (p1.y - p3.y) / 2;
        }
    }
    result.isMask = !!item.hasClippingMask;
    if (item._class === 'rectangle') {
        result.isRect = util.isRect(item);
        if(util.getRectRadius(item)!=-1&&util.getRectRadius(item)!=undefined){
            //解决了奇怪的圆角矩形判断不是矩形的情况
            result.isRect = true;
            result.style.borderRadius = util.getRectRadius(item);
        }
    }
    if (item._class === 'text') {
        if(item.attributedString&&item.attributedString.string){
            result.text = item.attributedString.string
        }else{
            result.text = result.style.text || item.name;
        }
        
    }
    if (item._class === 'bitmap') {
        if(item.image._ref.indexOf('.png')==-1&&item.image._ref.indexOf('.jpg')==-1)
        result.image = item.image._ref + '.png';
        else
        result.image = item.image._ref

        if(util.isReact){
           
        }
    }
    if (item._class === 'artboard') {
        result.frame.x = null;
        result.frame.y = null;
    }
    if(item.symbolID) {
        result.symbolID = item.symbolID;
        if(result.symbolID.split('&').length>1)
        {
            result.symbolJson =JSON.parse(result.symbolID.split('&')[0]);
            result.overrideValues = item.overrideValues;
        }
        // if(item.do_objectID.indexOf('&')!=-1){
        //     result.onlyCom = item.do_objectID.split('&')[0];
        // }
    }
    // if(item._class=='rectangle'){
    //     console.log(result)
    // }
    return result;
};

const layerParser = function (item) {
    let element = {};
    element = handleItem(item);

    if(element.symbolJson&&element.symbolJson.name&&components[element.symbolJson.name]){

    }else{
        if(item.name.indexOf('2html_Animation')!=-1){
            //把动画部分空出来处理动画部分 
        } else if(item.name.indexOf('HIDE')!=-1||item.name.indexOf('hide')!=-1) {
            //隐藏的元素
        } else if (item.layers) {
            element.childrens = [];
            while(item.layers.length>0){
                let _item =item.layers.shift();
                if(_item.hasClippingMask){
                    _item.layers = item.layers.slice();
                    // console.log(_item.layers)
                    item.layers.length=0;
                }
                let r = layerParser(_item);
                if (r) {
                    element.childrens.push(r);
                }
                
                // console.log('遮罩属性:',_item.hasClippingMask)
            }

        }
    }
    if (element.type === 'symbolMaster') {
        SymbolStore.set(element.symbolID,element);
    }
    return element;
};

module.exports = layerParser;