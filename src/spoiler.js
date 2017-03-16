window.addEventListener("load", function(){
    var spoiler = document.getElementsByClassName("spoiler");
    for(var i = 0; i < spoiler.length; ++i) {
        spoiler[i].addEventListener("click", function() {
            this.classList.toggle("revealed");
        });
    }
});
