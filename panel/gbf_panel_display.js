/*jshint esversion: 6 */
(function(app) {
	var scroll = function(elem, cl, data, limit) {
		$(elem).prepend('<p class=\"'+cl+'\">' + data + '</p>');
		if ($(elem + ' .' + cl).length > limit) {
			$(elem + ' .' + cl + ':last-child').remove();
		}
	};

	var show = function(tag, data) {
		switch (tag) {
			case 'conn_gbf':
				$('#conn_info').text(data);break;
			case 'curl':
				$('#curl').text(data);break;
			case 'url':
					scroll('#url', 'url_handler', data.url+'<br>'+data.handler, 4);
				break;
			case 'timer':
				$('#timer').text(data);
				break;
		}
	};
	var addDomListener = function(elem, func) {
		$(elem).click(func);
	};

	var dom = {
		show: show,
		addDomListener: addDomListener
	};
	app.dom = dom;
})(window.app || (window.app = {}));