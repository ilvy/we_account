/**
 * Created by Administrator on 14-12-29.
 */
var mysql = require("mysql"),
    dbPoolConfig = require("../config/config").dbPoolConfig;

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


//query("call pro_publish(?,?,?)",["img1.jpg;img2.jpg",'hhhhhhhhhhaaaaaaa',100],function(err,row){
//    if(err){
//        console.log(err);
//    }else{
//        console.log(row);
//    }
//});
