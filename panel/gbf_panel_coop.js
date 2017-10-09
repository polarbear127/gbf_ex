(function(app) {

	var url2handler = app.url2handler;
	var routeTool = app.routeTool;
	var route_constant = app.route_constant;
	var msg_conn = app.msg_conn;

	var start_btn = {
		className: "prt-unset-isready guide-style disp",
		attrName: 'className',
		buttonName: "btn-quest-start multi se-quest-start onm-tc-gbf",
		toStam: ["txt-quest-ap"]
	};

	//TODO: move to util
	var transfer = function(battlePlan) {
		if (battlePlan.constructor.name === 'Number') {
			return true;
		}
		if (battlePlan.length === 0) {
			return false;
		}
		for (var i = 0; i < battlePlan.length; i++) {
			if (transfer(battlePlan[i])) {
				battlePlan[i]--;
			}
		}
		return false;
	};
	var deepCopy = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	};
	
	var start = function(){
		app.msg_handlers.clearCountDown();
		app.battlePlan = deepCopy(app.planMap.COOP_PLAN);
		transfer(app.battlePlan.skillList);
		msg_conn.passMessage({
			type: "targetQuests",
			data: start_btn,
			timeLimit: route_constant.MEDIUM_TIME
		});
	};
	url2handler.addHandler(route_constant.coop.ENTER_ROOM, start);



})(window.app || (window.app = {}));