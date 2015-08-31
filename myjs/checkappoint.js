CheckAppoint = function (opt) {
    var me = this;
    me.options = $.extend({
        div: null,
        mapcontrol: null
    }, opt);
    if (!me.options.div) {
        return null;
    }
    me.div = $("#" + me.options.div);
    me.mapcontrol = me.options.mapcontrol;

    $("#my-road").click(function ()
    {
        if (!sideToggle.checked)
        {
            $("#sideToggle").trigger("click");
        }
        me.addhtml();
    });
    me.init_invite();
    me.init_attend();
    me.init_originate();
};
CheckAppoint.prototype.addhtml = function () {
    var me = this;
    var html =
            '<div id="content">' +
            '	<div class="panel-group" id="aaccordion">' +
            '        <div class="panel panel-default">' +
            '           <div class="panel-heading">' +
            '                <h4 class="panel-title"><a data-toggle="collapse" data-parent="#aaccordion" href="#acollapseOne">我发起的跑步</a></h4>' +
            '            </div>' +
            '            <div id="acollapseOne" class="panel-collapse collapse in">' +
            '                <div class="panel-body" id="originate-body"></div>' +
            '            </div>' +
            '        </div>' +
            '        <div class="panel panel-default">' +
            '           <div class="panel-heading">' +
            '                <h4 class="panel-title"><a data-toggle="collapse" data-parent="#aaccordion" href="#acollapseTwo">我参加的跑步</a></h4>' +
            '            </div>' +
            '            <div id="acollapseTwo" class="panel-collapse collapse">' +
            '                <div class="panel-body" id="attend-body"></div>' +
            '            </div>' +
            '        </div>' +
            '        <div class="panel panel-default">' +
            '            <div class="panel-heading">' +
            '                <h4 class="panel-title"><a data-toggle="collapse"data-parent="#aaccordion"href="#acollapseThree">邀请我的跑步</a></h4>' +
            '            </div>' +
            '            <div id="acollapseThree" class="panel-collapse collapse">' +
            '                <div class="panel-body" id="invite-body">' +
            '                </div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '   </div>' +
            '</div>';
    $('#content').replaceWith(html);
};
CheckAppoint.prototype.init_invite = function () {
    var me = this;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_INVITEINFO"
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                $("#invite-body").html("");
                if (obj.datalength === "1") {
                    for (var i = 0; i < obj.data.length; i++) {
                        me.addinvite(obj.data[i]);
                    }
                }
                else {
                    var html =
                            '<div>暂无邀请</div>';
                    $("#invite-body").html(html);
                }
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
    $(".invite-route").click(function () {
        var id = $(this).attr("id").split("_");
        me.drawroute(id[1]);
    });
    $(".invite_agree_btn").click(function () {
        var id = $(this).parent().attr("id").split("_");
        me.changeState(1, id[1]);
    });
    $(".invite_refuse_btn").click(function () {
        var id = $(this).parent().attr("id").split("_");
        me.changeState(2, id[1]);
    });

};
CheckAppoint.prototype.addinvite = function (data) {
    var me = this;
    var html =
            '    <div class="invite-contain" id="inviteappoint_' + data.id + '">' +
            '        <div class="invite-body">' +
            '            <span class="invite-header">发起人：</span>' +
            '            <span class="invite-context invite-inviter">' + data.creater + '</span>' +
            '        </div>' +
            '       <div class="invite-body">' +
            '            <span class="invite-header">跑步时间：</span>' +
            '            <span class="invite-context invite-time">' + data.time + '</span>' +
            '        </div>' +
            '        <div class="invite-body">' +
            '            <span class="invite-header">跑友：</span>';
    for (var i = 0; i < data.friend.length; i++) {
        html +=
                '<span class="invite-context invite-friend state_' + data.friend[i].state + '">' + data.friend[i].name + '&nbsp</span>';
    }
    html +=
            '        </div>' +
            '        <div class="invite-body">' +
            '            <span class="invite-header">跑步路线：</span>' +
            '            <button class="btn btn-default invite-route" id="inviteroute_' + data.routeid + '">查看路线</button>' +
            '        </div>' +
            '        <button class="btn btn-default invite_agree_btn">同意</button>' +
            '        <button class="btn btn-default invite_refuse_btn">拒绝</button>' +
            '    </div>';
    $("#invite-body").append(html);
};
CheckAppoint.prototype.drawroute = function (id) {
    var me = this;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_GETROUTEGEOM",
                rid: id
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                var points = me.LineTOPointArray(obj.geom);
                var line = new TPolyline(points, {strokeColor: "red", strokeWeight: 1, strokeOpacity: 1, strokeStyle: "dashed"});
                me.mapcontrol.addOverLay(line);
                var centerpoint = me.PointToPoint(obj.centerpoint);
                me.mapcontrol.centerAndZoom(centerpoint, 10);
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
};
CheckAppoint.prototype.LineTOPointArray = function (linestring) {
    var Points = [];
    var line = linestring.slice(17, -2);
    var pointstring = line.split(",");
    for (var i = 0; i < pointstring.length; i++) {
        var point = pointstring[i].split(" ");
        Points.push(new TLngLat(parseFloat(point[0]), parseFloat(point[1])));
    }
    return Points;
};
CheckAppoint.prototype.PointToPoint = function (point) {
    var Tpoint;
    var xy = point.slice(6, -2).split(" ");
    Tpoint = new TLngLat(parseFloat(xy[0]), parseFloat(xy[1]));
    return Tpoint;
};
CheckAppoint.prototype.changeState = function (state, id) {
    var me = this;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_INVITESTATE",
                id: id,
                state: state
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                $("#inviteappoint_" + id).remove();
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
};
CheckAppoint.prototype.init_attend = function () {
    var me = this;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_ATTENDINFO"
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                $("#attend-body").html("");
                if (obj.datalength === "1") {
                    for (var i = 0; i < obj.data.length; i++) {
                        me.addattend(obj.data[i]);
                    }
                }
                else {
                    var html =
                            '<div>暂无参加</div>';
                    $("#attend-body").html(html);
                }
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
    $(".attend-route").click(function () {
        var id = $(this).attr("id").split("_");
        me.drawroute(id[1]);
    });
};
CheckAppoint.prototype.addattend = function (data) {
    var me = this;
    var html =
            '    <div class="attend-contain" id="attendappoint_' + data.id + '">' +
            '        <div class="attend-body">' +
            '            <span class="attend-header">发起人：</span>' +
            '            <span class="attend-context attend-inviter">' + data.creater + '</span>' +
            '        </div>' +
            '       <div class="attend-body">' +
            '            <span class="attend-header">跑步时间：</span>' +
            '            <span class="attend-context attend-time">' + data.time + '</span>' +
            '        </div>' +
            '        <div class="attend-body">' +
            '            <span class="attend-header">跑友：</span>';
    for (var i = 0; i < data.friend.length; i++) {
        html +=
                '<span class="attend-context attend-friend state_' + data.friend[i].state + '">' + data.friend[i].name + '&nbsp</span>';
    }
    html +=
            '        </div>' +
            '        <div class="attend-body">' +
            '            <span class="attend-header">跑步路线：</span>' +
            '            <button class="btn btn-default attend-route" id="attendroute_' + data.routeid + '">查看路线</button>' +
            '        </div>' +
            '    </div>';
    $("#attend-body").append(html);
};
CheckAppoint.prototype.init_originate = function () {
    var me = this;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_ORIGINATEINFO"
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                $("#originate-body").html("");
                if (obj.datalength === "1") {
                    for (var i = 0; i < obj.data.length; i++) {
                        me.addoriginate(obj.data[i]);
                    }
                }
                else {
                    var html =
                            '<div>暂无信息</div>';
                    $("#originate-body").html(html);
                }
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
    $(".originate-route").click(function () {
        var id = $(this).attr("id").split("_");
        me.drawroute(id[1]);
    });
};
CheckAppoint.prototype.addoriginate = function (data) {
    var me = this;
    var html =
            '    <div class="originate-contain" id="originateappoint_' + data.id + '">' +
            '       <div class="originate-body">' +
            '            <span class="originate-header">跑步时间：</span>' +
            '            <span class="originate-context originate-time">' + data.time + '</span>' +
            '        </div>' +
            '        <div class="originate-body">' +
            '            <span class="originate-header">跑友：</span>';
    for (var i = 0; i < data.friend.length; i++) {
        html +=
                '<span class="originate-context originate-friend state_' + data.friend[i].state + '">' + data.friend[i].name + '&nbsp</span>';
    }
    html +=
            '        </div>' +
            '        <div class="originate-body">' +
            '            <span class="originate-header">跑步路线：</span>' +
            '            <button class="btn btn-default originate-route" id="originateroute_' + data.routeid + '">查看路线</button>' +
            '        </div>' +
            '    </div>';
    var date = new Date();
    var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    if (!me.Timecompare(data.time, result)) {
        html +=
                '<div class="overdue-shelter">已过期</div>'
    }
    $("#originate-body").append(html);
};
// time1>time2 true
CheckAppoint.prototype.Timecompare = function (time1, time2) {
    // var datetime1=time1.split(" ");
    // var datetime2=time2.split(" ");
    // var date1=datetime1[0].split("-");
    // var date2=datetime2[0].split("-");
    // var timing1=datetime1[1].split(":");
    // var timing2=datetime1[1].split(":");
    // if(date1[0]>date2[0]){
    //     return true;
    // }
    // if(date1[1]>date2[1]){
    //     return true;
    // }
    // if(date1[2]>date2[2]){
    //     return true;
    // }
    // if()
    var timestr1 = time1.replace(/-/g, "/");
    var date1 = new Date(timestr1);
    date1 = date1.getTime();
    var timestr2 = time2.replace(/-/g, "/");
    var date2 = new Date(timestr2);
    date2 = date2.getTime();
    if (date1 >= date2) {
        return true;
    }
};