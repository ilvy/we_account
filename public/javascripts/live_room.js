/**
 * Created by Administrator on 15-1-12.
 */
$(document).ready(function(){
    addListener();
});

function addListener(){
    $("#tools-btn").on("click",function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
        if($("#tools-panel").css("display") == 'none'){
            $("#tools-panel").css("display","block");
        }else{
            $("#tools-panel").css("display","none");
        }
    });
    $("#tools-panel").on("click",function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    });
    $(document).on("click",function(){
        $("#tools-panel").css("display","none");
    });
    var currLen,currNum,$currImgAlbum;
    $(document).on("click",".img-display img",function(){
        currNum = $(this).data("num");
        $currImgAlbum = $(this).parents(".img-display").find("img");
        currLen = $(this).parents(".img-display").data("imgnum");
        var imgSrc = $(this).attr("src"),
            naturalWidth = $(this)[0].naturalWidth;
        $(".big-img-display").html('<img src="'+imgSrc+'">');
        $(".modal-header").html($(this).parents('.box').find(".desc").data("desc"));
        $("#popup").modal();
    });
    $("#next").on("click",function(){
        currNum = (currNum+1) % currLen;
        var imgSrc = $currImgAlbum.eq(currNum - 1).attr("src");
        $(".big-img-display img").attr("src",imgSrc);
    });
}