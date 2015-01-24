/**
 * Created by Administrator on 15-1-12.
 */
$(document).ready(function(){
    addListener();
    initPopPanel();
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
        $("#tools-panel").css("display","none");
    });
    $(document).on("click",function(){
        $("#tools-panel").css("display","none");
    });
    var currLen,currNum,$currImgAlbum;
    $(document).on("click",".img-display img",function(){
        currNum = $(this).data("num");
        $currImgAlbum = $(this).parents(".img-display").find("img");
        currLen = $(this).parents(".img-display").data("imgnum");
        var bigImgStr = "";
        $(this).parents(".img-display").find("img").each(function(i){
            if(i != currNum){
                bigImgStr += '<img src="'+$(this).attr("src")+'" style="display:none;">';
            }else{
                bigImgStr += '<img src="'+$(this).attr("src")+'">';
            }
        });
        $(".big-img-display").html(bigImgStr);
        $(".modal-header").html($(this).parents('.box').find(".desc").data("desc"));
        $("#popup").modal();
    });
    $("#popup .modal-body").on("click",function(){
        currNum = (++currNum) % currLen;
        $(".big-img-display img").eq(currNum).css("display","block").siblings("img").css("display","none");
    });
//    $("#popup .modal-body").on("swiperight",function(){
//        currNum = (--currNum) % currLen;
//        $(".big-img-display img").eq(Math.abs(currNum)).css("display","block").siblings("img").css("display","none");
//    });
    //收藏直播间
    $(".favorite").on("click",function(){
        var url = '/we_account/favourite';
        $.ajax({
            url:url,
            type:"post",
            success:function(result){
                if(result.flag == 1){
                    alert("收藏成功");
                }else{
                    alert("收藏失败");
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    });
    var waterfallHeight,
        scrollTop;
    $(document).on("scroll",function(){
        if(!waterfallHeight){
//            waterfallHeight = waterfall.min(waterfall.h_weights);//绝对布局方式瀑布流
            waterfallHeight = waterfall.getHeight();//相对布局方式瀑布流
        }
        scrollTop = $("body").scrollTop();
        if(scrollTop + $(window).height() > 0.9 * waterfallHeight){
            waterfall.asyncLoader();
        }
    });
    $("#popup").on("scroll",function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    })

    /**
     * 删除商品信息
     */
    $(document).on("click",".delete-product",function(event){
        var product_id = $(this).parents(".box").data("id");
        var data = {
            id:id
        }
        $.ajax({
            url:"/we_account/delete_product",
            data:data,
            type:"post",
            success:function(results){
                if(results.flag == 1){
                    alert("删除成功");
                }else{
                    alert("删除失败");
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    });
}

function initPopPanel(){
    var w_h = $(window).height(),
        modal_head_h = $(".modal-header").outerHeight();
    $(".modal-body").css({
        'max-height':w_h - 120
    })
}