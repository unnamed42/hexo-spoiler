hexo.extend.tag.register('spoiler', function(args) {
    
    var content = args.join(' ');
    
    var html_code = hexo.render.renderSync({text: content, engine: "markdown"});
    
    html_code = html_code.replace(/<\/?p>/g,'');
    
    return "<span class=\"spoiler\">" + html_code + "</span>";
});

var fs = require('hexo-fs');
var path = require('path');

hexo.extend.generator.register('spoiler_asset', function(locals) {
    var assetBase = path.resolve(__dirname, "./asset");
    return [
        {
            path: 'css/spoiler.css',
            data: function() {return fs.createReadStream(path.resolve(assetBase,'spoiler.css'));}
        },
        {
            path: 'js/spoiler.js',
            data: function() {return fs.createReadStream(path.resolve(assetBase,'spoiler.js'));}
        }
    ];
});

hexo.extend.filter.register('after_render:html',function(str,data){
    
    var css = "<link rel=\"stylesheet\" href=\"/css/spoiler.css\" type=\"text/css\">";
    
    var js = "<script src=\"/js/spoiler.js\" type=\"text/javascript\" async></script>";
    
    if(str.indexOf("span class=\"spoiler\"") != -1)
        str = str.replace(/<\s*\/\s*head\s*>/, css + js + "</head>");
    
    return str;
});
