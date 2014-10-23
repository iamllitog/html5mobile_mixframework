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

            var list = document.querySelectorAll(element + " > [data-tabgroup-tabviews] > [data-tabgroup-tabid]");

            for(var i= 0,j=list.length;i<j;i++){
                alert( list[i].getAttribute('data-tabgroup-tabid'));
            }

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
            this.contentView.style.cssText += ';'+cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;';
            this.leftView.style.cssText += ';' + cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;left:-' + this.leftView.style.width;
            this.rightView.style.cssText += ';' + cssVendor + 'transform:translateZ(0);position:absolute;top:0;height:100%;right:-' + this.rightView.style.width;

            this.refreshSize();

            window.addEventListener(resizeEvent, this, false);
            this.wrapper.addEventListener(startEvent, this, false);
            this.wrapper.addEventListener(moveEvent, this, false);
            this.wrapper.addEventListener(endEvent, this, false);
        };

    TabGroup.prototype = {
        refreshSize: function () {
            var wrapperWidth = this.wrapper.clientWidth;
            this.snapThreshold = this.options.snapThreshold === null ?
                Math.round(wrapperWidth * 0.15) :
                /%/.test(this.options.snapThreshold) ?
                    Math.round(wrapperWidth * this.options.snapThreshold.replace('%', '') / 100) :
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
            }
        },

        __resize: function () {
            this.refreshSize();
            this.sliderView.style[transitionDuration] = '0s';
            this.__pos(0);
        },

        __start: function (e) {
            if (this.initiated) return;

            this.initiated = true;

        },

        __move: function (e) {

            if (!this.initiated) return;


        },

        __end: function (e) {
            if (!this.initiated) return;
            this.initiated = false;


        },

        __event: function (type) {
            var ev = document.createEvent("Event");

            ev.initEvent('slideview-' + type, true, true);

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