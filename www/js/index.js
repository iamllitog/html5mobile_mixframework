var page = {
    cssObjs :{items : [{title:"栅格系统",id:'grid'},{title:"排版",id:'typesetting'},{title:"代码",id:'code'},{title:"表单",id:'form'},{title:"表格",id:'table'},{title:"按钮",id:'button'},{title:"图片",id:'image'},{title:"其他",id:'othercss'}]},
    sliderView : null,
    tabGroup : null,
    leftMenuList : null,
    initialize: function () {
        $(document).ready(this.documentReady);

    },
    documentReady : function () {
        page.initViews();
        page.bindEvents();
        page.initData();
    },
    initViews : function () {
        this.sliderView = new SlideView('#slidewrapper',{
            openSlideMode : SlideView.OPEN_MODE_NONE
        });
        this.tabGroup = new TabGroup('#tabgroupwrapper');
        this.leftMenuList = new IScroll('#leftmenuwrapper');

    },
    bindEvents: function () {
        $('#slidewrapper').on('slideview-movein-leftview',function(event){
            page.tabGroup.moveMode = TabGroup.MOVE_MODE_NODE;
        });
        $('#slidewrapper').on('slideview-movein-centerview',function(event){
            page.tabGroup.moveMode = TabGroup.MOVE_MODE_SLIDE;

        });
        $('#menuButton').on('click',function(event){
            page.sliderView.toggleLeftView();
        });
    },
    initData : function(){
        var cssItems = ich.left_menulist_template(this.cssObjs);
        $('#leftmenu_ul').append(cssItems);
    }
};

