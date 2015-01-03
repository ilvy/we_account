/**
 * Created by Administrator on 14-12-10.
 */

var express = require("express"),
    router = express.Router(),
    https = require("https"),
    crypto = require("crypto"),
    checkWeAuth = require("./we_account/wexin_check").check,
    xmlParser = require("./we_account/util/xml_parser"),
    formidable = require("formidable"),
    path = require("path"),
    fs = require("fs"),
    dispatcher = require("./we_account/business/dispatcher"),
    publishAccount = require("./we_account/business/publish_account"),
    urlencode = require("urlencode"),
    appConfig = require("../config/config").appConfig,
    async = require("async"),
    session = require("express-session");
var publish_account = require("./we_account/business/publish_account"),
    checkUser = publish_account.checkUser,
    register = publish_account.register,
    gotoLiveRoom = require("./we_account/business/live_room").renderLiveRoom;

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

router.get("/register",function(req,res){

});

router.get("/writeSession",function(req,res){
    var session = req.session;
    console.log("****"+session.name+"***"+session.openId);
    session.openId = Math.random()*100;
    console.log("req.session.openId");
    console.log(session);
    res.redirect("/register.html");
})

router.post("/register",function(req,res){
//    var session = req.session;
//    var body = req.body;
//    var openId = session.openId,
//        username = body.username,
//        pwd = body.pwd;
//    console.log(session);
//    console.log("**************"+session.name+"*********openId:"+openId);
//    res.send("**************"+session.name+"*********openId:"+openId);
    register(req,res);
});

router.get("/publish",function(req,res){
    //判断用户是否存在账号，若无，返回注册界面，若已有账号，直接登录即可
    var redirect_uri = urlencode("http://120.24.224.144/we_account/goto_publish");
    res.redirect("https://open.weixin.qq.com/connect/oauth2/authorize?" +
        "appid="+appConfig.appId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect");
});

router.get("/goto_publish",function(req,resp){
    var session = req.session;
    var query = req.query;
    var code = query.code,
        status = query.status,
        appId = appConfig.appId,
        appSecret = appConfig.appSecret;
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appId+'&secret='+appSecret+'' +
        '&code='+code+'&grant_type=authorization_code';
    https.get(url,function(res){
        var chunks = "";
        res.on("data",function(data){
            chunks += data;
        });
        res.on('end',function(){
//            console.log(chunks.toString());
            var userInfo = JSON.parse(chunks);
            var openId = userInfo.openid;
            session.openId = openId;
            checkUser(openId,function response(err,results){
                if(err){
                    resp.redirect("err.html");
                    return;
                }
                if(results[0]["count(1)"]){
                    resp.redirect("/live-room-waterfall.html");
                }else{
                    resp.redirect("/register.html");
                }
            });
        })
    }).on("error",function(e){
        console.log("get error:"+ e.message);
    });
});

router.get("/live-room",gotoLiveRoom);

router.post("/publish",function(req,res){
    publishAccount.publishProduct(req,res);
});

router.post("/upload",function(req,res){
    //console.log(req);
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname+'';
    console.log(process.cwd()+" ******** "+__dirname);
    var newFileName = "test_"+new Date().getTime();//test换成用户的唯一识别

    form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        newFileName = newFileName + "." +file.name.split(".")[1];
        console.log( "rename:"+path.normalize(process.cwd()+"/public/images/" + newFileName));
        fs.rename(file.path, path.normalize(process.cwd()+"/public/images/" + newFileName),function(err){
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
        if(err){
            console.log(err);
            res.send("err");
        }
        res.send(newFileName);
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
