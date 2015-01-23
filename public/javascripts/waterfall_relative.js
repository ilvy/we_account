/**
 * Created by Administrator on 14-12-26.
 * 瀑布流相对布局
 *
 */
var boxes = [],
    waterfall,
    asyncLoader,
    totalPage,currentPage = 0;

$(document).ready(function(){
    boxes = $(".box");//sorted date source
    waterfall = new Waterfall();
    asyncLoader = new AsyncLoader();
    waterfall.asyncLoader();
})
$(window).on("load",function(){

});
$(window).on("resize",function(){
//    waterfall.init();
});

var Waterfall = function(){
    this.displayWay = '';//1.image size,2.self defined
    this.margin = 10;
    this.box_w = 200;
    this.h_weights = [];//weight of height,including prices,img size and so on 每列的高度
    this.isLoadOver = true;//上一次加载事件是否已经完毕,第一次加载默认为true
    this.init();
}

Waterfall.prototype.init = function(){
    var win_w = $(window).width(),
        win_H = $(window).height();
    if(win_w <= 360){
        this.min_col_num = 2;
    }else if(win_w <= 768){
        this.min_col_num = 4;
    }else if(win_w <= 921){
        this.min_col_num = 5;
    }else if(win_w <= 1366){
        this.min_col_num = 5;
    }else if(win_w <= 1440){
        this.min_col_num = 6;
    }else{
        this.min_col_num = 8;
    }
    this.box_w = Math.floor((win_w - this.min_col_num * this.margin * 2) / this.min_col_num);
//    $(".box").css("width",this.box_w);
    var smallH = this.smallH = this.box_w / 3;
    this.generateColumn();
    $(".box").each(function(){
        $(this).find("img:first-child").siblings("img").css("height",smallH);
    });
//    this.setPosition(boxes);
}

Waterfall.prototype.generateColumn = function(){
    var col_num = this.min_col_num;
    for(var i = 0; i < 8; i++){
        if(i < col_num){
            $(".waterfall .column").eq(i).css({
                width: this.box_w,
                float: "left",
                'margin-left': this.margin+"px"
            });
        }else{
            break;
        }

    }
}

Waterfall.prototype.setPosition = function(boxes){
    this.isLoadOver = true;//开始排位说明已经加载完毕
    var colNum = this.min_col_num,
        hs = this.h_weights,
        box_h,
        box_w = this.box_w,
        margin = this.margin,
        left,
        min_H,
        minKey,
        _this = this,
        i = 0;
    for(var ib = 0; ib < boxes.length; ib++){
//        $(".column").eq(ib % colNum).append(boxes.eq?boxes.eq(ib).removeClass("unvisible"):boxes[ib]);
        $(".column").eq(ib % colNum).append(boxes[ib]);
    }
}

Waterfall.prototype.asyncLoader = function(){
    if(!this.isLoadOver){
        return;
    }
    this.isLoadOver = false;
    var _this = this;
    var productsStrs = [],imgstr = '';
    asyncLoader.load(function(results){
        if(results.flag != 1){
            return;
        }
        var loadDatas;
        var urlArray = [],lazyImgs;//需要异步加载的图片数组
        if(results.data){
            loadDatas = results.data.products;
            totalPage = results.data.totalPage;
        }
        loadDatas.forEach(function(item){
//        $(this).clone().css(_this.lastPosition).appendTo(".waterfall");
            var imgstr = '';
            item.image_url.forEach(function(url,i){
                if(i > 0){
                    imgstr += '<img class="lazy" src="http://120.24.224.144/images/'+url+'" data-num="'+(i)+'" style="height:'+_this.smallH+'px">';
                }else{
                    imgstr += '<img class="lazy" src="http://120.24.224.144/images/'+url+'" data-num="'+(i)+'">';
                }
//                urlArray.push('/images/'+url);
            });
            productsStrs.push('<div class="box"><div class="desc" data-desc="'+item.text+'">'+item.text +'</div>' +
                '<div class="img-display" data-imgnum="'+item.image_url.length+'">'+ imgstr+
                '</div><div class="ontact-saler">联系卖家</div></div>');
        });
        _this.setPosition(productsStrs);
        var loadImgCount = 0;
//        lazyImgs = document.getElementsByClassName("lazy");
//        preloadImgs(lazyImgs,function ready(width,height){
//
//        },function onload(width,height){
//            loadImgCount++;
//            if(loadImgCount == lazyImgs.length){
//                $(".lazy").removeClass("lazy");
//            }
//        },function error(){
//            loadImgCount++;
//            if(loadImgCount == lazyImgs.length){
//                $(".lazy").removeClass("lazy");
//            }
//        });
    });

}

/**
 * 获取当前图片列的最小高度值，用于滚动加载判断
 * @returns {number}
 */
Waterfall.prototype.getHeight = function(){
    var $columns = $(".column"),
        colHeights = [];
    var _this = this;
    $columns.each(function(i){
        if(i < _this.min_col_num){
            colHeights.push($(this).outerHeight());
        }
    });
    return Math.min.apply(null,colHeights);
}


/**
 * 异步加载器
 * @type {Loader}
 */
var AsyncLoader = Waterfall.Loader = function(){
    this.loaderData = null;
}

AsyncLoader.prototype.setTheLastPos = function(){

}

AsyncLoader.prototype.load = function(callback){
    if(currentPage + 1 >= totalPage){
        return;
    }
    var url = '/we_account/load_more?page='+currentPage++;
    $.ajax({
        url:url,
        type:"get",
        success:function(results){
            console.log(results);
            callback(results);
        },
        error:function(err){
            console.log(err);
        }
    })
}

function printArray(str,arr){
    var res = '';
    for(var i in arr){
        res += ","+arr[i]
    }
    console.log(str+":"+res);
}