var page = {
    cssObjs :{id : 'css',items : [{title:"栅格系统",id:'grid'},{title:"排版",id:'typesetting'},{title:"代码",id:'code'},{title:"表单",id:'form'},{title:"表格",id:'table'},{title:"按钮",id:'button'},{title:"图片",id:'image'},{title:"其他",id:'othercss'}]},
    currentObjs : null,
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
        //需要加入click才能点击条目
        this.leftMenuList = new IScroll('#leftmenuwrapper', { click: true ,tap: true});
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

        $('#leftmenuSearchbar').on('input',function(event){
            var value = $(this).val();
            if(value.lastIndexOf('\\') != -1){
                return;
            }

            var searchList = {items : []};

            $.each(page.currentObjs.items, function(index, item){
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
        $('#leftmenu_ul').on('tap','li',function(event){
            if($(this).hasClass('active')) return;
            $('#leftmenu_ul > .active').removeClass('active');
            $(this).addClass('active');
            $('#title').text($(this).text());
            var html = './' + $(this).attr('data-id')+'.html';
            $("[data-tabgroup-tabviews] > [data-tabgroup-tabid='"+page.currentObjs.id+"'] > div").load(html);
            page.sliderView.toggleLeftView();
        });
    },
    initData : function(){
        this.currentObjs = this.cssObjs;
        var cssItems = ich.left_menulist_template(this.currentObjs);
        $('#leftmenu_ul').append(cssItems);
        //郑重提醒，:text :checkbox :first 等等在 jQuery 里面很常用的选择器，Zepto 不支持！
        //原因很简单，jQuery 通过自己编写的 sizzle 引擎来支持 CSS 选择器，而 Zepto 是直接通过浏览器提供的 document.querySelectorAll 接口。
        //这个接口只支持标准的 CSS 选择器，而上面提到的那些属于 jQuery 选择器扩展，所以仔细看看这个网页，注意一下这些选择器。
        $('#leftmenu_ul > li').first().addClass('active');
        $('#title').text($('#leftmenu_ul > li').first().text());
        page.leftMenuList.refresh();//当数据有变化时需要刷新

        $("[data-tabgroup-tabviews] > [data-tabgroup-tabid='css']").load('./'+this.currentObjs.items[0].id+'.html');
    }
};
