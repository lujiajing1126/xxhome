define(function(require, exports, module) {
	var eventController = require('scripts/controllers/eventController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var eventId = Helper.getParam("eid");
	
	(new loginController()).init(function(){
		var session=AppUser.getSession();
		(new eventController(eventId)).init(session);
	});
});