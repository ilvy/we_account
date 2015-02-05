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
    $(".favorite").on("vclick",function(){
        var url = '/we_account/favourite';
        if($(this).find('i').hasClass("fa-heart")){
            if(!confirm("是否取消关注")){
                return;
            }
            url = '/we_account/favourite_cancel';
        }
        $.ajax({
            url:url,
            type:"post",
            success:function(result){
                if(result.flag == 1){
                    if(result.data == 1){
                        $(".favorite .fa-heart-o").removeClass("fa-heart-o").addClass("fa-heart");
                        alert("收藏成功");
                    }else if(result.data == 10){
                        $(".favorite .fa-heart").removeClass("fa-heart").addClass("fa-heart-o");
                    }
                }else if(result.data == 0){
                    alert("房间不存在");
                }else if(result.data == -2){
                    window.location.href = '/follow_account.html';
                }else if(result.data == -10){
                    alert("取消关注失败");
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    });
    /**
     * 取消关注直播间
     * @param callback
     */
    function cancelFavorite(callback){
        var url = '/we_account/favourite_cancel';
        $.ajax({
            url:url,
            type:"post",
            success:function(result){
                callback(null,result);
            },
            error:function(err){
                console.log(err);
                callback(err,null);
            }
        });
    }

    var waterfallHeight,
        scrollTop;
    $(document).on("scroll",function(){
        if(!waterfallHeight){
//            waterfallHeight = waterfall.min(waterfall.h_weights);//绝对布局方式瀑布流
            waterfallHeight = waterfall.getMinHeight();//相对布局方式瀑布流
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
    $(document).on("vclick",".delete-product input",function(event){
        var product_id = $(this).parents(".box").data("id");
        $(this).parents(".box").remove();
        var data = {
            id:product_id
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
        new AjaxUpload("#upload-div-box",{
            action:"/we_account/upload",
//                action:"http://120.24.224.144:80/we_account/upload",
            name:'file',
            onSubmit:function(file,ext){
                console.log(file +" "+ ext);
                if(filterFile(ext)){
                    $("#uploading-mask").css("display","block");
                    hideWaterfallScroll();
                }else{
                    return false;
                }
            },
            onComplete:function(file,res){
//                    alert(res);
                compress(res,function(err,result){
                    $("#uploading-mask").css("display","none");
                    if(result.flag == 1){
                        $("#image_content").prepend('<div class="upload-display"><img  src="/images/'+res+'"/><div class="delete-img">×</div></div>');
                        showUploadPanel();
                    }else{
                        alert("上传失败");
                    }
                });
                console.log(res);
                productArray.push(res);
//                    products?products  += ";"+ res:products += res;
            }
        })
    });;
    $(function(){
        new AjaxUpload("#upload2",{
            action:"/we_account/upload",
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
                compress(res,function(err,result){
                    $("#uploading-mask").css("display","none");
                    if(result.flag == 1){
                        $("#image_content").prepend('<div class="upload-display"><img  src="/images/'+res+'"/><div class="delete-img">×</div></div>');
                    }else{
                        alert("上传失败");
                    }
                });
                console.log(res);
                productArray.push(res);
//                    products?products  += ";"+ res:products += res;
            }
        })
    });

    $(document).on("vclick","#upload-div-box,#upload2",function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else if(event.cancelBubble){
            event.cancelBubble = true;
        }
        var $this = $(this);
        var btn_id = $this.attr("id");
        $("#"+btn_id+"_file_type").click();
    });

//    $("#alertTest").on("click",function(){
//        $("#warn").fadeInAndOut();
//    });

    $(document).on("click","#submit",function(){
        var desc = $(".product-desc").val();//TODO 检验字符串合法性
        if(productArray.length == 0){
            $("#warn").fadeInAndOut();
            return;
        }
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
                    showNewUploadImg(data.data.id,productArray,desc);
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

    $(document).on("vclick",".delete-img",function(){
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
        filePath:fileName//"/mnt/projects/weAccount_git/we_account/public/images/"+fileName
    };
    $.ajax({
        url:"/we_account/compressPic",
        data:data,
        type:"post",
        success:function(result){//不需要响应
            console.log(result);
            callback(null,result);
        },
        error:function(err){
            console.log(err);
            callback(err,{});
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
    $(".product-desc").val("");
    productArray = [];
    products = "";
    $("#image_content .upload-display").remove();
}

function showUploadPanel(){
    $("#upload-panel").css("display","block");
    $("body").css("overflow-y","hidden");
    hideWaterfallScroll();
}

function removeUploadPanel(){
    $("#upload-panel").css("display","none");
    $("body").css("overflow-y","auto");
    showWaterfallScroll();
}

/**
 * 恢复瀑布流
 */
function showWaterfallScroll(){
    $(".waterfall").css({
        height:'initial',
        overflow:"initial"
    });
}
/**
 * 隐藏瀑布流的滚动条，防止在图片上传或者在上传界面被滚动
 */
function hideWaterfallScroll(){
    $(".waterfall").css({
        height:'400px',
        overflow:"hidden"
    });
}

/**
 *
 * @param product_id
 * @param productArray
 * @param desc
 * @param smallH
 */
function showNewUploadImg(product_id,productArray,desc){
    var minColIndex = waterfall.getMinHeightColumnIndex();
//    alert(minColIndex);
    var imgstr = '';
    productArray.forEach(function(item,i){
        if(i == 0){
            imgstr += '<img class="lazy" src="http://120.24.224.144/images/'+item+'" data-num="'+i+'">';
        }else{
            imgstr += '<img class="lazy" src="http://120.24.224.144/images/'+item+'" data-num="'+i+'"  style="height:'+waterfall.smallH+'px;width:'+waterfall.smallH+'px;">';
        }
    });
    $(".column").eq(minColIndex).prepend('<div class="box" data-id="'+product_id+'">' +
        '<div class="img-display" data-imgnum="'+productArray.length+'">' +imgstr+
        '</div><div class="desc" data-desc="'+desc+'">'+desc+'</div><div class="delete-product"><input type="button" value="删除"/></div></div>');
}

/**
 * 渐入渐出
 * @returns {*|jQuery}
 */
$.fn.fadeInAndOut = function(){
    return $(this).each(function(){
        var $this = $(this);
        $this.fadeIn(2000,function(){
            setTimeout(function(){
                $this.fadeOut();
            },2000);
        });
    });
}