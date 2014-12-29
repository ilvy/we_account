/**
 * Created by Administrator on 14-12-29.
 */
var mysql = require("mysql"),
    dbPoolConfig = require("../config/config").dbPoolConfig;

var pool = mysql.createPool(dbPoolConfig);

var query = function(sql,callback){
    pool.getConnection(function(err,connection){
        if(err){
            console.log(err);
            return;
        }
        connection.query(sql,function(err,rows){
            callback(err,rows);
            connection.release();
        });
    })
}

exports.query = query;

query("select * from user",function(err,rows){
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }
})