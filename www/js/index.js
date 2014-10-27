var page = {
    sliderView : null,
    tabGroup : null,
    initialize: function () {
        this.initViews();
        this.bindEvents();
    },
    initViews : function () {
        this.sliderView = new SlideView('#slidewrapper',{
            openSlideMode : SlideView.OPEN_MODE_NONE
        });
        this.tabGroup = new TabGroup('#tabgroupwrapper');
    },
    bindEvents: function () {
    }
};