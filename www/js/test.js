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
                $('[data-pulllist-list] a').remove();
                for(var i=0;i<20;i++){
                    $('[data-pulllist-list]').append("<a data-pulllist-item href='#' class='list-group-item list-group-item-info'>Cras sit amet nibh libero</a>");
                }
                page.myScroll.refreshOver();
            },2000)
        });
        $('#wrapper').on('pullscroll-loadmore',function(event){
            setTimeout(function(){
                for(var i=0;i<20;i++){
                    $('[data-pulllist-list]').append("<a data-pulllist-item href='#' class='list-group-item list-group-item-info'>Cras sit amet nibh libero</a>");
                }
                page.myScroll.loadMoreOver();
            },2000)
        });
//        $('#wrapper').on('pullscroll-pullup',function(event){
//            setTimeout(function(){
//                $('[data-pulllist-list]').append("<a data-pulllist-item href='#' class='list-group-item list-group-item-danger'>Vestibulum at eros</a>");
//            },2000)
//        });
    },
    initData: function () {
    }
};

