/**
 * Created by Administrator on 15-3-3.
 * 个人信息页面 js
 */
$(document).ready(function(){

    $(document).on("click",".cell",function(event){
        var $this = $(this);
//            if($this.find(".btn-group").is(":visible")){
//                $this.find(".btn-group").css("display","none");
//            }else{
        $this.find(".btn-group").css("display","block");
        $this.find(".value").attr("contenteditable",true).focus();
        $this.siblings(".cell").find(".btn-group").css("display","none");
//            }

    });
    $(document).on("click",".sure,.cancel",function(event){
        stopPropagation(event);
        var $this = $(this);
        var $obj = $this.parents(".btn-group").siblings(".value");
        if($this.hasClass("sure")){
            var value = $obj.text(),
                type = $obj.data("type");
            var data = {
                key:type,
                value:value
            }
            $.ajax({
                url:'/we_account/updatePersonality',
                type:"post",
                data:data,
                success:function(results){
                    if(results.flag == 1){
                        $obj.attr("data-value",$obj.text());
                        alert("修改成功");
                    }else{
                        alert("失败，请重试");
                    }
                }
            })
        }else{
            $this.parents(".btn-group").css("display","none").siblings(".value").attr("contenteditable",false).html($obj.data("value"));
        }
    });
});
function stopPropagation(event){
    if(event.stopPropagation){
        event.stopPropagation();
    }else if(event.cancelBubble){
        event.cancelBubble = true;
    }
}