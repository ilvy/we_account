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
        var product_id = $(this).parents(".box").data("id");
        window.location.href = '/we_account/product_display?product_id='+product_id;
//        var bigImgStr = "";
//        $(this).parents(".img-display").find("img").each(function(i){
//            if(i != currNum){
//                bigImgStr += '<img src="'+$(this).attr("src")+'" style="display:none;">';
//            }else{
//                bigImgStr += '<img src="'+$(this).attr("src")+'">';
//            }
//        });
//        $(".big-img-display").html(bigImgStr);
//        $(".modal-header").html($(this).parents('.box').find(".desc").data("desc"));
//        $("#popup").modal();
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
                    $(".favorite .fa-heart-o").removeClass("fa-heart-o").addClass("fa-heart");
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
    $(function(){
        new AjaxUpload("#upload",{
            action:"http://localhost:880/we_account/upload",
//                action:"http://120.24.224.144:80/we_account/upload",
            name:'file',
            onSubmit:function(file,ext){
                console.log(file +" "+ ext);
                if(filterFile(ext)){
                    $("#uploading-mask").css("display","block");
                }else{
                    return false;
                }
            },
            onComplete:function(file,res){
//                    alert(res);
                $("#image_content").prepend('<div class="upload-display"><img  src="/images/'+res+'"/><div class="delete-img">×</div></div>');
                $("#uploading-mask").css("display","none");
                showUploadPanel();
                compress(res,function(err,result){

                });
                console.log(res);
                productArray.push(res);
//                    products?products  += ";"+ res:products += res;
            }
        })
    });;
    $(function(){
        new AjaxUpload("#upload2",{
            action:"http://localhost:880/we_account/upload",
//                action:"http://120.24.224.144:80/we_account/upload",
            name:'file',
            onSubmit:function(file,ext){
                console.log(file +" "+ ext);
                if(filterFile(ext)){
                    $("#uploading-mask").css("display","block");
                }else{
                    return false;
                }
            },
            onComplete:function(file,res){
//                    alert(res);
                $("#image_content").prepend('<div class="upload-display"><img  src="/images/'+res+'"/><div class="delete-img">×</div></div>');
                $("#uploading-mask").css("display","none");
                compress(res,function(err,result){

                });
                console.log(res);
                productArray.push(res);
//                    products?products  += ";"+ res:products += res;
            }
        })
    });

    $(document).on("click","#submit",function(){
        var desc = $(".product-desc").val();//TODO 检验字符串合法性
        $("#uploading-mask").css("display","block");
        var url = "/we_account/publish",
            postData = {
                products:getProducts(),
                desc:desc
            };
        $.ajax({
            url:url,
            type:"post",
            data:postData,
            success:function(data){
                console.log(data);
                if(data && data.flag == 1){
                    cleanPosition();
                    removeUploadPanel();
                    alert("上传成功");
                }else{
                    alert("上传失败，请重试！！");
                }
                $("#uploading-mask").css("display","none");
            },
            error:function(err){
                console.log(err);
                $("#uploading-mask").css("display","none");
            }
        });
    });

    $(document).on("taphold",".upload-display",function(event){
        var $this = $(this);
        $this.append('<div class="delete-img">x</div>')
    });

    $(document).on("click",".delete-img",function(){
        var delIndex = $(this).parents(".upload-display").index();
        $(this).parents(".upload-display").remove();
        productArray.splice(delIndex,1);
    });

    $("#cancel").on("click",function(){
        removeUploadPanel();
    });
}

function initPopPanel(){
    var w_h = $(window).height(),
        modal_head_h = $(".modal-header").outerHeight();
    $(".modal-body").css({
        'max-height':w_h - 120
    })
}

var products = '',desc = '',productArray = [];

function getProducts(){
    var products = "";
    productArray.forEach(function(item,i){
        if(i != productArray.length - 1){
            products += item  + ";";
        }else{
            products += item;
        }

    });
    return products;
}
/**
 *
 * @param fileName
 * @param callback
 */
function compress(fileName,callback){
    var data = {
        filePath:"/mnt/projects/weAccount_git/we_account/public/images/"+fileName
    };
    $.ajax({
        url:"http://120.24.224.144:8080/MsecondaryServer/compressPic",
        data:data,
        type:"post",
        success:function(result){//不需要响应
            console.log(result);
            callback(null,result);
        },
        error:function(err){
            console.log(err);
            callback(err,null);
        }
    })
}
/**
 * 限制文件格式
 * @param ext
 * @returns {boolean}
 */
function filterFile(ext){
    var exceptExts = ['avi','mp4','wmv','3gp','flv','mkv','txt','js'];
    for(var i = 0; i < exceptExts.length; i++){
        if(ext == exceptExts[i]){
            return false;
        }
    }
    return true;
}
function cleanPosition(){
    $(".edit-desc-content").html("");
    productArray = [];
    products = "";
    $("#image_content").html("");
}

function showUploadPanel(){
    $("#upload-panel").css("display","block");
    $("body").css("overflow-y","hidden");
}

function removeUploadPanel(){
    $("#upload-panel").css("display","none");
    $("body").css("overflow-y","auto");
}