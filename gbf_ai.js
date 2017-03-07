function casino_poker_ai(cardInfo){
	var JOKER = {color:99, num:99};
	var cards_s = cardInfo.card_list;
	var cards = [];//treat 1 as 14
	var index = 0;
	cards_s.forEach(function(c_s){
		c = c_s.split('_');
		c = [parseInt(c[0]), parseInt(c[1])];
		cards.push({color:c[0], num:c[1], index:index, choosed: false});
		index++;
	});
	function cardComparator(c1, c2){
		if(c1.num-c2.num!=0){
			return c1.num - c2.num;
		} else {
			return c1.color - c2.color;
		}
	}
	cards.sort(cardComparator);

	var answer = [false, false, false, false, false];
	function makeAnswer(cards){
		cards.forEach(function(c){
			if(c.choosed){
				answer[c.index] = true;
			}
		});
		return answer;
	}

	function makeStraightAnswer(cards, start, len){
		for(var i=start;i<start+len;i++){
			cards[i].choosed=true;
		}
		makeAnswer(cards);
		return answer;
	}

	function makeFlushAnswer(cards, color){
		cards.forEach(function(c){
			if(c.color == color){
				c.choosed = true;
			}
		});
		makeAnswer(cards);
		return answer;
	}
	
	//keep joker
	var joker=0;
	cards.forEach(function(card){
		if(card.num==JOKER.num){
			card.choosed = true;
			joker++;
		}
	});

	//full house, two pair, four of a kind, five of a kind
	var keepNum=joker, maxSameKind = 1, sameKind = 1;
	for(var i= 1;i<cards.length;i++){
		if(cards[i-1].num == cards[i].num){
			sameKind++;
			if(!cards[i-1].choosed){
				keepNum++;
			}
			if(!cards[i].choosed){
				keepNum++;
			}
			cards[i].choosed = true;
			cards[i-1].choosed = true;
			maxSameKind = Math.max(sameKind, maxSameKind);
		} else {
			sameKind = 1;
		}
	}
	//two pair with joker(joker, 1, 1, 2, 5)
	if((maxSameKind==2)&&joker>0){
		for(var i= 0;i<cards.length;i++){
			if(!cards[i].choosed){
				cards[i].choosed = true;
				break;
			}
		}
		return makeAnswer(cards);
	}
	if(keepNum>=4){
		return makeAnswer(cards);
	}
	
	//test flush
	var flnum = joker+1, maxflnum=joker+1, color=0;
	for(var i= 1;i<cards.length;i++){
		if(cards[i-1].color == cards[i].color&&cards.color!=JOKER.color){
			flnum++;
			if(flnum>maxflnum){
				maxflnum = flnum;
				color = cards[i].color;
			}
		}
	}
	if(maxflnum==5){
		for(var i= 0;i<cards.length;i++){
			cards[i].choosed = true;
		}
		return makeAnswer(cards);
	}

	//test straight
	function isStraight(cards){
		var jokernum = joker;
		var maxlen = 1, maxstart = 0, len=1, start=0;
		for(var i=1;i<cards.length;i++){
			if(cards[i].num - cards[i-1].num == 1){
				len++;
				if(len>maxlen){
					maxlen = len;
					maxstart = start;
				}
			} else if((cards[i].num-cards[i-1].num==2&&jokernum>0)){
				jokernum--;
				len++;//plus joker
				if(len>maxlen){
					maxlen = len;
					maxstart = start;
				}				
			}else {
				start = i;
				len = 1;
				jokernum = joker;
			}
		}
		return {start:maxstart, maxlen:maxlen};
	}
	var cards_14=[];
	cards.forEach(function(c){
		cards_14.push({color:c.color, num:c.num==1?14:c.num, index:c.index, choosed: c.choosed});
	});
	cards_14.sort(cardComparator);
	var s1 =  isStraight(cards), s14 = isStraight(cards_14);
	if(s1.maxlen==5||s14.maxlen==5){
		for(var i= 0;i<cards.length;i++){
			cards[i].choosed = true;
		}
		return makeAnswer(cards);
	}

	//no hit
	if(s14.maxlen>s1.maxlen){
		s1=s14;
		cards = cards_14;
	}
	if(keepNum>=2){
		return makeAnswer(cards);
	} else if(s1.maxlen>maxflnum&&s1.maxlen>3){
		return makeStraightAnswer(cards, s1.start, s1.maxlen);
	} else if(maxflnum>=3){
		return makeFlushAnswer(cards, color);
	}
	return makeAnswer(cards);
}

function casino_poker_ai_HL(card){
	var num = card.split('_')[1];
	num = num==1?14:num;
	if(num>8){
		return 'low';
	} else {
		return 'high';
	}
}


/*var tests1=
[
{card_list:["1_1","1_10","1_11","1_12","1_13"],
 answer:[true, true, true, true, true]},//royal straight flush
{card_list:["1_1","1_10","1_11","1_12","99_99"],
 answer:[true, true, true, true, true]},//royal straight flush with joker
{card_list:["99_99","1_10","1_11","1_12","1_13"],
 answer:[true, true, true, true, true]},//royal straight flush with joker
{card_list:["1_1","2_1","3_1","4_1","99_99"],
 answer:[true, true, true, true, true]},//five of a kind
{card_list:["1_1","1_2","1_3","1_4","1_5"],
 answer:[true, true, true, true, true]},//flush straight
{card_list:["1_1","1_2","1_3","1_4","99_99"],
 answer:[true, true, true, true, true]},//flush straight with joker
{card_list:["1_1","2_1","3_1","4_1","1_5"],
 answer:[true, true, true, true, false]},//four of a kind
{card_list:["1_1","2_1","3_1","99_99","1_5"],
 answer:[true, true, true, true, false]},//four of a kind with joker
{card_list:["1_1","2_1","3_2","4_2","2_2"],
 answer:[true, true, true, true, true]},//full house
{card_list:["1_1","2_1","3_2","4_2","99_99"],
 answer:[true, true, true, true, true]},//full house with joker
{card_list:["1_1","1_5","1_7","1_9","1_11"],
 answer:[true, true, true, true, true]},//flush
{card_list:["1_1","1_5","1_7","1_9","99_99"],
 answer:[true, true, true, true, true]},//flush with joker
{card_list:["2_1","1_2","3_3","4_4","2_5"],
 answer:[true, true, true, true, true]},//straight
{card_list:["2_1","1_2","3_3","4_4","99_99"],
 answer:[true, true, true, true, true]},//straight with joker
{card_list:["2_1","1_1","3_1","4_4","2_5"],
 answer:[true, true, true, false, false]},//three of a kind
{card_list:["2_1","1_1","3_3","4_4","99_99"],
 answer:[true, true, true, false, true]},//three of a kind with joker
{card_list:["2_1","1_1","3_2","4_2","2_5"],
 answer:[true, true, true, true, false]},//two pair
{card_list:["2_1","1_1","3_2","4_4","99_99"],
 answer:[true, true, true, false, true]},//two pair with joker, we choose smaller if both work
{card_list:["2_1","1_1","3_2","4_4","4_5"],
 answer:[true, true, false, false, false]},//1 pair
{card_list:["2_1","1_2","3_3","4_7","4_9"],
 answer:[true, true, true, false, false]},//3 straight
{card_list:["2_1","1_2","3_3","4_4","4_9"],
 answer:[true, true, true, true, false]}//4 straight
];*/

/*tests2 = [
{card_list:["1_3","2_5","3_9","4_12","99_99"],
 answer:[false, false, false, false, true]},//4 straight
{card_list:["2_1","1_2","3_3","4_4","4_9"],
 answer:[true, true, true, true, false]}//4 straight
]

tests2.forEach(function(test){
	console.log(test.card_list);
	var testans = casino_poker_ai(test);
	console.log(testans);
	var result = true;
	for(var i=0;i<testans.length;i++){
		if(testans[i]!=test.answer[i]){
			result = false;
		}
	}
	if(result){
		console.log('%c'+result, 'background: green');
	} else {
		console.log('%c'+result, 'background: red');
	}
});*/
