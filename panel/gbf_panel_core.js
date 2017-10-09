/*jshint esversion: 6 */
(function(app) {

	var dom = app.dom;

	var agencyConn = chrome.runtime.connect({
		name: "devtools-agency",
	});

	var msgHandlers = {
		response: msg => {
			console.log(msg);
		}
	};
	var addMsgListener = function(tag, handler) {
		msgHandlers[tag] = handler;
	};
	agencyConn.onMessage.addListener(msg => {
		if (msgHandlers[msg.tag]) {
			msgHandlers[msg.tag](msg);
		} else {
			console.log('unknown msg: ' + msg);
		}
	});

	var connect_gbf = true;
	var passMessage = function(msg) {
		if (connect_gbf) {
			agencyConn.postMessage(msg, function(response) {
				console.log(response);
			});
		}
	};

	var setConnect_gbf = function(val) {
		connect_gbf = val;
		if(val){
			dom.show('conn_gbf', 'gbf connected');
		} else {
			dom.show('conn_gbf', 'gbf disconnected');
		}
	};

	dom.addDomListener('#connect_content', setConnect_gbf.bind(null, true));
	dom.addDomListener('#disconnect_content', setConnect_gbf.bind(null, false));

	var msg_conn = {
		addMsgListener: addMsgListener,
		passMessage: passMessage,
		setConnect_gbf: setConnect_gbf
	};
	app.msg_conn = msg_conn;

})(window.app || (window.app = {}));

(function(app) {
	var dom = app.dom;

	var urlHandlers = {};

	var addHandler = function(url, handler) {
		hgroup = urlHandlers[url.length] || (urlHandlers[url.length] = {});
		hgroup[url] = handler;
	};
	var addGroupHandlers = function(urls, handler) {
		urls.forEach(url => {
			addHandler(url, handler);
		});
	};
	var addAllHandlers = function(handlers) {
		handlers.forEach(h => {
			addGroupHandlers(h.urls, h.handler);
		});
	};
	var url2handler = {
		addHandler: addHandler,
		addGroupHandlers: addGroupHandlers,
		addAllHandlers: addAllHandlers,
		urlHandlers:urlHandlers
	};
	app.url2handler = url2handler;
})(window.app || (window.app = {}));