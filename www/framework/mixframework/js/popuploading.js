var popup = {
    popupshow: function (title) {
        $("body").append(
                "<div id='popbox'>" +
                "<img class='rotate360' src='../framework/mixframework/img/login.png' style='width: 50px;height: 50px;margin-top: 18px;margin-left:40px; '>" +
                "<div><span style='position:absolute;margin-left:35px;margin-top: 10px;font-size: 18px'>" + title + "</span></div>" +
                "</div>"
        );
//        $("#bg").css("display","block");
        $("#popbox").css("display", "block");
        //1.算出body的宽高
        var width = $('html').width();
        var height = $('html').height();
        //2.算出弹窗的位置
        var margin_left = (width - 130) / 2;
        var margin_top = (height - 130) / 2;
        $("#popbox").css("top", margin_top + "px");
        $("#popbox").css("left", margin_left + "px");

    },
    popupclose: function () {
//        $("#bg").css("display","none");
        $("#popbox").css("display", "none");
//        $('#bg').remove();
        $("#popbox").remove();
    },
    popupShowWindow: function (title) {
        $('body').append(
                '<div id="bg"></div>'+
                '<div class="window_popup" id="window_popup">' + title + '<div>'
        );
        $("#bg").css("display", "block");
        $(".window_popup").css("display", "block");
        //1.算出body的宽高
        var width = $('html').width();
        var height = $('html').height();
        //2.算出弹窗的位置
//        var margin_left = (width-130) / 2;
        $(".window_popup").css("max-width", width*0.96 + "px");
        $(".window_popup").css("min-width", width*0.8 + "px");
        var windowW=$('.window_popup').width();
        var windowH=$('.window_popup').height()/2;


        var margin_left=(width-windowW)/2;
        var margin_top = height/2-windowH;
        $(".window_popup").css("top", margin_top + "px");
        $(".window_popup").css("left", margin_left + "px");




    },
    popupCloseWindow: function () {
        $("#bg").css("display", "none");
        $(".window_popup").css("display", "none");
        $('#bg').remove();
        $(".window_popup").remove();
    }
};
