define(function(require, exports, module) {
	var $ = SUI.$,
		Helper = require('scripts/public/helper');

	exports.getJobs = function(boards, session, skip, limit) {
		boards = boards.join(',');
		return Helper.globalResponseHandler({
			url: '/api/recruitment/list_publish_recruitment',
			dataType: 'json',
			data: {
				boardName: boards,
				session: session,
				skip: skip,
				limit: limit
			}
		});
	};
	exports.getJob = function(jobId, session) {
		return Helper.globalResponseHandler({
			url: '/api/recruitment/' + jobId + '/load',
			dataType: 'json',
			data: {
				session: session
			}
		});
	};
});