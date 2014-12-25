var popup = {
    popupshow:function(title){
        $("body").append(
//                "<div id='bg'></div>"+
                "<div id='popbox'>"+
                    "<img class='popup_rotate360' src='../framework/mixframework/img/loading-icon.png' style='width: 50px;height: 50px;margin-top: 18px;margin-left:40px; '>"+
                    "<div><span style='position:absolute;margin-left:35px;margin-top: 10px;font-size: 18px'>"+title+"</span></div>"+
                "</div>"
        )
//        $("#bg").css("display","block");
        $("#popbox").css("display","block");
        //1.算出body的宽高
        var width=$('html').width();
        var height=$('html').height();
        //2.算出弹窗的位置
        var margin_left=(width-130)/2;
            var margin_top=(height-130)/2
            $("#popbox").css("top",margin_top+"px");


        $("#popbox").css("left",margin_left+"px");

    },
    popupclose : function () {
//        $("#bg").css("display","none");
        $("#popbox").css("display","none");
        $('#bg').remove();
        $("#popbox").remove();
    }
};
