/*jshint esversion: 6 */
(function(app) {
	'use strict';
	var url2handler = app.url2handler;
	var route_constant = app.route_constant;
	var msg_conn = app.msg_conn;

	var battleUrl = route_constant.battle;

	function nextBattle(battleInfo){
		if(battleCount >= 0) {
			var curList = app.battlePlan.skillList;
			if(curList[0][0][0].length && 
			   battleCount != curList.length - 1){
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	var checkEnd = function(content, encode) {
		var battleInfo = JSON.parse(content);
		var scenario = battleInfo.scenario;
		for (var i = 0; i < scenario.length; i++) {
			if (scenario[i].cmd && scenario[i].cmd == "win") {
				if(nextBattle(battleInfo)){
					msg_conn.passMessage({
						type: "combatEnd",
						data: "win",
						timeLimit: route_constant.MEDIUM_TIME
					});
				} else {
					msg_conn.passMessage({
						type: "reload",
						data: "win",
						timeLimit: route_constant.MEDIUM_TIME
					});
				}
				battleCount = -1;
				return true;
			}
		}
		return false;
	};

	var checkSkillSeal = function(skillList, battleInfo) {
		var scenario = battleInfo.scenario;
		var skillSealCharacters = {
			0: false,
			1: false,
			2: false,
			3: false
		};
		for (var i = 0; i < scenario.length; i++) {
			if (scenario[i].cmd && scenario[i].cmd == "condition") {
				var debuff = scenario[i].condition.debuff;
				if (!debuff) continue;
				for (var j = 0; j < debuff.length; j++) {
					if (debuff[j].status && debuff[j].status == "1033") {
						skillSealCharacters[scenario[i].pos] = true;
						break;
					}
				}

			}
		}

		for (var i = 0; i < 4; i++) {
			if (skillSealCharacters[i]) {
				for (var j = 0; j < skillList.length; j++) {
					if (skillList[j][0] == i) {
						skillList.splice(j, 1);
						j--;
					}
				}
			}
		}
		return skillList;
	};

	var putNextSkill = function(content, encode, multibattle) {
		if(content === null){
			return;
		}
		var skillList = [];
		var battleInfo = JSON.parse(content);
		var turn = battleInfo.status.turn - 1;
		var curList = app.battlePlan.skillList;
		if (multibattle) {
			curList = curList[battleCount];
		}
		if (turn < curList.length) {
			skillList = curList[turn];
			skillList = checkSkillSeal(skillList, battleInfo);
		}
		if (!checkEnd(content, encode)) {
			msg_conn.passMessage({
				type: "combat",
				data: {
					skillList: skillList
				},
				timeLimit: route_constant.LONG_TIME
			});
		}
	};

	var battleStart = function(content, encode, multibattle){
		var battleInfo = JSON.parse(content);
		var curList = app.battlePlan.skillList;
		if(multibattle){
			battleCount = parseInt(battleInfo.battle.count) - 1;
			curList = curList[battleCount];
		}
		var data = {skillList: curList[0]};
		if(!multibattle){
			data.isBackUp = app.battlePlan.isBackUp;
		}
		msg_conn.passMessage({
			type: "combat",
			data: data,
			timeLimit: route_constant.LONG_TIME
		});
	};

	var battleCount = -1;
	url2handler.addHandler(battleUrl.SOLO_START, (content, encode) => {
		battleStart(content, encode, true);
	});

	url2handler.addHandler(battleUrl.SOLO_ATTACK_RESULT, (content, encode) => {
		putNextSkill(content, encode, true);
	});

	url2handler.addGroupHandlers(battleUrl.MULTI_START, (content, encode) => {
		battleStart(content, encode, false);
	});

	url2handler.addGroupHandlers(battleUrl.MULTI_BATTLE_START, (content, encode) => {
		battleStart(content, encode, false);
	});

	url2handler.addGroupHandlers(battleUrl.BATTLE_ATTACK_RESULT, (content, encode) => {
		putNextSkill(content, encode, false);
	});

	url2handler.addGroupHandlers([battleUrl.SOLO_SKILL_RESULT, ...battleUrl.BATTLE_SKILL_RESULT], checkEnd);


})(window.app || (window.app = {}));