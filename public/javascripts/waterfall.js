/**
 * Created by Administrator on 14-12-26.
 */
var boxes = [],
    waterfall,
    asyncLoader;

$(document).ready(function(){
    boxes = $(".box");//sorted date source
})
$(window).on("load",function(){
    waterfall = new Waterfall();
});
$(window).on("resize",function(){
    waterfall.init();
});

var Waterfall = function(){
    this.displayWay = '';//1.image size,2.self defined
    this.margin = 10;
    this.box_w = 200;
    this.h_weights = [];//weight of height,including prices,img size and so on 每列的高度
    this.box_quantity = boxes.length;
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
    $(".box").css("width",this.box_w);
    this.setPosition();
}

Waterfall.prototype.setPosition = function(add_quantity){
    var colNum = this.min_col_num,
        hs = this.h_weights,
        box_h,
        box_w = this.box_w,
        margin = this.margin,
        left,
        min_H,
        minKey,
        _this = this,
        len = _this.box_quantity + (add_quantity?add_quantity:0) - 1,
        i = 0;
    boxes.each(function(i,item){
//        i = index;
        if(add_quantity){
            i = i + _this.box_quantity;
        }
        box_h = boxes.eq(i).outerHeight();
        if(i < colNum){
            hs[i] = box_h;
            left = (box_w) * i + (i+1)*margin;
            boxes.eq(i).css({
                top:0,
                left:left,
                width:box_w
            })
        }else{
            min_H = _this.min(hs);
            minKey = _this.getMinKey(min_H,hs);
            if(minKey == 0){
                console.log("hh");
            }
            _this.updateMin(minKey,box_h + margin);
            boxes.eq(i).css({
                top:min_H + margin,
                left:boxes.eq(minKey).position().left,
                width:box_w
            })
            if(i == len){//初始化加载器
                asyncLoader = new AsyncLoader();
                _this.lastPosition = {top:min_H,left:0};
            }
        }
    });
    this.box_quantity += (add_quantity?add_quantity:0);//当前瀑布流卡片总数
}

Waterfall.prototype.asyncLoader = function(){
    var _this = this;
    var loadDatas = asyncLoader.load();
    loadDatas.each(function(){
        $(this).clone().css(_this.lastPosition).appendTo(".waterfall");
    })
    boxes = $(".box");
    this.setPosition(boxes.length / 2);
}


Waterfall.prototype.min = function(array){
    return Math.min.apply(null,array);
}

Waterfall.prototype.getMinKey = function(o,array){
    for(var i in array){
        if(array[i] == o){
            return i;
        }
    }
}

Waterfall.prototype.updateMin = function(minKey,next_h){
    this.h_weights[minKey] += next_h;
}

/**
 * 异步加载器
 * @type {Loader}
 */
var AsyncLoader = Waterfall.Loader = function(){
    this.loaderData = null;
    this.init();
}

AsyncLoader.prototype.init = function(){
    //
    $(window).on("scroll",function(){
        if($("body").scrollTop() + $(window).height() >= 0.8 * $(document).height()){
            waterfall.asyncLoader();
        }
    })
}

AsyncLoader.prototype.setTheLastPos = function(){

}

AsyncLoader.prototype.load = function(){
    return boxes;
}