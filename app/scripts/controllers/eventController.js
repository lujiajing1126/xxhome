define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		EventService = require('scripts/services/EventService'),
		moment = require('scripts/lib/moment'),
		Helper = require('scripts/public/helper'),
		browser = require('scripts/public/browser'),
		b = browser.browser;

	var Controller = function(eventId) {
		this.namespace = "activityInformation";
		this.eventId = eventId;
		this.actions = {
			rob: function() {
				Helper.confirm("立即下载校校App可报名活动并抢票！", {}, function() {
					window.location.href = Helper.pages.download;
				});
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		var _controller = this;
		var eventId = this.eventId;
		if (!eventId) {
			window.location.href = "http://xiaoxiao.la/404.html";
			return;
		}
		(EventService.getEventInfo(eventId, session).then(function(data) {
			if (data.status == "OK") {
				var eventInfo = data.static;
				document.title=eventInfo.name+" — 活动详情 — 校校";
				eventInfo.pageType = "responsive"; //响应式
				eventInfo.eventId = eventId;
				eventInfo.descriptions = eventInfo.description ? eventInfo.description.split(/\r\n/g) : ["活动无简介"];
				eventInfo.beginDate = moment(eventInfo.begin.$date).format("YYYY-MM-DD HH:mm");
				eventInfo.endDate = moment(eventInfo.end.$date).format("YYYY-MM-DD HH:mm");
				if (b.android || b.ios || b.wx) {
					$(".body").css({
						"padding-top": 0
					});
					eventInfo.mobile = true;
				}
				$('.body').html(template('app/templates/event', eventInfo));
			}
		}))["catch"](function(error) {
			Helper.errorToast(error);
		}).done(function() {
			Helper.userStatus();
		});
		Helper.eventListener("click", _controller.actions);
	};
	module.exports = Controller;
});