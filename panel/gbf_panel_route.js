/*jshint esversion: 6 */
(function(app) {
	var route_constant = app.route_constant;
	var msg_conn = app.msg_conn;
	var chooseMenu = function(className, attrName, attrVal, buttonName, toAttr = []) {
		var item = {
			className: className,
			attrName: attrName,
			toAttr: toAttr,
			buttonName: buttonName,
			attrVal: attrVal
		};
		msg_conn.passMessage({
			type: "targetQuests",
			data: item,
			timeLimit: route_constant.MEDIUM_TIME
		});
	};

	var chooseQuest = function(className, attrName, attrVal, buttonName, toAttr = [], toStam = ['txt-stamina']) {
		var quest = {
			className: className,
			attrName: attrName,
			toAttr: toAttr,
			toStam: toStam,
			buttonName: buttonName,
			attrVal: attrVal
		};
		msg_conn.passMessage({
			type: "targetQuests",
			data: quest,
			timeLimit: route_constant.MEDIUM_TIME
		});
	};

	var chooseCustomerQuest = function(quest){
		msg_conn.passMessage({
			type: "targetQuests",
			data: quest,
			timeLimit: route_constant.MEDIUM_TIME
		});
	};

	var chooseDom = function(className){
		var quest = {
			className: className
		};
		msg_conn.passMessage({
			type: "chooseDom",
			data: quest,
			timeLimit: route_constant.MEDIUM_TIME
		});
	};

	var toChapterMain = function(mainid) {
		chooseQuest('btn-quest-list', 'data-chapter-id', mainid, 'prt-button-cover');
	};

	var toChapterMainEP = function(epnum) {
		chooseMenu('btn-cleard-episode', 'data-quest-id', epnum, 'btn-cleard-episode');
	};


	var toChapterQuest = function(questid) {
		chooseQuest('btn-quest-list', 'data-quest-id', questid, 'prt-button-cover');
	};

	var toSpecial = function(questid) {
		chooseMenu('lis-event-list extra', 'data-id', questid, 'btn-stage-detail', ['btn-stage-detail']);
	};

	var toSpecialQuest = function(questid) {
		chooseQuest('prt-quest-banner extra', 'data-quest-id', questid, 'btn-set-quest', ['btn-set-quest'], ['txt-quest-ap']);
	};

	var toSpEvent = function(questid) {
		chooseMenu('lis-event-list extra', 'data-group', questid, 'btn-stage-detail', ['btn-stage-detail']);
	};

	var routeTool = {
		toChapterMain: toChapterMain,
		toChapterMainEP: toChapterMainEP,
		toChapterQuest: toChapterQuest,
		toQuest: toChapterQuest,
		toSpecial: toSpecial,
		toSpecialQuest: toSpecialQuest,
		toSpEvent:toSpEvent,
		chooseCustomerQuest:chooseCustomerQuest
	};
	app.routeTool = routeTool;
})(window.app || (window.app = {}));

(function(app) {
	var url2handler = app.url2handler;
	var routeTool = app.routeTool;
	var route_constant = app.route_constant;

	var chapters = route_constant.chapter;
	for (var chapter_key in chapters) {
		var chapter = chapters[chapter_key];
		if (typeof chapter !== 'object' || !chapter.chooseQuest) {
			continue;
		}
		var curl = chapters.url.map(val => {
			return val + chapter.url;
		});
		var chooseQuest = chapter[chapter.chooseQuest];
		if (chapter.chooseQuest.substring(0, 2) == 'ch') { //main 
			url2handler.addGroupHandlers(curl, routeTool.toChapterMain.bind(null, [chooseQuest.url]));
			url2handler.addHandler(chapters.url_2 + chooseQuest.url, routeTool.toChapterMainEP.bind(null, [chooseQuest[chooseQuest.chooseQuest]]));
		} else { //free
			url2handler.addGroupHandlers(curl, routeTool.toChapterQuest.bind(null, [chooseQuest]));
		}
	}

	//specials may change with weekdays, thus need provide array
	var specials = route_constant.special;
	if (specials.chooseQuest) {
		var chooseQuest = specials[specials.chooseQuest];
		url2handler.addHandler(specials.url, routeTool.toSpecial.bind(null, chooseQuest.url));
		url2handler.addHandler(specials.url_2, routeTool.toSpecialQuest.bind(null, chooseQuest[chooseQuest.chooseQuest]));
	}

	//features need multi matching, thus need provide array
	var features = route_constant.feature;
	if (features.chooseQuests) {
		var chooseQuests = features.chooseQuests.map(qname => {
			return features[qname];
		});
		url2handler.addGroupHandlers(features.url, routeTool.toQuest.bind(null, chooseQuests));
	}

	var event = route_constant.event;
	if(event.chooseQuest){
		var chooseQuest = event[event.chooseQuest];
		if(chooseQuest.usual){//event that can be fitted with usual quest (chapter, special)
			url2handler.addHandler(chooseQuest.url, routeTool.toSpEvent.bind(null, chooseQuest[chooseQuest.chooseQuest].attrVal));
			chooseQuest = chooseQuest[chooseQuest.chooseQuest];
			url2handler.addHandler(chooseQuest.url, routeTool.toSpecialQuest.bind(null, chooseQuest[chooseQuest.chooseQuest]));
		} else {
			url2handler.addHandler(chooseQuest.url, routeTool.chooseCustomerQuest.bind(null, chooseQuest[chooseQuest.chooseQuest]));
		}
	}

})(window.app || (window.app = {}));