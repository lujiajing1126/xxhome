define(function(require,exports,module){
	require("sui/core/cookie");
	var storage = window.localStorage,
		localstorage = null,
		removeStorage = null;
	if(Modernizr.localstrage){
		// HTML5
		localstrage = function(key,value,options) {
			if(!value) {
				storage.getItem(key);
			} else {
				storage.setItem(key,value);
			}
		};
		removeStorage = function(key) {
			if(key)
				storage.removeItem(key);
			else
				storage.clear();
		};
	} else {
		// For those browsers do not support HTML LocalStrage
		seajs.log("Your browsers do not support localStorage");
		localstrage = function() {
			return $.cookie.apply(this,arguments);
		};
		removeStorage = function() {
			return $.removeCookie.apply(this,arguments);
		};

	}
	exports.storage = localstrage;
	exports.removeStorage = removeStorage;
});