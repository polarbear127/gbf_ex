/*jshint esversion: 6 */
(function(app) {
	var url2handler = app.url2handler;
	var route_constant = app.route_constant;
	var msg_conn = app.msg_conn;

	var preBattleUrl = route_constant.preBattle;
	url2handler.addHandler(preBattleUrl.QUEST_START, (content, encode) => {
		var questInfo = JSON.parse(content);
		if (questInfo.result == "ok") {
			msg_conn.passMessage({
				type: "questStart",
				data: "ok",
				timeLimit: route_constant.SHORT_TIME
			});
		}
	});

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

	url2handler.addHandler(route_constant.misc.BOOKMARK, (content, encode, url)=>{
		msg_conn.passMessage({
			type: "questStart",
			data: {
				
			},
			timeLimit: route_constant.MEDIUM_TIME
		});
	});

	url2handler.addHandler(preBattleUrl.QUEST_SUPPORT, (content, encode, url) => {
		app.msg_handlers.clearCountDown();
		var marker = 'supporter/';
		var markerpos = url.lastIndexOf(marker);
		var aftermarker = url.substring(markerpos + marker.length);
		var questId = aftermarker.substring(0, aftermarker.indexOf('/'));
		if(app.planMap[questId]){
			app.battlePlan = deepCopy(app.planMap[questId]);
			transfer(app.battlePlan.skillList);
			msg_conn.passMessage({
				type: "chooseSupporter",
				data: {
					attr: app.battlePlan.supporter.supporterAtter,
					supporter: app.battlePlan.supporter.supporterSummon
				},
				timeLimit: route_constant.MEDIUM_TIME
			});
		}
	});

	url2handler.addHandler(preBattleUrl.QUEST_DECK, (content, encode) => {
		if(!app.battlePlan || !app.battlePlan.targetGroup){
			return;
		}
		var deckInfo = JSON.parse(content);
		var targetGroup = app.battlePlan.targetGroup;
		if(deckInfo.decks[0].deck_id!=(targetGroup+'1')){
			msg_conn.passMessage({
				type: "chooseDeckGroup",
				data: targetGroup,
				timeLimit: route_constant.MEDIUM_TIME
			});
		} else {
			msg_conn.passMessage({
				type: "chooseDeck",
				data: app.battlePlan.targetDeck,
				timeLimit: route_constant.MEDIUM_TIME
			});
		}
	});

	url2handler.addHandler(preBattleUrl.STAGE_START, (content, encode) => {
		msg_conn.passMessage({
			type: "stage",
			data: {},
			timeLimit: route_constant.LONG_TIME
		});
	});

	url2handler.addGroupHandlers([preBattleUrl.BATTLE_RESULT, preBattleUrl.SOLOL_RESULT], (content, encode) => {
		msg_conn.passMessage({
			type: "combatResult",
			data: {},
			timeLimit: route_constant.MEDIUM_TIME
		});
	});

})(window.app || (window.app = {}));