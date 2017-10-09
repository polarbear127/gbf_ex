(function(app) {	
	var battle_plans = {
		coop_plan: {
			skillList:[
				[
					[1, 1]
				]
			]
		},
		//sr, r-> islander vh
		sr_r_islender: {
			targetGroup:'1',
			targetDeck: "Party5",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[0, 1],
					[1, 4],
					[7, 6],
					[1, 2],
					[2, 1],
					[2, 2],
					[2, 3],
					[4, 2],
					[4, 1],
					[1, 3]
				], //round0
				[], //round1
				[], //round2
				[
					[1, 1],
					[3, 1],
					[3, 2],
					[3, 3]
				] //round3
			]
		},
		zoe_2t: {
			targetGroup:'1',
			targetDeck: "Party3",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[1,1],
					[1,2],
					[1,3],
					[1,4],
					[2,1],
					[2,2],
					[7,6],
					[3,2],
					[3,1]
				], //round0
				[
					[4,2],
					[4,1],
					[4,3],
					[3,3]
				] //round1
			]
		},
		zoe_2t_hl: {
			targetGroup:'1',
			targetDeck: "Party3",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[1,1],
						[1,2],
						[1,3],
						[1,4],
						[2,1],
						[2,2],
						[7,6],
						[3,2],
						[3,1]
					], //round0
					[
						[4,2],
						[4,1],
						[4,3],
						[3,3]
					] //round1
				]
			]
		},
		zoe_3t: {
			targetGroup:'1',
			targetDeck: "Party3",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[1,1],
					[1,2],
					[1,3],
					[1,4],
					[2,1],
					[2,2],
					[7,6],
					[3,2],
					[3,1]
				], //round0
				[

				],   //
				[
					[4,2],
					[4,1],
					[4,3],
					[3,3]
				] //round1
			]
		},
		zoe_3t_hl: {
			targetGroup:'1',
			targetDeck: "Party3",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[1,1],
						[1,2],
						[1,3],
						[1,4],
						[2,1],
						[2,2],
						[7,6],
						[3,2],
						[3,1]
					], //round0
					[

					],   //
					[
						[4,2],
						[4,1],
						[4,3],
						[3,3]
					], //round2
					[
						[2, 3]
					]
				]
			]
		},
		zoe_2t_choose: {
			targetGroup:'1',
			targetDeck: "Party3",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[-2,3],
					[1,1],
					[1,2],
					[1,3],
					[1,4],
					[2,1],
					[2,2],
					[7,6],
					[3,2],
					[3,1]
				], //round0
				[
					[4,2],
					[4,1],
					[4,3],
					[3,3]
				] //round1
			]
		},
		simple_zoe: {
			targetGroup:'1',
			targetDeck: "Party2",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[4, 2],
						[4, 1],
						[2, 1],
						[2, 3],
						[1, 2],
						[1, 3],
						[3, 2]
					]
				],
			]
		},
		simple_zoe_raid: {
			targetGroup:'1',
			targetDeck: "Party2",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[4, 2],
					[4, 1],
					[2, 1],
					[2, 3],
					[1, 2],
					[1, 3],
					[3, 2]
					
				],
			]
		},
		event_plan_taomieHL70: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[1, 1],
						[1, 2],
						[1, 3],
						[1, 4],
						[2, 1],
						[2, 2],
						[7, 6],
						[4, 2],
						[4, 1],
						[3, 2],
						[3, 1]
					],
					[
						[4, 3],
						[3, 3]
					]
				],
			]
		},
		//ssr -> event ex+(AT, 3 ball boss)
		ball3_zoe: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[0, 2],
					[1, 2],
					[1, 4],
					[2, 1],
					[2, 2]
				], //round0
				[
					[-1, 1]
				],
				[
					[-1, 1],
					[1, 1],
					[1, 3],
					[7, 6],
					[3, 2],
					[3, 1]
				], //round1
				[
					[0, 1],
					[4, 2],
					[4, 3],
					[4, 1]
				],
				[
					[2, 3],
					[3, 3]
				],
				[]
			]
		},
		ball3_zoe_a: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[0, 2],
					[1, 1],
					[1, 2],
					[1, 3],
					[1, 4],
					[2, 1],
					[2, 2],
					[2, 3],
					[7, 6],
					[3, 2],
					[3, 1]
				], //round0
				[
					[2, 4],
					[4, 2],
					[4, 1],
					[4, 3],
				],
				[
					[3, 3]
				],
				[
					[0, 1]
				]
			]
		},
		light_uf: {
			targetGroup:'2',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "light",
				supporterSummon: ["Lucifer"]
			},
			skillList: [
				[
					[1, 1],
					[1, 3],
					[1, 4],
					[7, 6],
					[2, 1],
					[2, 2],
					[2, 3],
					[3, 3],
					[4, 2],
					[4, 3]
				],
				[],
				[
					[3, 1]
				],
				[
					[1, 2],
				],
				[
					[3, 2]
				], 
				[
					[1, 3],
					[2, 2]
				]
			]
		},

		event_Feng_taomie_70HL: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[1, 1],
						[1, 2],
						[1, 3],
						[2, 1],
						[2, 2],
						[7, 6],
						[3, 2],
						[3, 1],
					],
					[
					],
					[
						[2, 4],
						[4, 2],
						[4, 1],
						[3, 3]
					],
					[
						[1, 4],
						[4, 3]
					]
				],
			]
		},

		event_Feng_taomie_ex: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[],
					[
						[0, 2],
						[4, 3]
					]
				],
				[
					[
						[1, 4]
					]
				],
				[
					[
						[-1, 1],
					],
					[
						[0, 1],
						[1, 1],
						[1, 3],
						[2, 1],
						[7, 6],
						[3, 2],
						[4, 2],
						[4, 1],
						[3, 1]
					],
					[
						[1, 2],
						[2, 2],
						[3, 3],
						[7, 4],
						[4, 3]
					],
					[
						[1, 4],
					]
				]
			]
		},

		simpleMaterial: {
			targetGroup:'1',
			targetDeck: "Party6",
			isBackUp: false,
			supporter: {
				supporterAtter: "misc",
				supporterSummon: ["Kaguya", "White Rabbit", "Black Rabbit"]
			},
			skillList: [
				[
					[
						[1, 1]
					] //round0
				], //battle1
				[
					[
						[2, 3]
					]
				], //battle2
				[
					[
						[3, 2]
					]
				] //battle3
			]
		},

		dropMaterial: {
			targetGroup:'1',
			targetDeck: "Party2",
			isBackUp: false,
			supporter: {
				supporterAtter: "misc",
				supporterSummon: ["Kaguya", "White Rabbit", "Black Rabbit"]
			},
			skillList: [
				[
					[
						[4, 2],
						[4, 3]
					] //round0
				], //battle1
				[
					[
						[4, 1],
						[3, 2]
					]
				], //battle2
				[
					[
						[1, 3],
						[1, 4],
						[2, 1],
						[2, 3]
					]
				] //battle3
			]
		},

		mediumMaterial: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "misc",
				supporterSummon: ["Kaguya", "White Rabbit", "Black Rabbit"]
			},
			skillList: [
				[
					[
						[1, 1],
						[1, 2],
						[2, 2],
						[3, 2],
						[3, 1]
					] //round0
				], //battle1
				[
					[
						[4, 3]
					]
				], //battle2
				[
					[
						[1, 3],
						[1, 4],
						[4, 2],
						[4, 1],
						[2, 3]
					]
				] //battle3
			]
		},

		sr_r_material: {
			targetGroup:'1',
			targetDeck: "Party5",
			isBackUp: false,
			supporter: {
				supporterAtter: "misc",
				supporterSummon: ["Kaguya", "White Rabbit", "Black Rabbit"]
			},
			skillList: [
				[
					[

					] //round0
				], //battle1
				[
					[
						[0, 1],
						[7, 6]
					]
				], //battle2
				[
					[
						[1, 2],
						[1, 3],
						[1, 4],
						[2, 1],
						[2, 2],
						[2, 3]
					]
				] //battle3
			]
		},
		rabbit_material: {
			targetGroup:'2',
			targetDeck: "party5",
			isBackUp: false,
			supporter: {
				supporterAtter: "misc",
				supporterSummon: ["Belle Sylphid","Kaguya", "White Rabbit", "Black Rabbit"]
			},
			skillList: [
				[
					[
						[0, 1],
						[1, 2],
						[1, 4],
						[7, 6]
					] //round0
				], //battle1
				[
					[

					],
					
					[
						[1, 3],
						[2, 2],
						[3, 3],
						[4, 1],
						[4, 2]
					]
				],
				[
					[

					]
				]
			]
		},
		singleMaterial: {
			targetGroup:'1',
			targetDeck: "Party2",
			isBackUp: false,
			supporter: {
				supporterAtter: "misc",
				supporterSummon: ["Kaguya", "White Rabbit", "Black Rabbit"]
			},
			skillList: [
				[
					[
						[4, 2],
						[4, 3]
					] //round0
				] //battle1
			]
		},

		event_plan_mb: {
			targetGroup:'1',
			targetDeck: "Party2",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[0, 2],
						[2, 1],
						[4, 2],
						[4, 3]
					] //round0
				], //battle1
				[
					[
						[1, 4]
					]
				],
				[
					[
						[4, 1],
						[2, 3],
						[3, 2]
					]
				]
			]
		},

		event_plan_taomieEx: {
			targetGroup:'1',
			targetDeck: "Party1",
			isBackUp: false,
			supporter: {
				supporterAtter: "dark",
				supporterSummon: ["Bahamut"]
			},
			skillList: [
				[
					[
						[0, 2],
						[1, 1],
						[1, 2],
						[7, 6],
						[4, 3],
						[3, 2],
						[3, 1]
					] //round0
				], //battle1
				[
					[
						
					]
				],
				[
					[

					],
					[
						[1, 3],
						[1, 4],
						[2, 1],
						[2, 2],
						[3, 1]
					],
					[
						[-1, 1],
						[1, 2]
					],
					[
						[7, 1],
						[4, 2],
						[4, 1],
						[3, 2]
					],
					[
						[0, 1],
						[3, 1],
						[1, 1],
						[4, 3]
					]
				]
			]
		}
	};

	app.const_battle_plans = battle_plans;
})(window.app || (window.app = {}));