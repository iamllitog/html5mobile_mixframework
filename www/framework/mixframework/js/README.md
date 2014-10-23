#js控件

##SlideView

###初始化参数

+ openSlideMode
    > 打开slideview的方式
    >> + SlideView.OPEN_MODE_NONE : 手势划动无
    >> + SlideView.OPEN_MODE_ALL : 有手势划动

+ closeSlideMode
    > 关闭slideview的方式
    >> + SlideView.CLOSE_MODE_NONE : 手势划动无
    >> + SlideView.CLOSE_MODE_ALL : 有手势划动

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