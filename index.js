"use strict";

const asset = `
<script type="text/javascript">
window.addEventListener("load", function(){
    var spoiler = document.getElementsByClassName("spoiler");
    for(var i=0; i<spoiler.length; ++i){
        spoiler[i].addEventListener("click", function(){
            this.classList.toggle("revealed");
        });
    }
});
</script>
<style type="text/css">
span.spoiler {
    color: rgba(0, 0, 0, 0);
    background-color: rgba(0, 0, 0, 0);
    text-shadow: grey 0px 0px 10px;
    cursor: pointer;
    -webkit-transition: text-shadow .5s ease;
       -moz-transition: text-shadow .5s ease;
            transition: text-shadow .5s ease;
}
span.spoiler:hover {
    text-shadow: grey 0px 0px 5px;
}
span.spoiler.revealed {
    text-shadow: grey 0px 0px 0px;
}
</style>
`;

hexo.extend.tag.register('spoiler', function(args) {
    const spoiler = hexo.render.renderSync({
        text: args.join(' '), engine: "markdown"
    }).replace(/<\/?p>/g,'');

    return `<span class="spoiler">${spoiler}</span>`;
});

hexo.extend.filter.register('after_render:html', function(str, data) {
    if(str.indexOf('class="spoiler"') !== -1)
        return str.replace(/<\s*\/\s*head\s*>/i, `${asset}</head>`);
    return str;
}, 1);
