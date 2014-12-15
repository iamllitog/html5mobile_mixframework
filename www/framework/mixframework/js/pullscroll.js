//需要zepto
var PullScroll = (function (window, document) {

    PullScroll = function (element) {
        if (typeof element !== 'string') {
            throw new Error('first arg must string to select');
            return;
        }
        var that = this;
        this.elementStr = element;
        this.wrapper = document.querySelector(element);

        this.pullDownEl = document.querySelector(element + '  [data-pulllist-pulldown]');
        if (this.pullDownEl) {
            this.pullDownOffset = this.pullDownEl.offsetHeight;
        } else {
            this.pullDownOffset = 0;
        }

        this.pullUpEl = document.querySelector(element + '  [data-pulllist-pullup]');
        if (this.pullUpEl) {
            this.pullUpOffset = this.pullUpEl.offsetHeight;
        } else {
            this.pullUpOffset = 0;
        }

        this.sliderView = document.querySelector(element + ' > div');

        this.myScroll = new IScroll(element, {
            probeType: 1, tap: true, click: false, preventDefaultException: {tagName: /.*/}, mouseWheel: true, keyBindings: false,
            deceleration: 0.0002,
            startY: (parseInt(this.pullDownOffset) * (-1))
        });

        this.myScroll.on('scroll', function () {
            if (this.y > 0 && that.currentState == that.NOT_PULL_STATE) {
                //变为松开加载状态
                that.__changeToRelease();
            } else if (this.y < 0 && that.currentState == that.RELEASE_TO_REFRESH_STATE) {
                //变为下拉加载状态
                that.__changeToNotPull();
            } else if (this.y - that.pullUpOffset < this.maxScrollY && that.isAddMore == false && that.currentState != that.REFRESH_STATE) {
                //加载更多
                that.__event('loadmore');
                that.isAddMore = true;
            }
        });
        this.myScroll.on('scrollEnd', function () {
            if (this.y - that.pullUpOffset < this.maxScrollY && that.isAddMore == false && that.currentState != that.REFRESH_STATE) {
                //加载更多
                that.__event('loadmore');
                that.isAddMore = true;
            }
            if (that.currentState == that.RELEASE_TO_REFRESH_STATE) {
                that.__changeToRefresh();
                that.__event('refresh');
            }
        });

        //不懂 留着吧 In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
        setTimeout(function () {
            $(element).css({left: 0});
        }, 100);
    };

    PullScroll.prototype = {
        //当前状态
        currentState: 100,
        //是否正在加载更多
        isAddMore: false,
        //下拉加载三种状态
        NOT_PULL_STATE: 100,
        RELEASE_TO_REFRESH_STATE: 1000,
        REFRESH_STATE: 10000,

        /**
         * 刷新结束方法
         */
        refreshOver: function () {
            this.myScroll.scrollBy(0, parseInt(this.pullDownOffset) * (-1), 200);
            var icon = $(this.elementStr + ' [data-pulllist-pulldownicon]');
            var text = $(this.elementStr + ' [data-pulllist-pulldowntext]');
            icon.removeClass('glyphicon-refresh');
            icon.removeClass('rotate360');
            icon.addClass('glyphicon-arrow-down');
            icon.addClass('rotate0');
            text.text('下拉刷新');
            this.currentState = this.NOT_PULL_STATE;

            var wrapperH = this.wrapper.clientHeight, sliderH = this.sliderView.clientHeight, upsetH = $(this.elementStr + ' [data-pulllist-list] > .pullscroll-upsate').height() ? $(this.elementStr + ' [data-pulllist-list] > .pullscroll-upsate').height() : 0;
            if (wrapperH > sliderH) {
                $(this.elementStr + ' [data-pulllist-list]').append("<div class='pullscroll-upsate' style='min-height: " + (wrapperH - sliderH + 1) + "px'></div>");
            } else if (wrapperH > (sliderH - upsetH)) {
                $(this.elementStr + ' [data-pulllist-list] > .pullscroll-upsate').remove();
                $(this.elementStr + ' [data-pulllist-list]').append("<div class='pullscroll-upsate' style='min-height: " + (wrapperH - (sliderH - upsetH) + 1) + "px'></div>");
            } else {
                $(this.elementStr + ' [data-pulllist-list] > .pullscroll-upsate').remove()
            }
            var that = this;
            setTimeout(function () {
                that.myScroll.refresh();
                that = null;
            }, 0)

        },
        /**
         * 加载更多结束方法
         */
        loadMoreOver: function () {
            this.isAddMore = false;
            this.myScroll.refresh();
        },

        /**
         * 显示loading状态
         */
        showLoading: function () {
            this.myScroll.scrollTo(0, 0);
            this.__changeToRefresh();
        },

        __changeToNotPull: function () {
            var icon = $(this.elementStr + ' [data-pulllist-pulldownicon]');
            var text = $(this.elementStr + ' [data-pulllist-pulldowntext]');
            icon.removeClass('rotate-180');
            icon.addClass('rotate0');
            text.text('下拉刷新');
            this.currentState = this.NOT_PULL_STATE;
        },
        __changeToRelease: function () {
            var icon = $(this.elementStr + ' [data-pulllist-pulldownicon]');
            var text = $(this.elementStr + ' [data-pulllist-pulldowntext]');
            icon.removeClass('rotate0');
            icon.addClass('rotate-180');
            text.text('松开刷新');
            this.currentState = this.RELEASE_TO_REFRESH_STATE;
        },
        __changeToRefresh: function () {
            var icon = $(this.elementStr + ' [data-pulllist-pulldownicon]');
            var text = $(this.elementStr + ' [data-pulllist-pulldowntext]');
            icon.removeClass('glyphicon-arrow-down');
            icon.removeClass('rotate0');
            icon.removeClass('rotate-180');
            icon.addClass('glyphicon-refresh');
            icon.addClass('rotate360');

            text.text('正在刷新');
            this.currentState = this.REFRESH_STATE;
        },
        __event: function (type) {
            var ev = document.createEvent("Event");

            ev.initEvent('pullscroll-' + type, true, true);

            this.wrapper.dispatchEvent(ev);
        }
    }

    return PullScroll;

})(window, document);