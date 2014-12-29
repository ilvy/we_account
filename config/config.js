/**
 * Created by Administrator on 14-12-19.
 */
var menusObj = {
    "button": [
        {
            name:"我要发布",
            sub_button:[
                {
                    type:"view",
                    name:"我有直播号",
                    url:"http://120.24.224.144/we_account/publish"
                },
                {
                    type:"click",
                    name:"申请直播号",
                    key:"apply_account"
                }
            ]
        },
        {
            type:"click",
            name:"进入直播间",
            key:"enter-live-room"
        }
    ]
};

var dbPoolConfig = {
    host     : '120.24.224.144',
    user     : 'root',
    password : 'root@123',
    database:'moment',
    connectionLimit:10
};

exports.menusObj = menusObj;
exports.dbPoolConfig = dbPoolConfig;