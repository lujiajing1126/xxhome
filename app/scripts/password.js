define(function(require, exports, module) {
	var passwordController = require('scripts/controllers/passwordController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	(new passwordController()).init();
	(new loginController()).init();
});