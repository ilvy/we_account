/**
 * Created by Administrator on 14-12-10.
 */

var express = require("express"),
    router = express.Router(),
    crypto = require("crypto"),
    checkWeAuth = require("./we_account/wexin_check").check,
    xmlParser = require("./we_account/util/xml_parser"),
    formidable = require("formidable"),
    path = require("path"),
    fs = require("fs"),
    dispatcher = require("./we_account/business/dispatcher");
var TOKEN = 'jxfgx_20140526';
router.get("/",function(req,res){
    var query = req.query;
    var signature = query.signature,
        timestamp = query.timestamp,
        nonce = query.nonce,
        echostr = query.echostr;
    var array = [TOKEN,timestamp,nonce];
    array.sort();
    array.forEach(function(item){
        console.log(item);
    });
    var shaStr = "";
    array.forEach(function(item){
        shaStr += item;
    })
//    var sign = crypto.createHmac("sha1",shaStr).digest().toString('base64');
    var sign = crypto.createHash("sha1").update(shaStr).digest('hex');

    if(sign == signature){
        res.send(echostr);
    }else{
        console.log("check failed：生成signature:"+sign+",微信signature:"+signature)
        console.log("weixin_sign:"+signature);
        console.log("my_sign:"+sign);
    }
});

router.post("/",function(req,res){
    var xmlData = "",resultObj = {};
//    if(checkWeAuth(req)){
        console.log("get normal message from weixin user");
        req.on("data",function(data){
            xmlData += data;
        });
        req.on("end",function(){
            console.log("req end:"+xmlData);
            xmlParser.parseXml(xmlData,function(result){
                console.log("*****************************");
                for(var key in result){
                    console.log(key+": "+result[key]);
                }
                console.log("----------------"+result["ToUserName"]);
                console.log("in argument result:"+resultObj);
                var replyXml = '<xml>' +
                    '<ToUserName><![CDATA['+result["FromUserName"]+']]></ToUserName>' +
                    '<FromUserName><![CDATA['+result["ToUserName"]+']]></FromUserName>' +
                    '<CreateTime>'+new Date().getTime()+'</CreateTime>' +
                    '<MsgType><![CDATA['+result["MsgType"]+']]></MsgType>' +
                    '<Content><![CDATA['+"请求已接收，处理中，请稍后..."+']]></Content>' +
                    '</xml>';//result["FromUserName"];
//                res.write(replyXml);
//                res.end();
                dispatcher.dispatch(result,res);
            },resultObj);
        });
//    }else{
//        res.send("");
//        console.log("get normal message ,authority check failed");
//    }

});

//console.log(crypto.createHmac("sha1","21212121212hahahhehe").digest().toString('base64'));
//字典序排列
//[0,1,5,10,15].sort().forEach(function(item){
//    console.log(item);
//});

router.get("/publish",function(req,res){
    res.redirect("../test.html");
});

router.post("/upload",function(req,res){
    //console.log(req);
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname+'';
    console.log(process.cwd()+" ******** "+__dirname);

    form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        console.log( "rename:"+path.normalize(process.cwd()+"/public/images/" + file.name));
        fs.rename(file.path, path.normalize(process.cwd()+"/public/images/" + file.name),function(err){
            console.log("newPath:"+file.path);
        });
    })
        .on('error', function(err) {
            console.log("an error has occured with form upload");
            console.log(err);
//            request.resume();
        })
        .on('aborted', function(err) {
            console.log("user aborted upload");
        })
        .on('end', function() {
            console.log('-> upload done');
        });

    form.parse(req,function(err,fields,files){
//            fs.renameSync(files.upload.path,"/image/test.png");
        console.log(err);
        res.send("upload success");
    });
})


router.get("/xml",function(req,res){
    xmlParser.parseXml("<xml><ToUserName><![CDATA[gh_d28b25ec1197]]></ToUserName>" +
        "<FromUserName><![CDATA[oHbq1t0enasGWD7eQoJuslZY6R-4]]></FromUserName>" +
        "<CreateTime>1418886322</CreateTime>" +
        "<MsgType><![CDATA[text]]></MsgType>" +
        "<Content><![CDATA[Tygfguhhbdddghjj]]></Content>" +
        "<MsgId>6094070349933832851</MsgId>" +
        "</xml>",function(result){
        console.log("*****************************");
        for(var key in result){
            console.log(key+": "+result[key]);
        }
    });
    res.send("OK");
});

var obj = {};
obj["var1"] = 11111;
obj["var2"] = 22222;
obj["var3"] = 33333;
console.log(obj);

module.exports = router;
