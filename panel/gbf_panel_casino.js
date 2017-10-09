(function(app) {
	var url2handler = app.url2handler;
	var route_constant = app.route_constant;
	var msg_conn = app.msg_conn;

	var casino_addr = route_constant.casino;

	function chooseCombHandler(content, encode) {
		var cardInfo = JSON.parse(content);
		var cardArray = [];
		if (cardInfo.card_list['1']) { //card_list exits, combine card!
			for (var i = 1; i <= 5; i++) {
				cardArray.push(cardInfo.card_list[i.toString()]);
			}
			cardInfo.card_list = cardArray;
			var choosed = casino_poker_ai(cardInfo);
			msg_conn.passMessage({
				type: "keepCard",
				data: choosed,
				timeLimit: route_constant.SHORT_TIME
			});
		} else {
			msg_conn.passMessage({
				type: "combineResult",
				data: 'lose',
				timeLimit: route_constant.SHORT_TIME
			}); //trick
		}
	}

	function combResultHandler(content, encode) {
		var result = JSON.parse(content);
		msg_conn.passMessage({
			type: "combineResult",
			data: result.result,
			timeLimit: route_constant.SHORT_TIME
		});
	}

	//choose high or low
	function chooseHL(content, encode) {
		var card = JSON.parse(content);
		var hl = casino_poker_ai_HL(card.card_first);
		msg_conn.passMessage({
			type: "chooseHL",
			data: hl,
			timeLimit: route_constant.SHORT_TIME
		});
	}
	//get high or low result
	function hlResult(content, encode) {
		var result = JSON.parse(content);
		msg_conn.passMessage({
			type: "doubleResult",
			data: result.result,
			flag: result.next_game_flag,
			timeLimit: route_constant.SHORT_TIME
		});
	}

	url2handler.addHandler(casino_addr.CASINO_POKER_CARDINFO_ADDR, chooseCombHandler);
	url2handler.addHandler(casino_addr.CASINO_POKER_CARDINFO_ADDR_1, chooseCombHandler);
	url2handler.addHandler(casino_addr.CASINO_POKER_COMBINE_RESULT, combResultHandler);
	url2handler.addHandler(casino_addr.CASINO_POKER_DOUBLE_START, chooseHL);
	url2handler.addHandler(casino_addr.CASINO_POKER_DOUBLE_RESULT, hlResult);
})(window.app || (window.app = {}));