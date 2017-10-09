/*jshint esversion: 6 */

var casino = function() {
	'use strict';

	const DIV_BEFORE_ACTION = 'prt-navigation show';

	var playCombineCard = function(keepCard) {
		const BTN_KEEP_CARD_OK = 'prt-ok-shine';
		const CANVAS = 'canv';
		const poker_pos =
			[
				[0.1, 0.6],
				[0.3, 0.6],
				[0.5, 0.6],
				[0.7, 0.6],
				[0.9, 0.6]
			];

		var helper = new di.NodeHelper('Casino combine card: ');

		helper.addAndSetCurNode('keep card begin', 'CheckDomByClass', {
				domName: DIV_BEFORE_ACTION
			}, {},
			di.STARTER);

		helper.linkNextNode('find canvas', 'CheckDomById', {
			domName: CANVAS
		});

		keepCard.forEach(function(keep, i) {
			if (keep) {
				helper.linkNextNode('keep card #' + i, 'MouseCanvasAction', {
					domName: CANVAS,
					position: poker_pos[i]
				}, {
					headDelay: 150,
					afterDelay: 150
				});
			}
		});

		helper.linkCheckAndClickNode('ok', BTN_KEEP_CARD_OK);

		c.play(di.makeGraph(helper.nodes, 'CASINO_KEEP_CARD'));
	};

	var playNext = function(result) {
		const
			LOSE = 'lose',
			WIN = 'win',
			DRAW = 'draw';
		const
			BTN_BET_START = 'prt-start-shine',
			BTN_YES_CONTINUE = 'prt-yes-shine',
			DIV_BEFORE_KEEP_CARD = 'prt-navigation show';

		var helper = new di.NodeHelper('Casino play next: ');
		helper.addAndSetCurNode('play begin', 'CheckDomByClass', {
				domName: DIV_BEFORE_ACTION
			}, {},
			di.STARTER);
		switch (result) {
			case LOSE:
				helper.linkCheckAndClickNode('PLAY_AGAIN', BTN_BET_START);
				break;
			case WIN:
			case DRAW:
				helper.linkCheckAndClickNode('CONTINUE', BTN_YES_CONTINUE);
				break;
			default:
				throw 'CASINO playNext unkown result' + result;
		}

		c.play(di.makeGraph(helper.nodes, 'Casino play next start'));
	};

	var chooseHighLow = function(choose) {
		const
			HIGH = 'high',
			LOW = 'low';
		const
			BTN_HIGH = 'prt-high-shine',
			BTN_LOW = 'prt-low-shine';


		var helper = new di.NodeHelper('Casino choose high-low: ');
		switch (choose) {
			case HIGH:
				helper.linkCheckAndClickNode('CHOOSE HIGH', BTN_HIGH, true);
				break;
			case LOW:
				helper.linkCheckAndClickNode('CHOOSE LOW', BTN_LOW, true);
				break;
			default:
				throw 'CASINO chooseHighLow unkown choose' + choose;
		}

		c.play(di.makeGraph(helper.nodes, 'Casino choose high-low start'));

	};

	return {
		playCombineCard: playCombineCard,
		playNext: playNext,
		chooseHighLow: chooseHighLow
	};
}();