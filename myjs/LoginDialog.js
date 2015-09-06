/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 登录对话框
 */
window.RF = window.RF || {};
window.RF.UI = window.RF.UI || {};
(function($,$$){
    var LoginDialog = function () {
        var me = this;
        me.passwordID = uuid();
        me.mailID = uuid();
        me.loginID = uuid();
        me.AlterID = uuid();
        me.dlgID = uuid();    
        me.render();    
    };
    //登录对话框的渲染
    LoginDialog.prototype.render = function() {
        var me=this;
        var html =
                //用CSS写的对话框，基于bootstrap
                '<div class="modal fade" id="loginModal">' +
                '  <div class="modal-dialog">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '        <h3 class="modal-title">Login</h3>' +
                '      </div>' +
                '      <div class="modal-body">' +
                '           <div class=row>' +
                '               <div class = "col-xs-12" >' +
                '                   <div class = "input-group" >' +
                '                       <span class = "input-group-addon"> <span class ="glyphicon glyphicon-envelope" > </span></span >' +
                '                       <input type="text" id = "' + me.mailID + '" name = "E-mail" class = "form-control" placeholder = "E-mail" />' +
                '                   </div>' +
                '               </div>' +
                '               <div class = "col-xs-12" >' +
                '                   <div class = "input-group" >' +
                '                       <span class = "input-group-addon" > <span class = "glyphicon glyphicon-lock" > </span></span >' +
                '                       <input type = "passWord" id = "' + me.passwordID  +'" name = "password" class = "form-control" placeholder = "密码" >' +
                '                   </div>' +
                '               </div>' +
                '           </div>' +
                '      </div>' +
                '      <div class="modal-footer">' +
                '           <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '           <button type="button" class="btn btn-primary" id="' + me.loginID + '">login</button>' +
                '      </div>' +
                '    </div><!-- /.modal-content -->' +
                '  </div><!-- /.modal-dialog -->' +
                '</div><!-- /.modal -->';
        $("body").append(html);
        me.initEvent();
    };
    //登录对话框的一些事件
    LoginDialog.prototype.initEvent = function() {
        var me=this;
        $('#' + me.mailID).keyup(function () {
            $('#' + me.mailID).typeahead({
                source: function (query, process) {
                    var availableTags = [
                        '@163.com',
                        '@126.com',
                        '@qq.com',
                        '@foxmail.com',
                        '@gamil.com'
                    ];
                    for (var i = 0; i < availableTags.length; i++) {
                        availableTags[i] = query + availableTags[i];
                    }
                    return availableTags;
                }
            });
        });

        $('#' + me.mailID).blur(function () {
            var mailStr = $('#' + me.mailID).val();
            var flag = me.ConfirmMail(mailStr);
            if (flag) {
                ;
            } else {
                alert("邮箱错误！");
                $('#' + me.mailID).val("");
            }
        });

        $("#" + me.loginID).click(function () {
            me.onLogin();
        });
    };
    LoginDialog.prototype.MailCompelete = function (prefixStr) {
        var availableTags = [
            '@163.com',
            '@126.com',
            '@qq.com',
            '@foxmail.com',
            '@gamil.com'
        ];
        for (var i = 0; i < availableTags.length; i++) {
            availableTags[i] = prefixStr + availableTags[i];
        }

        return availableTags;
    };

    LoginDialog.prototype.ConfirmMail = function (mailStr) {
        var me = this;
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        flag = pattern.test(mailStr);
        if (flag) {
            return true;
        } else {
            return false;
        }
    };

    LoginDialog.prototype.show = function () {
        //bootstrap对话框弹出
        $('#loginModal').modal('show');
    };
    LoginDialog.prototype.hide = function () {
        //bootstrap对话框弹出
        $('#loginModal').modal('hide');
    };
    LoginDialog.prototype.destroy = function () {
        var me = this;
        $("#" + me.dlgID).remove();
    };

    $("#noregist").click(function ()
    {
        $("#register").trigger("click");
        alert('come click');
    });

    LoginDialog.prototype.onLogin = function(){
        var me = this;
        
        passWord = hex_md5($("#" + me.passwordID).val());
        
        var user = {
            useremail: $("#" + me.mailID).val(),
            password: passWord
        };

        $.ajax({
            url: "php/LService.php",
            type: "POST",
            data: {
                params: JSON.stringify({
                    type: "login",
                    user: user
                })
            },
            success: function(data) {
                var obj = JSON.parse(data);
                if (obj.success) {
                    alert('登录成功');
                    me.hide();
                } else {
                    alert(obj.message);
                }
            },
            error: function(xhr, msg) {
                alert(msg);
            }
        });
    }

    if (typeof(module) !== 'undefined') {
        module.exports = LoginDialog;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                'use strict';
                return LoginDialog;
            });
        } else {
            $$.LoginDialog = LoginDialog;
        }
    }
})(jQuery,window.RF.UI);