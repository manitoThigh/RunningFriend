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


/**
 * 解析xml为dom
 * @param xmlString xml字符串
 * @returns dom
 */
loadXML = function(xmlString){
    var xmlDoc=null;
    //判断浏览器的类型
    //支持IE浏览器 
    if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
        var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
        for(var i=0;i<xmlDomVersions.length;i++){
            try{
                xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                break;
            }catch(e){
            }
        }
    }
    //支持Mozilla浏览器
    else if(window.DOMParser && document.implementation && document.implementation.createDocument){
        try{
            /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
             * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
             * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
             * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
             */
            domParser = new  DOMParser();
            xmlDoc = domParser.parseFromString(xmlString,"text/xml");
        }catch(e){
        }
    }
    else{
        return null;
    }

    return xmlDoc;
}
