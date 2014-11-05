var page = {
    headerHeight : 0,
    myScroll : null,
    changeOld : false,
    initialize: function () {
        $(document).ready(this.documentReady);
    },
    documentReady: function () {
        page.initViews();
        page.bindEvents();
        page.initData();
    },
    initViews: function () {
        var hasTouch = 'ontouchstart' in window;
        var moveEvent = hasTouch ? 'touchmove' : 'mousemove',
            endEvent = hasTouch ? 'touchend' : 'mouseup';

        this.headerHeight = $('[data-pulllist-header]').height();
        $('.list-group').css('margin-top', -this.headerHeight)
        this.myScroll = new IScroll('#wrapper');

        $('.list-group').on(endEvent,function(e){
            if($(this).offset().top > page.headerHeight){
                $(this).css('margin-top', 0);
                setTimeout(function () {
                    page.myScroll.scrollBy(0,-page.headerHeight,200, IScroll.utils.ease.quadratic);
                    page.changeOld = true;
                },2000);
            }
        });

        this.myScroll.on('scrollEnd', function () {
            if(page.changeOld){
                $('.list-group').css('margin-top', -page.headerHeight);
                page.myScroll.scrollBy(0,page.headerHeight);
                page.changeOld = false;
            }
        });
    },
    bindEvents: function () {
    },
    initData: function () {
    }
};

