(function ($) {
    define(['myjs/LoginDialog', 'myjs/RegistDialog', 'myjs/mapcontrol', 'myjs/Route'],
            function (Login, Regist, MapControl, Route) {
                var initEvent = function () {
                    //关于我们
                    $("#aboutus").click(function () {
                        if (!sideToggle.checked)
                        {
                            $("#sideToggle").trigger("click");
                        }
                        var me = this;
                        me.html =
                                '<div id="content">' +
                                '<div id="information">' +
                                '   <h4>罗&nbsp;&nbsp;&nbsp;靓</h4>' +
                                '   <h4>李晗孙白</h4>' +
                                '   <h4>丁雪兴</h4>' +
                                '</div>' + '</div>';
                        //$(me.html).appendTo($('#sidemenu'));
                        $('#content').replaceWith(me.html);
                    });

                    //自定义路线侧边栏
                    $("#diy-road").click(function () {
                        if (!sideToggle.checked)
                        {
                            $("#sideToggle").trigger("click");
                        }
                        var me = this;
                        me.html =
                                '<div id="makeroute">' +
                                '<h3>自定义路线</h3>' +
                                '   <h4>使用方法：</h4>' +
                                '   <h4>1、在地图中使用点击右键选择设定起点</h4>' +
                                '   <h4>2、选择跑步模式</h4>' +
                                '   <h4>3、环圈跑和往返跑不需要设定终点。其他请自定义终点</h4>' +
                                '   <h4>4、点击规划路线按钮，完成路线设计</h4>' +
                                '<h3>输入跑步路程</h3>' +
                                '<h4></h4>' +
                                '</div>';
                        //$(me.html).appendTo($('#sidemenu'));
                        $('#content').replaceWith(me.html);
                    });

                    //登录对话框显示
                    //var login = new Login();
                    $("#login").click(function () {
                        var login = new Login();
                        login.show();
                    });

                    //注册对话框显示
//                    var register = new Regist();
                    $("#register").click(function () {
                        var register = new Regist();
                        register.show();
                    });



                    //地图显示
                    var map = new MapControl({
                        div: 'mapcontainer'
                    });
                    map.showZoomCon({
                        offset: [10, 130] //缩放平移控件的偏移值
                    });

                    //路线制定
                    var route = new Route({
                        map: map.map
                    });
                    route.rightclick();
                };
                initEvent();
            });
})(jQuery);