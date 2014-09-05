define(function(require, exports, module) {
	var passwordController = require('scripts/controllers/passwordController'),
		loginController = require('scripts/controllers/loginController');

	exports.init = function(templateName, data) {
		data = data || {};
		(new loginController()).init(function() {
			(new passwordController()).init(templateName, data);
		});
	};

});