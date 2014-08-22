define(function(require, exports, module) {
	var $ = require('jquery'),
		template = require('artTemplate'),
		loginController = require('scripts/controllers/loginController');
	require("sui/bootstrap/bootstrap");
	(new loginController()).init();
});