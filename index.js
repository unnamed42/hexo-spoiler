hexo.extend.tag.register('spoiler', function(args) {
    
    var content = args.join(' ');
    
    var html_code = hexo.render.renderSync({text: content, engine: "markdown"});
    
    html_code = html_code.replace(/<(|\/)p>/g,'');
    
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

hexo.extend.filter.register('after_post_render',function(data){
    var link_css = "<link rel=\"stylesheet\" href=\"/css/spoiler.css\" type=\"text/css\">";
    
    var link_js = "<script src=\"/js/spoiler.js\" type=\"text/javascript\" async></script>";
    
    data.content += link_css + link_js;
    
    return data;
});
