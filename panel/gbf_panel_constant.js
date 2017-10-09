(function(app) {

	var route_constant = {
		SHORT_TIME: 10000,
		MEDIUM_TIME: 30000,
		LONG_TIME: 600000,

		chapter: {
			url: ["http://game.granbluefantasy.jp/quest/content/newindex/1/",
				"http://game.granbluefantasy.jp/quest/content/_select/"
			],
			url_2: "http://game.granbluefantasy.jp/quest/check_quest_start/",
			chapter_1: {
				url: '200011',
				Scatterd_Cargo: '101121',
				chooseQuest: 'Scatterd_Cargo'
			},
			chapter_8: {
				url: '200024',
				ch_8_The_Iron_Titan: {
					url: '8',
					ep2: '82',
					chooseQuest: 'ep2'
				},
				chooseQuest: 'ch_8_The_Iron_Titan'
			},
			chapter_9: {
				url: '200031',
				Threat_to_the_Fisheries:  '101131',
				chooseQuest: 'Threat_to_the_Fisheries'
			},
			chapter_17: {
				url: '200051',
				I_challenge_you: '101271',
				chooseQuest: 'I_challenge_you'
			},
			chapter_20: {
				url: '200054',
				Whats_in_the_Box:'100561',
				chooseQuest:'Whats_in_the_Box'
			},
			chapter_25: {
				url: '200071',
				Battles_of_old:'101141',
				chooseQuest:'Battles_of_old'
			},
			chapter_51: {
				url: '200042',
				ch_14_Rose_Petal_Glint: {
					url: '14',
					ep2: '142',
					chooseQuest: 'ep2'
				},
				chooseQuest: 'ch_14_Rose_Petal_Glint'
			},
			chapter_65: {
				url: '200082',
				The_Dungeon_Diet: '102341',
				chooseQuest: 'The_Dungeon_Diet'
			},
			chapter_42:{
				url: '200081',
				Sharp_Ears: '101441',
				chooseQuest: 'Sharp_Ears'
			},
			chapter_70:{
				url: '200096',
				ch_70_Erste_Kingdom: {
					url: '70',
					ep4: '704',
					chooseQuest: 'ep4'
				},
				chooseQuest: 'ch_70_Erste_Kingdom'
			}
		},
		//special and feature should put attr in an array as they may change with weekday
		special: {
			url: "http://game.granbluefantasy.jp/quest/content/newextra/normal",
			url_2: "http://game.granbluefantasy.jp/rest/quest/extra_normal_detail_list",
			orb: {
				url: ['1', '6'],
				easy: ['400011', '400191'],
				chooseQuest: 'easy'
			},
			wastland_ex:{
				url:['13'],
				ex:['599831'],
				chooseQuest:'ex'
			},
			land_ex:{
				url:['16'],
				ex:['500101'],
				chooseQuest:'ex'
			},
			fire_ex:{
				url:['11'],
				ex:['599811'],
				chooseQuest:'ex'
			},
			dark_ex:{
				url:['23'],
				ex:['599861'],
				chooseQuest:'ex'
			},
			water_ex: {
				url: ['12'],
				ex: ['599821'],
				chooseQuest: 'ex'
			},
			wind_ex: {
				url: ['14'],
				ex: ['599841'],
				chooseQuest: 'ex'
			},
			light_ex: {
				url: ['15'],
				ex: ['599851'],
				chooseQuest: 'ex'	
			},
			angel: {
				url: ['100', '97'],
				vh: ['510051', '510031'],
				chooseQuest: 'vh'
			},
			longLin:{
				url: ['4'],
				vh: ['400121'],
				chooseQuest: 'vh'
			},
			chooseQuest: 'water_ex'
		},

		feature: {
			url: ["http://game.granbluefantasy.jp/quest/content/_index/1/0",
				"http://game.granbluefantasy.jp/quest/content/newindex/1/"
			],
			TiamatVH: "300041",
			ColossusVH: "300091",
			LeviathanVH: "300151",
			YggdrasilVH: "300191",
			AdversaVH: "300221",
			CelesteVH: "300251",
			chooseQuests: ['TiamatVH', 'ColossusVH', 'LeviathanVH', 'YggdrasilVH', 'AdversaVH', 'CelesteVH'],
		},

		event: {
			IdolMaster2017: {
				usual: true,
				url: 'http://game.granbluefantasy.jp/quest/content/newextra/event',
				soloVH: {
					url: 'http://game.granbluefantasy.jp/rest/quest/extra_event_detail_list/6015/2',
					attr: 'data-key',
					attrVal: ['6015_2'],
					ex: ['719281'],
					chooseQuest: 'ex'
				},
				chooseQuest: 'soloVH'
			},
			UF: {
				usual: false,
				url: 'http://game.granbluefantasy.jp/teamraid033/top/content/index',
				//'http://game.granbluefantasy.jp/teamraid031/top/content/index',
				soloEX: {
					attrName: 'className',
					className: 'btn-ex-raid2',
					buttonName: 'btn-ex-raid2',
					exp: {
						className: 'btn-multi-battle lis-quest-list',
						buttonName: 'btn-multi-battle lis-quest-list',
						toAttr: [],
						attrName: 'data-quest-id',
						attrVal: ['722161'], 
						//['719461'],
						toStam: ['txt-stamina']
					},
					chooseQuest: 'exp'
				},
				chooseQuest: 'soloEX'
			},
			zhanhuo:{
				usual: false,
				url:'http://game.granbluefantasy.jp/treasureraid058/top/content/newindex',
				soloEX: {
					attrName:'className',
					className:'btn-event-raid ex cleared',
					buttonName:'btn-event-raid ex cleared',
					ex:{
						className:'pop-usual pop-event-raid pop-show',
						buttonName:'btn-offer',
						attrName: 'className',
						attrVal: ['720001'],
						toStam:['txt-action-point']
					},
					chooseQuest:'ex'
				},
				soloVH: {
					attrName:'className',
					className:'btn-event-raid vh cleared',
					buttonName:'btn-event-raid vh cleared',
					vh:{
						className:'pop-usual pop-event-raid pop-show',
						buttonName:'btn-offer',
						attrName: 'className',
						attrVal: ['719991'],
						toStam:['txt-action-point']
					},
					chooseQuest:'vh'
				},
				chooseQuest:'soloEX'
			},
			SiXiang: {
				usual: false,
				url: 'http://game.granbluefantasy.jp/advent016/top/content/newindex',
				soloEX: {
					attrName: 'className',
					className: 'btn-select-multi',
					buttonName: 'btn-select-multi',
					zhuque: {
						className: 'btn-start-multi start-711191',
						buttonName: 'btn-start-multi start-711191',
						toAttr: [],
						attrName: 'className',
						attrVal: ['711191'],
						toStam: ['prt-list-ap']
					},
					xuanwu: {
						className: 'btn-start-multi start-711041',
						buttonName: 'btn-start-multi start-711041',
						toAttr: [],
						attrName: 'className',
						attrVal: ['711041'],
						toStam: ['prt-list-ap']
					},
					baihu: {
						className: 'btn-start-multi start-711141',
						buttonName: 'btn-start-multi start-711141',
						toAttr: [],
						attrName: 'className',
						attrVal: ['711141'],
						toStam: ['prt-list-ap']
					},
					qinglong: {
						className: 'btn-start-multi start-711091',
						buttonName: 'btn-start-multi start-711091',
						toAttr: [],
						attrName: 'className',
						attrVal: ['711091'],
						toStam: ['prt-list-ap']
					},
					chooseQuest: 'zhuque'
				},
				chooseQuest: 'soloEX'
			},
			LongGou:{
				usual: true,
				url:'http://game.granbluefantasy.jp/quest/content/newextra/event',
				soloEx:{
					url:'http://game.granbluefantasy.jp/rest/quest/extra_event_detail_list/2005',
					attr:'data-key',
					attrVal:['0'],
					ex:['500261', '500271'],
					chooseQuest:'ex'
				},
				chooseQuest:'soloEx'
			},
			TuTaoMie:{
				usual: true,
				url:'http://game.granbluefantasy.jp/quest/content/newextra/event',
				soloEx:{
					url:'http://game.granbluefantasy.jp/rest/quest/extra_event_detail_list/2015/',
					attr:'data-group',
					attrVal:['9004','2015'],
					ex:['501031','501051'],
					chooseQuest:'ex'
				},
				chooseQuest:'soloEx'
			},
			FengTaoMie:{
				usual: true,
				url:'http://game.granbluefantasy.jp/quest/content/newextra/event',
				soloEx:{
					url:'http://game.granbluefantasy.jp/rest/quest/extra_event_detail_list/2017/',
					attr:'data-group',
					attrVal:['9005','2017'],
					ex:['501161','501141'],
					chooseQuest:'ex'
				},
				chooseQuest:'soloEx'
			},

			DaoMan: {
				usual: true,
				url:'http://game.granbluefantasy.jp/quest/content/newextra/event',
				soloEx:{
					url:'http://game.granbluefantasy.jp/rest/quest/extra_event_detail_list/6016/',
					attr:'data-group',
					attrVal:['3','2'],
					ex:['721371','721341'],
					chooseQuest:'ex'
				},
				chooseQuest:'soloEx'
			},

			chooseQuest: 'UF'
		},

		battle: {
			SOLO_START: "http://game.granbluefantasy.jp/rest/raid/start",
			SOLO_ATTACK_RESULT: "http://game.granbluefantasy.jp/rest/raid/normal_attack_result",
			SOLO_SKILL_RESULT: "http://game.granbluefantasy.jp/rest/raid/ability_result",


			MULTI_START: ["http://game.granbluefantasy.jp/multiraid/start.json",
				"http://game.granbluefantasy.jp/rest/multiraid/start.json",
			],
			MULTI_BATTLE_START: ["http://game.granbluefantasy.jp/multiraid/multi_member_info",
				"http://game.granbluefantasy.jp/rest/multiraid/multi_member_info"
			],

			BATTLE_ATTACK_RESULT: ["http://game.granbluefantasy.jp/multiraid/normal_attack_result",
				"http://game.granbluefantasy.jp/rest/multiraid/normal_attack_result"
			],
			BATTLE_SKILL_RESULT: ["http://game.granbluefantasy.jp/multiraid/ability_result",
				"http://game.granbluefantasy.jp/rest/multiraid/ability_result"
			],

		},

		coop: {
			ENTER_ROOM: "http://game.granbluefantasy.jp/coopraid/content/room/"
		},

		preBattle: {
			QUEST_START: "http://game.granbluefantasy.jp/quest/check_quest_start/",
			QUEST_SUPPORT: "http://game.granbluefantasy.jp/quest/content/supporter/",
			QUEST_DECK: "http://game.granbluefantasy.jp/quest/decks_info/",
			STAGE_START: "http://game.granbluefantasy.jp/quest/content/stage",
			SOLOL_RESULT: "http://game.granbluefantasy.jp/result/data",
			BATTLE_RESULT: "http://game.granbluefantasy.jp/resultmulti/data",
			COOP_START: "ttp://game.granbluefantasy.jp/coopraid/set_ready/"
		},

		casino: {
			CASINO_POKER_CARDINFO_ADDR: "http://game.granbluefantasy.jp/casino_poker/poker_status/",
			CASINO_POKER_CARDINFO_ADDR_1: "http://game.granbluefantasy.jp/casino_poker/poker_deal",
			CASINO_POKER_COMBINE_RESULT: "http://game.granbluefantasy.jp/casino_poker/poker_draw",
			CASINO_POKER_DOUBLE_START: "http://game.granbluefantasy.jp/casino_poker/poker_double_start",
			CASINO_POKER_DOUBLE_RESULT: "http://game.granbluefantasy.jp/casino_poker/poker_double_result"
		},

		misc: {
			BOOKMARK: "http://game.granbluefantasy.jp/rest/bookmark/bookmark_info/"
		},
	};



	var planMap = {};
	var battle_plans = app.const_battle_plans;
	planMap[route_constant.chapter.chapter_1.Scatterd_Cargo] = battle_plans.sr_r_material;
	planMap[route_constant.chapter.chapter_8.ch_8_The_Iron_Titan.ep2] = battle_plans.simpleMaterial;
	planMap[route_constant.chapter.chapter_9.Threat_to_the_Fisheries] = battle_plans.sr_r_material;
	planMap[route_constant.chapter.chapter_17.I_challenge_you] = battle_plans.sr_r_material;
	planMap[route_constant.chapter.chapter_20.Whats_in_the_Box] = battle_plans.simpleMaterial;
	planMap[route_constant.chapter.chapter_51.ch_14_Rose_Petal_Glint.ep2] = battle_plans.singleMaterial;
	planMap[route_constant.chapter.chapter_65.The_Dungeon_Diet] = battle_plans.singleMaterial;
	planMap[route_constant.chapter.chapter_70.ch_70_Erste_Kingdom.ep4] = battle_plans.dropMaterial;
	planMap[route_constant.chapter.chapter_42.Sharp_Ears] = battle_plans.rabbit_material;
	planMap[route_constant.chapter.chapter_25.Battles_of_old] = battle_plans.sr_r_material;

	planMap[route_constant.special.orb.easy[0]] = battle_plans.simpleMaterial;
	planMap[route_constant.special.orb.easy[1]] = battle_plans.simpleMaterial;
	planMap[route_constant.special.water_ex.ex[0]] = battle_plans.mediumMaterial;
	planMap[route_constant.special.fire_ex.ex[0]] = battle_plans.mediumMaterial;
	planMap[route_constant.special.land_ex.ex[0]] = battle_plans.mediumMaterial;
	planMap[route_constant.special.wind_ex.ex[0]] = battle_plans.mediumMaterial;
	planMap[route_constant.special.light_ex.ex[0]] = battle_plans.mediumMaterial;
	planMap[route_constant.special.angel.vh[1]] = battle_plans.simpleMaterial;
	planMap[route_constant.special.wastland_ex.ex[0]] = battle_plans.dropMaterial;
	planMap[route_constant.special.longLin.vh[0]] = battle_plans.simpleMaterial;

	planMap[route_constant.feature.TiamatVH] = battle_plans.sr_r_islender;
	planMap[route_constant.feature.ColossusVH] = battle_plans.sr_r_islender;
	planMap[route_constant.feature.LeviathanVH] = battle_plans.sr_r_islender;
	planMap[route_constant.feature.YggdrasilVH] = battle_plans.sr_r_islender;
	planMap[route_constant.feature.AdversaVH] = battle_plans.sr_r_islender;
	planMap[route_constant.feature.CelesteVH] = battle_plans.sr_r_islender;

	planMap[route_constant.event.IdolMaster2017.soloVH.ex[0]] = battle_plans.event_plan_mb;
	//planMap[route_constant.event.DarkUF.soloEX.exp.attrVal[0]] = battle_plans.light_uf;
	planMap[route_constant.event.UF.soloEX.exp.attrVal[0]] = battle_plans.ball3_zoe_a;

	planMap[route_constant.event.LongGou.soloEx.ex[0]] = battle_plans.event_plan_mb;
	planMap[route_constant.event.LongGou.soloEx.ex[1]] = battle_plans.simple_zoe;

	planMap[route_constant.event.TuTaoMie.soloEx.ex[0]] = battle_plans.event_plan_taomieEx;
	planMap[route_constant.event.TuTaoMie.soloEx.ex[1]] = battle_plans.event_plan_taomieHL70;

	planMap[route_constant.event.FengTaoMie.soloEx.ex[0]] = battle_plans.event_Feng_taomie_70HL;
	planMap[route_constant.event.FengTaoMie.soloEx.ex[1]] = battle_plans.event_Feng_taomie_ex;

	planMap[route_constant.event.DaoMan.soloEx.ex[0]] = battle_plans.zoe_3t_hl;
	planMap[route_constant.event.DaoMan.soloEx.ex[1]] = battle_plans.event_plan_mb;

	planMap[route_constant.event.SiXiang.soloEX.zhuque.attrVal[0]] = battle_plans.zoe_2t;
	planMap[route_constant.event.SiXiang.soloEX.baihu.attrVal[0]] = battle_plans.zoe_2t;
	planMap[route_constant.event.SiXiang.soloEX.qinglong.attrVal[0]] = battle_plans.zoe_2t;

	planMap[route_constant.event.SiXiang.soloEX.xuanwu.attrVal[0]] = battle_plans.zoe_2t_choose;

	planMap[route_constant.event.zhanhuo.soloEX.ex.attrVal[0]] = battle_plans.zoe_3t;
	planMap[route_constant.event.zhanhuo.soloVH.vh.attrVal[0]] = battle_plans.simple_zoe_raid;
	planMap["723001"] = battle_plans.zoe_3t;

	planMap.COOP_PLAN =  battle_plans.coop_plan;

	var setting_constant = {
		WAIT_FULL: 1,
		WAIT_ENOUGH: 0,
		WAIT_TIME: 2
	};

	var control_constant = {
		stop: {
			type: "stop"
		},
		reload: {
			type: "reload"
		}
	};

	app.setting_constant = setting_constant;
	app.route_constant = route_constant;
	app.control_constant = control_constant;
	app.planMap = planMap;

})(window.app || (window.app = {}));