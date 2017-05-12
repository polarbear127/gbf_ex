//combat
var auto_lock = "btn-lock lock0";
var auto_hold = "btn-lock lock1";
var summon_top = "prt-list-top btn-command-summon summon-on";
var summon_list = "prt-summon-list opened";//find pos=6;
var summons = "lis-summon on btn-summon-available";
var portion_open = "btn-temporary";
var portion_menu = "prt-select-item";
var green_portion = "lis-item item-small btn-temporary-small ";
var blue_portion = "lis-item item-large btn-temporary-large";// disable if equal zero

var portion_choose = "txt-confirm";//click chara, wait for attack show up

var btn_usual_use = "btn-usual-use";
var btn_attack = "btn-attack-start display-on";
var icon_diagram = "img-diagram display-on";
var btn_cancel = "btn-usual-cancel";

var skillnum, state, clickTimerStart, clickTimer, firstTry, checkTimer;

function lxor(a, b){
	return a? (!b):b;
}

function findHealChara(){
	var minHp = -1;
	var chara = null;
	for(var cr=0;cr<4;cr++){
		var charaDomName = "lis-character" + cr + " btn-command-character";
		var characterDiv = document.getElementsByClassName(charaDomName)[0];
		if(characterDiv!=null){
			var charaHpGaugeDom = characterDiv.getElementsByClassName("prt-gauge-hp")[0]
										   .getElementsByClassName("prt-gauge-hp-inner")[0];
			var charaHpGauge = parseFloat(charaHpGaugeDom.style.width)/100;
			if(charaHpGauge!=1.0){
				var hp = parseInt(characterDiv.getElementsByClassName("txt-hp-value")[0].innerText);
				if(minHp<0||minHp>hp){
					minHp = hp;
					chara = charaDomName;
				} 
			}
		}
	}
	return chara;
}

function checkPrtUsable(){
	return !document.getElementsByClassName(txt-select-chara)[0].innerText.includes("This can't be used on any members");
}

//combat per round
function combat(skillList){
	if(checkTimer==0){
		checkTimer = setInterval (deal, 200, skillList);
	}
	var skilldom = buildSkill(skillList);
	function deal(skillList){
		if(skillnum == skillList.length){
			clearInterval(checkTimer);
			checkTimer = 0;
			
			clickAttack();
			
			state = 4;
			//click attack
		} else if(skilldom[skillnum].type == -1){
			switch(state){
				case 0: 
					var r1 = checkDomByName([auto_lock]);
					var r2 = checkDomByName([auto_hold]);
					if(lxor(r1, r2)){
						if((skilldom[skillnum].state == 0&&r1)||(r2&&skilldom[skillnum].state == 1)) {
							skillnum++;
							if(!firstTry){
								reset();
							}
						} else {
							if(firstTry||!clickTimerStart){
								if(r1){
									clickGeneral(auto_lock);
								} else if(r2){
									clickGeneral(auto_hold);
								}
								start();
							}
						}
					}

			}
		} else if(skilldom[skillnum].type == -2){
			switch(state){
				case 0: if(firstTry||!clickTimerStart){
							clickGeneral(portion_open);
							start();
						} else if(checkDomByName([portion_menu])){
							state++;
							reset();
					}break;
				case 1: if(firstTry||!clickTimerStart){
							clickGeneral(skilldom[skillnum].prt_name);
							start();
						} else if(checkDomByName([portion_choose])){
							state++;
							reset();
						}break;
				case 2: if(skilldom[skillnum].prt_type==0){
							var chara = findHealChara();
							if(chara!=null){
								if(firstTry||!clickTimerStart){
									clickGeneral(chara);
									start();
								} else if(!checkDomByName([portion_choose])){
									state++;
									reset();
								}
							} else {
								clickGeneral(btn_cancel);
								state = 4;
							}
						} else if(skilldom[skillnum].prt_type==1){
							if(!checkPrtUsable()){
								clickGeneral(btn_cancel);
								state = 4;
							} else {
								if(firstTry||!clickTimerStart){
									clickGeneral(btn_usual_use);
									start();
								} else if(!checkDomByName([btn_attack])){
									state++;
									reset();
								}
							}
						}break;
				case 3: if(checkDomByName([icon_diagram])){
							skillnum++;
							state = 0;
						}break;
				case 4: if(!checkDomByName([portion_choose])){
							state = 3;
						}break;
			}
		} else if(skilldom[skillnum].type == 6){
			if(state!=2){
				if(checkDom([okDom])){
					clickOk();
					return;
				}
			}
			switch(state){
			case 0://open summon
				if(firstTry||!clickTimerStart){
					simClick(skilldom[skillnum].character);
					start();
				} else if(checkDom([skilldom[skillnum].skillDivCheckDom])){
					state++;
					reset();
				}break;
			case 1://choose summon
				if(firstTry||!clickTimerStart){
					simClick(skilldom[skillnum].skill);
					start();
				} else if(checkDom([summonDialog, okSummonDom])){
					state++;
					reset();
				} else if(!checkDom([skilldom[skillnum].skillDivCheckDom])){
					state--;
					reset();
				}break;
			case 2://ok
				if(firstTry||!clickTimerStart){
					if(checkDom([summonDialog, okSummonDom])){
						clickGeneral(okSummonDom.name);
					} 
					start();
				} else if(!checkDom([summonDialog])){
					state = 0;
					skillnum++;
					reset();
				}break;
			}

		}  else if(skilldom[skillnum].type == 1){
			if(state!=2){
				if(checkDom([okDom])){
					clickOk();
					return;
				}
			}
			switch(state){
			case 0://character
				if(firstTry||!clickTimerStart){
					simClick(skilldom[skillnum].character);
					start();
				} else if(checkDom([skilldom[skillnum].skillDivCheckDom])){
					state++;
					reset();
				}break;
			case 1://skill
				if(firstTry||!clickTimerStart){
					simClick(skilldom[skillnum].skill);
					start();
				} else if(checkDom([okAbilityDom])||checkDom([cancelAbilityDom])){
					state++;
					reset();
				} break;
			case 2://ok
				if(firstTry||!clickTimerStart){
					if(checkDom([okAbilityDom])){
						clickGeneral(okAbilityDom.name);
					} else if(checkDom([cancelAbilityDom])){
						clickGeneral(cancelAbilityDom.name);
					}
					start();
				} else if(!checkDom([abilityDialog])){
					//keep in current character if there is any other skill that need to be used.
					if(skillnum<skillList.length-1
						&&skilldom[skillnum].character==skilldom[skillnum+1].character){
						skillnum++;
						state = 1;
					} else {
						state++;
					}
					reset();
				} break;
			case 3://back
				if(firstTry||!clickTimerStart){
					clickBack();
					start();
				} else if(skillnum<skillList.length
					&&skilldom[skillnum].characterDivDom.name==skilldom[skillnum].character.className){
					state=0;
					skillnum++;
					reset();
				} break;
			}
		}
	}
	function start(){
		clickTimerStart = true;
		firstTry = false;
		clickTimer=setTimeout(function(){clickTimerStart=false;}, 1000);
	}
	function reset(){
		clearTimeout(clickTimer);
		clickTimerStart = false;
		firstTry = true;		
	}
}

/*
skillList

[character1, skill1, condition1], [character2, skill2, condition2],...]
[[1,4],[2,1],[4,2][4,1],[3,2]]
*/
function buildSkill(skillList){
	var skilldom=[];
	for(var act = 0; act < skillList.length; act++){
		if(skillList[act][0]==-1){//chain attack
			skilldom.push({type:-1, state:skillList[act][1]});
			continue;//handle on time
		} else if(skillList[act][0]==-2){//portion
			var prt=null;
			switch(skillList[act][1]){
				case 0: prt=green_portion;break;
				case 1: prt=blue_portion;break;
			}
			skilldom.push({type:-2, prt_type:skillList[act][1], prt_name:prt });
			continue;
		} else if(skillList[act][0]==6){//summon
			var sk = skillList[act][1];
			var characterDiv = document.getElementsByClassName(summon_top)[0];
			var skills = document.getElementsByClassName(summons);
			var choosedSummon = null;
			for(var i=0;i<skills.length;i++){
				if(skills[i].hasAttribute("pos")&&parseInt(skills[i].getAttribute("pos"))==skillList[act][1]+1){
					choosedSummon = skills[i];
				}
			}
			skilldom.push({type:6, character:characterDiv, skill: choosedSummon,
				skillDivCheckDom:{
					name: summon_list,
					btnType:HTML_ELEM
				}
			});
			continue;
		}
		var cr = skillList[act][0], sk = skillList[act][1];
		var characterDiv = document.getElementsByClassName("lis-character" + cr + " btn-command-character")[0];
		var skillDivs = document.getElementsByClassName("lis-character"+cr);
		var skillDiv = skillDivs[0], iter = 1;
		while((skillDiv.className!=("lis-character"+cr))&&iter<skillDivs.length){
			skillDiv = skillDivs[iter];
			iter++;
		}
		while(skillDiv.className!='prt-ability-list'){
			skillDiv = skillDiv.nextSibling;
		}
		skillDiv = skillDiv.children[sk];
		skilldom.push({type:1,character: characterDiv, skill: skillDiv,
					characterDivDom: {
						name: "lis-character" + cr + " btn-command-character",
						btnType:HTML_ELEM
					},
					skillDivCheckDom: {
						name: "prt-command-chara chara"+(cr+1),
						btnType:HTML_ELEM
					}});
	}
	return skilldom;
}

function clickBack(){
	waitAndClick([{
		name: "btn-command-back display-off display-on",
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true,
		straight:true	
	},
	{
		name: "btn-command-back display-on",
		waitTime:1000,
		btnType:HTML_ELEM,
		needClick:true,
		straight:true	
	}], 1);
}