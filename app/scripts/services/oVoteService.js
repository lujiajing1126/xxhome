/**
 *
 */
define(function(require, exports, module) {
	var $ = SUI.$,
		Helper = require('scripts/public/helper');

	/**
	 * 获取投票的选手列表
	 */
	exports.getVotePlayers = function(voteId, session) {
		return Helper.globalResponseHandler({
			url: 'api/vote/' + voteId + '/get_options',
			dataType: 'json',
			data: {
				session: session
			}
		});
	};
	/**
	 * 获取投票某个选手的详细信息
	 */
	exports.getVotePlayer = function(voteId, option_id, session) {
		return Helper.globalResponseHandler({
			url: 'api/vote/' + voteId + '/get_option',
			dataType: 'json',
			data: {
				option_id: option_id,
				session: session
			}
		});
	};
	/**
	 * 为选手投票
	 */
	exports.cast = function(voteId, option_id, session) {
		return Helper.globalResponseHandler({
			url: 'api/vote/' + voteId + '/cast',
			dataType: 'json',
			type: 'post',
			data: {
				session: session,
				option_id: option_id
			}
		});
	};
});