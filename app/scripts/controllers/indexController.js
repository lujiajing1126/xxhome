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
		$(document).on("click", "[data-xx-action]", function() {
			var fn = $(this).attr("data-xx-action");
			_controller.actions[fn] && $.isFunction(_controller.actions[fn]) && _controller.actions[fn].call(this);
		});
		$(document).on("touchstart", "[data-xx-action]", function() {
			var fn = $(this).attr("data-xx-action");
			_controller.actions[fn] && $.isFunction(_controller.actions[fn]) && _controller.actions[fn].call(this);
		});
	};
	module.exports = Controller;
});