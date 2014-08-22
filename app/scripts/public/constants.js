define(function(require,exports,module){
	var APP_DEBUG = true,
	appConstants = {
		apiHost: APP_DEBUG?'/apiTest/':'/api/',
	}
	exports.appConst = appConstants;
});