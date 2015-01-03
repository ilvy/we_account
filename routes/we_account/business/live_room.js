/**
 * Created by Administrator on 2015/1/3.
 */

var dbOperator = require("../../../db/dbOperator")

function gotoLiveRoom(req,res){
    var openId = req.session.openId;
    var products;
    dbOperator.query("call pro_select_product(?)",[openId],function(err,rows){
        if(err){
            console.log("select products err");
            res.redirect("/err.html");
        }
        console.log(rows);
        products = rows[0];
        products.forEach(function(item,i){
            item.image_url = item.image_url.split(";");
        });
        console.log("products:"+products);
        res.render("live-room",{products:products||[]});
    });
}

exports.renderLiveRoom = gotoLiveRoom;