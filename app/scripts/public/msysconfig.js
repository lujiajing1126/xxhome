/**
 * define the configuration of this system
 */
define(function(require, exports, module) {
	exports.regulars = {
		phoneNumber: /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,
		email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		password: /^[a-zA-Z0-9_]{6,23}$/,
		authCode: /^[0-9]{6}$/
	};
	exports.tips = {
		userName: '用户名格式不对',
		password: '密码长度必须为6-23位',
		authCode: '验证码格式为6位数字',
		loginLoading: '抢滩登录中...',
		signuping: '玩命注册中...',
		xiaoxiaoSupport: '—校校技术赞助'
	};
	exports.pages = {
		home: './index.html',
		login: './login.html',
		notFound: 'http://xiaoxiao.la/404.html',
		download:'./download.html'
	};
	exports.delays = {
		authCode: 60
	};
});