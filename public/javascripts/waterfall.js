/**
 * Created by Administrator on 14-12-26.
 */
var boxes = [];

$(document).ready(function(){
    boxes = $(".box");//sorted date source
})

var Waterfall = function(){
    this.displayWay = '';//1.image size,2.self defined
    this.margin = 10;
    this.box_w = 200;
    this.h_weights = [];//weight of height,including prices,img size and so on
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
}

Waterfall.prototype.setPosition(){
    var colNum = this.min_col_num;
    boxes.each(function(i,item){
        if(i < colNum){
            

        }
    });
}
