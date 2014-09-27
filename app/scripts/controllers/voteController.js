define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		moment = require('scripts/lib/moment'),
		Helper = require('scripts/public/helper'),
		bowser = require('scripts/public/bowser'),
		b = bowser.bowser,
		VoteService = require('scripts/services/oVoteService');

	var Controller = function(voteId) {
		this.namespace = "vote";
		this.voteId = voteId;
		this.actions = {
			voteCast: function() {
				var btn = this,
					session = AppUser.getSession(),
					playerId = btn.attr("data-value");
				Helper.btnLoadingStart(btn, "正在提交...");
				(VoteService.cast(voteId, playerId, session).then(function(data) {
					if (data && data.status == "OK") {
						Helper.btnLoadingStart(btn, "投票成功");
					} else throw data;
				}))["catch"](function(error) {
					Helper.errorHandler(error);
					Helper.btnLoadingEnd(btn);
				}).done();
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		var _controller = this;
		var voteId = this.voteId;
		if (!voteId) {
			window.location.href = "http://xiaoxiao.la/404.html";
			return;
		}
		(VoteService.getVotePlayers(voteId, session).then(function(data) {
			if (data.status == "OK") {
				data.pageType = "responsive"; //响应式
				if (b.isMobile) {
					data.mobile = true;
					$('.body').html(template('app/templates/vote', data));
					var winWidth = $(window).width();
					$(".vote-avatar").height(winWidth / 2 - 30);
				} else {
					$('.body').html(template('app/templates/vote', data));
				}
			}
		}))["catch"](function(error) {
			Helper.errorHandler(error);
			//window.location.href = "http://xiaoxiao.la/404.html";
		}).done(function() {
			Helper.userStatus();
		});

		$(document).on("click", "[data-xx-action]", function(event) {
			var event = event || window.event;
			Helper.preventDefault(event);
			var target = $(this),
				actionName = target.attr("data-xx-action"),
				action = _controller.actions[actionName];
			action && $.isFunction(action) && action.call(target, event);
		});
	};
	module.exports = Controller;
});