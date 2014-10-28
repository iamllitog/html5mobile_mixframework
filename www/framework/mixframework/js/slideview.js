var SlideView = (function (window, document) {
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
        SlideView = function (element, options) {
            if (typeof element !== 'string') {
                throw new Error('first arg must string to select');
                return;
            }

            //1.得到所有view
            this.wrapper = document.querySelector(element);
            this.sliderView = document.querySelector(element + " > [data-slide-slider]");
            this.leftView = document.querySelector(element + " > [data-slide-slider] > [data-slide-leftview]");
            this.contentView = document.querySelector(element + " > [data-slide-slider] > [data-slide-content]");
            this.rightView = document.querySelector(element + " > [data-slide-slider] > [data-slide-rightview]");

            if (this.leftView == null || typeof this.leftView == 'undefined') {
                this.leftView = document.createElement('div');
                this.sliderView.appendChild(this.leftView);
                this.leftView.style.width = 0;
            }

            if (this.rightView == null || typeof this.rightView == 'undefined') {
                this.rightView = document.createElement('div');
                this.sliderView.appendChild(this.rightView);
                this.rightView.style.width = 0;
            }

            this.options = {
                openSlideMode: SlideView.OPEN_MODE_ALL,
                closeSlideMode: SlideView.OPEN_MODE_ALL,
                snapThreshold: null //滑动多少距离后出现menu
            };

            for (var i in options) this.options[i] = options[i];

            this.wrapper.style.overflow = 'hidden';
            this.wrapper.style.position = 'relative';

            this.sliderView.style.cssText += ';position:relative;top:0;height:100%;width:100%;' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform:translateZ(0);' + cssVendor + 'transition-timing-function:ease-out';
            this.contentView.style.cssText += ';' + cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;';
            this.leftView.style.cssText += ';' + cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;left:-' + this.leftView.style.width;
            this.rightView.style.cssText += ';' + cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;right:-' + this.rightView.style.width;

            this.refreshSize();

            window.addEventListener(resizeEvent, this, false);
            this.wrapper.addEventListener(startEvent, this, false);
            this.wrapper.addEventListener(moveEvent, this, false);
            this.wrapper.addEventListener(endEvent, this, false);
            this.sliderView.addEventListener(transitionEndEvent,this, false);

        };
//声明打开关闭的模式
    SlideView.OPEN_MODE_NONE = 100;
    SlideView.OPEN_MODE_ALL = 1000;
    SlideView.CLOSE_MODE_NONE = -100;
    SlideView.CLOSE_MODE_ALL = -1000;

    SlideView.CURRENT_LEFT_VIEW = 'left-view';
    SlideView.CURRENT_CENTER_VIEW = 'center-view';
    SlideView.CURRENT_RIGHT_VIEW = 'right-view';

    SlideView.prototype = {

        currentViewTag: 'center-view',
        x: 0,
        //开关左侧view
        toggleLeftView: function () {
            if(this.isFlip) return;
            var tranTime = Math.floor(80 * Math.abs(this.leftViewWidth) / this.snapThreshold);
            if (this.currentViewTag == SlideView.CURRENT_LEFT_VIEW) {
                this.__pos(0,tranTime);
                this.currentViewTag = SlideView.CURRENT_CENTER_VIEW;
                this.__event('movein-centerview');
            } else {
                this.__pos(this.leftViewWidth,tranTime);
                this.currentViewTag = SlideView.CURRENT_LEFT_VIEW;
                this.__event('movein-leftview');
            }
        },

        //开关右侧view
        toggleRightView: function () {
            if(this.isFlip) return;
            var tranTime = Math.floor(80 * Math.abs(this.rightViewWidth) / this.snapThreshold);
            if (this.currentViewTag == SlideView.CURRENT_RIGHT_VIEW) {
                this.__pos(0,tranTime);
                this.currentViewTag = SlideView.CURRENT_CENTER_VIEW;
                this.__event('movein-centerview');
            } else {
                this.__pos(-this.rightViewWidth,tranTime);
                this.currentViewTag = SlideView.CURRENT_RIGHT_VIEW;
                this.__event('movein-rightview');
            }
        },
        //得到当前显示的view 是right还是left还是center
        getCurrentViewTag: function () {
            return this.currentViewTag;
        },
        refreshSize: function () {
            this.wrapperWidth = this.wrapper.clientWidth;
            this.leftViewWidth = this.leftView.clientWidth;
            this.rightViewWidth = this.rightView.clientWidth;

            this.snapThreshold = this.options.snapThreshold === null ?
                Math.round(this.wrapperWidth * 0.15) :
                /%/.test(this.options.snapThreshold) ?
                    Math.round(this.wrapperWidth * this.options.snapThreshold.replace('%', '') / 100) :
                    this.options.snapThreshold;
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
                case transitionEndEvent:
                case 'otransitionend':
                    if (e.target == this.sliderView) this.__flipEnd();
                    break;
            }
        },

        __resize: function () {
            this.refreshSize();
            this.currentViewTag = SlideView.CURRENT_CENTER_VIEW;
                this.__pos(0);
        },

        __start: function (e) {
            if (this.initiated) return;

            var point = hasTouch ? e.touches[0] : e;

            this.__event('movestart', e);

            this.initiated = true;
            this.startX = point.pageX;
            this.startY = point.pageY;
            this.startPointX = point.pageX;
            this.startPointY = point.pageY;
            this.touchdistanceX = 0;
            this.touchdistanceY = 0;

            this.sliderView.style[transitionDuration] = '0s';
        },

        __move: function (e) {

            if (!this.initiated) return;

            //是否划动
            if ((this.currentViewTag == SlideView.CURRENT_LEFT_VIEW || this.currentViewTag == SlideView.CURRENT_RIGHT_VIEW) && this.options.closeSlideMode == SlideView.CLOSE_MODE_NONE) {
                return;
            } else if (this.currentViewTag == SlideView.CURRENT_CENTER_VIEW && this.options.openSlideMode == SlideView.OPEN_MODE_NONE) {
                return;
            }

            this.__event('move', e);
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
            if ((this.touchdistanceX < 10 && this.touchdistanceY < 10) || this.touchdistanceX < this.touchdistanceY ) {
                return;
            }
            e.preventDefault();

            //越界判断
            if (this.newX < -this.rightViewWidth || this.newX > this.leftViewWidth) {
                return;
            }

            this.__pos(this.newX);
        },

        __end: function (e) {
            if (!this.initiated) return;
            this.initiated = false;
            //是否划动
            if ((this.currentViewTag == SlideView.CURRENT_LEFT_VIEW || this.currentViewTag == SlideView.CURRENT_RIGHT_VIEW) && this.options.closeSlideMode == SlideView.CLOSE_MODE_NONE) {
                return;
            } else if (this.currentViewTag == SlideView.CURRENT_CENTER_VIEW && this.options.openSlideMode == SlideView.OPEN_MODE_NONE) {
                return;
            }

            this.__event('moveend', e);

            var point = hasTouch ? e.changedTouches[0] : e,
                distX = point.pageX - this.startPointX,
                distY = point.pageY - this.startPointY;

            if(Math.abs(distX) < Math.abs(distY))
                return;



            if (this.currentViewTag == SlideView.CURRENT_LEFT_VIEW) {
                if ((distX < 0 && Math.abs(distX) > this.snapThreshold) || (Math.abs(distX) < 10 && point.pageX > this.leftViewWidth)) {
                    this.__pos(0,Math.floor(150 * Math.abs(this.leftViewWidth - Math.abs(distX)) / this.snapThreshold));
                    this.currentViewTag = SlideView.CURRENT_CENTER_VIEW;
                    this.__event('movein-centerview');
                } else {
                    this.__pos(this.leftViewWidth,Math.floor(150 * Math.abs(distX) / this.snapThreshold));
                }
            } else if (this.currentViewTag == SlideView.CURRENT_CENTER_VIEW) {
                if (distX < 0 && Math.abs(distX) > this.snapThreshold) {
                    this.__pos(-this.rightViewWidth,Math.floor(150 * Math.abs(this.rightViewWidth - Math.abs(distX)) / this.snapThreshold));
                    this.currentViewTag = SlideView.CURRENT_RIGHT_VIEW;
                    this.__event('movein-rightview');
                } else if (distX > 0 && Math.abs(distX) > this.snapThreshold) {
                    this.__pos(this.leftViewWidth,Math.floor(150 * Math.abs(this.leftViewWidth - Math.abs(distX)) / this.snapThreshold));
                    this.currentViewTag = SlideView.CURRENT_LEFT_VIEW;
                    this.__event('movein-leftview');
                } else {
                    this.__pos(0,Math.floor(150 * Math.abs(distX) / this.snapThreshold));
                }
            } else {
                if ((distX > 0 && Math.abs(distX) > this.snapThreshold) || (Math.abs(distX) < 10 && point.pageX < (this.leftViewWidth + this.wrapperWidth))) {
                    this.__pos(0,Math.floor(150 * Math.abs(this.rightViewWidth - Math.abs(distX)) / this.snapThreshold));
                    this.currentViewTag = SlideView.CURRENT_CENTER_VIEW;
                    this.__event('movein-centerview');
                } else {
                    this.__pos(-this.rightViewWidth,Math.floor(150 * Math.abs(distX) / this.snapThreshold));
                }
            }
        },

        __flipEnd : function(e){
            this.isFlip = false;
        },

        __event: function (type, data) {
            var ev = document.createEvent("Event");

            for (var i in data) {
                var propertyName = i;
                if (propertyName == 'returnValue') continue;
                var property = data[i];
                if (typeof ev[propertyName] != 'function' && propertyName != "returnValue")
                    ev[propertyName] = property;
            }
            ev.initEvent('slideview-' + type, true, true);

            this.wrapper.dispatchEvent(ev);
        },
        __pos: function (x,time) {
            if(time && time > 0)
                this.isFlip = true;
            this.sliderView.style[transitionDuration] = time + 'ms';
            this.x = x;
            this.sliderView.style[transform] = 'translate(' + x + 'px,0)' + translateZ;
        }
    };

    function prefixStyle(style) {
        if (vendor === '') return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    return SlideView;

})(window, document);