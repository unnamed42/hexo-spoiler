(function(){
    var spoiler = document.getElementsByClassName("spoiler");
    var handler = function(){
        var cname = this.className.trim();
        cname === "spoiler"? cname += " revealed": cname = "spoiler";
        this.className = cname;
    };
    for(var i = 0; i < spoiler.length; ++i)
        spoiler[i].addEventListener("click",handler);
})();
