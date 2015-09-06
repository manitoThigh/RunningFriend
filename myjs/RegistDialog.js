/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/**
 * 注册对话框
 */
window.RF = window.RF || {};
window.RF.UI = window.RF.UI || {};
(function($,$$){
    var RegistDialog = function () {
        var me = this;
        me.mailID = uuid();
        me.usernameID = uuid();
        me.passwordID = uuid();
        me.password1ID = uuid();
        me.registID = uuid();
        me.resetID = uuid();
        me.dlgID = uuid();
        me.passWord = '';
        me.passWordOne = '';

        space = '\t\t';
        me.render();
        
    };
    RegistDialog.prototype.render = function() {
        var me=this;
         var html =
                '<div class="modal fade" id="registModal">' +
                '  <div class="modal-dialog">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '        <h3 class="modal-title">Regist</h3>' +
                '      </div>' +
                '      <div class="modal-body">' +
                '           <div class=row>' +
                '               <div class = "col-xs-12" >' +
                '                   <div class = "input-group" >' +
                '                       <span class = "input-group-addon"> <span class ="glyphicon glyphicon-envelope" > </span></span >' +
                '                       <input type="text" id = "' + me.mailID + '" name = "E-mail" class = "form-control" placeholder = "E-mail" />' +
                '                   </div>' +
                '                </div>' +
                '               <div class = "col-xs-12" >' +
                '                   <div class = "input-group" >' +
                '                       <span class = "input-group-addon"> <span class ="glyphicon glyphicon-user" > </span></span >' +
                '                       <input type="text" id = "' + me.usernameID + '" name = "username" class = "form-control" placeholder = "用户名" >' +
                '                   </div>' +
                '                </div>' +
                '               <div class = "col-xs-12" >' +
                '                   <div class = "input-group" >' +
                '                       <span class = "input-group-addon" > <span class = "glyphicon glyphicon-lock" > </span></span >' +
                '                       <input type = "passWord" id = "' + me.passwordID + '" name = "password" class = "form-control" placeholder = "密码" >' +
                '                   </div>' +
                '               </div>' +
                '               <div class = "col-xs-12" >' +
                '                   <div class = "input-group" >' +
                '                       <span class = "input-group-addon" > <span class = "glyphicon glyphicon-lock" > </span></span >' +
                '                       <input type = "passWord" id = "' + me.password1ID + '" name = "password" class = "form-control" placeholder = "再次确定密码" >' +
                '                   </div>' +
                '               </div>' +
                '           </div>' +
                '      </div>' +
                '      <div class="modal-footer">' +
                '           <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '           <button type="button" id = "' + me.registID + '" class="btn btn-primary">Sign up</button>' +
                '      </div>' +
                '    </div><!-- /.modal-content -->' +
                '  </div><!-- /.modal-dialog -->' +
                '</div><!-- /.modal -->';

        $("body").append(html);
        me.initEvent();
    };
    RegistDialog.prototype.initEvent = function() {
        var me=this;
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
        $("#" + me.registID).click(function () {
            me.register();
        });
        $("#" + me.resetID).click(function () {
            me.resetIuput();
        });
    };
    RegistDialog.prototype.register = function () {
        var me = this;
        var md5PassWord = '';
        var passwordFlag = me.ConfirmPassWord();
        if (passwordFlag) {
            var orignalPassWord = $('#' + me.passwordID).val();
            md5PassWord = hex_md5(orignalPassWord);
        } else {
            alert("两次密码不一致，请检查后输入");
            return false;
        }
        var user = {
            useremail: $("#" + me.mailID).val(),
            username: $("#" + me.usernameID).val(),
            password: md5PassWord
        };

        $.ajax({
            url: "php/LService.php",
            type: "POST",
            data: {
                params: JSON.stringify({
                    type: "register",
                    user: user
                })
            },
            success: function (data) {
                var obj = JSON.parse(data);
                if(obj.success){
                    alert(obj.message);
                    me.hide();
                }else{
                    alert(obj.message);
                }
            },
            error: function (xhr, msg) {
                alert(msg);
            }
        });
    };

    RegistDialog.prototype.resetIuput = function () {
        var me = this;
        $("#" + me.usernameID).val("");
        $("#" + me.mailID).val("");
        $("#" + me.passwordID).val("");
        $("#" + me.password1ID).val("");
    };

    RegistDialog.prototype.ConfirmMail = function (mailStr) {
        var me = this;
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        flag = pattern.test(mailStr);
        if (flag) {
            return true;
        } else {
            return false;
        }
    };

    RegistDialog.prototype.MailCompelete = function (prefixStr) {
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

    RegistDialog.prototype.ConfirmPassWord = function () {
        var me = this;
        var p1 = $('#' + me.passwordID).val();
        var p2 = $('#' + me.password1ID).val();
        if (p1 === p2) {
            return true;
        } else {
            return false;
        }
    };

    RegistDialog.prototype.show = function () {
        $('#registModal').modal('show');
        /*var me = this;
         $("#" + me.dlgID).dialog({
         modal: true,
         show: {
         effect: "blind",
         duration: 1000
         },
         hide: {
         effect: "explode",
         duration: 1000
         }
         });*/
    };
    RegistDialog.prototype.hide = function () {
        $('#registModal').modal('hide');
    };
    RegistDialog.prototype.destroy = function () {
        var me = this;
        $("#" + me.dlgID).remove();
    };

    if (typeof(module) !== 'undefined') {
        module.exports = RegistDialog;
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], function() {
                'use strict';
                return RegistDialog;
            });
        } else {
            $$.RegistDialog = RegistDialog;
        }
    }
})(jQuery,window.RF.UI);
