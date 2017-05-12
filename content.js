var BreakException = {};
var global_timer_list = [];

var POKER_OK_BTN_CLASS = "prt-ok";
var POKER_START_BTN_CLASS = "prt-start";
var POKER_YES_BTN_CLASS = "prt-yes";
var POKER_HL_BTN_CLASS = "prt-double-select";

var POKER_CHOOSE_CARD_LAST_ELEM="prt-navigation show";

var poker_pos = 
[[0.1, 0.6],
[0.3,0.6],
[0.5,0.6],
[0.7,0.6],
[0.9,0.6]];

var MAIN_QUEST_BTN_CLASS = "prt-link-quest";

var randomWaitTime = 20;
var clickInterval = 70;
var randomInterval = 20;
var randomClickPos = 15;

var EVENT_ELEM = 2;
var HTML_ELEM = 1;
var CANVAS_ELEM = 0;

var poker_last = 
{
name:POKER_CHOOSE_CARD_LAST_ELEM,
btnType:HTML_ELEM,
needClick:false,
};

var attr2type = {
	fire: "icon-supporter-type-1 btn-type",
	water: "icon-supporter-type-2 btn-type",
	earth: "icon-supporter-type-3 btn-type",
	wind: "icon-supporter-type-4 btn-type",
	light: "icon-supporter-type-5 btn-type",
	dark: "icon-supporter-type-6 btn-type",
	misc: "icon-supporter-type-7 btn-type"
}

var attr2Num = {
	fire : "1",
	water: "2",
	earth: "3",
	wind: "4",
	light: "5",
	dark: "6",
	misc: "7"
}

//click function for canvas board
function simBoardClick(x, y, board, event){
	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	var randx = Math.random()*randomClickPos-randomClickPos/2,
	    randy = Math.random()*randomClickPos-randomClickPos/2;
	var boardRect = board.getBoundingClientRect();
	x=randx+boardRect.left+x*boardRect.width;
	y=randy+boardRect.top+y*boardRect.height;
	console.log("x = "+x+", y = " +y);
	var ev = new MouseEvent(event,{
		clientX: x,
		clientY: y,
		button: 0,
		buttons:1,
	});
    ev.isTrusted = true;
    board.dispatchEvent(ev);
}

//click function for html elements
function simClick(board){
	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	var randx = Math.random()*randomClickPos-randomClickPos/2,
	    randy = Math.random()*randomClickPos-randomClickPos/2;
	var domRect = board.getBoundingClientRect();
	var x=randx+domRect.left+domRect.width/2;
	var y=randy+domRect.top+domRect.height/2;

	var md = new MouseEvent("mousedown",{
		clientX: x,
		clientY: y,
		button: 0,
		buttons:1,
	    'view': window,
	    'bubbles': true,
	    'cancelable': true
	});
	var mu = new MouseEvent("mouseup",{
		clientX: x,
		clientY: y,
		button: 0,
		buttons:1,
	    'view': window,
	    'bubbles': true,
	    'cancelable': true
	});
	board.dispatchEvent(md);
	setTimeout(function(){
		board.dispatchEvent(mu);
	},40+Math.random()*5);
    
}

/*
btns=[btn, btn, btn, btn];
btn:{
	name,//class id in html
	waitTime,//min 100, min interval 20(see randomWaitTime),
	btnType, //"htmlElem" or "canvas", event signal	
	needClick, // need to be clicked
	needCheck, // need to be checked
	straight, //ready will be ture when straight element is checked to be ture, regardless other element
	event, //mouseup, mosedown...etc...	
}	
*/
function waitAndClick(btns, maxClick){
	var checkTimer = setInterval (deal, 200, btns);
	function deal(btns){
		var ready = checkDom(btns);
		if(ready){
			clearInterval (checkTimer);
			var clicknums = 0;
			for(var i=0;i<btns.length;i++){
				var btn = btns[i];
				if(btn.needClick){
					var waitTime = btn.waitTime+Math.random*randomWaitTime;
					if(btn.btnType==HTML_ELEM){
						var pdom = document;
						if(typeof btn.parent!="undefined"){
							pdom = document.getElementsByClassName(btn.parent)[0];
						}
						btn.elem = pdom.getElementsByClassName(btn.name)[0];
						if(btn.elem&&!isHidden(btn.elem)){
							setTimeout(function(btn){
								simClick(btn.elem);
							}, waitTime, btn);
							clicknums++;
							if(typeof btn.needCheck!='undefined'&&clicknums>=maxClick){
								return;
							}
						}
					} else {//canvas
						var board = document.getElementById("canv");
						setTimeout(function(btn){
							simBoardClick(btn.pos[0], btn.pos[1], board, btn.event);
						}, waitTime, btn)
					}
				}
			}
		}
	}
}
function findExact(celems,btn){
	var elems = [];
   	for(var i=0;i<celems.length;i++){
   		if(celems[i].className&&celems[i].className==btn.name){
   			elems.push(celems[i]);
   			break;
   		}
   	}
   	return elems;	
}
function checkDom(btns){
	var ready = true;
	for(var i=0;i<btns.length;i++){
		btn = btns[i];
		if(btn.btnType==HTML_ELEM){
			if(typeof btn.straight!='undefined'&&btn.straight){
				var elems = document.getElementsByClassName(btn.name);
			   	if (elems.length!=0&&!isHidden(elems[0])){
			   		ready = true;
			   		break;
			   	}
			}
		   	if(typeof btn.needCheck=='undefined'||btn.needCheck){
		   	   var elems = null;
		   	   if(typeof btn.excatly!='undefined'&&!btn.excatly){
		   	   		elems = document.getElementsByClassName(btn.name);
		   	   } else {
		   	   		elems = findExact(document.getElementsByClassName(btn.name), btn); 
		   	   }
			   
			   if (elems.length==0||isHidden(elems[0]))
			   		ready = false;
		   	}
		}
	}
	return ready;
}

function checkDomByName(btns){
	var doms = [];
	btns.forEach(function(btnName){
		doms.push({name:btnName,
				   btnType:HTML_ELEM
				  })
	});
	return checkDom(doms);
}

//for buttons in list, you need to provide a handler whitch can return the target view
function waitAndClickList(targetHandler){
	var args = toArray(arguments);
	var checkTimer = setInterval (deal, 200, targetHandler, args.slice(1));
	global_timer_list.push(checkTimer);
	function deal(targetHandler, args){
		var btn = targetHandler(...args);
		if(btn!=null){
			clearInterval (checkTimer);
			var waitTime = 200+Math.random*randomWaitTime;
			setTimeout(function(btn){
				simClick(btn);
			}, waitTime, btn);
		}
	}
}

//array like object(arguments, HTMLCollections...) to array
function toArray(object){
	return [].slice.call(object);
}

//Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}


function initRound(){
	skillnum=0; 
	state=0;
	clickTimerStart = false;
	clickTimer = 0;
	firstTry = true;
	checkTimer = 0;
}

////get instruction from panel!
var reloadTimer = 0;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(reloadTimer!=0){
	  clearTimeout(reloadTimer);
	}
	initRound();
	initMenuRoute();
	handleRequest(request, sender, sendResponse);
	if(request.timeLimit>0){
	    reloadTimer = setTimeout(function(){
	  		handleRequest(request, sender, sendResponse);
	  	}, request.timeLimit);//automactilly canceled if get message within specifict time.
	}
});

function handleRequest(request, sender, sendResponse){
	switch(request.type){
  		case "keepCard": playCombineCard(request.data); break;
  		case "combineResult": playNext(request.data);break;
  		case "chooseHL": chooseHighLow(request.data);break;
  		case "doubleResult": 
  		if(request.flag){
  			playNext(request.data);
  		} else {
  			playNext('lose');//trick, when we cannot win any more, we start again.
  		}
  		break;
  		case "mainMenu":mainClick(request.data);break;
  		case "targetQuests":listToTargetQuest(request.data);break;
  		case "targetEvent": toTargetEvent(request.data);break;
  		case "questStart":clickOk();break;
  		case "chooseSupporter": chooseSupporter(request.data.attr, request.data.supporter);break;
  		case "chooseDeck":chooseDeck(request.data);break;
  		case "combat": if(typeof request.data.isBackUp!='undefined'){
  							combatBackUp(request.data.isBackUp, request.data.skillList).then(combat);
  						} else {
  							comBatContinue(request.data.skillList).then(combat);
  						} break;
  		case "combatEnd": clickEnd();break;
  		case "combatResult" : backToQuest(); break;
  		case "select_all": selectAll();break;
  		case "stop":global_timer_list.forEach(function(t){clearInterval(t)}); 
  					global_timer_list.length = 0;
  					break;
  		case "reload":location.reload(true);break;
  	}
    sendResponse({farewell: "goodbye"});
}

function sendMsg(state, data){
	chrome.runtime.sendMessage({state:state, data:data});
}

//select all-------------------------------------------------------------------------------------
var WEAPON_SELL_URL = "http://game.granbluefantasy.jp/#sell";
function selectAll(){
	var href = window.location.href;
	console.log("select all href: "+href);
	if(href.includes(WEAPON_SELL_URL)){
		var weaponList = document.getElementById("lis-weapon");
		var weapons = weaponList.children;
		for(var i=0;i<weapons.length;i++){
			setTimeout(simClick, i*250, weapons[i]);
		}
	}
}

//select all-------------------------------------------------------------------------------------

//route------------------------------------------------------------------------------------------
function mainClick(btn){
	if(btn == "quest"){
		waitAndClick([{
			name: MAIN_QUEST_BTN_CLASS,
			btnType:HTML_ELEM,
			needClick:false
		},
		{
			name: "btn-link-quest raid se-ok",
			waitTime:2000,
			btnType:HTML_ELEM,
			needClick:true,
			needCheck:false		
		},
		{
			name: "btn-link-quest se-ok",
			waitTime:2000,
			btnType:HTML_ELEM,
			needClick:true,
			needCheck:false		
		},
		{
			name: "prt-assault-time",
			waitTime:2000,
			btnType:HTML_ELEM,
			needClick:true,
			needCheck:false		
		}
		], 1);
	} else if(btn.includes("event")){
		var checkTimer = setInterval(deal, 200)
		function deal(){
			var banners = document.getElementsByClassName("lis-banner");
			var bannerDom = null;
			for(var i=0;i<banners.length;i++){
				var c = banners[i].getElementsByClassName("btn-banner")[0];
				if(c&&c.hasAttribute("data-location-href")&&c.getAttribute("data-location-href")==btn){
					bannerDom = c;
					break;
				}
			}
			if(bannerDom!=null){
				clearInterval(checkTimer);
				simClick(bannerDom);
			}
		}
	}
}

function listToTargetQuest(targetQuests){
	waitAndClickList(findTargetQuest, targetQuests);
}

//multi-level menu quest selection
var menuLevel=0, menuTimerCount=0;
function initMenuRoute(){
	menuLevel=0;
	menuTimerCount=0;
}
function toTargetEvent(data){
	var checkTimer = setInterval(deal, 200);
	function deal(){
		if(menuTimerCount==0){
			if(data[menuLevel].type == "single"){
				waitAndClick([{name:data[menuLevel].name,
							   btnType:HTML_ELEM,
							   needClick:true,
							   waitTime:200}],1);
			} else {
				var btns = document.getElementsByClassName(data[menuLevel].name);
				var targetBtn = null;
				for(var b=0;b<btns.length;b++){
					if(btns[b].hasAttribute(data[menuLevel].targetAttr)
					   &&btns[b].getAttribute(data[menuLevel].targetAttr)==data[menuLevel].id){
						targetBtn = btns[b];
					}
				}
				if(targetBtn!=null){
					simClick(targetBtn);
					clearInterval(checkTimer);
				}
			}
		}
		if(menuTimerCount>=3){
			if(menuLevel<data.length-1&&checkDom([{name:data[menuLevel].check, btnType:HTML_ELEM}])){
				menuLevel++;
			}
		}
		menuTimerCount++;
		menuTimerCount=menuTimerCount%5;
	}
}

function chooseSupporter(attr, supporter){
	var attrdiv = attr2type[attr];
	waitAndClick([
	{
		name: attrdiv+" unselected",
		btnType:HTML_ELEM,
		needClick:false,
		straight:true	
	},
	{
		name: attrdiv+" selected unselected",
		btnType:HTML_ELEM,
		needClick:false,
		straight:true	
	},
	{
		name: attrdiv+" selected",
		btnType:HTML_ELEM,
		needClick:false,
		straight:true	
	},
	{
		name: attrdiv+" unselected",
		waitTime:2000,
		btnType:HTML_ELEM,
		needClick:true,
		needCheck:false	
	},
	{
		name: attrdiv+" selected unselected",
		waitTime:2000,
		btnType:HTML_ELEM,
		needClick:true,
		needCheck:false	
	},
	{
		name: attrdiv+" selected",
		waitTime:2000,
		btnType:HTML_ELEM,
		needClick:true,
		needCheck:false	
	}
	],1);

	waitAndClickList(findSupporter, attr2Num[attr], supporter);

}

function findSupporter(attrNum, supporter){
	var supporterAttrList = toArray(document.getElementsByClassName("btn-supporter lis-supporter"));
	var candidates = [];
	for(var i=0;i<supporterAttrList.length;i++){
		var listdiv = supporterAttrList[i];
		if(listdiv.hasAttribute("data-attribute")&&listdiv.getAttribute("data-attribute")==attrNum){
			candidates.push(listdiv);
		}
	}
	var supportElem = null;
	for(var i=0;i<candidates.length;i++){
		var detail = candidates[i].getElementsByClassName("prt-supporter-detail")[0];
		var summon = detail.getElementsByClassName("prt-supporter-summon")[0];
		for(var j=0;j<supporter.length;j++){
			if(summon.innerText.includes(supporter[j])){
				return summon;
			} else if(supportElem = null){
				supportElem = summon;
			}
		}
	}
	return supportElem;
}

var MAX_AP_GAP = 9999;
function findTargetQuest(targetQuests){
	var questsList = toArray(document.getElementsByClassName("prt-list-contents"));
	if(questsList.length==0){
		return null;
	}
	var ans = null;
	var minApGap = MAX_AP_GAP;
	var userStam = 0;
	var totalStam = 0;
	try {
		for(var i=0;i<targetQuests.length;i++){
			questsList.forEach(function(questDiv){
				var questBtns = toArray(questDiv.children);
				questBtns.forEach(function(btn){
					if(btn.hasAttribute("data-quest-id") && btn.getAttribute("data-quest-id") == targetQuests[i]) {
	        			var targetBtn = btn.getElementsByClassName("prt-button-cover")[0];
	        			if(targetBtn&&!isHidden(targetBtn)){
	        				var targetStam = btn.getElementsByClassName("prt-quest-detail")[0]
	        								  .getElementsByClassName("prt-quest-body")[0]
	        								  .getElementsByClassName("prt-quest-description")[0]
	        								  .getElementsByClassName("prt-quest-info")[0]
	        								  .getElementsByClassName("txt-stamina")[0]
	        								  .innerText;
	        				targetStam = parseInt(targetStam.substring(2));
	        				var stamInfo = document.getElementsByClassName("prt-user-stamina")[0]
	        									.getElementsByClassName("txt-stamina-value")[0]["title"];
	        				stamInfo = stamInfo.split('/');
	        				userStam = parseInt(stamInfo[0]);
	        				totalStam = parseInt(stamInfo[1]);
	        				if(targetStam+userStam>=0){
	        					ans = targetBtn;
	        					throw BreakException;
	        				} else {
	        					minApGap = Math.min(-(targetStam+userStam));
	        				}
	        			}
	    			}
				})
			});
		}
	} catch(e){
		if (e !== BreakException) throw e;
	}
	if(ans!=null){
		return ans;
	} else {
		if(minApGap!=MAX_AP_GAP){
			sendMsg("lackStam", {stamGap:minApGap, 
								totalStam:totalStam,
								userStam:userStam,});
		} else {
			sendMsg("noQuestFound",{});
		}
		return null;
	}
	
}

function clickOk(){
	waitAndClick([{
		name: "btn-usual-ok",
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true,	
	}]);
}

function clickGeneral(name){
	waitAndClick([{
		name: name,
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true,	
	}]);	
}

var deckStep = 0;
function chooseDeck(data){
	var checkTimer = setInterval(deal,200);
	var to_deck=0, prevdeck = -1;
	var countTry = 0;
	var decks = null;
	function deal(){
		switch(deckStep){
			case 0: if(checkDom([{name:"lis-deck", btnType:HTML_ELEM}])){
						deckStep++;
					}break;
			case 1: decks = document.getElementsByClassName("lis-deck");
					for(var i=0;i<decks.length;i++){
						if(decks[i].getAttribute("data-deck-name")==data){
							to_deck = parseInt(decks[i].getAttribute("data-index"));
							break;
						}
					}deckStep++;
			case 2:	var current_deck = findExact(decks, {name:"lis-deck flex-active-slide"})[0];
					var cur_index = parseInt(current_deck.getAttribute("data-index"));
						if(prevdeck!=cur_index){
							if(to_deck<cur_index){
								clickGeneral("flex-prev");
							} else if(to_deck>cur_index){
								clickGeneral("flex-next");
							}
							countTry = 0;
						} else {
							countTry++;
						}
						if(to_deck==cur_index){
							clearInterval(checkTimer);
							clickGeneral('btn-usual-ok se-quest-start onm-tc-gbf');
						}
						prevdeck = cur_index;
						if(countTry>10){
							prevdeck = -1;
						}
					break;
		}
	}
}


//route------------------------------------------------------------------------------------------

var backupwindow = {
	name: "pop-usual pop-start-assist pop-show",
	waitTime: 1000,
	btnType:HTML_ELEM,
	needCheck:true
};

var endDiv = {
	name: "prt-command-end",
	btnType:HTML_ELEM,
	needCheck:true,
	needClick:false
}

function clickBackUpCancel(){
	waitAndClick([backupwindow,{
		name: "btn-usual-cancel",
		parent:"pop-usual pop-start-assist pop-show",
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true	
	}]);
}

function clickAttack(){
	waitAndClick([{
		name: "btn-attack-start display-on",
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true	
	}]);
}

function clickEnd(){
	waitAndClick([
		endDiv,
		{
			name: "btn-result",
			waitTime:1000,
			btnType:HTML_ELEM,
			needClick:true,	
		}
		])
}

var okDom = {
	name: "btn-usual-ok",
	waitTime:1000,
	btnType:HTML_ELEM,
};
var okAbilityDom = {
	name: "btn-usual-ok btn-ability-use",
	waitTime:1000,
	btnType:HTML_ELEM,
};

var okSummonDom = {
	name: "btn-usual-ok btn-summon-use",
	waitTime:1000,
	btnType:HTML_ELEM,
};

var cancelDom = {
	name: "btn-usual-cancel",
	waitTime:1000,
	btnType:HTML_ELEM,
};

var cancelAbilityDom = {
	name: "btn-usual-cancel btn-ability-cancel",
	waitTime:1000,
	btnType:HTML_ELEM,
};

var backDom = {
	name: "btn-command-back display-on",
	waitTime:1000,
	btnType:HTML_ELEM,
	straight:true	
};
var backDom1 = {
	name: "btn-command-back display-off display-on",
	waitTime:1000,
	btnType:HTML_ELEM,
	straight:true	
};

var abilityDialog = {
	name: "pop-usual prt-ability-dialog",
	waitTime:1000,
	btnType:HTML_ELEM,
	straight:true	
}

var summonDialog = {
	name:"pop-usual pop-summon-detail",
	waitTime:1000,
	btnType:HTML_ELEM,
	straight:true,
	needClick:false,
	needCheck:true	
}

function combatBackUp(isBackUp, skillList){
	if(isBackUp){
		clickOk();
	} else {
		clickBackUpCancel();
	}
	var canStart = new Promise(function(resolve, reject) {
		var checkTimer = setInterval(checkBackUp, 200);
		var step = 0;
		function checkBackUp(){
		  	if (step==0&&checkDom([backupwindow])) {
		  		step++;
		  	}else if(step==1&&!checkDom([backupwindow])){
		  		clearInterval(checkTimer);
		    	resolve(skillList);
		  	}
	  	}
  	});
  	return canStart;
}

function comBatContinue(skillList){
	var canStart = new Promise(function(resolve, reject) {
		var checkTimer = setInterval(checkBackUp, 200);
		function checkBackUp(){
			var attackBtn = {name: "btn-attack-start display-on",
				 			 btnType:HTML_ELEM};
			if(checkDom([attackBtn])){
				clearInterval(checkTimer);
				resolve(skillList);
			}
		}
	});
	return canStart;
}

var controlArea = {
	name:"prt-button-area",
	btnType: HTML_ELEM,
	needCheck: true,
	needClick: false
}

function clickQuest(){
waitAndClick([
	controlArea,
	{
		name: "btn-control",
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true
	},1]);	
}
//cjs-lp-rankup
function backToQuest(){
	var checkTimer = setInterval(deal,1000);
	function deal(){
		if(checkDom([{name:"btn-usual-close", btnType:HTML_ELEM}])){
			clickGeneral("btn-usual-close");
		} else if(checkDom([{name:"btn-control", btnType:HTML_ELEM}])){
			clickQuest();
		} else if(checkDom([okDom])){
			var container = document.getElementsByClassName("prt-popup-footer")[0];
			if(container!=null&&!isHidden(container)){
				var okbtn = container.getElementsByClassName("btn-usual-ok")[0];
				if(okbtn!=null){
					simClick(okbtn);
				}
			}
		} 
	}
}

//casino------------------------------------------------------------------------------------------
function playCombineCard(keepCard){
	var btns=[];
	for(var i=0;i<keepCard.length;i++){
		if(keepCard[i]){
			btns.push({name:"", 
					   pos:poker_pos[i],
					   waitTime:i*100,
					   btnType:CANVAS_ELEM,
					   needClick:true,
					   event:"mousedown"});
		}
	}
	btns.push({
		name:"prt-ok-shine",
		waitTime:600,
		btnType:HTML_ELEM,
		needClick:true,
	});
	btns.push(poker_last);	
	waitAndClick(btns);
}


function playNext(result){
	if(result=='lose'){//lose, we play again!
		waitAndClick([{
		name:"prt-start-shine",
		waitTime:100,
		btnType:HTML_ELEM,
		needClick:true
		}, poker_last]);	
		//waitAndClick(POKER_CHOOSE_CARD_LAST_ELEM, POKER_START_BTN_CLASS, "prt-start-shine", poker_ok_pos);
	} else if(result=='win'||result=='draw'){//win, go double!
		waitAndClick([{
		name:"prt-yes-shine",
		waitTime:100,
		btnType:HTML_ELEM,
		needClick:true
		}, poker_last]);		
		//waitAndClick(POKER_CHOOSE_CARD_LAST_ELEM, POKER_YES_BTN_CLASS, "prt-yes-shine", poker_yes_pos);
	}
}

function chooseHighLow(choose){
	if(choose=='high'){
		waitAndClick([{
		name:"prt-high-shine",
		waitTime:100,
		btnType:HTML_ELEM,
		needClick:true
		}, poker_last]);
	} else if(choose=='low'){
		waitAndClick([{
		name:"prt-low-shine",
		waitTime:100,
		btnType:HTML_ELEM,
		needClick:true
		}, poker_last]);
	}
}
//casino------------------------------------------------------------------------------------------


