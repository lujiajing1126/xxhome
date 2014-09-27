define(function(require, exports, module) {
	var voteController = require('scripts/controllers/voteController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var voteId = Helper.getParam("vid"),
		session = Helper.getParam("session");

	if (session) {
		var isLocalStorage = window.localStorage ? true : false;
		$.cookie("userSession", session, {
			path: "/"
		});
		if (isLocalStorage)
			window.localStorage.setItem("userSession", session);
	}
	
	(new loginController()).init(function() {
		var session = AppUser.getSession();
		(new voteController(voteId)).init(session);
	});
});