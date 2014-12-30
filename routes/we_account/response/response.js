/**
 * Created by Administrator on 14-12-22.
 */

function response(data,res){
    var replyXml = '<xml>' +
        '<ToUserName><![CDATA['+data["FromUserName"]+']]></ToUserName>' +
        '<FromUserName><![CDATA['+data["ToUserName"]+']]></FromUserName>' +
        '<CreateTime>'+new Date().getTime()+'</CreateTime>' +
        '<MsgType><![CDATA[text]]></MsgType>' +
        '<Content><![CDATA['+data.replyContent+']]></Content>' +
        '</xml>';
    console.log(replyXml);
    res.write(replyXml);
    res.end();
}

function success(res){

}

exports.response = response;