define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		Helper = require('scripts/public/helper');
	var Controller = function() {
		this.namespace = "homepage";
		this.actions = {
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;
		Helper.eventListener("click",_controller.actions);
		Helper.eventListener("touchstart",_controller.actions);
		Helper.userStatus();
	};
	module.exports = Controller;
});