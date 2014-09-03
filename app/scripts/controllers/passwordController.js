define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template');

	var Controller = function(eventId) {
		this.namespace = "password";
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		
	};

	Controller.prototype.findPassword=function(){
		var userName=$("#userName").val();
	};
	module.exports = Controller;
});