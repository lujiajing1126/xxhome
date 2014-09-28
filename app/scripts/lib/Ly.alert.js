define(function(require, exports, module) {
	var $ = SUI.$;

	var Alert = function() {
		this.options = {
			position: null // 默认居中
		};
		this.callback = null;
	};
	Alert.prototype.init = function(message, options, callback) {
		var _this = this;
		_this.message = message;
		_this.options = $.extend(_this.options, options);
		_this.callback = callback;
	};
	Alert.prototype.createHTML = function() {
		var messageBox = $('<div class="ly-message-box-contaner"></div>');
		var html = ['<div class="ly-message-box">',
			'<div class="ly-message-box-header">',
			this.options.title || '校校提示',
			'</div>',
			'<div class="ly-message-box-body">',
			this.message,
			'</div>',
			'<div class="ly-message-box-footer">',
			'<button class="ly-btn ly-btn-yes width-p-100">确定</button>',
			'</div>',
			'</div>'
		].join('');
		messageBox.html(html);
		this.messageBox = messageBox;
		this.eventListener();
	};
	Alert.prototype.eventListener = function() {
		var _this = this;
		this.messageBox.on('click', '.ly-btn-yes', function() {
			_this.messageBox.animate({
				top: -1000
			}, 200, function() {
				_this.callback && $.isFunction(_this.callback) && _this.callback();
				_this.messageBox.off('click').remove();
			});
		});
	};
	/**
	 * 要使用callback函数必须先传options，以后在优化
	 */
	Alert.prototype.render = function(message, options, callback) {
		this.init(message, options, callback);
		this.createHTML();
		this.messageBox.appendTo(document.body);
	};

	exports.alert = function(message, options, callback) {
		(new Alert()).render(message, options, callback)
	};
});