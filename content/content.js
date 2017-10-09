/*jshint esversion: 6 */
var BreakException = {};
var global_timer_list = [];

var randomWaitTime = 20;
var clickInterval = 70;
var randomInterval = 20;
var randomClickPos = 15;
var randomClickPos_small = 5;

var EVENT_ELEM = 2;
var HTML_ELEM = 1;
var CANVAS_ELEM = 0;

var attr2type = {
	fire: "icon-supporter-type-1 btn-type",
	water: "icon-supporter-type-2 btn-type",
	earth: "icon-supporter-type-3 btn-type",
	wind: "icon-supporter-type-4 btn-type",
	light: "icon-supporter-type-5 btn-type",
	dark: "icon-supporter-type-6 btn-type",
	misc: "icon-supporter-type-7 btn-type"
};

var attr2Num = {
	fire : "1",
	water: "2",
	earth: "3",
	wind: "4",
	light: "5",
	dark: "6",
	misc: "0"
};

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

function simDOMClick(board){
	var doc = document.documentElement;
	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
	var randx = Math.random()*randomClickPos-randomClickPos/2,
	    randy = Math.random()*randomClickPos-randomClickPos/2;
	var domRect = board.getBoundingClientRect();
	var x=randx+domRect.left+domRect.width/2;
	var y=randy+domRect.top+domRect.height/2;

	var md = new MouseEvent("click",{
		clientX: x,
		clientY: y,
		button: 0,
		buttons:1,
	    'view': window,
	    'bubbles': true,
	    'cancelable': true
	});

	board.dispatchEvent(md);
    
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
								if(typeof btn.eventType!="undefined"&&btn.eventType=="click"){
									simDOMClick(btn.elem);
								} else {
									simClick(btn.elem);
								}
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
	if(reloadTimer!==0){
	  clearTimeout(reloadTimer);
	}
	global_timer_list.forEach((timer)=>{
		clearInterval(timer);
	});
	global_timer_list.length = 0;
	initRound();
	handleRequest(request, sender, sendResponse);
	if(request.timeLimit>0){
	    reloadTimer = setTimeout(function(){
	  		handleRequest(request, sender, sendResponse);
	  	}, request.timeLimit);//automactilly canceled if get message within specifict time.
	}
});

function handleRequest(request, sender, sendResponse){
	switch(request.type){
  		case "keepCard": casino.playCombineCard(request.data); break;
  		case "combineResult": casino.playNext(request.data);break;
  		case "chooseHL": casino.chooseHighLow(request.data);break;
  		case "doubleResult": 
  		if(request.flag){
  			casino.playNext(request.data);
  		} else {
  			casino.playNext('lose');//trick, when we cannot win any more, we start again.
  		}
  		break;
  		case "mainMenu":mainClick(request.data);break;
  		case "targetQuests":route.findTargetQuest(request.data);break;
  		case "targetEvent": toTargetEvent(request.data);break;
  		case "questStart":clickOk();break;
  		case "chooseSupporter": chooseSupporter(request.data.attr, request.data.supporter);break;
  		case "chooseDeckGroup": beforeBattle.chooseDeckGroup(request.data);break;
  		case "chooseDeck":chooseDeck(request.data);break;
  		case "stage":route.skipStage();break;
  		case "combat": if(typeof request.data.isBackUp!='undefined'){
  							combatBackUp(request.data.isBackUp, request.data.skillList).then(combat);
  						} else {
  							comBatContinue(request.data.skillList).then(combat);
  						} break;
  		case "combatEnd": clickEnd();break;
  		case "combatResult" : backToQuest(); break;
  		case "select_all": selectAll();break;
  		case "stop":global_timer_list.forEach(function(t){clearInterval(t);}); 
  					global_timer_list.length = 0;
  					break;
  		case "reload":location.reload(true);break;
  	}
    sendResponse({farewell: "goodbye"});
}

function sendMsg(state, data){
	chrome.runtime.sendMessage({state:state, data:data});
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
	for(i=0;i<candidates.length;i++){
		var detail = candidates[i].getElementsByClassName("prt-supporter-detail")[0];
		var summon = detail.getElementsByClassName("prt-supporter-summon")[0];
		for(var j=0;j<supporter.length;j++){
			var summonInfo = summon.innerText.match("Lvl\\s(\\d+)\\s"+supporter[j]);
			if(summonInfo !== null){
				return summon;
			}
		}
	}
	return supportElem;
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

function clickGeneral_DOM(name){
	waitAndClick([{
		name: name,
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true,
		eventType:"click"	
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
								clickGeneral_DOM("flex-prev");
							} else if(to_deck>cur_index){
								clickGeneral_DOM("flex-next");
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
};

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
		]);
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
};

var summonDialog = {
	name:"pop-usual pop-summon-detail",
	waitTime:1000,
	btnType:HTML_ELEM,
	straight:true,
	needClick:false,
	needCheck:true	
};

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
		  	if (step===0&&checkDom([backupwindow])) {
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
};

function clickQuest(){
waitAndClick([
	controlArea,
	{
		name: "btn-control",
		waitTime:1000,
		btnType:HTML_ELEM,
		excatly:false,
		needClick:true
	},1]);	
}
//cjs-lp-rankup
function backToQuest(){
	var checkTimer = setInterval(deal,1000);
	global_timer_list.push(checkTimer);
	function deal(){
		if(checkDom([{name:"btn-usual-close", btnType:HTML_ELEM}])){
			clickGeneral("btn-usual-close");
		} else if(checkDom([{name:"btn-control", excatly:false, btnType:HTML_ELEM}])){
			clickQuest();
		} else if(checkDom([okDom])){
			var container = document.getElementsByClassName("prt-popup-footer")[0];
			if(container!==null&&!isHidden(container)){
				var okbtn = container.getElementsByClassName("btn-usual-ok")[0];
				if(okbtn!==null){
					simClick(okbtn);
				}
			}
		} 
	}
}