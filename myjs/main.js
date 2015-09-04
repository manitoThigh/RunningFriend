(function($){
	define(['myjs/LoginDialog','myjs/RegistDialog'],function(Login,Regist) {
		var initEvent=function(){
			//关于我们
			$("#aboutus").click(function (){
			    if (!sideToggle.checked)
			    {
			        $("#sideToggle").trigger("click");
			    }
			    var me = this;
			    me.html =
			            '<div id="content">' +
			            '<div id="information">' +
			            '   <h4>刘文凯</h4>' +
			            '   <h4>罗&nbsp;&nbsp;&nbsp;靓</h4>' +
			            '   <h4>李晗孙白</h4>' + 
			            '   <h4>张&nbsp;&nbsp;&nbsp;锐</h4>' +
			            '</div>' + '</div>';
			    //$(me.html).appendTo($('#sidemenu'));
			    $('#content').replaceWith(me.html);
			});
			//登录对话框显示
			var login=new Login();
			$("#login").click(function(){
				login.show();
			});
			//注册对话框显示
			var register= new Regist();
			$("#register").click(function(){
				register.show();
			});
		};
		initEvent();
	});
})(jQuery);