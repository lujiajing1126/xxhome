define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		EventService = require('scripts/services/EventService');
		moment=require('scripts/lib/moment');
	var Controller = function(eventId) {
		this.namespace = "activityInformation";
		this.eventId = eventId;
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		var eventId = this.eventId;
		if (!eventId) {
			window.location.href="http://xiaoxiao.la/404.html";
			return;
		}

		(EventService.getEventInfo(eventId, session).then(function(data) {
			if (data.status == "OK") {
			var eventInfo = data.static;
				eventInfo.pageType="responsive";//响应式
				eventInfo.eventId=eventId;
				eventInfo.descriptions = eventInfo.description ? eventInfo.description.split(/\r\n/g) : ["活动无简介"];
				eventInfo.beginDate=moment(eventInfo.begin.$date).format("YYYY-MM-DD HH:mm");
				eventInfo.endDate=moment(eventInfo.end.$date).format("YYYY-MM-DD HH:mm");
				$('.body').html(template('app/templates/event', eventInfo));
			}
		}))["catch"](function(error) {
			window.location.href="http://xiaoxiao.la/404.html";
		}).done();
	};
	module.exports = Controller;
});