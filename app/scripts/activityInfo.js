define(function(require, exports, module) {
	var activityController = require('scripts/controllers/activityController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var eventId = Helper.getParam("event");
	
	Helper.requestWithSession(function(session) {
		(new activityController(eventId)).init(session);
		(new loginController()).init();
	}, function(error) {
		console.log(error);
	});
});