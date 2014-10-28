define(function(require, exports, module) {
	var loginController = require('scripts/controllers/loginController'),
		Helper = require('scripts/public/helper'),
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		browser = require('scripts/public/browser'),
		b = browser.browser,
		VoteService = require('scripts/services/oVoteService');

	var voteId = Helper.getParam("vid"),
		playerId = Helper.getParam("pid"),
		session = Helper.getParam("session");

	var residueTickets; //剩余票数

	if (session) {
		var isLocalStorage = window.localStorage ? true : false;
		$.cookie("userSession", session, {
			path: "/"
		});
		if (isLocalStorage)
			window.localStorage.setItem("userSession", session);
	}

	var Controller = function() {
		var _controller = this;
		this.namespace = "vote";
		this.actions = {
			voteCast: function() {
				var btn = this,
					session = AppUser.getSession();
				Helper.btnLoadingStart(btn, "正在提交...");
				(VoteService.cast(voteId, playerId, session).then(function(data) {
					if (data && data.status == "OK") {
						Helper.btnLoadingStart(btn, "投票成功");
						Helper.alert("投票成功！,剩余" + (--residueTickets) + "票", {}, function() {
							_controller.render(); // 投票成功重新渲染页面
						});
						setTimeout(function() {
							Helper.btnLoadingEnd(btn, "我要投票");
						}, 2000);
					} else throw data;
				}))["catch"](function(error) {
					Helper.alert(error);
					Helper.btnLoadingEnd(btn, "我要投票");
				}).done();
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;
		(new loginController()).init(function() {
			_controller.render();
		});
		Helper.eventListener("click", _controller.actions);
	};
	Controller.prototype.render = function() {
		var _controller = this;
		var session = AppUser.getSession();
		(VoteService.getVotePlayer(voteId, playerId, session).then(function(data) {
			if (data && data.status == "OK") {
				document.title = data.vote.voteName + "—" + data.option.optionName + Helper.tips.xiaoxiaoSupport;
				residueTickets = data.residueTickets;
				data.option.descriptions = data.option.description ? data.option.description.split(/\r\n/g) : ["无介绍"];

				/**
				 * fixed: url in name
				 */
				var name = data.option.optionName;
				if (name.indexOf(',') != -1) {
					data.option.optionName = name.split(',')[0];
					data.option.url = name.split(',')[1];
				}

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
		}).done();
	};
	module.exports = Controller;
});