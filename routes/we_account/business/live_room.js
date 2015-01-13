/**
 * Created by Administrator on 2015/1/3.
 */

var dbOperator = require("../../../db/dbOperator"),
    urlencode = require('urlencode'),
    response = require("../response/response"),
    async = require("async");

function gotoLiveRoom(req,res){
    console.log("***********************gotoLiveRoom");
    var openId = req.session.openId;
    var products,totalPage;
    var funs = [
        //监测是不是发布者自己进入
        function checkPublisher(cb){
            dbOperator.query("call pro_check_publisher_knock(?,?)",[null,openId],function(err,results){
                if(err){
                    console.log(err);
                }
                cb(err,results[0][0]);
            });
        },
        function select_product(publisher,cb){
            req.session.isPublisher = publisher ? 1:0;
            dbOperator.query("call pro_select_products(?,?,?)",[openId,null,0],function(err,rows){
                if(err){
                    console.log("select products err");
                    res.redirect("/err.html");
                }
                console.log(rows);
                totalPage = rows[0][0]['totalpage'];
                products = rows[1];
                products.forEach(function(item,i){
                    item.image_url = item.image_url.split(";");
                });
//        console.log("products:"+products);
                res.render("live-room",{products:products||[],publisher:publisher,totalPage:totalPage});
            });
        }
    ];
    async.waterfall(funs,function(err,results){});

}

function knocktoLiveRoom(req,res){
    console.log("***********************knocktoLiveRoom");
    var openId = req.session.openId,
        room = req.session.room || '888888';
    if(!room){
        room = null;
        response.failed("",res,"room is null");
        return;
    }
    var products,totalPage;
    var funs = [
        //监测是不是发布者自己进入
        function checkPublisher(cb){
            dbOperator.query("call pro_check_publisher_knock(?,?)",[room,openId],function(err,results){
                if(err){
                    console.log(err);
                }
                cb(err,results[0][0]);
            });
        },
        function select_product(publisher,cb){
            req.session.isPublisher = publisher ? 1:0;
            dbOperator.query("call pro_select_products(?,?,?)",[null,room,0],function(err,rows){
                if(err){
                    console.log("select products err");
                    res.redirect("/err.html");
                }
                console.log(rows);
                totalPage = rows[0][0]['totalpage'];
                products = rows[1];
                products.forEach(function(item,i){
                    item.image_url = item.image_url.split(";");
                });
//        console.log("products:"+products);
                res.render("live-room",{products:products||[],publisher:publisher,totalPage:totalPage});
            });
        }
    ];
    async.waterfall(funs,function(err,results){});

}


/**
 * 顾客（非发布者）输入门牌号，敲门
 */
function knockDoor(req,res){
    var body = req.body,
        room = urlencode(body.room);
    if(!room){
        response.failed("",res,"输入为空");
    }else{
        req.session.room = room;
        dbOperator.query("call pro_customer_knock_door(?)",[room],function(err,results){
            if(results[0][0]['result'] > 0){
                response.success("",res,"有这个门牌号,客人请进!");
            }else{
                response.failed("",res,"没有这个门牌号,客人请确认一下!");
            }
        });
    }

}

/**
 * 延时加载接口
 * @param req
 * @param res
 */
function loadMoreProducts(req,res){
    var session = req.session,
        openId = session.openId,
        room = session.room;
    var query = req.query;
    var paras = [null,null,query.page];
    var products;
    if(session.isPublisher){
        paras[0] = openId;
    }else{
        paras[1] = room;
    }
    dbOperator.query("call pro_select_products(?,?,?)",paras,function(err,rows){
        if(err){
            console.log("select products err");
            res.redirect("/err.html");
        }
        console.log(rows);
        products = rows[1];
        products.forEach(function(item,i){
            item.image_url = item.image_url.split(";");
        });
//        console.log("products:"+products);
        response.success({products:products,totalPage:rows[0][0]['totalpage']},res,"加载成功");
    });
}

exports.renderLiveRoom = gotoLiveRoom;
exports.knockDoor = knockDoor;
exports.knocktoLiveRoom = knocktoLiveRoom;
exports.loadMoreProducts = loadMoreProducts;