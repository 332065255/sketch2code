
// documentation: https://developer.sketchapp.com/reference/api/
var UI = require('sketch/ui')
var dom = require('sketch/dom');
var fs = require('@skpm/fs');
const { execSync } = require('@skpm/child_process');
import go from './index';
var utils = require('./util');

export default function (){
    
    // sketch.UI.message("It's alive 🙌react")
    var document = dom.getSelectedDocument();
    document.save()
    if (document.selectedLayers.length === 0) {
      UI.alert('Export Code', '请选择一个画板');
      return;
    }
    utils.isH5=true;
    utils.isReact = true;
    go();
    sketch.UI.message("OJBK🙌")
}
