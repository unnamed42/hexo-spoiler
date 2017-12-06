"use strict";

var path = require("path");
var fs   = require("hexo-fs");

var css = '<style type="text/css">' + fs.readFileSync(path.join(__dirname, "src/spoiler.css")) + "</style>";
var js  = '<script type="text/javascript">' + fs.readFileSync(path.join(__dirname, "src/spoiler.js")) + "</script>";

hexo.extend.tag.register('spoiler', function(args) {
    var content = args.join(' ');
    var html_code = hexo.render.renderSync({text: content, engine: "markdown"}).replace(/<\/?p>/g,'');
    
    return '<span class="spoiler">' + html_code + "</span>";
});

hexo.extend.filter.register('after_render:html',function(str,data){
    
    if(str.indexOf('span class="spoiler"') != -1)
        str = str.replace(/<\s*\/\s*head\s*>/i, css + js + "</head>");
    
    return str;
});
