/**
 * Created by Administrator on 14-12-19.
 */
var menusObj = {
    "button": [
        {
            type:"click",
            name:"我要发布",
            key:"publish"
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