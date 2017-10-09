/*jshint esversion: 6 */

var da = function() {
	'use strict';

	var getDomPos = function(dom) {
		var domRect = dom.getBoundingClientRect();
		var x = domRect.left + domRect.width / 2;
		var y = domRect.top + domRect.height / 2;
		return {
			x: x,
			y: y
		};
	};

	var ClickBtn = class extends d.MouseAction {
		constructor(options = {}) {
			super(options);
		}

		static click(dom, randPos = d.MouseAction.default().randPos) {
			var me = new MouseEvent(EVENT_CLICK, d.makeMouseEventProp(getDomPos(dom), randPos));
			dom.dispatchEvent(me);
		}

		execute(pool) {
			ClickBtn.click.call(this, pool[this.domName], this.randPos);
		}
	};

	var DownUpBtn = class extends d.MouseAction {
		static
		default () {
			return {
				interval: 170,
				randInterval: 5
			};
		}

		constructor(options = {}) {
			super(options);
			options = this.makeOp(DownUpBtn, options);
			this._interval = options.interval;
			this._randInterval = options.randInterval;
		}

		get interval() {
			return this._interval;
		}
		set interval(interval) {
			this._interval = interval;
		}

		get randInterval() {
			return this._randInterval;
		}
		set randInterval(randInterval) {
			this._randInterval = randInterval;
		}

		static mouseDownUp(dom, interval = DownUpBtn.default().interval, randInterval = DownUpBtn.default().randInterval,
			randPos = d.MouseAction.default().randPos) {

			var eventProp = d.makeMouseEventProp(getDomPos(dom), randPos);
			var md = new MouseEvent('mousedown', eventProp);
			var mu = new MouseEvent('mouseup', eventProp);
			dom.dispatchEvent(md);
			setTimeout(function() {
				dom.dispatchEvent(mu);
			}, interval + Math.random() * randInterval);
		}

		execute(pool) {
			DownUpBtn.mouseDownUp.call(this, pool[this.domName], this.interval, this.randInterval, this.randPos);
		}
	};

	var getCanvasPos = function(board, position) {
		var boardRect = board.getBoundingClientRect();
		var x = boardRect.left + position[0] * boardRect.width;
		var y = boardRect.top + position[1] * boardRect.height;
		return {
			x: x,
			y: y
		};
	};

	var MouseCanvasAction = class extends d.MouseAction {
		static
		default () {
			return {
				event: 'mousedown'
			};
		}
		constructor(options = {}) {
			super(options);
			options = this.makeOp(MouseCanvasAction, options);
			this.__position = options.position;
			this._event = options.event;
		}

		get event() {
			return this._event;
		}
		set event(event) {
			this._event = event;
		}

		get position() {
			return this.__position;
		}
		set position(position) {
			this.__position = position;
		}

		static executeCanv(board, pos, event = MouseCanvasAction.default().event,
			randPos = d.MouseAction.default().randPos) {

			var ev = new MouseEvent(event, d.makeMouseEventProp(getCanvasPos(board, pos), randPos));
			board.dispatchEvent(ev);
			var ev1 = new MouseEvent('mouseup', d.makeMouseEventProp(getCanvasPos(board, pos), randPos));
			setTimeout(function() {
				board.dispatchEvent(ev1);
			}, 100 + Math.random() * 5);
		}

		execute(pool) {
			MouseCanvasAction.executeCanv.call(this, pool[this.domName], this.position, this.event, this.randPos);
		}
	};

	var CheckDom = class extends d.DomAction {
		constructor(options = {}) {
			super(options);
			this.success = false;
		}
	};

	var CheckDomByClass = class extends CheckDom {
		static
		default () {
			return {
				isExact: true
			};
		}
		constructor(options = {}) {
			super(options);
			options = this.makeOp(CheckDomByClass, options);
			this._isExact = options.isExact;
		}

		get isExact() {
			return this._isExact;
		}
		set isExact(isExact) {
			this._isExact = isExact;
		}

		static checkClass(domName, isExact = CheckDomByClass.default().isExact,
			root = c.Head.default()[d.DomAction.default().scope]) {

			var answers = [];
			var candi = u.toArray(root.getElementsByClassName(domName));
			if (isExact) {
				for (var i = 0; i < candi.length; i++) {
					if (candi[i].className === domName) {
						answers.push(candi[i]);
					}
				}
			} else {
				answers = candi;
			}
			if (answers.length > 0) {
				this.success = true;
			}
			return answers;
		}

		check(pool) {
			var answers = CheckDomByClass.checkClass.call(this, this.domName, this.isExact, pool[this.scope]);
			return this.success ? answers[0] : null;
		}
	};

	var CheckDomById = class extends CheckDom {
		constructor(options = {}) {
			super(options);
		}
		static checkId(domName, root = c.Head.default()[d.DomAction.default().scope]) {
			var answer = root.getElementById(this.domName);
			if (answer !== null) {
				this.success = true;
			}
			return answer;
		}
		check(pool) {
			return CheckDomById.checkId.call(this, this.domName, pool[this.scope]);
		}
	};

	var getLeaves = function(roots, domlevel, level = 0) {
		if (level >= domlevel.length) {
			return roots;
		}
		var nextRoots = (CheckDomByClass.checkClass(domlevel[level], false, roots[0]));
		if (nextRoots.length === 0) {
			return null;
		}
		return getLeaves(nextRoots, domlevel, level + 1);
	};

	var CheckDomByAttr = class extends CheckDom {
		static
		default () {
			return {
				toAttr: [],
			};
		}
		constructor(options = {}) {
			super(options);
			options = this.makeOp(CheckDomByAttr, options);
			this._toAttr = options.toAttr;
			this.__attr = null;
		}

		set toAttr(toAttr) {
			this._toAttr = toAttr;
		}
		get toAttr() {
			return this._toAttr;
		}

		set attr(attr) {
			this.__attr = attr;
		}
		get attr() {
			return this.__attr;
		}

		static checkAttr(domName, attr, toAttr = CheckDomByAttr.default().toAttr,
			root = c.Head.default()[d.DomAction.default().scope]) {

			var list = CheckDomByClass.checkClass(domName, false, root);
			var answers = [];
			for (var ai = 0; ai < attr.vals.length; ai++) {
				for (var i = 0; i < list.length; i++) {
					var d = list[i];
					var t = getLeaves([d], toAttr);
					if (t === null) {
						continue;
					}
					t = t[0];
					if (t.hasAttribute(attr.name) && attr.vals[ai] == t.getAttribute(attr.name)) {
						answers.push(d);
					}
				}
			}
			this.success = answers.length > 0;
			return answers[0];
		}

		check(pool) {
			return CheckDomByAttr.checkAttr.call(this, this.domName, this.attr, this.toAttr, pool[this.scope]);
		}
	};

	var CheckDomCallback = class extends CheckDom {
		static
		default () {
			return {
				callbackArgs: {}
			};
		}
		constructor(options = {}) {
			super(options);
			options = this.makeOp(CheckDomCallback, options);
			this.__callback = options.callback;
			this._callbackArgs = options.callbackArgs;
		}
		set callback(callback) {
			this.__callback = callback;
		}
		get callback() {
			return this.__callback;
		}

		set callbackArgs(callbackArgs) {
			this._callbackArgs = callbackArgs;
		}
		get callbackArgs() {
			return this._callbackArgs;
		}

		check(pool) {
			return this.callback.call(this, this.callbackArgs, pool);
		}
	};

	var PanelReporter = class extends o.Base {
		static
		default () {
			return {
				data: {}
			};
		}
		constructor(options = {}) {
			super(options);
			options = this.makeOp(PanelReporter, options);
			this._data = options.data;
			this.__tag = options.tag;
		}

		set data(data) {
			this._data = data;
		}
		get data() {
			return this._data;
		}

		set tag(tag) {
			this.__tag = tag;
		}
		get tag() {
			return this.__tag;
		}

		static sendMsg(tag, data = {}) {
			chrome.runtime.sendMessage({
				tag: tag,
				data: data
			});
		}

		packData(pool, data) {
			var bag = {};
			for (var key in data) {
				if (key.charAt(0) == '_') {
					var keyname = key.substring(1);
					bag[keyname] = pool[keyname];
				} else {
					bag[key] = data[key];
				}
			}
			return bag;
		}

		execute(pool) {
			PanelReporter.sendMsg(this.tag, this.packData(pool, this.data));
		}
	};

	return {
		ClickBtn: ClickBtn,
		DownUpBtn: DownUpBtn,
		MouseCanvasAction: MouseCanvasAction,
		CheckDomByClass: CheckDomByClass,
		CheckDomById: CheckDomById,
		CheckDomByAttr: CheckDomByAttr,
		CheckDomCallback: CheckDomCallback,
		PanelReporter: PanelReporter,

		getLeaves: getLeaves
	};
}();