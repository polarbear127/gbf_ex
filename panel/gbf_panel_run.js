/*jshint esversion: 6 */
(function(app) {
	var dom = app.dom;
	
	var urlHandlers = app.url2handler.urlHandlers;

	var GBF_ADDR = "http://game.granbluefantasy.jp/";

	var toHanlder = function(handler, url, content, encode) {
		handler(content, encode, url);
	};
	chrome.devtools.network.onRequestFinished.addListener(request => {
		var httpRequest = request.request;
		if (httpRequest.url.includes(GBF_ADDR)) {
			var url = httpRequest.url;
			dom.show('curl', url);
			var matchlen = -1,
				sh = null;
			var keys = Object.keys(urlHandlers);
			for (var i=keys.length-1;i>=0;i--) {
				l = keys[i];
				lnum = parseInt(l);
				if (url.length>=lnum && urlHandlers[l][url.substring(0, lnum)] && lnum > matchlen) {
					sh = urlHandlers[l][url.substring(0, lnum)];
					matchlen = lnum;
				}
				if (matchlen >= 0) {
					dom.show('url', {url: url, handler: sh.name});
					request.getContent(toHanlder.bind(null, sh, url));
					break;
				}
			}
		}
	});

})(window.app || (window.app = {}));