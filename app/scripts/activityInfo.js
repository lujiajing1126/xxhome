define(function(require, exports, module) {
	var activityController = require('home/scripts/controllers/activityController'),
		loginController = require('home/scripts/controllers/loginController'),
		Helper = require('home/scripts/public/helper');

	var eventId = Helper.getParam("event");
	
	Helper.requestWithSession(function(session) {
		(new activityController(eventId)).init(session);
		(new loginController()).init();
	}, function(error) {
		console.log(error);
	});
});