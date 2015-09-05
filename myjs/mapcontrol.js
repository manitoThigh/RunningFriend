

/**
 * 地图模块
 */
window.RF = window.RF || {};
window.RF.UI = window.RF.UI || {};
(function($,$$){
    var Mapcontrol = function (opt) {
        var me = this;
        me.options = $.extend({
            div: null
        }, opt);
        if (!me.options.div) {
            return null;
        }
        me.div = $("#" + me.options.div);
        // me.olmapid = uuid();
        // var html = '<div id=' + me.olmapid + ' class="map" ></div>';
        // me.div.append(html);
        // $("#"+me.olmapid).css('height','100%');
        var config = {
            projection: "EPSG:4326"
        };
        me.map = new TMap(me.options.div, me.config);
        me.map.centerAndZoom(new TLngLat(112.9306, 28.1621), 11);
        //鼠标滚轮缩放
        me.map.enableHandleMouseScroll();
        //键盘操作
        me.map.enableHandleKeyboard();
        //添加缩放条
        // me.showZoomCon();
        // //创建比例尺控件对象
        // var scale = new TScaleControl();
        // //添加比例尺控件
        // me.map.addControl(scale);
        // //添加地图类型选择
        // me.addChangeMapCon();
        //鼠标移动显示坐标
        // me.MoveGetCoordinate();
        // // me.measure();
        // // me.markPoint(); 
        // // me.legend();
    };
    //添加缩放条
    Mapcontrol.prototype.showZoomCon = function (opt) {
        var me = this;
        var config = $.extend({
            type: "TMAP_NAVIGATION_CONTROL_LARGE", //缩放平移的显示类型
            anchor: "TMAP_ANCHOR_TOP_RIGHT", //缩放平移控件显示的位置
            offset: [0, 0], //缩放平移控件的偏移值
            showZoomInfo: true                       //是否显示级别提示信息，true表示显示，false表示隐藏。
        },opt);
        //创建缩放平移控件对象
        var control = new TNavigationControl(config);
        me.map.addControl(control);
    };
    //添加地图类型选择
    Mapcontrol.prototype.addChangeMapCon = function () {
        var me = this;
        me.MapTyleid = uuid();
        me.MapSelectid = uuid();
        var html =
                '<div class="MapSelect" id=' + me.MapTyleid + '>' +
                '      <select id=' + me.MapSelectid + '>' +
                '          <option value="TMAP_NORMAL_MAP">地图</option>' +
                '          <option value="TMAP_SATELLITE_MAP">卫星</option>' +
                '          <option value="TMAP_HYBRID_MAP">卫星混合</option>' +
                '         <option value="TMAP_TERRAIN_MAP">地形</option>' +
                '          <option value="TMAP_TERRAIN_HYBRID_MAP">地形混合</option>' +
                '      </select>' +
                '  </div>';
        me.div.append(html);
        $("#" + me.MapSelectid).change(function () {
            var type = $("#" + me.MapSelectid).val();
            me.ChangeMap(type);
        });
    };
    Mapcontrol.prototype.ChangeMap = function (type) {
        var me = this;
        switch (type) {
            case "TMAP_NORMAL_MAP":
                me.map.setMapType(TMAP_NORMAL_MAP);
                break;
            case "TMAP_SATELLITE_MAP":
                me.map.setMapType(TMAP_SATELLITE_MAP);
                break;
            case "TMAP_HYBRID_MAP":
                me.map.setMapType(TMAP_HYBRID_MAP);
                break;
            case "TMAP_TERRAIN_MAP":
                me.map.setMapType(TMAP_TERRAIN_MAP);
                break;
            case "TMAP_TERRAIN_HYBRID_MAP":
                me.map.setMapType(TMAP_TERRAIN_HYBRID_MAP);
                break;
        }
    };
    //鼠标移动显示坐标
    Mapcontrol.prototype.MoveGetCoordinate = function () {
        var me = this;
        me.CoordinateContainid = uuid();
        var html =
                '<div class="CoordinateContain" id=' + me.CoordinateContainid + '>' +
                '</div>';
        $("#" + me.olmapid).append(html);
        TEvent.addListener(me.map, "mousemove", function (p) {
            //将像素坐标转换成经纬度坐标
            var lnglat = me.map.fromContainerPixelToLngLat(p);
            $("#" + me.CoordinateContainid).html("经度："+lnglat.getLng().toFixed(2) + ",纬度："+lnglat.getLat().toFixed(2));
        });
    };
    Mapcontrol.prototype.legend = function() {
        var me=this;
        me.LegendContainid = uuid();
        var html =
                '<div class="MapLegend">'+
                '   <div class="LegendContain" id="LegendContain">' +
                '       <div class="Legendhead">图例<div class="Legendclose glyphicon glyphicon-chevron-up" id=' + me.LegendContainid + '></div></div>'+
                '       <div class="Legendbody" id="Legendbody">'+
                '           <div class="legenditem">'+
                '               <img src="mylib/image/0.png"/>'+
                '                弱于热带低压'+
                '            </div>'+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/1.png"/>'+
                '                热带低压(TD)'+
                '            </div>  '+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/2.png"/>'+
                '                热带风暴(TS)'+
                '            </div>  '+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/3.png"/>'+
                '                强热带风暴(STS)'+
                '            </div>  '+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/4.png"/>'+
                '                台风(TY)'+
                '            </div>  '+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/5.png"/>'+
                '                强台风(STY)'+
                '            </div>  '+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/6.png"/>'+
                '                超强台风(SuperTY)'+
                '            </div>  '+
                '            <div class="legenditem">'+
                '                <img src="mylib/image/9.png"/>'+
                '                变性'+
                '            </div>  '+
                '       </div>'+
                '   </div>'+
                '</div>';
        $("#" + me.olmapid).append(html);
        $("#"+me.LegendContainid).click(function() {
            var closecls=$(this).attr("class");
            // alert(closecls.indexOf("glyphicon-chevron-up")==-1?false:true);
            if(closecls.indexOf("glyphicon-chevron-up")==-1?false:true){
                $(this).removeClass('glyphicon-chevron-up');
                $(this).addClass('glyphicon-chevron-down');
                var legendup;
                clearInterval(legendup);
                var moveup=200;
                var div=document.getElementById("LegendContain");
                legendup=setInterval(function(){
                    if(moveup>0){
                        div.style.top=div.offsetTop-20+"px";
                        moveup=moveup-20;
                    }
                    else{
                        clearInterval(legendup);
                    }
                },50);
            }
            else{
                $(this).removeClass('glyphicon-chevron-down');
                $(this).addClass('glyphicon-chevron-up');
                var legenddown;
                clearInterval(legenddown);
                var movedown=0;
                var div=document.getElementById("LegendContain");
                legenddown=setInterval(function(){
                    if(movedown<200){
                        div.style.top=div.offsetTop+20+"px";
                        movedown=movedown+20;
                    }
                    else{
                        clearInterval(legenddown);
                    }
                },50);
            }
        });

    };
    Mapcontrol.prototype.wmsconfig = function (layers) {
        var me = this;
        var config = {
            REQUEST: "GetMap", //操作名称
            VERSION: "1.1.1", //请求服务的版本
            SERVICE: "WMS", //服务类型标识符
            LAYERS: layers,
            TRANSPARENT: true, //输出图像背景是否透明
            STYLES: "", //每个请求图层的用","分隔的描述样式
            FORMAT: "image/png", //输出图像的类型
            SRS: me.map.getCode(), //地图投影类型
            WIDTH: 256, //输出地图图片的像素宽
            HEIGHT: 256          //输出地图图片的像素高
        };
        return config;
    };
    //测距侧面工具
    Mapcontrol.prototype.measure = function () {
        var me = this;
        var config = {
            strokeColor: "blue", //折线颜色
            fillColor: "#FFFFFF", //填充颜色。当参数为空时，折线覆盖物将没有填充效果
            strokeWeight: "3px", //折线的宽度，以像素为单位
            strokeOpacity: 0.5, //折线的透明度，取值范围0 - 1
            strokeStyle: "solid" //折线的样式，solid或dashed
        };
        //创建测距工具对象
        me.lineTool = new TPolylineTool(me.map, config);
        //注册测距工具绘制完成后的事件
        TEvent.addListener(me.lineTool, "draw", function () {
            me.lineTool.close();
        });
        //创建测面工具对象
        me.polygonTool = new TPolygonTool(me.map, config);
        TEvent.addListener(me.polygonTool, "draw", function () {
            me.polygonTool.close();
        });
    };
    //标注工具
    Mapcontrol.prototype.markPoint = function () {
        var me = this;
        //创建标注工具对象
        me.markerTool = new TMarkTool(me.map);
        //注册标注的mouseup事件
        TEvent.addListener(me.markerTool, "mouseup", function (point) {
            //鼠标在地图上按下左键时添加一个点标记
            var marker = new TMarker(point);
            me.map.addOverLay(marker);
            me.markerTool.close();
        });

    };
    //缩放至全国
    Mapcontrol.prototype.ZoomToChina = function () {
        var me = this;
        me.map.setCenter(new TLngLat(116.40969, 30.89945));
        me.map.setZoom(4);
    };


    if (typeof(module) !== 'undefined') {
        module.exports = Mapcontrol;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                'use strict';
                return Mapcontrol;
            });
        } else {
            $$.Mapcontrol = Mapcontrol;
        }
    }
})(jQuery,window.RF.UI);
