/**
 * Created by Administrator on 2015/1/3.
 */

var dbOperator = require("../../../db/dbOperator"),
    urlencode = require('urlencode'),
    response = require("../response/response"),
    async = require("async"),
    http = require("http"),
    querystring = require("querystring");


/**
 * 进入直播间页面
 * @param req
 * @param res
 */
function gotoLiveRoom_new(req,res){//相对布局瀑布流，不加载商品信息
    console.log("***********************gotoLiveRoom");
    var openId = req.session.openId,
        type = req.session.type;
    var room_id = req.query.room_id;
    req.session.room_id = room_id;
    var products,totalPage,
        paras1 = [null,null,0];
    req.session.isPublisher = type==1 ? 1:0;
    checkPublisher(function(err,results){
        var productRes,publisher = results;
        if(type == 1){//发布者
            res.render("live_room_rel_layout",{publisher:publisher,room:publisher.room_id});
        }else{
            if(openId){
                dbOperator.query("call pro_check_user_favorite_room(?,?)",[openId,room_id],function(err,favResult){
                    if(err){
                        console.log("pro_select_favourite_rooms err:");
                        console.log(err);
                    }
                    res.render("live_room_rel_layout",{publisher:"",room:room_id,isFavorite:favResult[0][0]['result']});
                });
            }else{
                res.render("live_room_rel_layout",{publisher:"",room:room_id,isFavorite:0});
            }
        }
    });

    //监测是不是发布者自己进入
    function checkPublisher(cb){
        dbOperator.query("call pro_check_publisher_knock(?,?)",[null,openId],function(err,results){
            if(err){
                console.log(err);
            }
            cb(err,results[0][0]);
        });
    }

}

/**
 * 进入直播间页面
 * @param req
 * @param res
 */
function gotoLiveRoom_new_bak(req,res){
    console.log("***********************gotoLiveRoom");
    var openId = req.session.openId,
        type = req.session.type;
    var room_id = req.query.room_id;
    req.session.room_id = room_id;
    var products,totalPage,
        paras1 = [null,null,0];
    var funs = [
        function select_product(cb){
            dbOperator.query("call pro_select_products(?,?,?)",paras1,function(err,rows){
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
//                res.render("live-room",{products:products||[],publisher:publisher,totalPage:totalPage});
                cb(err,{products:products||[],totalPage:totalPage})
            });
        }
    ];
    req.session.isPublisher = type==1 ? 1:0;
    if(type == 1){//发布者
        funs.unshift(checkPublisher);
        paras1[0] = openId;
    }else{
        paras1[1] = room_id;
    }
    async.series(funs,function(err,results){
        var productRes,publisher = null;
        if(type == 1){
            productRes = results[1];//商品信息
            publisher = results[0];//发布者信息
        }else{
            productRes = results[0];
        }
        res.render("live_room_rel_layout",{products:productRes["products"]||[],publisher:publisher,totalPage:productRes["totalPage"]});
    });

    //监测是不是发布者自己进入
    function checkPublisher(cb){
        dbOperator.query("call pro_check_publisher_knock(?,?)",[null,openId],function(err,results){
            if(err){
                console.log(err);
            }
            cb(err,results[0][0]);
        });
    }

}


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
 * 顾客（非发布者）直接在微信输入框输入门牌号，敲门，检测是否存在房间
 */
function checkRoom(room,callback){

    dbOperator.query("call pro_customer_knock_door(?)",[room],function(err,results){
        if(results[0][0]['result'] > 0){
            callback(err,room);
        }else{
            callback(err,null);
        }
    });
}

/**
 * 延时加载接口
 * @param req
 * @param res
 */
function loadMoreProducts_new(req,res){
    var session = req.session,
        openId = session.openId,
        type = req.session.type;
    var room_id = session.room_id;
    var query = req.query;
    var paras = [null,null,query.page];
    var products;
    if(session.isPublisher){
        paras[0] = openId;
    }else{
        paras[1] = room_id;
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
        response.success({products:products,totalPage:rows[0][0]['totalpage'],isPublisher/*发布者有删除按钮*/:session.isPublisher},res,"加载成功");
    });
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

/**
 * 添加收藏直播间
 * @param req
 * @param res
 */
function addFavourite(req,res){
    console.log("*****************");
    var room = req.session.room,
        open_id = req.session.openId;
    var paras = [open_id,room];
    if(room && open_id){
        dbOperator.query('call pro_add_favourite(?,?)',paras,function(err,rows){
            if(err){
                console.log("call pro_add_favourite error:"+err);
                response.failed("-2",res,'');//程序报错
            }else{
                var result = rows[0][0]["res"];
                if(result == 1){//添加收藏成功
                    response.success("1",res,'收藏成功');
                }else if(result == 0){//房间不存在或者已经收藏过
                    response.failed("-1",res,'已经收藏，不能重复收藏');
                }else if(result == -1){//当前房间发布者不用收藏

                }
            }
        })
    }
}

/**
 *
 * @param req
 * @param resp
 */
function renderRoom_door(req,resp){
    var open_id = req.session.openId||'oHbq1t0enasGWD7eQoJuslZY6R-4';
    var paras = [open_id];
    if(open_id){
        dbOperator.query("call pro_select_favourite_rooms(?)",paras,function(err,rows){
            if(err){
                console.log(err);
            }else{
                console.log(rows);
                resp.render('room-door',{favourite_rooms:rows[0]});
            }
        })
    }else{

    }
}

var filePath,
    dirPath = '/mnt/projects/weAccount_git/we_account/public/images/';
function compressImg(res,fileName,callback){
    filePath = dirPath + fileName;
    var data = {
        filePath:filePath
    };
    var req = http.request({
        host:"120.24.224.144",
        port:"8080",
        method:"post",
        path:"/MsecondaryServer/compressPic"
    },function(res){
        var result = "";
        res.on("data",function(chunk){
            result += chunk;
        }).on("end",function(){
            console.log(result);
            result = JSON.parse(result);
//            callback(null,result);
            if(result.code == 1){
                res.send(fileName);
            }else{
                res.send(result.code);
            }
        }).on("error",function(err){
            console.log(err);
//            callback(err,null);
        });
    });
    req.write(querystring.stringify(data));
    req.end();
}

/**
 * 删除商品
 * @param req
 * @param res
 */
function delete_product(req,res){
    var body = req.body;
    var id = body.id,
        openId = req.session.openId;
    dbOperator.query("call pro_delete_product(?,?)",[openId,id],function(err,results){
        if(err){
            console.log("call pro_delete_product err:"+err);
            response.failed("删除失败",res,"删除失败");
            return;
        }
        response.success("删除成功",res,"删除成功");
    });
}

/**
 * 单个商品展示
 * @param req
 * @param res
 */
function displayProduct(req,res){
    var query = req.query;
    var id = query.product_id;
    dbOperator.query('call pro_select_product_by_id(?)',[id],function(err,results){
        if(err){
            console.log("call pro_select_product_by_id err:"+err);
            return;
        }
        var product = results[0][0];
        product.image_url = product.image_url.split(";");
        res.render("product",{product:product});
    });
}

/**
 * 获取收藏的房间列表
 * @param req
 * @param res
 */
function myFavorite(req,res){
    var open_id = req.session.openId;//||'oHbq1t0enasGWD7eQoJuslZY6R-4';
    var paras = [open_id];
    if(open_id){
        dbOperator.query("call pro_select_favourite_rooms(?)",paras,function(err,rows){
            if(err){
                console.log(err);
            }else{
                console.log(rows);
                res.render('myfavorite',{favourite_rooms:rows[0]});
            }
        })
    }
}

//exports.renderLiveRoom = gotoLiveRoom;
exports.renderLiveRoom_new = gotoLiveRoom_new;
exports.knockDoor = knockDoor;
//exports.knocktoLiveRoom = knocktoLiveRoom;
//exports.loadMoreProducts = loadMoreProducts;
exports.loadMoreProducts_new = loadMoreProducts_new;
exports.addFavourite = addFavourite;
exports.renderRoom_door = renderRoom_door;
exports.compressImg = compressImg;
exports.delete_product = delete_product;
exports.displayProduct = displayProduct;
exports.myFavorite = myFavorite;
exports.checkRoom = checkRoom;