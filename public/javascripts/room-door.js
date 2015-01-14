/**
 * Created by Administrator on 2015/1/14.
 */

$(document).ready(function(){
    addListener();
});

function addListener(){
    $(".favour_room_option").on("click",function(){
        var room = encodeURI($(this).html().trim());
        $.ajax({
            url:'/we_account/knock_door',
            type:"post",
            data:{room:room},
            success:function(results){
                if(results && results.flag == 1){
                    window.location.href = '/we_account/live-room?room_id='+room;
                    $("#favour_rooms_options_popup").modal('hide');
                }else{
                    alert("对不起，您输入的门牌号有误");
                    $("#favour_rooms_options_popup").modal('hide');
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    });
    $("#enter-room-btn").on("click",function(){
        var room = encodeURI($("#room").html().trim());
        if(room.length > 20){
            alert("输入不合法");
        }else if(room.length == 0){
            alert("不能为空");
        }else{
            $.ajax({
                url:'/we_account/knock_door',
                type:"post",
                data:{room:room},
                success:function(results){
                    if(results && results.flag == 1){
                        window.location.href = '/we_account/live-room?room_id='+room;
//                        window.location.href = '/we_account/open_door';
                    }else{
                        alert("对不起，您输入的门牌号有误");
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        }
    });
}