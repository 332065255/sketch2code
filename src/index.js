
const StyleStore = require('./store/StyleStore');
const layerParser = require('./parser/layerParser');
const styleRender = require('./render/styleRender');
const htmlRender = require('./render/htmlRender');
const template = require('./template/template');
const util = require('./util.js');
var outPages = [];
var outResults = [];
var UI = require('sketch/ui')
var dom = require('sketch/dom');
var fs = require('@skpm/fs');
const { execSync } = require('@skpm/child_process');
var _path="";
export default function(){
    var document = dom.getSelectedDocument();
    var pages = (document.selectedLayers.layers[0])
    _path = (document.path+"");
    _path = _path.substring(0,_path.lastIndexOf('/'))
    execSync(`rm -rf ${_path+"/output/*"};unzip -o ${document.path} -d ${_path+"/output"};`)
    console.log('解压缩完成')
    util.mkdir(`${_path+"/output/html"}`)
    // 复制图片到结果文件夹
    if(fs.existsSync(_path+'/output/images')){
        execSync(`cp -rf ${_path+"/output/images"} ${_path+"/output/html/images"}`)
    }
    // 读取每个 page 的信息
    let files = fs.readdirSync(_path+'/output/pages');
    let fileStore = {};
    files.forEach((f) => {
        fileStore[f] = JSON.parse(fs.readFileSync(_path+'/output/pages/' + f).toString());
    });
    outPages = [];
    outResults = [];
    // 对每个页面进行处理解析
    files.forEach((f, i) => {
        let data = fileStore[f];
        let result = layerParser(data);
        outResults.push(result);
    });
    outResults.forEach((result) => {
        if(result.type === 'page'&&result.name.indexOf('Symbols')==-1) {
            handleArtBoard(result, `page-${result.name}`);

            if(fs.existsSync(_path+'/output/images')){
                util.mkdir(`${_path+"/output/html/page-"+result.name+""}`)
                execSync(`cp -rf ${_path+"/output/images"} ${_path+"/output/html/page-"+result.name+"/images"}`)
            }
            
            execSync(`open ${_path}/output/html/page-${result.name}/`);
        }
    });
    // 输出模板页面 js 中的页面配置数据
}
/**
 * 以 ArtBoard 为单位输出页面
 * @param layer
 * @param pageName
 */
const handleArtBoard = (layer, pageName) => {
    if(layer.type == 'artboard') {
        StyleStore.reset();
        styleRender(layer, null,util.isReact?'./':'../');
        var html = htmlRender(layer, null, util.isReact?'./':'../');
        html = template(html, layer,`${layer.name}.css`);
        if(util.isReact){
            util.mkdir(`${_path+"/output/html"}/${pageName}`)
            fs.writeFileSync(`${_path}/output/html/${pageName}/${layer.name}.jsx`, html);
            fs.writeFileSync(`${_path}/output/html/${pageName}/index.jsx`, `/*eslint-disable*/
                import React from 'react';
                import ReactDOM from 'react-dom';
                import App from './${layer.name}';
                
                ReactDOM.render(
                    <App />,
                    document.getElementById('root'),
                );
            `);
            fs.writeFileSync(`${_path}/output/html/${pageName}/${layer.name}.css`, StyleStore.toString());
            fs.writeFileSync(`${_path}/output/html/${pageName}/userEdit.scss`,util.getEditCSS());
        }else{
            fs.writeFileSync(`${_path}/output/html/${pageName}/artboard-${layer.name}.html`, html);
            fs.writeFileSync(`${_path}/output/html/${pageName}/artboard-${layer.name}.css`, StyleStore.toString());
        }
        
        outPages.push({
            name: layer.name,
            url: `./${pageName}/artboard-${layer.name}.html`
        });
    } else {
        layer.childrens && layer.childrens.forEach((child) => {
            handleArtBoard(child, pageName);
        });
    }
  };