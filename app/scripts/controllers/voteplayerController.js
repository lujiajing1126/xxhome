define(function(require, exports, module) {
	var loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper'),
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		bowser = require('scripts/public/bowser'),
		b = bowser.bowser,
		VoteService = require('scripts/services/oVoteService');

	var voteId = Helper.getParam("vid"),
		playerId = Helper.getParam("pid"),
		session = Helper.getParam("session");

	if (session) {
		var isLocalStorage = window.localStorage ? true : false;
		$.cookie("userSession", session, {
			path: "/"
		});
		if (isLocalStorage)
			window.localStorage.setItem("userSession", session);
	}

	var Controller = function() {
		this.namespace = "vote";
		this.actions = {
			voteCast: function() {
				var btn = this,
					session = AppUser.getSession();
				Helper.btnLoadingStart(btn, "正在提交...");
				(VoteService.cast(voteId, playerId, session).then(function(data) {
					if (data && data.status == "OK") {
						Helper.btnLoadingStart(btn, "投票成功");
						setTimeout(function() {
							Helper.btnLoadingEnd(btn,"我要投票");
						}, 2000);
					} else throw data;
				}))["catch"](function(error) {
					Helper.alert(error);
					Helper.btnLoadingEnd(btn,"我要投票");
				}).done();
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;

		(new loginController()).init(function() {
			var session = AppUser.getSession();
			(VoteService.getVotePlayer(voteId, playerId, session).then(function(data) {
				if (data && data.status == "OK") {
					data.option.descriptions = data.option.description ? data.option.description.split(/\r\n/g) : ["无介绍"];
					console.log(data);
					if (b.isMobile) {
						data.mobile = true;
						$('.body').html(template('app/templates/voteplayer', data));
						var winWidth = $(window).width();
						$(".vote-avatar").height(winWidth / 2 - 30);
					} else {
						$('.body').html(template('app/templates/voteplayer', data));
					}
				} else throw data;
			}))["catch"](function(error) {
				if (error == "Not Logged In")
					window.location.href = "./login.html?go=vote|" + voteId + '|player|' + playerId;
				else
					Helper.errorHandler(error);
			}).done(function() {
				Helper.eventListener("click", _controller.actions);
			});
		});
	};
	module.exports = Controller;
});