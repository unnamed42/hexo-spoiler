hexo.extend.tag.register('spoiler', function(args) {
    
    var content = args.join(' ');
    
    var html_code = hexo.render.renderSync({text: content, engine: "markdown"});
    
    html_code = html_code.replace(/<\/?p>/g,'');
    
    return "<span class=\"spoiler\">" + html_code + "</span>";
});

var css = '<style type="text/css">' + 
          "span.spoiler {" + 
              "color: rgba(0, 0, 0, 0);" + 
              "background-color: rgba(0, 0, 0, 0);" + 
              "text-shadow: grey 0px 0px 10px;" +
              "cursor: pointer;" +
              "-webkit-transition: text-shadow .5s ease;" +
              "-moz-transition: text-shadow .5s ease;" +
              "transition: text-shadow .5s ease;" +
          "}" +
          "span.spoiler:hover {" +
              "text-shadow: grey 0px 0px 5px;" +
          "}" +
          "span.spoiler.revealed {" +
              "text-shadow: grey 0px 0px 0px;" +
          "}" +
          "</style>";

var js = '<script type="text/javascript">' + 
         "window.addEventListener('load', function(){" + 
             "var spoiler = document.getElementsByClassName('spoiler');" + 
             "for(var i = 0; i < spoiler.length; ++i) {" + 
                 "spoiler[i].addEventListener('click', function() {" + 
                     "this.classList.toggle('revealed');" + 
                 "});" + 
             "}" + 
         "});" + 
         "</script>";

hexo.extend.filter.register('after_render:html',function(str,data){
    
    if(str.indexOf("span class=\"spoiler\"") != -1)
        str = str.replace(/<\s*\/\s*head\s*>/i, css + js + "</head>");
    
    return str;
});
