



window.RF = window.RF || {};
window.RF.UI = window.RF.UI || {};
(function($, $$) {

    ShowInfo = function (map, marker, flag) {
        if (flag === 0) {
            text = '位于长沙市东北部烈士公园是长沙市最大的公园,\n' +
                    '依据其自然地形，山上种树辟园，洼地造湖建亭而成。\n' +
                    '公园内常年树木苍翠，绿草如茵，奇花斗妍。\n' +
                    '在城市中心有这样一个公园着实难得，\n' +
                    '因此在这里跑步锻炼的人自然不在少数，当下，正值金秋，\n' +
                    '公园里面的桂花开了，满园甜香，闻着花香，锻炼身体的同时更添一份乐趣。';
        } else if (flag === 1) {
            text = '在北边的朋友，跑步地点可以选择在月湖公园，\n' +
                    '长沙月湖公园位于浏阳河畔，紧靠国防科技大学和长沙大学。\n' +
                    '站在湖边，一眼望去，烟雨朦胧，刚刚植下的树笼着一身的灰白色轻纱，\n' +
                    '悄然伫立。月湖公园各景点各具特色又相互呼应，亭台阁楼、水榭栈道的大量运用，\n' +
                    '渗透出古朴丰厚的文化底蕴，配合因山势微微起伏的而量身挑选的植物配置与园林小品，\n' +
                    '呈现出自然风光与人文景观浑然天成的优美韵律。';
        } else if (flag === 2) {
            text = '坐落在大学城的岳麓山，是不少居住在河西的市民锻炼的首选地，\n' +
                    '骑行、爬山的都有。在这里跑步可以感受到大自然的气息，\n' +
                    '听着虫鸣，小鸟婉转的啼叫，所有的烦心事都可以抛之脑后。\n' +
                    '跑累了口渴，还可直接饮用岳麓山的泉水，要知道不少人特地背着容器上山取水呢。\n';
        } else if (flag === 3) {
            text = '橘子洲则位于长沙市区对面的湘江江心，是湘江下游众多冲积沙洲之一，\n' +
                    '也是世界上最大的内陆洲。橘子洲头位于橘子洲的南端，在这里跑步，\n' +
                    '可以享受河风习习，夜晚跑步抬头可见两岸绚丽的万家灯火';
        } else if (flag === 4) {
            text = '洋湖湿地公园位于湖南长沙市洋湖大道以北，潇湘南大道东线以西、\n' +
                    '靳江河以南、以东，是长沙城区最大的湿地公园。园中有亭台水榭廊桥，\n' +
                    '油绿树围绕，与其他公园相比，丰富多样的植物种类是湿地公园的特色之一。';
        }

        var me = this;
        me.passwordID = uuid();
        me.mailID = uuid();
        me.loginID = uuid();
        me.AlterID = uuid();
        me.dlgID = uuid();
        if(!$("#message").length){
            me.html =
                    '<div class="modal fade" id="message">' +
                    '  <div class="modal-dialog">' +
                    '    <div class="modal-content">' +
                    '      <div class="modal-header">' +
                    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '        <h3 class="modal-title">跑步圣地介绍</h3>' +
                    '      </div>' +
                    '      <div class="modal-body">'
                    '           </div>' +
                    '      </div>' +
                    '    </div><!-- /.modal-content -->' +
                    '  </div><!-- /.modal-dialog -->' +
                    '</div><!-- /.modal -->';
            $(me.html).appendTo($("body"));
        }
        $('#message .modal-body').append(text);
        $('#message').modal('show');
    };

    DisRegularPlace = function (mapobj) {
        this.map = mapobj;
        this.hasShow = false;
        this.corArray = new Array();
        this.picSize = new Array();
    };

    DisRegularPlace.prototype.Congigure = function () {
        //设置每个景点的坐标，坐标顺序为烈士公园，月湖公园，岳麓山，橘子洲，洋湖湿地公园
        this.corArray[0] = [112.98763, 28.21229];
        this.corArray[1] = [113.03129, 28.24062];
        this.corArray[2] = [112.92921, 28.18563];
        this.corArray[3] = [112.95637, 28.19663];
        this.corArray[4] = [112.93057, 28.11699];

        this.picSize[0] = [450, 291];
        this.picSize[1] = [550, 347];
        this.picSize[2] = [550, 339];
        this.picSize[3] = [550, 388];
        this.picSize[4] = [550, 360];

    };

    DisRegularPlace.prototype.AddMaker = function () {
        var me = this;
        var icon = new TIcon("http://api.tianditu.com/img/map/markerA.png", new TSize(19, 27), {anchor: new TPixel(9, 27)});
        var marker = new TMarker(new TLngLat(this.corArray[0][0], this.corArray[0][1]), {icon: icon});
        this.map.addOverLay(marker);
        TEvent.addListener(marker, "click", function (p) {
            ShowInfo(this.map, marker, 0);
        });

        var icon1 = new TIcon("http://api.tianditu.com/img/map/markerA.png", new TSize(19, 27), {anchor: new TPixel(9, 27)});
        var marker1 = new TMarker(new TLngLat(this.corArray[1][0], this.corArray[1][1]), {icon: icon});
        this.map.addOverLay(marker1);
        TEvent.addListener(marker1, "click", function (p) {
            ShowInfo(this.map, marker1, 1);
        });

        var icon2 = new TIcon("http://api.tianditu.com/img/map/markerA.png", new TSize(19, 27), {anchor: new TPixel(9, 27)});
        var marker2 = new TMarker(new TLngLat(this.corArray[2][0], this.corArray[2][1]), {icon: icon});
        this.map.addOverLay(marker2);
        TEvent.addListener(marker2, "click", function (p, flag) {
            ShowInfo(this.map, marker2, 2);
        });

        var icon3 = new TIcon("http://api.tianditu.com/img/map/markerA.png", new TSize(19, 27), {anchor: new TPixel(9, 27)});
        var marker3 = new TMarker(new TLngLat(this.corArray[3][0], this.corArray[3][1]), {icon: icon});
        this.map.addOverLay(marker3);
        TEvent.addListener(marker3, "click", function (p, flag) {
            ShowInfo(this.map, marker3, 3);
        });

        var icon4 = new TIcon("http://api.tianditu.com/img/map/markerA.png", new TSize(19, 27), {anchor: new TPixel(9, 27)});
        var marker4 = new TMarker(new TLngLat(this.corArray[4][0], this.corArray[4][1]), {icon: icon});
        this.map.addOverLay(marker4);
        TEvent.addListener(marker4, "click", function (p, flag) {
            ShowInfo(this.map, marker4, 4);
        });
        me.marker = [marker, marker1, marker2, marker3, marker4];
    };

    DisRegularPlace.prototype.RemoveMaker = function (){
        var me = this
        for(var i = 0; i < 5; i++){
            me.map.removeOverLay(me.marker[i]);
        }
    }

    DisRegularPlace.prototype.SetHasShow = function (hasshow){
        var me = this;
        me.hasShow = hasshow;
    }

    if (typeof(module) !== 'undefined') {
        module.exports = DisRegularPlace;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                'use strict';
                return DisRegularPlace;
            });
        } else {
            $$.DisRegularPlace = DisRegularPlace;
        }
    }
})(jQuery, window.RF.UI);



