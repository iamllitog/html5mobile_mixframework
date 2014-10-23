#js控件

##SlideView()

###使用方法

1.引入

> `<script src="../framework/mixframework/js/slideview.js"></script>`

2.在html标签中嵌入

`
<div id='slidewrapper'>
    <div data-slide-slider>
        <div data-slide-leftview style="width: 180px;"></div>
        <div data-slide-content style="width: 100%;"></div>
        <div data-slide-rightview style="width: 100px;"></div>
    </div>
</div>
`


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