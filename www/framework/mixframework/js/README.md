#js控件

##SlideView

###使用方法

1.引入

> `<script src="../framework/mixframework/js/slideview.js"></script>`

2.在html标签中嵌入


    <div id='slidewrapper'>
        <div data-slide-slider>
            <div data-slide-leftview style="width: 180px;"></div>
            <div data-slide-content style="width: 100%;"></div>
            <div data-slide-rightview style="width: 100px;"></div>
        </div>
    </div>

3.在body结束标签前初始化

> `var slideView = new SlideView('#slidewrapper');`

###初始化参数

+ openSlideMode
    > 打开slideview的方式
    >> + SlideView.OPEN_MODE_NONE : 手势划动无
    >> + SlideView.OPEN_MODE_ALL : 有手势划动

+ closeSlideMode
    > 关闭slideview的方式
    >> + SlideView.CLOSE_MODE_NONE : 手势划动无
    >> + SlideView.CLOSE_MODE_ALL : 有手势划动

+ snapThreshold
    > 在划动多少距离后，触发menu弹出或隐藏，接受百分比(20%)和像素(50)

###方法

+ toggleLeftView()
    > 开关左侧view

+ toggleRightView()
    > 开关右侧view

+ getCurrentViewTag()
    > 得到当前显示的view 是right还是left还是center

    > **RETURN 返回值** 
    >> SlideView.(CURRENT_LEFT_VIEW | CURRENT_CENTER_VIEW | CURRENT_RIGHT_VIEW)

###属性
+ currentViewTag : 当前显示的view 是right还是left还是center
    >SlideView.(CURRENT_LEFT_VIEW | CURRENT_CENTER_VIEW | CURRENT_RIGHT_VIEW)

###事件

+ slideview-movestart

    > 开始触摸
+ slideview-movein-leftview

    > 划动进入左界面
+ slideview-movein-rightview

    > 划动进入右界面
+ slideview-movein-centerview

    > 划动进入中间界面
+ slideview-move

    > 划动时
+ slideview-moveend

    > 划动结束

##TabGroup

###使用方法

1.引入

> `<script src="../framework/mixframework/js/tabgroup.js"></script>`

2.在html标签中嵌入


    <div id='tabgroupwrapper'>
        <div data-tabgroup-tabviews>
            <div data-tabgroup-tabid='a'></div>
            <div data-tabgroup-tabid='b'></div>
            <div data-tabgroup-tabid='c'></div>
            <div data-tabgroup-tabid='d'></div>
        </div>

        <div data-tabgroup-tabbuttons>
            <div data-tabgroup-tabid="a" data-tabgroup-activebtclass="activeBtA" data-tabgroup-defaultbtclass="defaultBtA">
            </div>
            <div data-tabgroup-tabid="b" data-tabgroup-activebtclass="activeBtB" data-tabgroup-defaultbtclass="defaultBtB">
            </div>
            <div data-tabgroup-tabid="c" data-tabgroup-activebtclass="activeBtC" data-tabgroup-defaultbtclass="defaultBtC">
            </div>
            <div data-tabgroup-tabid="d" data-tabgroup-activebtclass="activeBtD" data-tabgroup-defaultbtclass="defaultBtD">
            </div>
        </div>
    </div>

3.在body结束标签前初始化

> `var TabGroup = new TabGroup('#tabgroupwrapper');`

###初始化参数

+ snapThreshold

> 在划动多少距离后，触发menu弹出或隐藏，接受百分比(20%)和像素(50)

+ currentViewId

> 设置当前显示界面的id

+ currentViewIndex

> 设置当前显示view的index,currentViewId和currentViewIndex都设置时,以currentViewId为准

+ moveMode

> 设置切换page的模式

>> TabGroup.MOVE_MODE_SLIDE 划动切换

>> TabGroup.MOVE_MODE_NODE 禁止划动切换

###方法

+ goToPageById(pageId)

> 根据Id跳转到指定view

+ goToPageByIndex(index)

> 根据index跳转到指定view

+ animationToPageById(pageId)

> 根据Id跳转到指定view(动画方式)

+ animationToPageByIndex(index)

> 根据index跳转到指定view(动画方式)

+ getCurrentViewId()

> 得到当前显示的view的id

+ getCurrentViewIndex()

> 得到当前显示的view的index

###属性

+ moveMode

> 设置切换page的模式

>> TabGroup.MOVE_MODE_SLIDE 划动切换

>> TabGroup.MOVE_MODE_NODE 禁止划动切换

###事件

+ tabgroup-movestart

    > 开始触摸

+ tabgroup-move

    > 划动时

+ tabgroup-moveend

    > 划动结束

+ tabgroup-changeview

    > 按钮点击

+ tabgroup-buttonclick

    > 按钮点击


##PullScroll

###使用方法

1.引入

> `<script src="../framework/mixframework/js/zepto.min.js"></script>`
> `<script src="../framework/mixframework/js/iscroll-probe.js"></script>`
> `<script src="../framework/mixframework/js/pullscroll.js"></script>`
> `<link rel="stylesheet" href="../framework/mixframework/css/pullscroll.css">`

2.在html标签中嵌入


<div id="wrapper" style="height: 500px;overflow: hidden;margin-top: 50px;">
            <div id="scroller">
                <div class="list-group" data-pulllist-pulldown>
                    <a href="#" class="list-group-item list-group-item-info">
                        <span data-pulllist-pulldownicon class="glyphicon glyphicon-arrow-down"></span>
                        <span data-pulllist-pulldowntext>下拉刷新</span>
                    </a>
                </div>
                <div class="list-group" data-pulllist-list>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-info">Cras sit amet nibh
                        libero</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-warning">Porta ac consectetur
                        ac</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis
                        in</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-info">Cras sit amet nibh
                        libero</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-warning">Porta ac consectetur
                        ac</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis
                        in</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-info">Cras sit amet nibh
                        libero</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-warning">Porta ac consectetur
                        ac</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-info">Cras sit amet nibh
                        libero</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-warning">Porta ac consectetur
                        ac</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-success">Dapibus ac facilisis
                        in</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-info">Cras sit amet nibh
                        libero</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-warning">Porta ac consectetur
                        ac</a>
                    <a data-pulllist-item href="#" class="list-group-item list-group-item-danger">Vestibulum at eros</a>
                </div>
                <div class="list-group" data-pulllist-pullup>
                    <a href="#" class="list-group-item list-group-item-info">
                        <span data-pulllist-pullupicon class="rotate360 glyphicon glyphicon-refresh"></span>
                        <span data-pulllist-pulluptext>正在加载更多</span>
                    </a>
                </div>
            </div>
        </div>

3.在body结束标签前初始化

> `var myScroll = new PullScroll('#wrapper');`

###方法

+ refreshOver();

> 此方法需要在刷新完成后调用

+ loadMoreOver();

> 此方法需要在加载更多完成后调用

###属性

+ myScroll

> 在pullscroll中维护一个iscroll,使用此属性可以操作它

###事件

+ pullscroll-refresh

    > 刷新时的回调

+ pullscroll-loadmore

    > 加载更多时的回调

##popuploading

###使用方法

1.引入

> ` <link rel="stylesheet" href="../framework/mixframework/css/popuploading.css">`
> `<script src="../framework/mixframework/js/popuploading.js"></script>`


2.在html标签中嵌入

3.在body结束标签前初始化

> ``

###方法

+ popup.popupshow("loading...");显示加载框

> 此方法需要在联网获取数据时调用

+  popup.popupclose();关闭加载框

> 此方法需要在数据加载完成后调用
