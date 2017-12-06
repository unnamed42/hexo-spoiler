"use strict";

const path    = require("path");
const read    = require("hexo-fs").readFileSync;

const asset = `<style type="text/css">${read(path.join(__dirname, "src/spoiler.css"))}</style>` + 
              `<script type="text/javascript">${read(path.join(__dirname, "src/spoiler.js"))}</script>`;

hexo.extend.tag.register('spoiler', function(args) {
    const spoiler = hexo.render.renderAsync({
        text: args.join(' '), engine: "markdown"
    }).replace(/<\/?p>/g,'');
    
    return `<span class="spoiler">${spoiler}</span>`;
});

hexo.extend.filter.register('after_render:html', function(str, data) {
    if(str.indexOf('span class="spoiler"') != -1) 
        return str.replace(/<\/head>/i, `${asset}</head>`);
    return str;
});
