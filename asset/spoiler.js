jQuery(function(){
    $(document).on('click',".spoiler",function() {
        if($(this).hasClass("revealed")){
            $(this).removeClass("revealed");
        } else {
            $(this).addClass("revealed");
        }
    });
});
