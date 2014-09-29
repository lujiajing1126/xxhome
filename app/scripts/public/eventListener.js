define(function(require, exports, module) {
	var $ = SUI.$;
	exports.eventListener = function(eventName, actions) {
		$(document).on(eventName, "[data-xx-action]", function(evt) {
			evt = evt || window.event;
			var _this = $(this),
				actionName = _this.attr("data-xx-action"),
				action = actions[actionName];
			action && $.isFunction(action) && action.call(_this, evt);
		});
	};
	exports.globalEventListener = function(eventName, dataEventAction, actions) {
		$(document).on(eventName, "[" + dataEventAction + "]", function(evt) {
			evt = evt || window.event;
			var _this = $(this),
				actionName = _this.attr(dataEventAction),
				action = actions[actionName];
			action && $.isFunction(action) && action.call(_this, evt);
		});
	};
});