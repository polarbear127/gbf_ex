/*jshint esversion: 6 */
(function(app) {
	var msg_conn = app.msg_conn;
	var setting = app.setting_constant;
	var ctrl = app.control_constant;
	var dom = app.dom;

	var getStamTime = function(stam) {
		return stam * 5 * 60 * 1000;
	};

	var countDownTimer = null;

	var countDown = function(time, callback) {
		var targetTime = new Date().getTime() + time;
		if (countDownTimer !== null) {
			clearInterval(countDownTimer);
		}
		countDownTimer = setInterval(function() {
			var now = new Date().getTime();
			var distance = targetTime - now;
			if (distance < 0) {
				clearInterval(countDownTimer);
				countDownTimer = null;
				callback();
				return;
			}
			var hours = Math.floor(distance / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			dom.show('timer', hours + "h " + minutes + "m " + seconds + "s ");
		}, 1000);
	};

	var clearCountDown = function(){
		if(countDownTimer !==null){
			clearInterval(countDownTimer);
			dom.show('timer', "");
		}
	};

	msg_conn.addMsgListener('lackStam', msg => {
		msg_conn.passMessage(ctrl.stop);
		var stamTime = 0;
		switch (setting.WAIT_ENOUGH) {
			case setting.WAIT_FULL:
				stamTime = getStamTime(msg.data.totalStam - msg.data.curStam);
				break;
			case setting.WAIT_TIME:
				stamTime = getStamTime(app.waitStam);
				break;
			case setting.WAIT_ENOUGH:
				stamTime = getStamTime(msg.data.stamGap);
				break;
			default:
				console.log('unknown wait mode: ' + app.waitMode);
				return;
		}
		countDown(stamTime, msg_conn.passMessage.bind(null, ctrl.reload));
	});

	msg_conn.addMsgListener('noQuestFound', ()=>{
		msg_conn.passMessage(ctrl.stop);
		dom.show('timer', 'noQuestFound');
	});

	msg_conn.addMsgListener('noQuestFound', ()=>{
		msg_conn.passMessage(ctrl.stop);
		dom.show('timer', 'noSupporterFound');
	});

	var msg_handlers = {clearCountDown:clearCountDown};
	app.msg_handlers = msg_handlers;
})(window.app || (window.app));