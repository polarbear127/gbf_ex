/*jshint esversion: 6 */
//fast deep copy of a object

var u = {
	deepCopy: function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	//array like object(arguments, HTMLCollections...) to array
	toArray: function(object) {
		return [].slice.call(object);
	},
	//Where el is the DOM element you'd like to test for visibility
	isHidden: function(el) {
		var style = window.getComputedStyle(el);
		return (style.display === 'none');
	},

	isUndef: function(obj) {
		return typeof obj == 'undefined';
	},

	lxor: function(a, b) {
		return a ? (!b) : b;
	},
	/**
	 * find needle in array
	 * https://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
	 *
	 * @param      {value}  needle  anything as long as comparable
	 * @return     {bool}  true if the array contains the needle, false otherwise.
	 */
	contains: function(needle) {
		// Per spec, the way to identify NaN is that it is not equal to itself
		var findNaN = needle !== needle;
		var indexOf;

		if (!findNaN && typeof Array.prototype.indexOf === 'function') {
			indexOf = Array.prototype.indexOf;
		} else {
			indexOf = function(needle) {
				var i = -1,
					index = -1;

				for (i = 0; i < this.length; i++) {
					var item = this[i];

					if ((findNaN && item !== item) || item === needle) {
						index = i;
						break;
					}
				}

				return index;
			};
		}
		return indexOf.call(this, needle) > -1;
	}
};