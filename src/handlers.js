
import fs from '@skpm/fs';
import UI from 'sketch/ui';
var dic = require('sketch/settings')
import eventBus from './events';
var utils = require('./util');
import BrowserWindow from 'sketch-module-web-view';
var browserWindow = null;
var _ = require('lodash');
var _timeOut= 0;
import go from './index';
coscript.setShouldKeepAround(true);
// 文档打开的事件监听
export function onOpenDocument(context) {
  // COScript.currentCOScript().shouldKeepAround = true;
  const document = context.actionContext.document;
  const dictionary = NSThread.mainThread().threadDictionary();
  dictionary['previewLocked'] =  false
  browserWindow = new BrowserWindow({
    backgroundColor: '#2e2c29',
    alwaysOnTop: true,
    title:'导出前预览',
    ...{ width: 375, height: 600 ,show: false},
  });
  dictionary['browserWindow'] = browserWindow;
  dictionary['eventBus'] = eventBus;
  eventBus.on('showBrowser',data=>{
    console.log('666',data)
  })
  // setInterval(()=>{
  //   console.log(Math.random()*10000)
  // },1000)
}
export function onDocumentSaved(context){
  const document = context.actionContext.document;
  const dictionary = NSThread.mainThread().threadDictionary();
  var _path = (document.path+"");
    _path = _path.substring(0,_path.lastIndexOf('/'))
  if(dictionary['previewLocked']==false){
    dictionary['previewLocked']=true;
    //dosth
    if(dic.settingForKey('browserWindow')!=null){
      let arr = dic.settingForKey('ArtboardId').split(',')
      utils.isH5=true;
      utils.isHTML=true;
      utils.isPreview=true;
      go(arr[0],arr[1]);
      
      UI.message('重新渲染完毕');
      BrowserWindow.fromId(dic.settingForKey('browserWindow').id).reload();
    }
    dictionary['previewLocked']=false;
  }
  
}