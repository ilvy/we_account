/**
 * Created by Administrator on 14-12-22.
 */

var applyAccount = require("./publish_account").applyAccount,
    response = require("../response/response").response,
    transitionManager = require("./transitionManager"),
    transition = '';//apply_account、enter-live-room、apply_nice_num:申请靓号
var niceNums = ['121212','438438','436436'];

function dispatch(data,res){
    switch (data.MsgType){
        case 'text':
            console.log("msgtype:text");
            var text = data.Content;
            if(text == 'a1'){
                data.replyContent = "您的直播号："+123456;
            }else if(text == 'a2'){
                data.replyContent = "1、121212 ￥：30\n,"
                                        +"2、438438 ￥：50\n"
                                        +"3、436436 ￥：50\n"
                                        +"4、......\n"
                                        +"999、暂停购买\n"
                                        +"请输入您心仪的号码序号";
                transition = transitionManager.apply_nice_num;
            }else if(typeof text == 'Number' && transition == transitionManager.apply_nice_num){
                data.replyContent = '购买靓号:'+niceNums[text]+"成功";
            }else if(transition == transitionManager.enter_live_room){
                data.replyContent = '进入直播间。。。';
            }
            response(data,res);
            break;
        case 'event':
            console.log("msgtype:event");
            if(data.Event == 'CLICK'){
                console.log("event:click");
                if(data.EventKey == 'apply_account'){
                    console.log("EventKey:apply_account");
//                    applyAccount(data,res);
                    data.replyContent = "申请直播号请输入：\na1：系统生成随机号，\na2：申请靓号";
                    transition = transitionManager.apply_account;
                    response(data,res);
                }else if(data.EventKey == 'enter-live-room'){
                    data.replyContent = "请输入想要进入的直播号(6位)";
                    transition = transitionManager.enter_live_room;
                    response(data,res);
                }
            }else if(data.Event == 'VIEW'){
                break;
            }
            break;
        default :
            break;

    }
}

exports.dispatch = dispatch;
