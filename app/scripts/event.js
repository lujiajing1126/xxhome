define(function(require, exports, module) {
	var eventController = require('scripts/controllers/eventController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var eventId = Helper.getParam("eid");
	
	Helper.requestWithSession(function(session) {
		(new eventController(eventId)).init(session);
		(new loginController()).init();
	}, function(error) {
		console.log(error);
	});
});