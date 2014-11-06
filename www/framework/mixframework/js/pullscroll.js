//需要zepto
var PullScroll = (function (window, document) {
    var dummyStyle = document.createElement('div').style,
        vendor = (function () {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                t = vendors[i] + 'ransform';
                if (t in dummyStyle) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

    // Style properties
        transform = prefixStyle('transform'),
        transitionDuration = prefixStyle('transitionDuration'),

        hasTouch = 'ontouchstart' in window;

    startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup',
        cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',

        PullScroll = function (element) {
            var that = this;
            if (typeof element !== 'string') {
                throw new Error('first arg must string to select');
                return;
            }

            this.iScroll = new IScroll(element);

            //1.得到warpper和warpper里的滑动区域
            this.wrapper = document.querySelector(element);
            this.sliderView = document.querySelector(element + " > div ");


            //TODO 2.查看header,如果没有则添加一个
            this.header = $(element + " > div > [data-pulllist-header]");
            this.headerHeight = this.header.height();
            $(this.sliderView).css('margin-top', -this.headerHeight);
            this.headerIcon = document.querySelector(element + " > div > [data-pulllist-header] > [data-pulllist-icon]");
            this.headerText = document.querySelector(element + " > div > [data-pulllist-header] > [data-pulllist-text]");

            //3.绑定事件
            this.sliderView.addEventListener(startEvent, this, false);
            this.sliderView.addEventListener(moveEvent, this, false);
            this.sliderView.addEventListener(endEvent, this, false);
//
            this.iScroll.on('scrollEnd', function () {
                if (!that.isRefreshOver) {
                    $(that.sliderView).css('margin-top', -that.headerHeight);
                    that.iScroll.scrollBy(0, that.headerHeight);
                    that.isRefreshOver = true;
                }
            });

        };

    PullScroll.prototype = {
        isRefreshOver: true,
        currentState: 100,

        NOT_PULL_STATE: 100,
        RELEASE_TO_REFRESH_STATE: 1000,
        REFRESH_STATE: 10000,

        //处理事件的方法
        handleEvent: function (e) {
            switch (e.type) {
                case startEvent:
                    this.__start(e);
                    break;
                case moveEvent:
                    this.__move(e);
                    break;
                case cancelEvent:
                case endEvent:
                    this.__end(e);
                    break;
            }
        },

        refreshOver: function () {
            this.iScroll.scrollBy(0, -this.headerHeight, 200, IScroll.utils.ease.quadratic);
            this.isRefreshOver = false;
            this.currentState = this.NOT_PULL_STATE;
            this.__changeToNotPull();
        },

        __start: function (e) {
            if (this.initiated) return;
            this.initiated = true;
        },

        __move: function (e) {
            if (!this.initiated) return;
            if ($(this.sliderView).offset().top > this.headerHeight && this.currentState == this.NOT_PULL_STATE) {
                //更换状态
                this.__changeToRelease();
                this.__event('release_to_refresh', e);
                this.currentState = this.RELEASE_TO_REFRESH_STATE;
            } else if($(this.sliderView).offset().top < this.headerHeight && this.currentState == this.RELEASE_TO_REFRESH_STATE){
                this.__changeToNotPull();
                this.__event('pull_to_refresh', e);
                this.currentState = this.NOT_PULL_STATE;
            }
        },

        __end: function (e) {
            if (!this.initiated) return;
            this.initiated = false;
            if ($(this.sliderView).offset().top > this.headerHeight && this.currentState != this.REFRESH_STATE) {
//                alert(this.iScroll.maxScrollY);
                this.__changeToRefresh();
                this.iScroll.scrollBy(0, -this.headerHeight);
                $(this.sliderView).css('margin-top', 0);
                this.currentState = this.REFRESH_STATE;
                this.__event('refresh', e);
            }
        },

        //iscroll上的事件处理

        __event: function (type, data) {
            var ev = document.createEvent("Event");

            for (var i in data) {
                var propertyName = i;
                if (propertyName == 'returnValue') continue;
                var property = data[i];
                if (typeof ev[propertyName] != 'function' && propertyName != "returnValue")
                    ev[propertyName] = property;
            }
            ev.initEvent('pullscroll-' + type, true, true);

            this.wrapper.dispatchEvent(ev);
        },

        __changeToNotPull: function () {
            this.headerIcon.className = this.headerIcon.className.replace('glyphicon-refresh', 'glyphicon-arrow-down');
            this.headerIcon.style[transitionDuration] = '500ms';
            this.headerIcon.style[transform] = 'rotate(0deg)';
            this.headerText.innerHTML = '下拉刷新';
        },
        __changeToRelease: function () {
//            this.headerIcon.className = this.headerIcon.className.replace('glyphicon-refresh','glyphicon-arrow-down');
            this.headerIcon.style[transitionDuration] = '500ms';
            this.headerIcon.style[transform] = 'rotate(-180deg)';
            this.headerText.innerHTML = '松开刷新';
        },
        __changeToRefresh: function () {
            this.headerIcon.className = this.headerIcon.className.replace('glyphicon-arrow-down', 'glyphicon-refresh');
            //TODO 此处需要修改以增强适配
//            this.headerIcon.style['-webkit-animation-iteration-count'] = 20;
            this.headerIcon.style[transitionDuration] = '1000ms';
            this.headerIcon.style[transform] = 'rotate(180deg)';
            this.headerText.innerHTML = '正在刷新';
        }
    };

    function prefixStyle(style) {
        if (vendor === '') return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    return PullScroll;

})(window, document);