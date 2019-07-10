var util = require('./../util')
module.exports = function(html,layer,css) {
    if(util.isReact){
        return `/*eslint-disable*/
        import React from 'react';
        import './${css}';
        import './userEdit.scss';
        export default class App extends React.Component{
            constructor(){
                super();
            }
            animation(){
                return (<div></div>);
            }
        
            render(){
                return (
                    ${html}
                )
            }
        }`
        ;
    }
    return `<html>
<head>

<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
<!--<meta name="viewport" content="initial-scale=2,maximum-scale=1,user-scalable=no,width=device-width,minimal-ui">-->
<link rel="stylesheet" href="./artboard-${layer.name}.css" type="text/css" />
</head>
<body >
    ${html}
<script>
// (function(win) {
//     var remCalc = {};
    
//     var docEl = win.document.documentElement,
//         tid;
//         docEl.style.fontSize = '100px';
//     function refreshRem() {
//         // 获取当前窗口的宽度
//         var width = docEl.getBoundingClientRect().width;
//         // 大于640px 按640算
//         if (width > 750) { width = 750 }
//         console.log(width);
//         //var rem = width / 10;  // cms 只要把这行改成  var rem = width /640 * 100 
//         var rem = width /750 * 100 
//         docEl.style.fontSize = rem + "px";
//         remCalc.rem = rem;
//         //误差、兼容性处理
//         var actualSize = parseFloat(window.getComputedStyle(document.documentElement)["font-size"]);
//         if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
//             var remScaled = rem * rem / actualSize;
//             docEl.style.fontSize = remScaled + "px"
//         }
//     }

//     //函数节流，避免频繁更新
//     function dbcRefresh() {
//         clearTimeout(tid);
//         tid = setTimeout(refreshRem, 100)
//     }

//     //窗口更新动态改变font-size
//     win.addEventListener("resize", function() { dbcRefresh() }, false);

//     //页面显示的时候再计算一次   难道切换窗口之后再切换来窗口大小会变?....
//     win.addEventListener("pageshow", function(e) {
//         if (e.persisted) { dbcRefresh() }
//     }, false);
//     refreshRem();
//     remCalc.refreshRem = refreshRem;
//     remCalc.rem2px = function(d) {
//         var val = parseFloat(d) * this.rem;
//         if (typeof d === "string" && d.match(/rem$/)) { val += "px" }
//         return val
//     };
//     remCalc.px2rem = function(d) {
//         var val = parseFloat(d) / this.rem;
//         if (typeof d === "string" && d.match(/px$/)) { val += "rem" }
//         return val
//     };
//     win.remCalc = remCalc
// })(window);

</script>

</body>
</html>`;
};