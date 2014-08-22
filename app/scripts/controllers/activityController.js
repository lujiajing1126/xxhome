define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('artTemplate'),
		EventService = require('home/scripts/services/EventService');
	var Controller = function(eventId) {
		this.namespace = "activityInformation";
		this.eventId = eventId;
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		var eventId = this.eventId;
		if (!eventId) {
			$('.body').html(template('app/templates/activityInfo', {
				stage: "drafting"
			}));
			return;
		}
		
		EventService.getEventInfo(eventId, session).then(function(data) {
			console.log(data);
			var orgInfo = data.static;
			if (data.status == "OK") {
				orgInfo.descriptions = orgInfo.description ? orgInfo.description.split(/\r\n/g) : ["活动无简介"];
				$('.body').html(template('app/templates/activityInfo', orgInfo));
			}
		}).catch(function(error) {
			console.log(error);
		}).done();
	};
	module.exports = Controller;
});