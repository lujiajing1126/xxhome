define(function(require, exports, module) {
	var organizationController = require('scripts/controllers/organizationController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var orgId = Helper.getParam("oid");

	(new loginController()).init(function() {
		var session = AppUser.getSession();
		(new organizationController(orgId)).init(session);
	});
});