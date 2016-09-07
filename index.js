hexo.extend.tag.register('spoiler', function(args) {
    
    var content = args.join(' ');
    
    var html_code = hexo.render.renderSync({text: content, engine: "markdown"});
    
    html_code = html_code.replace(/<(|\/)p>/g,'');
    
    return "<span class=\"spoiler\">" + html_code + "</span>";
});

var fs = require('hexo-fs');
var path = require('path');

var assetBase = path.resolve(__dirname, "./asset");

hexo.extend.generator.register('css', function(locals) {
    
    var route = {
        path: 'css/spoiler.css',
        data: function() {return fs.createReadStream(path.resolve(assetBase,'spoiler.css'));}
    }
    
    return route;
});

hexo.extend.generator.register('js', function(locals) {
    
    var route = {
        path: 'js/spoiler.js',
        data: function() {return fs.createReadStream(path.resolve(assetBase,'spoiler.js'));}
    }
    
    return route;
});

hexo.extend.filter.register('after_post_render',function(data){
    
    var link_css = "<link rel=\"stylesheet\" href=\"/css/spoiler.css\" type=\"text/css\">";
    
    var link_js = "<script src=\"/js/spoiler.js\" type=\"text/javascript\"></script>";
    
    data.content += link_css + '\n' +link_js;

    return data;
});
