/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * [Route 路线设置]
 * @type {[type]}
 */
window.RF = window.RF || {};
window.RF.UI = window.RF.UI || {};
(function($, $$) {
	var Route = function(opt) {
		var me = this;
		me.map; //地图类
		me.control; //地图控制类
		me.menu; //右键菜单
		me.startposition; //起点坐标值
		me.destposition; //终点坐标值
		me.distance; //路程，单位公里 
		me.duration; //时间，单位秒 
		me.routelatlon; //路径的点信息集合 
		me.parameters; //起终点、途经点及驾车方案信息。 
		me.routes; //详细的行驶信息。 
		me.simple; //简化的行驶信息，不一定存在。
		me.html = ""; //路线保存
		me.isCircle = 0; //判断是否为环圈跑
		me.edges = 3; //环圈路线规划的边的数目，默认为4，可以修改，后果自负
		me.counter = 0; //环圈路线规划的计数器
		me.angel = 0; //环圈跑的角度计数  
		me.runDistance = 0; //想跑的距离
		me.infoShow=true;
		me.lineclick;
		me.options = $.extend({
			map: null
		}, opt);
		if (!me.options.map) {
			me.run();
		} else {
			me.map = me.options.map;
		}
	}

	Route.prototype.run = function() {
		var me = this;
		me.map = new TMap(me.options.div);
		me.map.centerAndZoom(new TLngLat(112.9306, 28.1621), 11);
		me.map.enableHandleMouseScroll();
		me.map.enableInertia();
		me.map.enableHandleKeyboard();
		me.map.enableDoubleClickZoom();
		var config = {
			type: "TMAP_NAVIGATION_CONTROL_LARGE",
			anchor: "TMAP_ANCHOR_TOP_RIGHT",
			offset: [0, 0],
			showZoomInfo: true
		};
		me.control = new TNavigationControl(config);
		me.map.addControl(me.control);
		this.rightclick();
	}

	//初始化右键菜单
	Route.prototype.rightclick = function() {
		var me = this;

		//创建右键菜单对象 
		me.menu = new TContextMenu();
		var txtMenuItem = [{
			text: '设为起点',
			callback: function(lonlat) {
				me.setPoint(lonlat, "start");
			}
		}, {
			text: '设为终点',
			callback: function(lonlat) {
				me.setPoint(lonlat, "dest");
			}
		}, {
			text: '规划路线',
			callback: function(lonlat) {
				if (me.startposition == null && me.destposition == null) {
					alert("请先设定起点位置！");
					return;
				}
				me.clearAll();
				me.isCircle = 0;
				me.route(me.startposition, me.destposition, 3);
			}
		}, {
			text: '往返跑路线',
			callback: function(lonlat) {
				if (me.startposition == null) {
					alert("请先设定起点位置！");
					return;
				}
				me.clearAll();
				me.isCircle = 0;
				me.getDistance();
				me.retureRoute(me.runDistance);
				me.route(me.startposition, me.destposition, 3);
			}
		}, {
			text: '环圈跑路线',
			callback: function(lonlat) {
				if (me.startposition == null) {
					alert("请先设定起点位置！");
					return;
				}
				me.clearAll();
				me.isCircle = 1;
				me.getDistance();
				me.circleRoute(me.startposition, me.runDistance);
				// me.isCircle = 0; 
			}
		}];
		for (var i = 0; i < txtMenuItem.length; i++) {
			//创建右键菜单参数接口对象 
			var options = new TMenuItemOptions();
			//设置右键菜单的宽度 
			options.width = 100;
			//添加菜单项 
			me.menu.addItem(new TMenuItem(txtMenuItem[i].text,
				txtMenuItem[i].callback, options));
		}
		//添加右键菜单 
		me.map.addContextMenu(me.menu);
	}

	//选取起终点信息,鼠标右键设置
	Route.prototype.setPoint = function(lnglat, type) {
		var me = this;

		//这里使用右键选择的位置会被标记到文本框里
		if (type == "start") {
			me.startposition = lnglat.getLng() + "," + lnglat.getLat();

		} else {
			me.destposition = lnglat.getLng() + "," + lnglat.getLat();

		}
	}

	//开始路径规划 
	Route.prototype.route = function(startposition, destposition, sty) {
		var me = this;

		//**************
		//清除上一次的内容。 
		//这里清除了上一次的结果！！！！
		//    me.clearAll();
		//**************

		var start = startposition; //起点坐标值 
		var dest = destposition; //终点坐标值 
		var style = 3; //驾车方案，0-3， 
		//途经点信息暂时不再列举。可以看文档。 
		var postStr = "routeStr={'orig':'" + start + "','dest':'" + dest + "','style':'" + style + "'}";
		//url为后台servlet请求地址。自己设定，可以参考web.xml中设定，servlet为com.tianditu.servelt.RouteServlet.java 
		var url = "http://api.tianditu.com/api/api-new/route.do";

		//这里只能用API提供的Ajax方法，否则不能实现功能
		Ajax.request(url, {
			data: postStr,
			method: "POST",
			success: function(req) {
				var result = req.responseText;
				//路径规划只支持国内，有国外时不法规划，返回此内容。 
				if (result == "<result></result>") {
					var html = "<div class='nochoosecity'>由于缺少部分路网信息，暂时无法提供驾车方案。</div>";
					//routeShowListDiv.innerHTML = html;
					return;
				}
				//解析结果集 
				me.resolveResult(result, start, dest, style);
			},
			error: function(req) {
				alert("网络问题请重试")
			}
		});
	}

	//解析领规划信息。并显示。 
	Route.prototype.resolveResult = function(result, startposition, destposition, style) {
		var me = this;

		//将xml变成json格式。 
		var obj = me.parseXmlToObj(result, style);

		me.distance = obj.distance; //路程，单位公里 
		me.duration = obj.duration; //时间，单位秒 
		me.routelatlon = obj.routelatlon; //路径的点信息集合 
		me.parameters = obj.parameters; //起终点、途经点及驾车方案信息。 
		me.routes = obj.routes; //详细的行驶信息。 
		me.simple = obj.simple; //简化的行驶信息，不一定存在。 

		var startName = startposition;
		var destName = destposition;
		var startLonlat = startposition;
		var destLonlat = destposition;
		var startFeature = me.createFeature(startLonlat, "start");
		var destFeature = me.createFeature(destLonlat, "dest");

		//*********
		//这里有个算距离的东东。。。
		var distance_show = Math.round(me.distance);
		//**********
		if (me.infoShow) {
			var html = "<div class='route_scheme_box'>";
			html += "<div class='route_scheme5'>";
			html += "<a id='route_style_walk'>步行</a>";
			html += "</div>";
			html += "<div >总里程：约<span>" + distance_show + "</span>公里</div>";
			html += "<div >";
			html += "<div ><div ></div><span>";
			var totalStartName = startName;
			startName = startName.length > 8 ? startName.substring(0, 6) + "..." : startName;
			html += "</span><div id='route_showResultList_start' title='" + totalStartName + "'>" + startName + "</div></div>";
			html += "<div >";

			if (me.simple.length > 0) {
				//如果有simple，太短的时候可能没有 
				var simpleLength = me.simple.length;
				for (var i = 0; i < simpleLength; i++) {
					var item = me.simple[i];
					var strguide = item.strguide;
					var streetNames = item.streetNames;
					var lastStreetName = item.lastStreetName;
					var signage = item.signage;
					var streetLatLon = item.streetLatLon;
					var streetDistance = item.streetDistance;
					var segmentNumber = item.segmentNumber;
					var numberArr = segmentNumber.split("-");
					var startNumber = 0;
					var endNumber = 1;
					if (numberArr.length <= 1) {
						if (segmentNumber != 0) {
							endNumber = parseInt(segmentNumber) + 1;
							startNumber = endNumber - 1;
						}
					} else {
						startNumber = parseInt(numberArr[0]);
						endNumber = parseInt(numberArr[1]);
					}

					var roadName = strguide;
					html += "<div  >";
					html += "<strong>" + (i + 1) + "</strong> ";
					html += "<em>";
					html += "<span></span>";
					html += roadName;
					//详细列表 
					html += "<div>";
					html += "<ul>";
					//详细列表序号 
					var k = 1;
					if (numberArr.length <= 1) {
						for (var j = startNumber; j < endNumber; j++) {
							var route = me.routes[j];
							var route_strguide = route.strguide;
							html += "<li><p>" + k + ")</p>" + route_strguide + "</li>";
							k++;
						}
					} else {
						for (var j = startNumber; j <= endNumber; j++) {
							var route = me.routes[j];
							var route_strguide = route.strguide;
							html += "<li><p>" + k + ")</p>" + route_strguide + "</li>";
							k++;
						}
					}

					html += "</ul>";
					html += "</div>";

					html += "</em>";
					html += "<div class='clear'></div>";
					html += "</div>";
				}
			} else {
				//如果路程太短，没有simple 
				var routesLength = me.routes.length;
				if (routesLength > 0) {
					for (var i = 0; i < routesLength; i++) {
						var route = me.routes[i];
						var strguide = route.strguide;
						html += "<div  >";
						html += "<strong>" + (i + 1) + "</strong> ";
						html += "<em>";
						html += "<span></span>";
						html += strguide;
						html += "</em>";
						html += "<div ></div>";
						html += "</div>";
					}
				} else {
					//路程太短，没有routes时 
					html += "<div >";
					html += "步行即可到达";
					html += "</div>";
				}
			}
			html += "</div>";
			html += "<div ></div>";
			html += "<div  title='" + destName + "'><div></div>" + destName + "</div>";
			html += "</div>";
			html += "</div>";
			html += "<div ></div>";
			html += "</div>";

			me.routeLine(html);
		}
		//控制抽屉弹出，显示路径信息
		//    if (!sideToggle.checked)
		//    {
		//        $("#sideToggle").trigger("click");
		//    }
		//    $('#content').replaceWith('<div id="content">' + html + '</div>');

		//这里把获得的路线存入数据库

		//显示路线 
		me.showRouteLineFeature(me.routelatlon, startFeature, destFeature);
	}

	//在地图上显示路线。 
	Route.prototype.showRouteLineFeature = function(routelatlon, startFeature, destFeature) {
		var me = this;

		var lonlats = routelatlon.split(";");
		var lonlatsLength = lonlats.length;
		var midFeatures = [];
		var routeLine = null;
		if (lonlatsLength > 0) {
			var lineArr = [];
			for (var i = 0; i < lonlatsLength; i++) {
				var lonlat = lonlats[i];
				if (lonlat == "") {
					continue;
				}
				var lon = lonlat.split(",")[0];
				var lat = lonlat.split(",")[1];
				var lnglat = new TLngLat(lon, lat);
				lineArr.push(lnglat);
			}
			var style = {
				strokeColor: "#024DA8",
				strokeWeight: 5,
				strokeOpacity: 0.8
			}
			routeLine = new TPolyline(lineArr, style);
		}
		me.map.addOverLay(routeLine);
		me.lineClick(routeLine);
		me.map.addOverLay(startFeature);
		me.map.addOverLay(destFeature);
		if (midFeatures.length > 0) {
			for (var i = 0; i < midFeatures.length; i++) {
				var feature = midFeatures[i];
				me.map.addOverLay(feature);
			}
		}
		me.map.setViewport(lineArr);

	}

	//解析xml 
	Route.prototype.parseXmlToObj = function(result, style) {
		var me = this;
		//转化为dom对象解析此xml，转为为json对象。 
		var xmlDoc = me.loadXML(result);
		var distance = xmlDoc.getElementsByTagName("distance")[0].firstChild.nodeValue;
		var duration = xmlDoc.getElementsByTagName("duration")[0].firstChild.nodeValue;
		var routelatlon;
		if (document.all) {
			routelatlon = xmlDoc.getElementsByTagName("routelatlon")[0].firstChild.nodeValue;
		} else {
			routelatlon = xmlDoc.getElementsByTagName("routelatlon")[0].textContent;
		}
		var parameters = xmlDoc.getElementsByTagName("parameters")[0];
		var start = parameters.getElementsByTagName("orig")[0].firstChild.nodeValue;
		var dest = parameters.getElementsByTagName("dest")[0].firstChild.nodeValue;
		var mid = "";
		if (parameters.getElementsByTagName("mid")[0] && parameters.getElementsByTagName("mid")[0].firstChild) {
			mid = parameters.getElementsByTagName("mid")[0].firstChild.nodeValue;
		}
		var sty = parameters.getElementsByTagName("style")[0].firstChild.nodeValue;

		var routes = xmlDoc.getElementsByTagName("routes")[0];
		var items = routes.getElementsByTagName("item");
		var itemsLength = items.length;
		var strguide, signage = "",
			streetName = "",
			nextStreetName = "",
			turnlatlon = "";
		var routesArr = [];
		for (var i = 0; i < itemsLength; i++) {
			strguide = items[i].getElementsByTagName("strguide")[0].firstChild.nodeValue;
			if (items[i].getElementsByTagName("signage")[0].firstChild) {
				signage = items[i].getElementsByTagName("signage")[0].firstChild.nodeValue;
			}
			if (items[i].getElementsByTagName("streetName")[0].firstChild) {
				streetName = items[i].getElementsByTagName("streetName")[0].firstChild.nodeValue;
			}
			if (items[i].getElementsByTagName("nextStreetName")[0].firstChild) {
				nextStreetName = items[i].getElementsByTagName("nextStreetName")[0].firstChild.nodeValue;
			}
			if (items[i].getElementsByTagName("turnlatlon")[0].firstChild) {
				turnlatlon = items[i].getElementsByTagName("turnlatlon")[0].firstChild.nodeValue;
			}
			var routesObj = {
				strguide: strguide,
				signage: signage,
				streetName: streetName,
				nextStreetName: nextStreetName,
				turnlatlon: turnlatlon
			}
			routesArr.push(routesObj);
		}

		var simple = xmlDoc.getElementsByTagName("simple")[0];
		var sim_items = simple.getElementsByTagName("item");
		var sim_itemsLength = sim_items.length;
		var sim_strguide, streetNames = "",
			lastStreetName = "",
			linkStreetName = "",
			sim_turnlatlon = "",
			streetLatLon = "",
			streetDistance = "",
			segmentNumber = "";
		var simpleArr = [];
		for (var i = 0; i < sim_itemsLength; i++) {
			sim_strguide = sim_items[i].getElementsByTagName("strguide")[0].firstChild.nodeValue;
			if (sim_items[i].getElementsByTagName("streetNames")[0].firstChild) {
				streetNames = sim_items[i].getElementsByTagName("streetNames")[0].firstChild.nodeValue;
			}
			if (sim_items[i].getElementsByTagName("lastStreetName")[0].firstChild) {
				lastStreetName = sim_items[i].getElementsByTagName("lastStreetName")[0].firstChild.nodeValue;
			}
			if (sim_items[i].getElementsByTagName("linkStreetName")[0].firstChild) {
				linkStreetName = sim_items[i].getElementsByTagName("linkStreetName")[0].firstChild.nodeValue;
			}
			if (sim_items[i].getElementsByTagName("turnlatlon")[0].firstChild) {
				sim_turnlatlon = sim_items[i].getElementsByTagName("turnlatlon")[0].firstChild.nodeValue;
			}
			if (sim_items[i].getElementsByTagName("streetLatLon")[0].firstChild) {
				streetLatLon = sim_items[i].getElementsByTagName("streetLatLon")[0].firstChild.nodeValue;
			}
			if (sim_items[i].getElementsByTagName("streetDistance")[0].firstChild) {
				streetDistance = sim_items[i].getElementsByTagName("streetDistance")[0].firstChild.nodeValue;
			}
			if (sim_items[i].getElementsByTagName("segmentNumber")[0].firstChild) {
				segmentNumber = sim_items[i].getElementsByTagName("segmentNumber")[0].firstChild.nodeValue;
			}
			var simpleObj = {
				strguide: sim_strguide,
				streetNames: streetNames,
				lastStreetName: lastStreetName,
				linkStreetName: linkStreetName,
				turnlatlon: sim_turnlatlon,
				streetLatLon: streetLatLon,
				streetDistance: streetDistance,
				streetDistance: streetDistance,
				segmentNumber: segmentNumber
			}
			simpleArr.push(simpleObj);
		}
		var obj = {
			distance: distance,
			duration: duration,
			routelatlon: routelatlon,
			parameters: {
				start: start,
				dest: dest,
				mid: mid,
				style: style
			},
			routes: routesArr,
			simple: simpleArr
		}
		return obj;
	}

	//创建起点和终点的marker 
	Route.prototype.createFeature = function(lonlat, type) {
		var me = this;
		var lonlats = lonlat.split(",");
		var lnglat = new TLngLat(lonlats[0], lonlats[1]);

		var iconUrl = null;
		if (type == "start") {
			iconUrl = "http://map.tianditu.com/images/route/routeStart.png";
		} else if (type == "dest") {
			iconUrl = "http://map.tianditu.com/images/route/routeDest.png";
		}
		var iconSize = new TSize(44, 34);
		var iconPixel = new TPixel(16, 34);
		var tIcon = new TIcon(iconUrl, iconSize, {
			anchor: iconPixel
		});
		var marker = new TMarker(lnglat, {
			icon: tIcon
		});
		return marker;
	}

	//清除地图上的信息及列表信息。 
	Route.prototype.clearAll = function() {
		var me = this;
		me.map.clearOverLays();
		//$("#list").innerHTML = "";
	}

	Route.prototype.loadXML = function(xmlString) {
		var me = this;
		var xmlDoc = null;
		//判断浏览器的类型
		//支持IE浏览器 
		if (!window.DOMParser && window.ActiveXObject) { //window.DOMParser 判断是否是非ie浏览器
			var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
			for (var i = 0; i < xmlDomVersions.length; i++) {
				try {
					xmlDoc = new ActiveXObject(xmlDomVersions[i]);
					xmlDoc.async = false;
					xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
					break;
				} catch (e) {}
			}
		}
		//支持Mozilla浏览器
		else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
			try {
				/* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
				 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
				 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
				 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
				 */
				domParser = new DOMParser();
				xmlDoc = domParser.parseFromString(xmlString, "text/xml");
			} catch (e) {}
		} else {
			return null;
		}

		return xmlDoc;
	}

	//往返跑路线规划
	Route.prototype.retureRoute = function(distance) {
		var me = this;

		//利用勾股定理，计算折返点的坐标

		//角度为随机确定
		//MOD1:方向完全随机。这个MOD在道路缺少的环境下会产生路程超长的后果
		var angel = Math.random() * 2 * Math.PI;

		//MOD2：四方向模式。是有东南西北四个方向，但是可以保证路程可控。
		//    var angel = me.random();

		var startlon = me.startposition.split(",")[0];
		var startlat = me.startposition.split(",")[1];

		//注意！！！
		//对于JS，我们需要强制转换获得的数据为Number型，否则就被解析为字符串链接。。。。。。
		var distlon = Number(startlon) + Number(((distance / 2) * Math.cos(angel)) / 111000);
		var distlat = Number(startlat) + Number(((distance / 2) * Math.sin(angel)) / (111000 * Math.cos(startlat)));

		//构造终点位置
		me.destposition = distlon + "," + distlat;

		//规划路线
		me.route(me.startposition, me.destposition, 3);
	}

	//距离是一圈，就是全程的距离
	//起点位置就是全局的构造好的me.startposition
	Route.prototype.circleRoute = function(startposition, distance) {
		var me = this;
		var angel;

		//全局变量me.angel是为了更复杂的环圈跑的模式留作准备的
		if (me.counter === 0) {
			me.angel = Math.PI * 2 * 0.25;
			angel = me.angel;
		} else if (me.counter === 1) {
			angel = 0;
		} else if (me.counter === 2) {
			angel = Math.PI * 2 * 0.75;
		} else if (me.counter === 3) {
			angel = Math.PI * 2 * 0.5;
		}


		//构造起点坐标
		var startlon = startposition.split(",")[0];
		var startlat = startposition.split(",")[1];

		//构造边的距离
		//多少边，就等分多少次
		if (me.counter === 0) {
			var dist = distance / me.edges;
		} else {
			var dist = distance;
		}


		//构造终点坐标
		var distlon = Number(startlon) + Number(((dist / 2) * Math.cos(angel)) / 111000);
		var distlat = Number(startlat) + Number(((dist / 2) * Math.sin(angel)) / (111000 * Math.cos(startlat)));
		var destposition = distlon + "," + distlat;

		if (Number(me.counter) === 3) {
			me.route(startposition, destposition, 3);
			me.counter = 0;
		} else {
			me.counter++;
			me.route(startposition, destposition, 3);
			me.circleRoute(destposition, dist)

		}


	}

	Route.prototype.random = function() {
		var me = this;

		var temp = Math.random();

		if (temp < 0.25) {
			temp = 0;
		} else if (temp < 0.5 || temp > 0.25) {
			temp = 0.25;
		} else if (temp < 0.75 || temp > 0.5) {
			temp = 0.5;
		} else if (temp < 1 || tmep > 0.75) {
			temp = 1;
		}
		temp = Number(temp * 2 * Math.PI);

		return temp;
	}

	Route.prototype.routeLine = function(routehtml) {
		var me = this;

		//环圈跑，保存四次数据在输出
		//每次的数据保存在me.html中
		if (me.isCircle === 1) {
			if (Number(me.counter) === 3) {
				if (!sideToggle.checked) {
					$("#sideToggle").trigger("click");
				}
				$('#content').replaceWith('<div id="content">' + me.html + '</div>');
			} else {
				me.html += routehtml;
			}
			return;
		}

		//其他情况都直接输出
		if (!sideToggle.checked) {
			$("#sideToggle").trigger("click");
		}
		$('#content').replaceWith('<div id="content">' + routehtml + '</div>');
	}

	Route.prototype.getDistance = function() {
		var me = this;
		me.runDistance = $("#rundistance").val();
	}
	//鼠标点击线事件
	Route.prototype.lineClick = function(line) {
		var me=this;
		me.removeLineClick();
		//注册线的点击事件
        me.lineclick = TEvent.addListener(line,"click",function(p){
            alert("click line");
        });
	};
	Route.prototype.removeLineClick=function(){
		var me=this;
		TEvent.removeListener(me.lineclick);
	}


	if (typeof(module) !== 'undefined') {
		module.exports = Route;
	} else {
		if (typeof define === 'function' && define.amd) {
			define([], function() {
				'use strict';
				return Route;
			});
		} else {
			$$.Route = Route;
		}
	}
})(jQuery, window.RF.UI);