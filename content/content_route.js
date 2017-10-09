/*jshint esversion: 6 */

var route = function() {
	'use strict';

	var clickDomByClass = function(targetDom) {
		var helper = new di.NodeHelper(targetDom.name || 'click-dom-by-class');
		helper.linkCheckAndClickNode('DOM menu', targetDom.className, true);
		c.play(di.makeGraph(helper.nodes, 'click-dom-by-class'));

	};

	var buildChooseMenu = function(targetMenu, helper = null, name = 'choose-menu') {
		var diType = di.NORMAL;
		if (helper === null) {
			helper = new di.NodeHelper(name);
			diType = di.STARTER;
		}
		if (targetMenu.attrName == 'className') {
			helper.linkNextNode('find-' + targetMenu.className, 
				'CheckDomByClass', {
				domName: targetMenu.className
			}, {
				thre: 5,
				timeoutState: 'report-no-quest-found'
			}, diType);
		} else {
			helper.linkNextNode(
				'find-' + targetMenu.className,
				'CheckDomByAttr', {
					domName: targetMenu.className,
					toAttr: targetMenu.toAttr,
					attr: {
						name: targetMenu.attrName,
						vals: targetMenu.attrVal,
					},
					isExact:false
				}, {
					thre: 5,
					timeoutState: 'report-no-quest-found'
				}, diType
			);
		}

		helper.addNode('report-no-quest-found',
			'PanelReporter', {
				tag: 'noQuestFound'
			});
		return helper;
	};

	var buildCheckStam = function(targetQuests, helper = null, name = 'checkStam') {
		var diType = di.NORMAL;
		if (helper === null) {
			helper = new di.NodeHelper(name);
			diType = di.STARTER;
		}
		var checkStam = function(args, pool) {
			var quest = pool[this.domName];
			var userStamInfo = da.getLeaves([pool.document], ['prt-user-stamina', 'txt-stamina-value'])[0].title;
			userStamInfo = userStamInfo.split('/');
			var curStam = parseInt(userStamInfo[0]);
			var totalStam = parseInt(userStamInfo[1]);

			pool.totalStam = totalStam;
			pool.curStam = curStam;

			var questStam = da.getLeaves([quest], args.toStam)[0].innerText;
			questStam = parseInt(questStam.substring(2));
			if (questStam + curStam >= 0) {
				this.success = true;
				return quest;
			}
			pool.stamGap = -(questStam + curStam);
			return quest;
		};
		helper.linkNextNode(
			'check-stamin',
			'CheckDomCallback', {
				domName: targetQuests.className,
				callback: checkStam,
				callbackArgs: {
					toStam: targetQuests.toStam,
				}
			}, {
				failState: 'report-lack-stam'
			}, diType);

		helper.addNode('report-lack-stam',
			'PanelReporter', {
				tag: 'lackStam',
				data: {
					_stamGap: null,
					_totalStam: null,
					_curStam: null
				}
			});
		return helper;

	};

	var findTargetQuest = function(targetQuest, helper = null) {
		helper = buildChooseMenu(targetQuest, helper);
		if (targetQuest.toStam) {
			helper = buildCheckStam(targetQuest, helper);
		}
		if (targetQuest.buttonName != targetQuest.className) {
			helper.linkNextNode(
				'find button',
				'CheckDomByClass', {
					domName: targetQuest.buttonName,
					scope: targetQuest.className,
					isExact: false
				});
		}

		helper.linkNextNode(
			'click-menu' + targetQuest.className, 'DownUpBtn', {
				domName: targetQuest.buttonName
			});
		if (targetQuest.chooseQuest) {
			findTargetQuest(targetQuest[targetQuest.chooseQuest], helper);
		} else {
			c.play(di.makeGraph(helper.nodes, 'go-muli-lv-menu'));
		}
	};

	var toRaid = function() {};

	var skipStage = function() {
		var helper = new di.NodeHelper('skip-stage');
		helper.linkCheckAndClickNode('click-skip', 'btn-command-skip', true);
		helper.linkNextNode(
			'find popup',
			'CheckDomByClass', {
				domName: 'pop-usual pop-skip-confirm pop-show',
			}, {
				thre: 10,
				timeoutState: 'Click ' + 'click-skip'
			});
		helper.linkNextNode(
			'find ok button',
			'CheckDomByClass', {
				domName: 'btn-usual-ok',
				scope: 'pop-usual pop-skip-confirm pop-show'
			});
		helper.linkNextNode(
			'click skip ok', 'DownUpBtn', {
				domName: 'btn-usual-ok'
			});
		helper.linkNextNode(
			'find result popup',
			'CheckDomByClass', {
				domName: 'pop-usual pop-skip-result pop-show',
			});
		helper.linkNextNode(
			'find result ok button',
			'CheckDomByClass', {
				domName: 'btn-usual-ok',
				scope: 'pop-usual pop-skip-result pop-show'
			});
		helper.linkNextNode(
			'click result ok', 'DownUpBtn', {
				domName: 'btn-usual-ok'
			});
		c.play(di.makeGraph(helper.nodes, 'skip-stage'));
	};

	return {
		skipStage: skipStage,
		findTargetQuest: findTargetQuest,
		clickDomByClass: clickDomByClass
	};
}();