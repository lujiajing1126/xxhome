define(function(require, exports, module) {
	var voteController = require('scripts/controllers/voteController'),
		loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper');

	var voteId = Helper.getParam("vid");
	
	(new loginController()).init(function(){
		var session=AppUser.getSession();
		(new voteController(voteId)).init(session);
	});
});