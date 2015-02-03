/**
 * Created by Administrator on 14-12-29.
 */
var mysql = require("mysql"),
    dbPoolConfig = require("../config/config").dbPoolConfig,
    urlencode = require("urlencode");

var pool = mysql.createPool(dbPoolConfig);

var query = function(sql,posts,callback){
    sql = mysql.format(sql,posts);
    console.log("sql:\n"+sql);
    pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            return;
        }
        connection.query(sql,posts,function(err,rows){
            callback(err,rows);
            connection.release();
        });
    })
}

exports.query = query;

//console.log(urlencode("http://120.24.224.144/we_account"));
//query("select * from ?? where id = ?",['user',1],function(err,rows){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(rows);
//    }
//});

/**
 * 调用存储过程测试
 */
//query("call pro_test()",[],function(err,rows){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(rows);
//    }
//});


//query("call pro_publish(?,?,?)",["img1.jpg;img2.jpg",'hhhhhhhhhhaaaaaaa','oHbq1t0enasGWD7eQoJuslZY6R-4'],function(err,row){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(row);
//    }
//});

//query("call pro_check_register_by_weAccount(?)",['fdsfdfdsfdsfdsfdsfdfs'],function(err,rows){
//    if(err){
//        console.log(err);
//    }
//    console.log(rows);
//});

//query('call pro_register(?,?,?,?)',['1111110','222222222222','11111111111','1111111111111'],function(err,rows) {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log(rows);
//    }
//});

//query("call pro_select_products(?,?,?)",['oHbq1t0enasGWD7eQoJuslZY6R-4','888888',0],function(err,results){
//    if(err){
//        console.log(err);
//    }
//    console.log(results);
////    cb(err,results[0][0]);
//});
//call pro_check_register_by_weAccount('oHbq1t_wYiRebu6m8Qy8zF2ztreM')
//query("call pro_check_register_by_weAccount(?)",['oHbq1t0enasGWD7eQoJuslZY6R-4'],function(err,rows){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(rows)
//    }
//})


//query("call pro_check_user_favorite_room(?,?)",['oHbq1t0enasGWD7eQoJuslZY6R-4','999999'],function(err,rows){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(rows)
//    }
//})

//query("call pro_check_publisher_knock(?,?)",['999999','oHbq1t0enasGWD7eQoJuslZY6R-4'],function(err,results){
//    if(err){
//        console.log(err);
//    }
//    console.log(results);
//});