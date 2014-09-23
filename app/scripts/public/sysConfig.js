/**
 * define the configuration of this system
 */
define(function(require, exports, module) {
	exports.regulars = {
		phoneNumber: /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,
		email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		password: /^[a-zA-Z0-9_]{6,23}$/,
		authCode:/^[0-9]{6}$/	
	};
	exports.tips={
		password:'密码长度必须为6-23位',
		authCode:'验证码格式为6位数字'
	};
});