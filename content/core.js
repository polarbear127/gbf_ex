/*jshint esversion: 6 */

var o = function() {
	'use strict';
	var Base = class {
		static
		default () {
			return {};
		}
		makeOp(cl, options, ...args) {
			return Object.assign(cl.default(...args), options);
		}
	};
	return {
		Base: Base
	};
}();

var c = function() {
	'use strict';
	const DEBUG = 0;
	var mode = DEBUG;

	var Node = class extends o.Base {
		static
		default () {
			return {
				subsequentState: null,
				headDelay: 200,
				afterDelay: 200,
			};
		}
		constructor(options = {}) {
			super();
			options = this.makeOp(Node, options);
			this._headDelay = options.headDelay;
			this._afterDelay = options.afterDelay;
			this.__nodeName = options.nodeName;
			this._subsequentState = options.subsequentState;
		}

		get nodeName() {
			return this.__nodeName;
		}
		set nodeName(nodeName) {
			this.__nodeName = nodeName;
		}

		get subsequentState() {
			return this._subsequentState;
		}
		set subsequentState(subsequentState) {
			this._subsequentState = subsequentState;
		}

		get afterDelay() {
			return this._afterDelay;
		}
		set afterDelay(afterDelay) {
			this._afterDelay = afterDelay;
		}

		get headDelay() {
			return this._headDelay;
		}
		set headDelay(headDelay) {
			this._headDelay = headDelay;
		}

		action(pool) {
			throw 'action should be defined';
		}
		nextState(pool) {
			throw 'nextState should be defined';
		}
	};

	var Head = class extends Node {
		static default(){
			return{
				document:document,
				window:window
			};
		}
		constructor(options={}) {
			super(options);
			options=this.makeOp(Head, options);
			this.document = options.document;
			this.window = options.window;
		}

		action(pool) {
			pool.document = this.document;
			pool.window = this.window;
			if (mode === DEBUG) {
				console.log("Start " + this.nodeName);
			}
		}
		nextState(pool) {
			return this.subsequentState;
		}
	};
	//executor
	var Sequential = class extends Node {
		constructor(options = {}) {
			super(options);
			this.__executor = options.executor;
		}

		get executor() {
			return this.__executor;
		}
		set executor(executor) {
			this.__executor = executor;
		}

		action(pool) {
			this.executor.execute(pool);
			if (mode === DEBUG) {
				console.log("Sequential " + this.executor.constructor.name + " [" + (this.executor.domName || "-")+"]");
			}
		}

		nextState(pool) {
			return this.subsequentState;
		}
	};

	var Branch = class extends Node {
		static
		default (obj) {
			return {
				thre: 20,
				failState: obj,
				timeoutState: null
			};
		}
		//checker
		constructor(options = {}) {
			super(options);
			options = this.makeOp(Branch, options, this);

			this.__checker = options.checker;
			this._failState = options.failState;
			this._timeoutState = options.timeoutState;
			this._thre = options.thre;

			this.retry = 0;
		}

		get thre() {
			return this._thre;
		}
		set thre(thre) {
			this._thre = thre;
		}

		get checker() {
			return this.__checker;
		}
		set checker(checker) {
			this.__checker = checker;
		}

		get failState() {
			return this._failState;
		}
		set failState(failState) {
			this._failState = failState;
		}

		get timeoutState() {
			return this._timeoutState;
		}
		set timeoutState(timeoutState) {
			this._timeoutState = timeoutState;
		}

		action(pool) {
			var dom = this.checker.check(pool);
			if (this.checker.success) {
				pool[this.checker.domName] = dom;
				this.retry = 0;
			} else {
				this.retry++;
			}
			if (mode === DEBUG) {
				console.log("Branch " +
					this.checker.constructor.name + " [" + this.checker.domName + "]"+
					" result " + this.checker.success +
					" retry" + this.retry);
			}
		}
		nextState(pool) {
			if (this.checker.success) {
				return this.subsequentState;
			} else if (this.retry < this.thre) {
				return this.failState;
			} else {
				this.retry = 0;
				return this.timeoutState;
			}
		}
	};

	var play = function(graph) {
		var pool = {};
		wait(graph);

		function act(node) {
			if (mode === DEBUG) {
				console.log("action-start " + node.nodeName);
			}
			node.action(pool);
			if (mode === DEBUG) {
				console.log("action-finished " + node.nodeName);
			}
			setTimeout(wait, node.afterDelay, node.nextState(pool));
		}

		function wait(node) {
			if (node !== null) {
				setTimeout(act, node.headDelay, node);
			}
		}
	};

	return {
		Node: Node,
		Head: Head,
		Sequential: Sequential,
		Branch: Branch,
		play: play
	};
}();

var d = function() {
	'use strict';
	/**
	 * { Dom related base class.
	 * 	 Necessary Field:
	 * 	 domName,
	 * 	 
	 * 	 Optional Field:
	 * 	 scope<'document'>}
	 *
	 * @type       {class}
	 */
	var DomAction = class extends o.Base {
		static
		default () {
			return {
				scope: 'document'
			};
		}
		constructor(options = {}) {
			super();
			options = this.makeOp(DomAction, options);
			this._scope = options.scope;
			this.__domName = options.domName;
		}

		get scope() {
			return this._scope;
		}
		set scope(scope) {
			this.__scope = scope;
		}

		get domName() {
			return this.__domName;
		}
		set domName(domName) {
			this.__domName = domName;
		}
	};

	var MouseAction = class extends DomAction {
		static
		default () {
			return {
				randPos: [5, 5]
			};
		}
		constructor(options = {}) {
			super(options);
			options = this.makeOp(MouseAction, options);
			this._randPos = options.randPos;
		}

		get randPos() {
			return this._randPos;
		}
		set randPos(randPos) {
			this._randPos = randPos;
		}
	};

	var makeRandPos = function(randPos) {
		return {
			rx: Math.random() * randPos[0] + randPos[0] / 2,
			ry: Math.random() * randPos[1] + randPos[1] / 2
		};
	};

	var makeMouseEventProp = function(pos, randPos = MouseAction.default().randPos) {
		var rpos = makeRandPos(randPos);
		return {
			clientX: pos.x + rpos.rx,
			clientY: pos.y + rpos.ry,
			buttons: 1,
			bubbles: true
		};
	};

	return {
		DomAction: DomAction,
		MouseAction: MouseAction,
		makeMouseEventProp:makeMouseEventProp
	};
}();