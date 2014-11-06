var page = {
    headerHeight : 0,
    myScroll : null,
    initialize: function () {
        $(document).ready(this.documentReady);
    },
    documentReady: function () {
        page.initViews();
        page.bindEvents();
        page.initData();
    },
    initViews: function () {
        this.myScroll = new PullScroll('#wrapper');

    },
    bindEvents: function () {
        $('#wrapper').on('pullscroll-refresh',function(event){
            setTimeout(function(){
                page.myScroll.refreshOver();
            },2000)
        });
    },
    initData: function () {
    }
};

