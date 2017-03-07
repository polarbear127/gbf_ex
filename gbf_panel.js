//we need to get traffic from devtool!
//we need some places to show the status, directly change the DOM is dangerous!
var mainDiv = document.getElementById('main');
var infoDiv = document.getElementById('info');

var agencyConn = chrome.runtime.connect({
    name: "devtools-agency"
});

var GBF_ADDR = "http://game.granbluefantasy.jp/";

////casino address handler setting
var CASINO_MATCHER = "http://game.granbluefantasy.jp/casino.*";
//var CASINO_DATA_ADDR = "http://game.granbluefantasy.jp/casino/content/index";
//var CASINO_POKER_FRONT_ADDR = "http://game.granbluefantasy.jp/casino/content/list/poker";
//var CASINO_POKER_OK_ADDR = "http://game.granbluefantasy.jp/casino_poker/content/poker";
var CASINO_POKER_CARDINFO_ADDR = "http://game.granbluefantasy.jp/casino_poker/poker_status/";
var CASINO_POKER_CARDINFO_ADDR_1 = "http://game.granbluefantasy.jp/casino_poker/poker_deal";
var CASINO_POKER_COMBINE_RESULT = "http://game.granbluefantasy.jp/casino_poker/poker_draw";
var CASINO_POKER_DOUBLE_START = "http://game.granbluefantasy.jp/casino_poker/poker_double_start";
var CASINO_POKER_DOUBLE_RESULT = "http://game.granbluefantasy.jp/casino_poker/poker_double_result";

var casinoAddrHLMap = [
{addr:CASINO_POKER_CARDINFO_ADDR, h:chooseCombHandler},
{addr:CASINO_POKER_CARDINFO_ADDR_1, h:chooseCombHandler},
{addr:CASINO_POKER_COMBINE_RESULT, h:combResultHandler},
{addr:CASINO_POKER_DOUBLE_START, h:chooseHL},
{addr:CASINO_POKER_DOUBLE_RESULT, h:hlResult}
];

////quest address handler setting
var MY_PAGE = "http://game.granbluefantasy.jp/user/content/index";
var QUEST_MATCHER = "http://game.granbluefantasy.jp/quest/content/*";
var QUEST_FEATURE = "http://game.granbluefantasy.jp/quest/content/_index/1/0";
var QUEST_FEATURE1 = "http://game.granbluefantasy.jp/quest/content/newindex/1/";
var QUEST_FAVORITE = "http://game.granbluefantasy.jp/quest/content/_index/0/1";
var QUEST_START = "http://game.granbluefantasy.jp/quest/check_quest_start/";
var QUEST_SUPPORT = "http://game.granbluefantasy.jp/quest/content/supporter/"
var QUEST_DECK = "http://game.granbluefantasy.jp/deckcombination/deck_combination_group_list";

var MULTI_START = "http://game.granbluefantasy.jp/multiraid/start.json";
var MULTI_BATTLESTART = "http://game.granbluefantasy.jp/multiraid/multi_member_info";

var BATTLE_ATTACKRESULT = "http://game.granbluefantasy.jp/multiraid/normal_attack_result";
var BATTLE_SKILLRESULT = "http://game.granbluefantasy.jp/multiraid/ability_result";
var BATTLE_RESULT = "http://game.granbluefantasy.jp/resultmulti/data";

var SHORT_TIME = 10000;
var MEDIUM_TIME = 30000;
var LONG_TIME = 60000;

var questAddrHLMap=[
{addr:MY_PAGE, h:toQuest},
{addr:QUEST_FEATURE, h:toTargetQuests},
{addr:QUEST_FEATURE1, h:toTargetQuests},
{addr:QUEST_FAVORITE, h:showInfo},
{addr:QUEST_START, h:checkQuestStart},
{addr:QUEST_SUPPORT, h:chooseSupporter},
{addr:QUEST_DECK, h:chooseDeck},
{addr:MULTI_START, h:recodBattleInfo},
{addr:MULTI_BATTLESTART, h:startBattle},
{addr:BATTLE_ATTACKRESULT, h:nextTurn},
{addr:BATTLE_SKILLRESULT, h:checkEnd},
{addr:BATTLE_RESULT, h:checkResult}
];

var TiamatVH = "300041";
var ColossusVH = "300091";
var LeviathanVH = "300151";
var YggdrasilVH = "300191";
var AdversaVH = "300221";
var CelesteVH = "300251";

var targetQuests=[TiamatVH, ColossusVH, LeviathanVH, YggdrasilVH, AdversaVH, CelesteVH];

var battlePlan = {
isBackUp:false,
skillList:
[
[[1,4],[2,1],[4,2],[4,1],[3,2]]//round0
]
};
//temporary code to transfer 1 based index to 0 based index.
for(var i=0;i<battlePlan.skillList.length;i++){
	var round = battlePlan.skillList[i];
	for(var j=0;j<round.length;j++){
		round[j][0]--;
		round[j][1]--;
	}
}

var battleInfo = {};


//settings here:
var set_play_casino = true;
var set_play_little_islander = true;

////core functions
chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
  		var httpRequest = request.request;
	  	if(httpRequest.url.includes(GBF_ADDR)){
	  		if(set_play_casino&&httpRequest.url.match(CASINO_MATCHER)){
	  			url2handler(request, casinoAddrHLMap);
	  		} else {
	  			url2handler(request, questAddrHLMap);
	  		}
	  	}
	}
);

//wrap handler for debugging...
function contentHandler(content, encode, handler){
	infoDiv.innerText = content;
	handler(content, encode);
}

function url2handler(request, addr_hl_map){
	var httpRequest = request.request;
	mainDiv.innerText = httpRequest.url;
	for(var i=0; i<addr_hl_map.length; i++){
		addr_h = addr_hl_map[i]
		if(httpRequest.url.includes(addr_h.addr)){
			request.getContent(function(content, encode){contentHandler(content, encode, addr_h.h);});
			break;//why not foreach? because we can't do break in foreach!
		}
	}
}

function passMessage(msg){
	agencyConn.postMessage(msg, function(response){console.log(response);});
}


//debug handler-----------------------------------------------------------------------------------
function showInfo(content, encode){
	var jobj = JSON.parse(content);
	if(jobj.data){
		infoDiv.innerText = decodeURIComponent(jobj.data);
	} else {
		infoDiv.innerText = decodeURIComponent(jobj);
	}
}

//router------------------------------------------------------------------------------------------
function toQuest(content, encode){
	showInfo(content, encode);
	passMessage({type:"mainMenu", data:"quest", timeLimit:SHORT_TIME});
}

function toTargetQuests(content, encode){
	showInfo(content, encode);
	passMessage({type:"targetQuests", data:targetQuests, timeLimit:SHORT_TIME});
}

function checkQuestStart(content, encode){
	var questInfo = JSON.parse(content);
	if(questInfo.result=="ok"){
		passMessage({type:"questStart", data:"ok", timeLimit:SHORT_TIME});
	}
}

function chooseSupporter(content, encode){
	passMessage({type:"chooseSupporter", data:{attr:"dark", supporter:["Bahamut"]}, timeLimit:MEDIUM_TIME});
}

function chooseDeck(content, encode){
	passMessage({type:"chooseDeck", data:1, timeLimit:MEDIUM_TIME});
}

function recodBattleInfo(content, encode){
	battleInfo = JSON.parse(content);
}

function startBattle(content, encode){
	passMessage({type:"combat", 
		data:{
			isBackUp:battlePlan.isBackUp,
			skillList:battlePlan.skillList[0]
		},
		timeLimit:LONG_TIME
	});
}

function nextTurn(content, encode){
	var skillList = [];
	var battleInfo = JSON.parse(content);
	var turn = battleInfo.status.turn-1;
	if(turn<battlePlan.skillList.length){
		skillList = battlePlan.skillList[turn];
	}
	if(!checkEnd(content, encode)){
		passMessage({type:"combat", 
			data:{
				skillList:skillList
			},
			timeLimit:LONG_TIME
		});
	}
}

function checkEnd(content, encode){
	var battleInfo = JSON.parse(content);
	var scenario = battleInfo.scenario;
	for(var i=0;i<scenario.length;i++){
		if(scenario[i].cmd&&scenario[i].cmd=="win"){
			passMessage({type:"combatEnd", data:"win", timeLimit:MEDIUM_TIME});
			return true;
		}
	}
	return false;
}

function checkResult(content, encode){
	infoDiv.innerText = content;
	passMessage({type:"combatResult", data:{}, timeLimit:MEDIUM_TIME});
}

//router------------------------------------------------------------------------------------------

//casino------------------------------------------------------------------------------------------
function chooseCombHandler(content, encode){
	var cardInfo = JSON.parse(content);
	var cardArray = [];
	if(cardInfo.card_list['1']){//card_list exits, combine card!
		for(var i = 1; i<=5; i++){
			cardArray.push(cardInfo.card_list[i.toString()]);
		}
		cardInfo.card_list = cardArray;
		var choosed = casino_poker_ai(cardInfo);
		passMessage({type:"keepCard",data: choosed, timeLimit:SHORT_TIME});
	} else {
		passMessage({type:"combineResult",data: 'lose', timeLimit:SHORT_TIME});//trick
	}
}
//get keep card result
function combResultHandler(content, encode){
	var result = JSON.parse(content);
	passMessage({type:"combineResult", data: result.result, timeLimit:SHORT_TIME});
}
//choose high or low
function chooseHL(content, encode){
	var card = JSON.parse(content);
	var hl = casino_poker_ai_HL(card.card_first);
	passMessage({type:"chooseHL", data: hl, timeLimit:SHORT_TIME});
}
//get high or low result
function hlResult(content, encode){
	var result = JSON.parse(content);
	passMessage({type:"doubleResult", data: result.result, flag: result.next_game_flag, timeLimit:SHORT_TIME});
}
//casino------------------------------------------------------------------------------------------

//islenderVH--------------------------------------------------------------------------------------
