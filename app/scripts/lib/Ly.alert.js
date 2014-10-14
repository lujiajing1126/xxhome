define(function(require, exports, module) {
	var $ = SUI.$;

	var Alert = function() {
		this.options = {
			position: null // 默认居中
		};
		this.callback = null;
	};
	Alert.prototype.init = function(type, message, options, callback, errorCallback) {
		var _this = this;
		_this.type = type;
		_this.message = message;
		_this.options = $.extend(_this.options, options);
		_this.callback = callback;
		_this.errorCallback = errorCallback || null;
	};
	Alert.prototype.createHTML = function() {
		var footerHtml, html, messageBox,
			type = this.type,
			title = this.options.title || '校校提示',
			yesText = this.options.yesText || '确定',
			noText = this.options.noText || '取消';

		if (type == "alert")
			footerHtml = '<button class="ly-btn ly-btn-yes width-p-100">' + yesText + '</button>';
		else if (type == "confirm")
			footerHtml = '<button class="ly-btn ly-btn-yes width-p-50">' + yesText + '</button><button class="ly-btn ly-btn-no width-p-50">' + noText + '</button>';

		messageBox = $('<div class="ly-message-box-contaner"></div>');
		html = ['<div class="ly-message-box">',
			'<div class="ly-message-box-header">',
			title,
			'</div>',
			'<div class="ly-message-box-body">',
			this.message,
			'</div>',
			'<div class="ly-message-box-footer">',
			footerHtml,
			'</div>',
			'</div>'
		].join('');
		messageBox.html(html);
		this.messageBox = messageBox;
		this.eventListener();
	};
	Alert.prototype.eventListener = function() {
		var _this = this,
			type = _this.type;
		_this.messageBox.on('click', '.ly-btn-yes', function() {
			_this.messageBox.animate({
				top: -1000
			}, 200, function() {
				_this.callback && $.isFunction(_this.callback) && _this.callback();
				_this.messageBox.off('click').remove();
			});
		});
		if (type == 'confirm') {
			_this.messageBox.on('click', '.ly-btn-no', function() {
				_this.messageBox.animate({
					top: -1000
				}, 200, function() {
					_this.messageBox.off('click').remove();
					_this.errorCallback && $.isFunction(_this.errorCallback) && _this.errorCallback();
				});
			});
		}
	};
	/**
	 * 要使用callback函数必须先传options，以后在优化
	 */
	Alert.prototype.render = function(type, message, options, callback, errorCallback) {
		this.init(type, message, options, callback, errorCallback);
		this.createHTML();
		this.messageBox.appendTo(document.body);
	};

	exports.alert = function(message, options, callback) {
		(new Alert()).render("alert", message, options, callback);
	};
	exports.confirm = function(message, options, successCallback, errorCallback) {
		(new Alert()).render("confirm", message, options, successCallback, errorCallback);
	};
});