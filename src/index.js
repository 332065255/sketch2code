
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
var art_id=null;
var page_id=null;
export default function(id,id2){
    art_id=id;
    page_id=id2;
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

        if(page_id!=null){
            if(data.do_objectID != page_id){
                return;
            }
            if(art_id!=null){
                var layers = data.layers;
                layers.map(item=>{
                    if(item.do_objectID == art_id){
                        data.layers=[item]
                    }
                })
            }
        }

        let result = layerParser(data);
        outResults.push(result);
    });
    outResults.forEach((result) => {
        if(result.type === 'page'&&result.name.indexOf('Symbols')==-1) {
            handleArtBoard(result, `page-${result.name}`);

            if(fs.existsSync(_path+'/output/images')){
                if(!util.isHTML){
                    util.mkdir(`${_path+"/output/html/page-"+result.name+""}`)
                    execSync(`cp -rf ${_path+"/output/images"} ${_path+"/output/html/page-"+result.name+"/images"}`)
                }else{
                    util.mkdir(`${_path+"/output/html/preview"}`)
                    execSync(`cp -rf ${_path+"/output/images"} ${_path+"/output/html/preview/images"}`)
                }
                
            }
            
            if(!util.isPreview){
                execSync(`open ${_path}/output/html/page-${result.name}/`);
            }
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
        styleRender(layer, null,'./');
        var html = htmlRender(layer, null, './');
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
        }else if(util.isHTML){
            // fs.writeFileSync(`${_path}/output/html/${pageName}/artboard-${layer.name}.html`, html);
            // fs.writeFileSync(`${_path}/output/html/${pageName}/artboard-${layer.name}.css`, StyleStore.toString());
            util.mkdir(`${_path+"/output/html"}/preview`)
            fs.writeFileSync(`${_path}/output/html/preview/preview.html`, html,{
                encoding:'utf8'
            });
            fs.writeFileSync(`${_path}/output/html/preview/artboard-${layer.name}.css`, StyleStore.toString(),{
                encoding:'utf8'
            });
        }else if(util.isVue){
            util.mkdir(`${_path+"/output/html"}/${pageName}`)
            fs.writeFileSync(`${_path}/output/html/${pageName}/${layer.name}.vue`, html);
            fs.writeFileSync(`${_path}/output/html/${pageName}/index.vue`, `/*eslint-disable*/
                <template>
                    <App/>
                </template>
                <script type="text/babel">

                    import App from './${layer.name}';
                    
                    export default{
                        props: {
                    
                        },
                          data(){
                            return {
                            }
                        },
                        components: {
                            'App':App
                        }
                    }
                </script>
                <style lang="scss" scoped>
                </style>
            `);
            fs.writeFileSync(`${_path}/output/html/${pageName}/${layer.name}.css`, StyleStore.toString());
            fs.writeFileSync(`${_path}/output/html/${pageName}/userEdit.scss`,util.getEditCSS());
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