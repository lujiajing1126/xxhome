define(function(require, exports, module) {
	var $ = SUI.$,
		Helper = require('scripts/public/helper');

	exports.getJobs = function(schools, session, skip, limit) {
		return Helper.globalResponseHandler({
			url: '/api/',
			dataType: 'json'
		});
	};
	exports.getJob = function(schools, session, skip, limit) {
		return Helper.globalResponseHandler({
			url: '/api/',
			dataType: 'json'
		});
	};
});