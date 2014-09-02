define(function(require, exports, module) {
	var $ = SUI.$,
		Helper = require('scripts/public/helper');

	exports.getEventInfo = function(eventId, session) {
		var fields = ['name', 'location', 'category', 'description', 'begin', 'end', 'numberOfPeople', 'signingUpFields', 'poster', 'images', 'attachments', 'stage','organizationId','organizationName'];
		//var fields = ['name', 'location'];
		return Helper.globalResponseHandler({
			url: '/api/event/' + eventId + '/load?session=' + session + '&fields=' + fields.join(','),
			dataType: 'JSON'
		});
	};
});