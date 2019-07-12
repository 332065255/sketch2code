
// documentation: https://developer.sketchapp.com/reference/api/
var UI = require('sketch/ui')
var Settings = require('sketch/settings')
var dom = require('sketch/dom');
var fs = require('@skpm/fs');
require('@skpm/timers')
const { execSync } = require('@skpm/child_process');
import go from './index';
var utils = require('./util');
import BrowserWindow from 'sketch-module-web-view';
coscript.setShouldKeepAround(true);
let fiber = require('sketch/async').createFiber()
export default function (){
    if(Settings.settingForKey('browserWindow')){
      BrowserWindow.fromId(Settings.settingForKey('browserWindow').id).destroy();
    }
  
    var document = dom.getSelectedDocument();
    // document.save()
    const newPages = JSON.parse(JSON.stringify(document.pages));
    var selectedArtboards=[];
    newPages.forEach((page) => {
      if (page.type === 'Page' && page.selected) {
        page.layers.forEach(layer => {
          if (layer.type === 'Artboard') {
            if (layer.selected) {
              selectedArtboards.push(layer);
            }
          }
        });
      }
    });
    if (selectedArtboards.length === 0 ||selectedArtboards.length>1) {
      UI.alert('Export Code', '请选择一个画板');
      return;
    }
    // console.log(selectedArtboards[0].id,document.selectedPage.id)
    utils.isH5=true;
    utils.isHTML=true;
    utils.isPreview=true;
    // utils.isReact = true;
    go(selectedArtboards[0].id,document.selectedPage.id);
    UI.message("preview OJBK🙌")
    var _path = (document.path+"");
    _path = _path.substring(0,_path.lastIndexOf('/'))
    var browserWindow = dialog(`${_path}/output/html/preview/preview.html`,{ width: 375, height: 600 ,show: false})
    Settings.setSettingForKey('browserWindow',browserWindow);
    Settings.setSettingForKey('ArtboardId',`${selectedArtboards[0].id},${document.selectedPage.id}`);
    browserWindow.once('ready-to-show', () => {
      browserWindow.show()
    })
    browserWindow.once('closed',()=>{
      Settings.setSettingForKey('browserWindow',null);
    })
}
function dialog(url, options) {
  // return showDialog(buildFilename(context, url), options, _this.view.windowScriptObject());

  const browserWindow = new BrowserWindow({
    backgroundColor: '#2e2c29',
    alwaysOnTop: true,
    title:'导出前预览',
    ...options,
  });

  browserWindow.loadURL(`file://${url}`);
  console.log(`file://${url}`)
  return browserWindow;
}
