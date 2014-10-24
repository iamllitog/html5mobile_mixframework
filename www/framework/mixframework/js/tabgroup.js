var TabGroup = (function (window, document) {
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

    // Browser capabilities
        has3d = prefixStyle('perspective') in dummyStyle,
        hasTouch = 'ontouchstart' in window,
        hasTransform = !!vendor,
        hasTransitionEnd = prefixStyle('transition') in dummyStyle,

    // Helpers
        translateZ = has3d ? ' translateZ(0)' : '',

    // Events
        resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove',
        endEvent = hasTouch ? 'touchend' : 'mouseup',
        cancelEvent = hasTouch ? 'touchcancel' : 'mouseup',
        tabBtClickEvent = 'click',
        transitionEndEvent = (function () {
            if (vendor === false) return false;

            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'oTransitionEnd',
                'ms': 'MSTransitionEnd'
            };

            return transitionEnd[vendor];
        })(),
        TabGroup = function (element, options) {
            if (typeof element !== 'string') {
                throw new Error('first arg must string to select');
                return;
            }

            //1.得到所有view
            this.wrapper = document.querySelector(element);
            this.sliderView = document.querySelector(element + " > [data-tabgroup-tabviews] ");

            var views = document.querySelectorAll(element + " > [data-tabgroup-tabviews] > [data-tabgroup-tabid]");

            this.options = {
                snapThreshold: null, //滑动多少距离后出现menu
                currentViewId: null,
                currentViewIndex: 0,
                moveMode: TabGroup.MOVE_MODE_SLIDE
            };

            for (var i in options) this.options[i] = options[i];

            this.wrapper.style.overflow = 'hidden';
            this.wrapper.style.position = 'relative';

            this.sliderView.style.cssText += ';position:relative;top:0;height:100%;width:100%;' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform:translateZ(0);' + cssVendor + 'transition-timing-function:ease-out';
            for (var i = 0, j = views.length; i < j; i++) {
                var view = views[i];
                var tabId = view.getAttribute('data-tabgroup-tabid');
                var tabBt = document.querySelector(element + " > [data-tabgroup-tabbuttons] > [data-tabgroup-tabid=" + tabId + "]");
                view.style.cssText += ';' + cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;width:100%;';
                view.style.left = i * 100 + '%';

                this.views[tabId] = {
                    index: i,
                    tabBt: tabBt,
                    view: view
                };
                this.tabIds.push(tabId);

                if (tabBt) {
                    tabBt.addEventListener(tabBtClickEvent, this, false);
                    this.views[tabId].tabBtActiveClass = tabBt.getAttribute('data-tabgroup-activebtclass');
                    this.views[tabId].tabBtDefaultClass = tabBt.getAttribute('data-tabgroup-defaultbtclass');
                }
                if (i == 0) {
                    this.currentViewIndex = 0;
                    tabBt.className += " " + this.views[tabId].tabBtActiveClass;
                } else {
                    tabBt.className += " " + this.views[tabId].tabBtDefaultClass;
                }

            }

            this.viewLength = views.length;
            views = null;

            this.refreshSize();

            window.addEventListener(resizeEvent, this, false);
            this.sliderView.addEventListener(startEvent, this, false);
            this.sliderView.addEventListener(moveEvent, this, false);
            this.sliderView.addEventListener(endEvent, this, false);

            if (this.options.currentViewId) {
                this.goToPageById(this.options.currentViewId);
            } else if (this.options.currentViewIndex) {
                this.goToPageByIndex(this.options.currentViewIndex);
            }
        };

    TabGroup.MOVE_MODE_SLIDE = 1000;
    TabGroup.MOVE_MODE_NODE = -1000;
    TabGroup.CHANGE_PAGE_TIME = 300;

    TabGroup.prototype = {
        views: {},
        tabIds: [],
        currentViewIndex: 0,
        x: 0,
        refreshSize: function () {
            this.wrapperWidth = this.wrapper.clientWidth;
            this.snapThreshold = this.options.snapThreshold === null ?
                Math.round(this.wrapperWidth * 0.15) :
                /%/.test(this.options.snapThreshold) ?
                    Math.round(this.wrapperWidth * this.options.snapThreshold.replace('%', '') / 100) :
                    this.options.snapThreshold;
        },

        //根据pageid跳转到对应界面
        goToPageById: function (pageId) {
            var view = this.views[pageId];
            if (view)
                this.__changeTab(view.index);
        },
        //根据index跳转到对应界面
        goToPageByIndex: function (pageIndex) {
            this.__changeTab(pageIndex);
        },

        //根据pageid跳转到对应界面(动画)
        animationToPageById: function (pageId) {
            var view = this.views[pageId];
            if (view) {
                this.sliderView.style[transitionDuration] = TabGroup.CHANGE_PAGE_TIME + 'ms';
                this.__changeTab(view.index);
            }
        },
        //根据index跳转到对应界面(动画)
        animationToPageByIndex: function (pageIndex) {
            this.sliderView.style[transitionDuration] = TabGroup.CHANGE_PAGE_TIME + 'ms';
            this.__changeTab(pageIndex);
        },

        //得到当前view的id
        getCurrentViewId: function () {
            return this.tabIds[this.currentViewIndex];
        },

        //得到当前view的index
        getCurrentViewIndex: function () {
            return this.currentViewIndex;
        },

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
                case resizeEvent:
                    this.__resize();
                    break;
                case tabBtClickEvent:
                    this.__tabBtclick(e);
                    break;
            }
        },

        __tabBtclick: function (e) {
            var tabIndex = this.views[e.currentTarget.getAttribute('data-tabgroup-tabid')].index;

            if (this.options.moveMode == TabGroup.MOVE_MODE_NODE) {
                this.sliderView.style[transitionDuration] = '0ms';
            } else {
                this.sliderView.style[transitionDuration] = TabGroup.CHANGE_PAGE_TIME + 'ms';
            }
            this.goToPageByIndex(tabIndex);
        },

        __resize: function () {
            this.refreshSize();
            this.sliderView.style[transitionDuration] = '0s';
            this.goToPageByIndex(this.currentViewIndex);
        },

        __start: function (e) {
            if (this.initiated) return;

            if (this.options.moveMode == TabGroup.MOVE_MODE_NODE) {
                return;
            }
            this.initiated = true;
            var point = hasTouch ? e.touches[0] : e;
            this.startX = point.pageX;
            this.startY = point.pageY;
            this.beginX = point.pageX;
            this.beginY = point.pageY;
            this.touchdistanceX = 0;
            this.touchdistanceY = 0;
            this.sliderView.style[transitionDuration] = '0s';
        },

        __move: function (e) {

            if (!this.initiated) return;

            if (this.options.moveMode == TabGroup.MOVE_MODE_NODE) {
                return;
            }

            var point = hasTouch ? e.touches[0] : e;

            this.endX = point.pageX;
            this.endY = point.pageY;
            this.movedistanceX = this.endX - this.startX;
            this.movedistanceY = this.endY - this.startY;

            this.newX = this.movedistanceX + this.x;

            this.startX = this.endX;
            this.startY = this.endY;

            this.touchdistanceX += Math.abs(this.movedistanceX);
            this.touchdistanceY += Math.abs(this.movedistanceY);

            //x方向和y方向划动大于10为有效
            if (this.touchdistanceX < 10 && this.touchdistanceY < 10) {
                return;
            }
            e.preventDefault();

            // 越界判断
            if (this.newX < (-(this.viewLength - 1) * this.wrapperWidth) || this.newX > 0) {
                return;
            }

            this.__pos(this.newX);


        },

        __end: function (e) {
            if (!this.initiated) return;

            if (this.options.moveMode == TabGroup.MOVE_MODE_NODE) {
                return;
            }

            this.initiated = false;

            var point = hasTouch ? e.changedTouches[0] : e,
                distX = point.pageX - this.beginX;

            this.sliderView.style[transitionDuration] = Math.floor(100 * Math.abs(distX) / this.snapThreshold) + 'ms';

            if (Math.abs(distX) <= this.snapThreshold) {
                this.__changeTab(this.currentViewIndex);
            } else if (distX > 0) {
                this.__changeTab(this.currentViewIndex > 0 ? (this.currentViewIndex - 1) : 0);
            } else {
                this.__changeTab(this.currentViewIndex < (this.viewLength - 1) ? (this.currentViewIndex + 1) : (this.viewLength - 1));
            }
        },

        //更改tab
        __changeTab: function (newIndex) {
            if (this.currentViewIndex != newIndex) {

                var currentView = this.views[this.tabIds[this.currentViewIndex]];
                var newView = this.views[this.tabIds[newIndex]];

                var activeClass = currentView.tabBtActiveClass;
                var defualtClass = currentView.tabBtDefaultClass;
                currentView.tabBt.className = currentView.tabBt.className.replace(activeClass, defualtClass);

                activeClass = newView.tabBtActiveClass;
                defualtClass = newView.tabBtDefaultClass;
                newView.tabBt.className = newView.tabBt.className.replace(defualtClass, activeClass);

                this.currentViewIndex = newIndex;
            }

            this.__pos(-this.currentViewIndex * this.wrapperWidth);
        },

        __event: function (type) {
            var ev = document.createEvent("Event");

            ev.initEvent('tabgroup-' + type, true, true);

            this.wrapper.dispatchEvent(ev);
        },
        __pos: function (x) {
            this.x = x;
            this.sliderView.style[transform] = 'translate(' + x + 'px,0)' + translateZ;
        }
    };

    function prefixStyle(style) {
        if (vendor === '') return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    return TabGroup;

})(window, document);