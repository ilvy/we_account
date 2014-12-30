/**
 * Created by Administrator on 14-12-22.
 */

var dbOperator = require("../../../db/dbOperator");

function applyAccount(data,res){

}

/**
 *  TODO 注册使用md5加密密码
 * @param req
 * @param res
 */
function register(req,res){
    var body = req.body;
    var accountName = emailAccount = body.username,
        pwd = body.pwd;

}

function checkUser(open_id){
    var openId = open_id;
    return function(cb){
        dbOperator.query("call pro_check_register_by_weAccount(?)",[openId],function(err,rows){
            if(err){
                console.log(err);
            }
            cb(err,rows[0]);
        });
    }
}

function publishProduct(req,res){
    var body = req.body;
    var products = body.products,
        desc = body.desc,
        publisher_id = 100,
        params = [products,desc,publisher_id];
    dbOperator.query("call pro_publish(?,?,?)",params,function(err,row){
        if(err){
            console.log(err);
        }else{
            console.log(row);
        }
    });
}

exports.applyAccount = applyAccount;
exports.publishProduct = publishProduct;
exports.checkUser = checkUser;

