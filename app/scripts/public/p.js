define(function(require, exports, module) {
	var XX = {},
		$ = SUI.$;
	
	XX.trim = function(string) {
		return $.trim(string);
	};
	/*
	 * indexOfArr返回数组arr中arrKey为value的元素的索引值
	 * @param value：比较的值
	 * @param arr：数组对象
	 * @param arrKey：数组对象key
	 */
	XX.indexOfArr = function(value, arr, arrKey) {
		var index = -1;
		$(arr).each(function(idx, item) {
			if (item[arrKey] == value)
				index = idx;
		});
		return index;
	};
	XX.errMsg = function(msg, delay) {
		var $ = SUI.$;
		var msg_box = document.createElement('div');
		var h = '<div class="msg-wrapper"><div class="alert alert-danger fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button> ' + msg + '</div></div>';
		$(msg_box).addClass("alert-msg").html(h).appendTo('body');
		if (delay) {
			setTimeout(function() {
				$(msg_box).animate({
					top: -100
				}, 1000, function() {
					$(msg_box).remove();
				});
			}, delay * 1000);
		}
	};
	XX.ajax = function(url, data, type, success, error) {
		SUI.$.ajax({
			type: type,
			url: url,
			data: data,
			success: function(request) {
				success(request);
			},
			error: function(msg) {
				error(msg);
			}
		});
	};

	XX.validate = {
		handler: function(validate_func, success_func, error_func) {
			if (validate_func()) {
				return success_func();
			} else {
				return error_func();
			}
		},
		regexp: function(input, re, wrapperClass) {
			wrapperClass = wrapperClass || "input-group";
			var $ = SUI.$;
			var $input = $(input);
			var inputValue = $input.val()

			var v_func = function() {
				return re.test(inputValue);
			}
			var s_func = function() {
				$input.parents('.' + wrapperClass + ":first").removeClass("has-error").addClass('has-success');
				return true;
			}
			var e_func = function() {
				var placeholder = $input.attr("placeholder") || "",
					err_placeholder = $input.attr("data-tips") || placeholder;
				$input.attr('placeholder', err_placeholder).val('').one("focus.revalue", function() {
					$(this).val(inputValue);
				}).parents('.' + wrapperClass + ":first").removeClass("has-success").addClass('has-error');
				return false;
			}
			return this.handler(v_func, s_func, e_func);
		},
		required_01: function(input, wrapperClass) {
			var reString = /[^\s]+/;
			return this.regexp(input, reString, wrapperClass);
		},
		money: function(input, wrapperClass) {
			var reMoney = /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/;
			return this.regexp(input, reMoney, wrapperClass);
		},
		numberNull: function(input, wrapperClass) {
			var reNumber = /^[0-9]*$/;
			return this.regexp(input, reNumber, wrapperClass);
		},
		number: function(input, wrapperClass) {
			var reNumber = /^[0-9]+$/;
			return this.regexp(input, reNumber, wrapperClass);
		},
		email: function(input, wrapperClass) {
			var reEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return this.regexp(input, reEmail, wrapperClass);
		}

	};
	XX.getNav = function(totalPage, currentPage, hash) {
		var navs = [];
		var sIndex, eIndex;
		if (totalPage == 1) {
			return navs;
		} else if (currentPage <= 3) {
			sIndex = 1;
			eIndex = totalPage > 5 ? 5 : totalPage;
		} else {
			eIndex = totalPage > currentPage + 2 ? currentPage + 2 : totalPage;
			sIndex = eIndex - 4;
		}
		for (var i = sIndex; i <= eIndex; i++) {
			var href = "#" + hash + "?page=" + i;
			if (i == currentPage)
				navs.push('<li class="active"><a>' + i + '</a></li>');
			else
				navs.push('<li><a href="' + href + '">' + i + '</a></li>');
		}
		return navs;
	};


	XX.ArrEx = function(data, length) {
		var arr=[];
		for (var i = 0; i < length; i++) {
			var d={};
			for (var o in data) {
				d[o]=data[o]+i;
			}
			arr.push(d);
		}
		return arr;
	};

	module.exports = XX;
});