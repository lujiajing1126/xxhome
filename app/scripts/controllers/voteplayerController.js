define(function(require, exports, module) {
	var loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper'),
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		bowser = require('scripts/public/bowser'),
		b = bowser.bowser;

	var playerId = Helper.getParam("pid");

	var Controller = function() {
		this.namespace = "vote";
		this.playerId = playerId;
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		//(new loginController()).init(function() {
			//var session = AppUser.getSession();
			var data = {};
			if (b.isMobile) {
				data.mobile = true;
				$('.body').html(template('app/templates/voteplayer', data));
				//var winWidth = $(window).width();
				//$(".vote-avatar").height(winWidth / 2 - 30);
			} else {
				$('.body').html(template('app/templates/voteplayer', data));
			}
		//});
	};
	module.exports = Controller;
});