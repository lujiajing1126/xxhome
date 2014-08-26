define(function(require, exports, module) {
    // Define Scope Vars
    var $ = SUI.$,
        Q = require("sui/async/q"),
        throttle = function(method, delay) { // 节流函数
            var timer = null;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    method.apply(context, args);
                }, delay);
            }
        },
        emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/,
        moneyReg = /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/, //金额
        intReg = /^[0-9]+$/, //整型
        intNullReg = /^[0-9]*$/, //整形可为空
        rtrimReg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, //去除字符串两侧的空格
        typeOf = function(type) {
            return function(obj) {
                return ({}).toString.call(obj) === "[object " + type + "]";
            }
        },
        typeOfNumber = typeOf("Number"),
        homepage = '/index.html';
    // Require Things
    require('sui/core/cookie');
    $.test = function() {
        alert("test");
    };
    $.ajaxErrorHandler = function(error) {
        seajs.log(error);
    };
    $.goHome = function(msg) {
        if (msg)
            alert(msg);
        window.location.href = homepage;
    },
    /**
     * 弹出Mailbox
     */
    $.expand = function() {
        var $mailbox = $('div.mailbox');
        $mailbox.css('height', $(window).height());
        $mailbox.stop().animate({
            top: '0px'
        }, {
            easing: 'easeOutBounce',
            duration: 1000
        });
        $('body').css({
            'overflow-y': 'hidden'
        });
        $mailbox.data('status', 'open');
        $('div.mailbox').trigger('expand.mailbox');
    };
    /**
     * 收起Mailbox
     */
    $.contract = function() {
        var $mailbox = $('div.mailbox');
        $mailbox.stop().animate({
            top: '-' + window.innerHeight + 'px'
        }, 'fast');
        $('body').css({
            'overflow-y': 'scroll'
        });
        $mailbox.data('status', 'closed');
    };
    /**
     * fixed:为函数添加返回值，以便程序判断是否应该继续向下执行
     */
    /**
     * [单个表单验证方法]
     * @param  {String} value         [表单的值]
     * @param  {String} rules         [表单的验证规则]
     * @param  {Function} fnCallback    [正确的处理方法]
     * @param  {Function} errorCallback [错误的处理方法]
     */
    $.formValid = function(value, rules, fnCallback, errorCallback) {
        var result = true;
        value = $.trim(value);
        rules = rules.split('|');
        $.each(rules, function(k, v) {
            if (result) {
                switch (v) {
                    // 验证规则
                    case 'email':
                        if (!emailReg.test(value))
                            result = false;
                        break;
                    case 'require':
                        if (!value)
                            result = false;
                        break;
                    case 'number':
                        if (!typeOfNumber(value))
                            result = false;
                        break;
                    case 'money':
                        if (!moneyReg.test(value))
                            result = false;
                        break;
                    case 'int':
                        if (!intReg.test(value))
                            result = false;
                        break;
                    case 'intNull':
                        if (!intNullReg.test(value))
                            result = false;
                        break;
                    case 'notNum':
                        if ($.isNumeric(value))
                            result = false;
                        break;
                }
            }
        });
        if (!result) {
            $.isFunction(errorCallback) && errorCallback();
            return false;
        } else {
            $.isFunction(fnCallback) && fnCallback();
            return true;
        }
    };
    /**
     * 验证表单，并在所有表单验证正确的时候返回表单数据
     * @param  {String} sel     [表单选择器]
     * @param  {Object} options [其他需要传输的对象]
     * @return {Boolean|Object} [当错误时返回false，正确时返回所有的对象]
     */
    $.getFormData = function(sel, options) {
        var $form = $(sel),
            data = {},
            error = false,
            dataArray = $form.serializeArray();
        $form.find("[data-validate-rule]:not(.hide)").each(function(k, v) {
            var _val = $(v).val(),
                _rule = $(v).attr("data-validate-rule");
            $.formValid(_val, _rule, function() {}, function() {
                error = true;
            });
        });
        !error && $.map(dataArray, function(obj) {
            if (/\[\]$/.test(obj.name)) { // 处理checkbox,radio等name后面带[]的情况
                var tmpName = obj.name.match(/^(.*)\[\]$/, "")[1];
                if (!data.hasOwnProperty(tmpName))
                    data[tmpName] = [];
                data[tmpName].push($.isNumeric(obj.value) ? +obj.value : obj.value);
            } else if (obj.name.indexOf("->") != -1) { // 强类型转换,处理
                var result = obj.name.match(/^(.*)(\-\>(.*))/),
                    tmpName = result[1],
                    type = result[3];
                switch (type) {
                    case 'String':
                        data[tmpName] = "" + obj.value;
                        break;
                    case 'Integer':
                        data[tmpName] = +obj.value;
                        break;
                    default:
                        data[tmpName] = "" + obj.value;
                        break;
                }
            } else {
                // Name start with * will not be considered
                // 忽略以*开始的name的字段
                // 默认做自动类型转换，数字为数字，文本为String
                if (!(obj.name.charCodeAt(0) == 42))
                    // data[obj.name] = $.isNumeric(obj.value) ? +obj.value : obj.value;
                    // fixed:默认为string，若需要Integer则需要设定name="AAA->Integer"
                    data[obj.name] = obj.value;
            }
        });
        options && seajs.log(options);
        options && $.each(options, function(k, v) {
            if (v.length < 1)
                error = true;
        });
        return error ? false : $.extend(data, options);
    };
    /**
     * 获取Session，常用于没有Session存在的情况，如登陆，注册
     * @return {Q Promise}
     */
    $.getSession = function() {
        $.removeCookie('userSession');
        return $.globalResponseHandler({
            url: "/api/session/create",
            type: "POST",
            dataType: "JSON"
        }).then(function(data) {
            seajs.log(data);
            return data.session;
        }, function(error) {
            seajs.log(error);
        });
    };
    /**
     * 全局异步请求处理器
     * @required Q.js jQuery
     * @param {Object} data [Ajax参数]
     * @param {Boolean} options [传true会跳到homepage]
     * @example
     * {
     *     url: '/api/session/create',
     *     type: 'post',
     *     dataType: 'json'
     * }
     * @return {Q Promise} [200返回代码，handle函数处理服务器返回的异常;其他错误抛出WebService错误]
     */
    $.globalResponseHandler = function(data, options) {
        var handle = function(data) {
            switch (data.status) {
                case 'OK':
                    return data;
                    break;
                case 'Error':
                    throw data.message;
                    break;
                case 'Expired':
                    /**
                     * Fix Bug: 修复由于path导致的无法清除cookie的问题
                     */
                    $.removeCookie("userSession", {
                        path: '/'
                    });
                    window.location.href = homepage;
                    break;
                case 'CAPTCHA':
                    throw "对不起，您请求过于频繁，请输入验证码后再试";
                    break;
                case 'Not Logged In':
                    $.removeCookie("userSession", {
                        path: '/'
                    });
                    window.location.href = homepage;
                    break;
                case 'Permission Denied':
                    throw "Permission Denied";
                    break;
                case 'Inconsistent Argument':
                    // Bug Track
                    throw "Inconsistent Argument";
                    break;
                default:
                    throw data;
                    break;
            }
        };
        return Q($.ajax(data)).then(function(data) {
            return handle(data);
        }, function(error) {
            seajs.log(error);
            /*
            if(options)
                window.location.href = homepage;
            else
                history.go(-1);
            */
            throw "Web Service Error";
        });

    };

    /**
     * 全局提示
     * @param  {string} msg   [tips msg]
     * @param  {int} delay [提示信息存在时间]
     * @return {null}       [no return]
     */
    $.xxMsg = function(msg, type, delay) {
        // var msg_box = document.createElement('div');
        // var h = '<div class="msg-wrapper"><div class="alert alert-' + type + ' fade in" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button> ' + msg + '</div></div>';
        // $(msg_box).addClass("alert-msg").html(h).appendTo('body');
        // if (delay) {
        //     setTimeout(function() {
        //         $(msg_box).animate({
        //             top: -100
        //         }, 1000, function() {
        //             $(msg_box).remove();
        //         });
        //     }, delay);
        // }

        $.gritter.add({
            text: msg,
            time: delay
        });
    };
    $.errMsg = function(msg, delay) {
        $.xxMsg(msg, 'danger', delay);
    };

    $.successMsg = function(msg, delay) {
        $.xxMsg(msg, 'success', delay);
    }
    /*
     * indexOfArr返回数组arr中arrKey为value的元素的索引值
     * @param value：比较的值
     * @param arr：数组对象
     * @param arrKey：数组对象key
     */
    $.indexOfArr = function(value, arr, arrKey) {
        var index = -1;
        $(arr).each(function(idx, item) {
            if (item[arrKey] == value)
                index = idx;
        });
        return index;
    };

    /**
     * 移除
     */
    Array.prototype.remove = function(item) {
        var index = this.indexOf(item);
        return this.splice(index, 1);
    };

    /**
     * 按钮ajax操作开始
     */
    $.btnAjaxStart = function(btn, text) {
        var oText = btn.text();
        btn.data("data-text", oText);
        text = text || '处理中...';
        btn.text(text).siblings('.btn').addBack().attr('disabled', 'disabled');
    };
    $.btnAjaxEnd = function(btn, text) {
        text = text || btn.data("data-text") || "确定";
        btn.text(text).siblings('.btn').addBack().removeAttr('disabled');
    };

    /**
     * 上传插件
     */
    $.uploadFile = function() {
        
    }

    exports.throttle = throttle;
});