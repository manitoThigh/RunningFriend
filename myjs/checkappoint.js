/**
 * 约跑
 */
window.RF = window.RF || {};
window.RF.UI = window.RF.UI || {};
(function($, $$) {
    CheckAppoint = function(opt) {
        var me = this;
        me.options = $.extend({
            routeController: null
        }, opt);
        me.routeController = me.options.routeController;
    };
    CheckAppoint.prototype.render = function() {
        var me = this;
        $("#appointment").click(function() {
            if (!sideToggle.checked) {
                $("#sideToggle").trigger("click");
            }
            me.addhtml();
        });
    };
    //基本界面
    CheckAppoint.prototype.addhtml = function() {
        var me = this;
        var html =
            '<div id="content">' +
            '   <div class="panel-group" id="check-appoint">' +
            '        <div class="panel panel-default">' +
            '           <div class="panel-heading">' +
            '                <h4 class="panel-title"><a data-toggle="collapse" data-parent="#check-appoint" href="#acollapseOne">我发起的跑步</a></h4>' +
            '            </div>' +
            '            <div id="acollapseOne" class="panel-collapse collapse in">' +
            '                <div class="panel-body" id="originate-body"></div>' +
            '            </div>' +
            '        </div>' +
            '        <div class="panel panel-default">' +
            '           <div class="panel-heading">' +
            '                <h4 class="panel-title"><a data-toggle="collapse" data-parent="#check-appoint" href="#acollapseTwo">我参加的跑步</a></h4>' +
            '            </div>' +
            '            <div id="acollapseTwo" class="panel-collapse collapse">' +
            '                <div class="panel-body" id="attend-body"></div>' +
            '            </div>' +
            '        </div>' +
            '        <div class="panel panel-default">' +
            '            <div class="panel-heading">' +
            '                <h4 class="panel-title"><a data-toggle="collapse"data-parent="#check-appoint" href="#acollapseThree">邀请我的跑步</a></h4>' +
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
        me.init_invite();
        me.init_attend();
        me.init_originate();
    };
    //邀请我的跑步活动初始化
    CheckAppoint.prototype.init_invite = function() {
        var me = this;
        $.ajax({
            url: "php/Service.php",
            type: "post",
            data: {
                params: JSON.stringify({
                    type: "APPOINT_INVITEINFO"
                })
            },
            success: function(data) {
                var obj = JSON.parse(data);
                if (obj.success) {
                    $("#invite-body").html("");
                    if (obj.datalength === "1") {
                        for (var i = 0; i < obj.data.length; i++) {
                            me.addinvite(obj.data[i]);
                        }
                        $(".invite-route").unbind().click(function() {
                            var id = $(this).data("id");
                            console.log(id);
                            me.routeController.getRouteById(id);
                        });
                        $(".invite_agree_btn").unbind().click(function() {
                            var id = $(this).parent().data("id");
                            me.changeState(1, id);
                        });
                        $(".invite_refuse_btn").unbind().click(function() {
                            var id = $(this).parent().data("id");
                            me.changeState(2, id);
                        });
                    } else {
                        var html =
                            '<div>暂无邀请</div>';
                        $("#invite-body").html(html);
                    }
                } else {}
            },
            error: function(xhr, msg) {
                alert("false");
                alert(msg);
            }
        });
    };
    CheckAppoint.prototype.addinvite = function(data) {
        var me = this;
        var date = new Date();
        var result = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var html =
            '    <div class="invite-contain" data-id="' + data.id + '">' +
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
            '            <button class="btn btn-default invite-route" data-id="' + data.routeid + '">查看路线</button>' +
            '        </div>';
        if (!me.Timecompare(data.time, result)) {
            html +=
                '<div class="overdue-shelter">已过期</div>'
        } else {
            html +=
                '        <button class="btn btn-default invite_agree_btn">同意</button>' +
                '        <button class="btn btn-default invite_refuse_btn">拒绝</button>';
        }

        html +=
            '    </div>';
        $("#invite-body").append(html);
    };
    //拒绝或参加跑步活动
    CheckAppoint.prototype.changeState = function(state, id) {
        var me = this;
        $.ajax({
            url: "php/Service.php",
            type: "post",
            data: {
                params: JSON.stringify({
                    type: "APPOINT_INVITESTATE",
                    id: id,
                    state: state
                })
            },
            success: function(data) {
                var obj = JSON.parse(data);
                if (obj.success) {
                    $("[data-id='"+id+"']").remove();
                } else {}
            },
            error: function(xhr, msg) {
                alert("false");
                alert(msg);
            }
        });
    };
    //我参加的跑步活动初始化
    CheckAppoint.prototype.init_attend = function() {
        var me = this;
        $.ajax({
            url: "php/Service.php",
            type: "post",
            data: {
                params: JSON.stringify({
                    type: "APPOINT_ATTENDINFO"
                })
            },
            success: function(data) {
                var obj = JSON.parse(data);
                if (obj.success) {
                    $("#attend-body").html("");
                    if (obj.datalength === "1") {
                        for (var i = 0; i < obj.data.length; i++) {
                            me.addattend(obj.data[i]);
                        }
                        $(".attend-route").unbind().click(function() {
                            var id = $(this).data("id");
                            me.routeController.getRouteById(id);
                        });
                    } else {
                        var html =
                            '<div>暂无参加</div>';
                        $("#attend-body").html(html);
                    }
                } else {}
            },
            error: function(xhr, msg) {
                alert("false");
                alert(msg);
            }
        });
    };
    CheckAppoint.prototype.addattend = function(data) {
        var me = this;
        var html =
            '    <div class="attend-contain" data-id="' + data.id + '">' +
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
            '            <button class="btn btn-default attend-route" data-id="' + data.routeid + '">查看路线</button>' +
            '        </div>' +
            '    </div>';
        $("#attend-body").append(html);
    };
    //我组织的跑步活动
    CheckAppoint.prototype.init_originate = function() {
        var me = this;
        $.ajax({
            url: "php/Service.php",
            type: "post",
            data: {
                params: JSON.stringify({
                    type: "APPOINT_ORIGINATEINFO"
                })
            },
            success: function(data) {
                var obj = JSON.parse(data);
                if (obj.success) {
                    $("#originate-body").html("");
                    if (obj.datalength === "1") {
                        for (var i = 0; i < obj.data.length; i++) {
                            me.addoriginate(obj.data[i]);
                        }
                        $(".originate-route").unbind().click(function() {
                            var id = $(this).data("id");
                            me.routeController.getRouteById(id);
                        });
                    } else {
                        var html =
                            '<div>暂无信息</div>';
                        $("#originate-body").html(html);
                    }
                } else {}
            },
            error: function(xhr, msg) {
                alert("false");
                alert(msg);
            }
        });
    };
    CheckAppoint.prototype.addoriginate = function(data) {
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
            '            <button class="btn btn-default originate-route" data-id="' + data.routeid + '">查看路线</button>' +
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
    // 时间比较time1>time2 true
    CheckAppoint.prototype.Timecompare = function(time1, time2) {
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
    if (typeof(module) !== 'undefined') {
        module.exports = CheckAppoint;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                'use strict';
                return CheckAppoint;
            });
        } else {
            $$.CheckAppoint = CheckAppoint;
        }
    }
})(jQuery, window.RF.UI);