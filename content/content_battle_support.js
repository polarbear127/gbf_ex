var beforeBattle = function() {
	'use strict';
	var chooseSupporter = function(supporter) {
		var supporterClassName = 'btn-supporter lis-supporter';
		var helper = new di.NodeHelper('choose-supporter');
		helper.linkNextNode(
			'check-supporter-list',
			'CheckDomByClass', {
				domName: supporterClassName
			}, {}, true);
		var checkSupporter = function(args, pool) {
			var supporter = args.supporter;
			var candidate = toArray(document.getElementsByClassName(supporterClassName));
			var summons = {};
			for (i = 0; i < candidates.length; i++) {
				var detail = candidates[i].getElementsByClassName("prt-supporter-detail")[0];
				var summon = detail.getElementsByClassName("prt-supporter-summon")[0];
				var summonName = summon.innerText.trim();
				var summonLv = detail.getElementsByClassName("txt-summon-level")[0].innerText;
				summonLv = parseInt(summonlv.split(' ')[1]);
				if (summons[summonName]) {
					if (summons[summonName].Lv < summonLv) {
						summons[summonName].summonDom = summon;
						summons[summonName].Lv = summonLv;
					}
				} else {
					summons[summonName] = {
						summonDom: summon,
						Lv: summonLv
					};
				}
			}
			for (var j = 0; j < supporter.length; j++) {
				if (summons[supporter[j]]) {
					this.success = true;
					return summons[supporter[j]].summonDom;
				}
			}
			return null;
		};
		helper.linkNextNode('check-supporter',
			'CheckDomCallback', {
				domName: supporterClassName,
				callback: checkSupporter,
				callbackArgs: {
					supporter: supporter,
				}
			}, {
				failState: 'report-no-supporter'
			});
		helper.linkNextNode('click-supporter',
			'DownUpBtn', {
				domName: supporterClassName
			});
		helper.addNode('report-no-supporter',
			'PanelReporter', {
				tag: 'noSupporter',
				data: {}
			});
		c.play(di.makeGraph(helper.nodes, 'choose-supporter'));
	};
	var chooseDeckGroup = function(groupId) {
		var groupDomName = 'btn-select-group id-' + groupId;
		var helper = new di.NodeHelper('choose-group');
		helper.linkCheckAndClickNode(
			'target-group',
			groupDomName, true);
		c.play(di.makeGraph(helper.nodes, 'choose-group'));
	};
	var chooseDeck = function(deckName) {
		var deckDomName = 'lis-deck';
		var helper = new di.NodeHelper('choose-deck');
		helper.linkNextNode('CheckDomByClass', {
			domName: deckDomName
		}, {}, true);
		helper.linkNextNode('CheckDomByAttr', {
			domName: deckDomName,
			isExact: false,
			attr: {
				name: "data-deck-name",
				vals: [deckName]
			}
		}, {
			thre: 5,
			timeoutState: 'report-no-deck-found'
		});
		var checkDeck = function(args, pool) {
			var deckName = args.deckName;
			var current_deck = da.CheckDomByClass.checkClass('lis-deck flex-active-slide');
			var cur_index = parseInt(current_deck.getAttribute("data-index"));
			var to_index = parseInt(pool[deckDomName].getAttribute("data-index"));
			if (to_deck < cur_index) {
				return da.CheckDomByClass.checkClass("flex-prev");
			} else if (to_deck > cur_index) {
				return da.CheckDomByClass.checkClass("flex-next");
			} else {
				this.success = true;
				return da.CheckDomByClass.checkClass("btn-usual-ok se-quest-start onm-tc-gbf");
			}
		};
		var deckAct = 'flex-ok';
		helper.linkNextNode('check-deck',
			'CheckDomCallback', {
				domName: deckAct,
				callback: checkDeck,
				callbackArgs: {
					deckName: deckName,
				}
			}, {
				failState: 'next-deck'
			});
		helper.linkNextNode('click-start',
			'DownUpBtn', {
				domName: deckAct
			});
		helper.addNode('next-deck',
			'ClickBtn', {
				domName: deckAct
			});
		helper.addNode('report-no-deck-found', 'PanelReporter', {
			tag: 'noDeck',
			data: deckName
		});
		c.play(di.makeGraph(helper.nodes, 'choose-deck'));
	};

	var chooseBackUp = function(isBackUp, skillList) {
		var helper = new di.NodeHelper('choose-backup');
		helper.linkNextNode('check-backup-appear', 'CheckDomByClass', {
			domName: "pop-usual pop-start-assist pop-show"
		}, {}, true);
		helper.linkCheckAndClickNode('click-backup', isBackUp ? "btn-usual-ok" : "btn-usual-cancel");
		helper.linkNextNode('check-backup-close', 'CheckDomByClass', {
			domName: "pop-usual pop-start-assist pop-show"
		}, {
			subsequentState: 'check-backup-close',
			failState: 'start-battle'
		}, true);
		var startbattle = function() {
			combat(skillList);
			this.success = true;
		};
		helper.linkNextNode(
			'startbattle', {
				domName: '',
				callback: startbattle
			}, {});
		c.play(di.makeGraph(helper.nodes, 'choose-backup'));
	};

	return {
		chooseSupporter: chooseSupporter,
		chooseDeckGroup: chooseDeckGroup,
		chooseDeck: chooseDeck,
		chooseBackUp: chooseBackUp
	};
}();

var afterBattle = function() {
	'use strict';
	var toQuest = function() {
		var helper = new di.NodeHelper('back-to-quest');
		//ok
		helper.linkNextNode('check-ok-appear', 'CheckDomByClass', {
			domName: 'prt-popup-footer'
		}, {
			thre: 5,
			timeoutState:'btn-usual-close'
		}, true);
		helper.linkNextNode('check-okbtn-appear', 'CheckDomByClass', {
			domName: 'btn-usual-ok',
			scope: 'prt-popup-footer'
		}, {});
		helper.linkNextNode('click-ok', 'DownUpBtn', {
			domName: 'btn-usual-ok'
		}, {
			subsequentState: 'check-ok-appear'
		});
		//close
		helper.addAndSetCurNode('check-close-appear', 'CheckDomByClass', {
			domName: 'btn-usual-close',
		}, {
			thre: 5,
			timeoutState:'check-rankup'
		});
		helper.linkNextNode('click-close', 'DownUpBtn', {
			domName: 'btn-usual-close'
		}, {
			subsequentState: 'check-close-appear'
		});
		//rank up
		//onm-anim-parts
		//onm-anim-mask
		//cjs-lp-rankup(id)
		helper.addAndSetCurNode('check-rankup', 'CheckDomById', {
			domName: 'cjs-lp-rankup',
		}, {
			thre: 5,
			timeoutState:'check-quest'
		});
		helper.linkNextNode('click-rankup', 'MouseCanvasAction', {
			domName: 'cjs-lp-rankup',
			position:[0.5, 0.5]
		}, {
			subsequentState: 'check-rankup'
		});
		//back to quest
		helper.addAndSetCurNode('check-quest', 'CheckDomByClass', {
			domName: 'btn-control',
			isExact:false
		}, {});
		helper.linkNextNode('click-quest', 'DownUpBtn', {
			domName: 'btn-control'
		}, {});
	};		
	
}();