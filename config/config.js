/**
 * Created by Administrator on 14-12-19.
 */
var menusObj = {
    "button": [
        {
            "type": "click",
            "name": "今日歌曲",
            "key": "V1001_TODAY_MUSIC"
        },
        {
            "name": "菜单",
            "sub_button": [
                {
                    "type": "view",
                    "name": "搜索",
                    "url": "http://www.soso.com/"
                },
                {
                    "type": "view",
                    "name": "视频",
                    "url": "http://v.qq.com/"
                },
                {
                    "type": "click",
                    "name": "赞一下我们",
                    "key": "V1001_GOOD"
                }
            ]
        }
    ]
};

exports.menusObj = menusObj;