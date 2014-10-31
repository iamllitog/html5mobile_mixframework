var page = {
    cssObjs: {id: 'css', items: [
        {title: "栅格系统", id: 'grid'},
        {title: "排版", id: 'typesetting'},
        {title: "代码", id: 'code'},
        {title: "表单", id: 'form'},
        {title: "表格", id: 'table'},
        {title: "按钮", id: 'button'},
        {title: "图片", id: 'image'},
        {title: "其他", id: 'othercss'}
    ]},
    componentsObjs: {id: 'components', items: [
        {title: 'glyphions', id: 'glyphions'}
    ]},
    jspluginsObjs: {id: 'jsplugins', items: [
        {title: 'glyphions', id: 'glyphions'}
    ]},
    currentObjs: null,
    css: null,
    components: null,
    jsplugins: null,
    sliderView: null,
    tabGroup: null,
    leftMenuList: null,
    initialize: function () {
        $(document).ready(this.documentReady);

    },
    documentReady: function () {
        page.initViews();
        page.bindEvents();
        page.initData();
    },
    initViews: function () {
        $('html').height($(window).height());//输入框盖住解决-1:输入框被盖住多因为高度按百分比，所以此处设置为死值
        this.sliderView = new SlideView('#slidewrapper', {
            openSlideMode: SlideView.OPEN_MODE_NONE
        });
        this.tabGroup = new TabGroup('#tabgroupwrapper');
        //需要加入click才能点击条目
        this.leftMenuList = new IScroll('#leftmenuwrapper', { click: true, tap: true});
    },
    bindEvents: function () {
        //输入框盖住解决-2:当换向或resize时重新更改高度
        $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', function (event) {
            $('html').height($(window).height());
        });
        $('#slidewrapper').on('slideview-movein-leftview', function (event) {
            page.tabGroup.moveMode = TabGroup.MOVE_MODE_NODE;
        });
        $('#slidewrapper').on('slideview-movein-centerview', function (event) {
            page.tabGroup.moveMode = TabGroup.MOVE_MODE_SLIDE;
        });
        $('#menuButton').on('click', function (event) {
            page.sliderView.toggleLeftView();
        });

        $('#leftmenuSearchbar').on('input', function (event) {
            var value = $(this).val();
            if (value.lastIndexOf('\\') != -1) {
                return;
            }

            var searchList = {items: []};

            $.each(page.currentObjs.items, function (index, item) {
                if (page.currentObjs.items[index].title.match(value)) {
                    searchList.items.push(page.currentObjs.items[index]);
                }
            });

            $('#leftmenu_ul li').remove();
            var cssItems = ich.left_menulist_template(searchList);
            $('#leftmenu_ul').append(cssItems);
            page.leftMenuList.refresh();
        });

        //当首次绑定元素时没有选择到指定元素(因为没有此元素),此时我们可以用代理事件绑定
        //如下 我们绑定到其父元素上 让其父元素代理事件
        //另外一个好处，就是可以减少事件的监听提高效率
        $('#leftmenu_ul').on('tap', 'li', function (event) {
            if ($(this).hasClass('active')) return;
            $('#leftmenu_ul > .active').removeClass('active');
            $(this).addClass('active');
            page[page.tabGroup.getCurrentViewId()] = {title : $(this).text(),id:$(this).attr('data-id')};
            $('#title').text($(this).text());
            var html = './' + $(this).attr('data-id') + '.html';
            $("[data-tabgroup-tabviews] > [data-tabgroup-tabid='" + page.currentObjs.id + "'] > div").load(html);
            page.sliderView.toggleLeftView();
        });

        $('#tabgroupwrapper').on('tabgroup-changeview', function (event) {
//            alert(event.tabId);

            page.currentObjs = page[event.tabId + 'Objs'];
            var items = ich.left_menulist_template(page.currentObjs);
            $('#leftmenu_ul li').remove();
            $('#leftmenu_ul').append(items);

            $("#leftmenu_ul >  [data-id='"+page[event.tabId].id+"'] ").addClass('active');
        });
    },
    initData: function () {
        this.currentObjs = this.cssObjs;
        var cssItems = ich.left_menulist_template(this.currentObjs);
        $('#leftmenu_ul').append(cssItems);
        //郑重提醒，:text :checkbox :first 等等在 jQuery 里面很常用的选择器，Zepto 不支持！
        //原因很简单，jQuery 通过自己编写的 sizzle 引擎来支持 CSS 选择器，而 Zepto 是直接通过浏览器提供的 document.querySelectorAll 接口。
        //这个接口只支持标准的 CSS 选择器，而上面提到的那些属于 jQuery 选择器扩展，所以仔细看看这个网页，注意一下这些选择器。
        $('#leftmenu_ul > li').first().addClass('active');
        $('#title').text($('#leftmenu_ul > li').first().text());
        page.leftMenuList.refresh();//当数据有变化时需要刷新

        this.css = this.cssObjs.items[0];
        this.components = this.componentsObjs.items[0];
        this.jsplugins = this.jspluginsObjs.items[0];

        $("[data-tabgroup-tabviews] > [data-tabgroup-tabid='css']").load('./' + this.css.id + '.html');
        $("[data-tabgroup-tabviews] > [data-tabgroup-tabid='components']").load('./' + this.components.id + '.html');
        $("[data-tabgroup-tabviews] > [data-tabgroup-tabid='jsplugins']").load('./' + this.jsplugins.id + '.html');
    }
};
