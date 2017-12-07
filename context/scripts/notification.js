;
(function(w) {
	/* 封装ajax函数
	 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
	 * @param {string}opt.url 发送请求的url
	 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
	 * @param {object}opt.data 发送的参数，格式为对象类型
	 * @param {function}opt.success ajax发送并接收成功调用的回调函数
	 */
	function ajax(opt) {
		opt = opt || {};
		opt.method = opt.method.toUpperCase() || 'POST';
		opt.url = opt.url || '';
		opt.async = opt.async || true;
		opt.data = opt.data || null;
		opt.success = opt.success || function() {};
		var xmlHttp = null;
		if(XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		} else {
			xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		}
		var params = [];
		for(var key in opt.data) {
			params.push(key + '=' + opt.data[key]);
		}
		var postData = params.join('&');
		if(opt.method.toUpperCase() === 'POST') {
			xmlHttp.open(opt.method, opt.url, opt.async);
			xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
			xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
			xmlHttp.send(postData);
		} else if(opt.method.toUpperCase() === 'GET') {
			xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
			xmlHttp.send(null);
		}
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				var response = "";
				try {
					response = JSON.parse(xmlHttp.responseText);
				} catch(e) {
					response = xmlHttp.responseText;
				}
				opt.success(response);
			}
		};
	}
	var temp = "<li>{{0}}</li>";
	var scrollTime = 2000;
	var scrollHeight = 30;
	var announcement = function() {};
	var Url = "";
	var Notice = "";
	var Time = scrollTime;
	var Height = scrollHeight;
	var RefreshTime = 10000;
	var LastRefreshTime = new Date().getTime();
	var Lang = "ch,en,tw";
	announcement.prototype = {
		start: function(url, notice, lang, time, refreshTime) {
			var ele = document.getElementById(notice);
			if(!ele) {
				console.log("容器不存在");
				return;
			}

			Url = url;
			Notice = notice;
			Time = time;
			Height = ele.clientHeight;
			Lang = lang ? lang : Lang;
			RefreshTime = refreshTime ? refreshTime : RefreshTime;
			scrollHeight = ele.offsetHeight;
			scrollTime = time ? time : scrollTime;

			ajax({
				method: 'Get',
				url: url,
				data: {},
				header: {
					Token: "",
					QIC: ""
				},
				success: function(response) {
					initStart(ele, response, Lang);
				}
			});
		}
	}

	function initStart(ele, response, lang) {
		var data = [];
		if(response && response.Data) {
			data = response.Data;
		}
		var length = data.length;
		var lis = [];
		for(var i = 0; i < length; i++) {
			for(var item in data[i].Contents) {
				if(lang.indexOf(item)>-1) {
					var str = temp.replace(/\{\{0\}\}/g, data[i].Contents[item]);
					lis.push(str);
				}
			}
		}
		var str = "<div><img src='../image/notice.png'/></div><ul style='top:0px;'>" + lis.join('') + "</ul>";
		ele.innerHTML = str;
		var ulele = ele.getElementsByTagName("ul").item(0);
		var ulheigth = ulele.offsetHeight;
		var maxtop = ulheigth / scrollHeight;
		if(maxtop <= 1) {
			return;
		}
		var top = 0;
		var time = scrollTime;
		setTime();

		function setTime() {
			setTimeout(function() {
				++top;
				if(maxtop <= top) {
					var timestamp = new Date().getTime();
					if(timestamp - LastRefreshTime > RefreshTime) {
						setTimeout(function() {
							w.$Notification.start(Url, Notice, Lang, Time, RefreshTime);
						}, 1000)
						return;
					}
					time -= 1000;
					top = 0;
					ulele.style.cssText = "top:" + top * -1 * scrollHeight + "px;transition-duration: 0s;transition-delay: 0s";
				} else {
					time = scrollTime;
					ulele.style.cssText = "top:" + top * -1 * scrollHeight + "px";
				}
				setTime();
			}, time)
		}
	}

	w.$Notification = new announcement();

})(window);