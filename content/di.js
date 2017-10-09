/*jshint esversion: 6 */

var di = function() {
	'use strict';

	const STARTER = 0;
	const NORMAL = 1;

	var makeGraph = function(nodes, name) {
		var graph = new c.Head({nodeName:name});
		var map = {};
		map.start = graph;
		var depInj = function(obj, options) {
			for (var key in obj) {
				if (key.includes('State')) {
					continue;
				}
				var keyname = key;
				if (key.substring(0, 2) == '__') {
					keyname = keyname.substring(2);
					if (u.isUndef(options[keyname])) {
						throw 'Undefined necessary key :' + key + 'in: ' + JSON.stringify(options);
					}
					obj[key] = options[keyname];
				} else if (key.charAt(0) == '_') {
					keyname = key.substring(1);
					if (u.isUndef(options[keyname])) {
						continue;
					}
					obj[key] = options[keyname];
				}
			}
			return obj;
		};

		nodes.forEach(function(act) {
			var action = depInj(Reflect.construct(da[act.action.class], []), act.action.options);
			if (!u.isUndef(action.check)) {
				act.nodeClass = 'Branch';
				act.options.checker = action;
			} else if (!u.isUndef(action.execute)) {
				act.nodeClass = 'Sequential';
				act.options.executor = action;
			} else {
				throw 'Unknown Action ' + act.action.class;
			}
		});

		nodes.forEach(function(val) {
			var node = depInj(Reflect.construct(c[val.nodeClass], []), val.options);
			if (val.di_type === STARTER) {
				graph.subsequentState = node;
			}
			map[node.nodeName] = node;
		});

		nodes.forEach(function(act) {
			var node = map[act.options.nodeName];
			for (var key in node) {
				if (key.includes('State')) {
					var keyname = key.substring(1);
					if (!u.isUndef(act.options[keyname])) {
						node[key] = map[act.options[keyname]];
					}
				}
			}
		});

		return graph;
	};

	var NodeHelper = class {
		constructor(prefix = '') {
			this.prefix = prefix;
			this.nodes = [];
			this.curNode = null;
		}
		assembleName(name){
			return this.prefix+' '+name;
		}
		addNode(nodeName, actionClass, actionOptions = {}, nodeOptions = {}, di_type = NORMAL) {
			nodeOptions.nodeName = this.assembleName(nodeName);
			for(var key in nodeOptions){
				if(key.includes('State')){
					nodeOptions[key] = this.assembleName(nodeOptions[key]);
				}
			}
			var node = {
				di_type: di_type,
				options: nodeOptions,
				action: {
					class: actionClass,
					options: actionOptions
				}
			};
			this.nodes.push(node);
			return node;
		}
		addAndSetCurNode() {
			this.curNode = this.addNode(...arguments);
		}
		linkNextNode(nodeName, actionClass, actionOptions = {}, nodeOptions = {}, di_type = NORMAL, state='subsequentState') {
			var node = this.addNode(...arguments);
			if (this.curNode !== null) {
				this.curNode.options[state] = node.options.nodeName;
			}
			this.curNode = node;
		}
		linkCheckAndClickNode(nodeName, domName, starter = false, actionClass = 'DownUpBtn') {
			this.linkNextNode('Check ' + nodeName, 'CheckDomByClass', { domName: domName }, {}, starter ? STARTER : NORMAL);
			this.linkNextNode('Click ' + nodeName, actionClass, { domName: domName });
		}
	};

	return {
		makeGraph: makeGraph,
		NodeHelper: NodeHelper,
		STARTER: STARTER,
		NORMAL: NORMAL
	};
}();