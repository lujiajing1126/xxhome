define(function(require, exports, module) {
	var $ = SUI.$,
		template = require('build/template'),
		loginController = require('scripts/controllers/loginController');
	require("sui/bootstrap/bootstrap");
	(new loginController()).init();
});