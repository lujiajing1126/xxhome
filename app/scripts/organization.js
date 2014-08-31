define(function(require, exports, module) {
	var organizationController = require('scripts/controllers/organizationController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var orgId = Helper.getParam("oid");
	
	Helper.requestWithSession(function(session) {
		(new organizationController(orgId)).init(session);
		(new loginController()).init();
	}, function(error) {

		console.log(error);
	});
});