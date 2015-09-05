/**
 * AJAX函数
 */
Ajax =	function(){
	function request(url, opt) {
		function fn() {}
		var async   = opt.async !== false,
			method  = opt.method    || 'GET',
			data    = opt.data      || null,
			success = opt.success   || fn,
			failure = opt.failure   || fn;
			method  = method.toUpperCase();
		if (method == 'GET' && data){
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
		}
		var xhr = null;
		if(window.ActiveXObject){
			var arrayActive=["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP","Microsoft.XMLHTTP"];
			for(var i=0;i<arrayActive.length;i++){
				try{
					xhr=new ActiveXObject(arrayActive[i]);
					break;
				}catch(e){
					continue;
				}
			}
		}else if(window.XMLHttpRequest){
			try{
				xhr=new XMLHttpRequest();
			}catch(e){
				xhr=null;
			}
		}else{
			xhr=null;
		}
		xhr.open(method, url, async);
		if (method == 'POST') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}		
		xhr.onreadystatechange = function(){
			_onStateChange(xhr, success, failure);
		};
		xhr.send(data);
		return xhr;
	}
		//响应是否成功，注：200~300之间或304的都理解成响应成功，当然你也可以改写成状态为：200
	function _onStateChange(xhr, success, failure) {
		if (xhr.readyState == 4){
			var s = xhr.status;
			if (s>= 200 && s < 300) {
				success(xhr);
			} else {
				failure(xhr);
			}
		} else {}
	}
	return {request:request};
}();

