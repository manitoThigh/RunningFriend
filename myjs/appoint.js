Appoint = function (opt) {
    var me = this;
    me.options = $.extend({
        div: null
    }, opt);
    if (!me.options.div) {
        return null;
    }
    me.div = $("#" + me.options.div);
    $("#yuepao").click(function ()
    {
        if (!sideToggle.checked)
        {
            $("#sideToggle").trigger("click");
        }
        me.addhtml();
    });

};
Appoint.prototype.addhtml = function () {
    var me = this;
    var html =
            '<div id="content">' +
            '<div class="appoint-header">发起跑步</div>' +
            '	<div class="appoint-body">' +
            '		<div class="appoint-body-route">' +
            '			<div class="body-header">制定路线</div>' +
            '			<div><lable><input type="radio" name="routetype" value="draw"/>绘制路线</lable>' +
            '			<button class="btn btn-default btn-block" id="appoint_drawroute">绘制</button>' +
            '			</div>' +
            '			<div><lable><input type="radio" name="routetype" value="select"/>绘制路线</lable>' +
            '			<button class="btn btn-default btn-block" id="appoint_selectroute" data-toggle="collapse" data-target="#accordion" aria-expanded="false" aria-controls="accordion">历史路线</button>' +
            '			<div id="appoint-history-route">' +
            '			</div>' +
            '			</div>' +
            '		<div class="appoint-body-time">' +
            '			<div class="body-header">跑步时间</div>' +
            '			<div class="input-group date form_datetime" id="appoint-settime" data-date-format="yyyy-mm-dd hh:ii" data-link-field="dtp_input1">' +
            '			    <input class="form-control" size="16" type="text" value="" readonly>' +
            '				<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>' +
            '			</div>' +
            '		</div>' +
            '		<div class="appoint-body-friend">' +
            '			<div class="body-header">邀请跑友</div>' +
            '			<div class="appoint-list">' +
            '				<button class="btn btn-default btn-block" id="appoint_getfrined">获取好友信息</button>' +
            '				<table id="appoint_friend_list" class="table table-striped table-condensed">' +
            '				</table>' +
            '			</div>' +
            '		</div>' +
            '	</div>' +
            '	<button class="btn btn-info" id="appoint-confirm">提交路线</button>';
    '</div>';
    $('#content').replaceWith(html);
    var myDate = new Date();
    var nowdate = myDate.getFullYear() + "-" + (parseInt(myDate.getMonth()) + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();
    $('#appoint-settime').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1,
        pickerPosition: "bottom-left",
        startDate: nowdate
    });
    $('#appoint-settime input').attr('value', nowdate);
    $("#appoint_getfrined").click(function () {
        me.getfriendlist();
    });
    $("#appoint-confirm").click(function () {
        me.summitRoute();
    });
    me.getroutelist();
};
Appoint.prototype.summitRoute = function () {
    var time = $('#appoint-settime input').attr('value');
    var friend = [];
    var checks = $(".appoint-check");
    var rid;
    for (var i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            friend.push(checks.value);
        }
    }
    var newroute;
    var type = $('input[name="routetype"]:checked').val();
    if (type === 'draw') {
    }
    else {
        rid = $('input[name="routetype"]:checked').val();
    }
    var myDate = new Date();
    var nowdate = myDate.getFullYear() + "-" + (parseInt(myDate.getMonth()) + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();
    $('#appoint-settime input').attr('value', nowdate);
    $("#appoint_friend_list").html("");
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_SUMMITAPPOINT",
                friend: friend,
                time: time,
                rtype: type,
                rid: rid
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                var myDate = new Date();
                var nowdate = myDate.getFullYear() + "-" + (parseInt(myDate.getMonth()) + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes();
                $('#appoint-settime input').attr('value', nowdate);
                $("#appoint_friend_list").html("");
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
};
Appoint.prototype.getfriendlist = function () {
    var me = this;
    var response;
    var responselength;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_GETFRIEND"
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                response = obj.friend;
                responselength = obj.datalength;
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
    var html =
            '<div class="modal fade" id="FriendModal">' +
            '  <div class="modal-dialog">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '        <h3 class="modal-title">FriendList</h3>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '           <div class=row>' +
            '               <div class = "col-xs-12" >' +
            '                   <div class = "input-group" >' +
            //朋友信息，或者也可以使用表格
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '           <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '           <button type="button" class="btn btn-primary">OK</button>' +
            '      </div>' +
            '    </div><!-- /.modal-content -->' +
            '  </div><!-- /.modal-dialog -->' +
            '</div><!-- /.modal -->';
    /*for (i = 0; i < response.length; i++) {
     html +=
     '<tr>' +
     '<td class="typhooncheck"><input class="appoint-check" type="checkbox" name="friendcheck" value=' + response[i].id + ' /></td>' +
     '<td>' + response[i].name + '</td>' +
     '<td>' + response[i].gender + '</td>' +
     '</tr>';
     }
     html +=
     '</tbody>';*/
    $(html).appendTo($("body"));
    $('#FriendModal').modal('show');
};
Appoint.prototype.getroutelist = function () {
    var me = this;
    var response;
    var responselength;
    $.ajax({
        url: "php/Service.php",
        type: "post",
        async: false,
        data: {
            params: JSON.stringify({
                type: "APPOINT_GETROUTE"
            })
        },
        success: function (data) {
            var obj = JSON.parse(data);
            if (obj.success) {
                response = obj.route;
                responselength = obj.datalength;
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
    var html =
            '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
    /*'				<thead>' +
     '						<tr>' +
     '							<th>&nbsp</th>' +
     '							<th>时间</th>' +
     '							<th>查看</th>' +
     '						</tr>' +
     '					</thead>' +
     '					<tbody>';*/

    for (i = 0; i < response.length; i++) {
        html +=
                '   <div class="panel panel-default">' +
                '       <div class="panel-heading" role="tab" id="heading' + response[i].id + '">' +
                '           <h4 class="panel-title">' +
                '               <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse' + response[i].id + '" aria-expanded="false" aria-controls="collapse' + response[i].id + '">' +
                '                   第 ' + response[i].id + ' 条' +
                '               </a>' +
                '           </h4>' +
                '       </div>' +
                '       <div id="collapse' + response[i].id + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + response[i].id + '">' +
                '           <div class="panel-body">' +
                '               sdgaw' +
                '           </div>' +
                '       </div>' +
                '   </div>';
        /*'<tr>' +
         '<td class="typhooncheck"><input class="appoint-check" type="radio" name="routeradio" value=' + response[i].id + ' /></td>' +
         '<td>' + response[i].timing + '</td>' +
         '<td><button class="btn btn-default" id="route_' + response[i].id + '" >查看</button></td>' +
         '</tr>';*/
        $("#heading" + response[i].id).click(function () {
            me.drawroute(response[i].id);
        }
        );
    }
    html +=
            '</div>';
    /*html +=
     '</tbody>';*/
    $("#appoint-history-route").html(html);
    //$('#accordion').collapse('show');
    $('#accordion').on('shown.bs.collapse', function () {
        //添加响应事件
    });
};
Appoint.prototype.drawroute = function (id) {
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
                me.mapcontrol.centerAndZoom(centerpoint, 14);
            } else {
            }
        },
        error: function (xhr, msg) {
            alert("false");
            alert(msg);
        }
    });
};

Appoint.prototype.LineTOPointArray = function (linestring) {
    var Points = [];
    var line = linestring.slice(17, -2);
    var pointstring = line.split(",");
    for (var i = 0; i < pointstring.length; i++) {
        var point = pointstring[i].split(" ");
        Points.push(new TLngLat(parseFloat(point[0]), parseFloat(point[1])));
    }
    return Points;
};
Appoint.prototype.PointToPoint = function (point) {
    var Tpoint;
    var xy = point.slice(6, -2).split(" ");
    Tpoint = new TLngLat(parseFloat(xy[0]), parseFloat(xy[1]))
    return Tpoint;
};