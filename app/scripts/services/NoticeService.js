define(function(require, exports, module) {
	var $ = SUI.$;
	/**
	 * 创建公告板
	 * @return {[type]} [description]
	 */
	exports.queryAboards = function(orgId, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/ensure_aboard_for_members?session=' + session + '&skip=' + skip + '&limit=' + limit,
			dataType: 'json',
			type: 'get'
		});
	};
	exports.get
	/**
	 * 获取公告列表
	 * @param  {string} session 	[用户session]
	 * @param  {int} skip    		[跳过条数]
	 * @param  {int} limit   		[所取数据条数]
	 * @return {obj}         		[$.globalResponseHandler]
	 */
	exports.getNoticeList = function(aboardId, session, skip, limit) {
		aboardId = encodeURI(aboardId);
		return $.globalResponseHandler({
			url: '/api/aboard/' + aboardId + '/announcements?session=' + session + '&skip=' + skip + '&limit=' + limit,
			dataType: 'json',
			type: 'GET'
		});
	};
	/**
	 * 获取公告详情
	 * @param  {string} noticeId 	[公告ID]
	 * @param  {string} session  	[用户session]
	 * @return {string}          	[$.globalResponseHandler]
	 */
	exports.getNoticeInfo = function(noticeId, session) {
		return $.globalResponseHandler({
			url: '/api/aboard/aboardName/load_announcement?session=' + session + '&announcementId=' + noticeId,
			dataType: 'json',
			type: 'get'
		});
	};
	/**
	 * 创建公告
	 * @return {obj} [$.globalResponseHandler]
	 */
	exports.createNotice = function(aboard, name, title, content, contact, session) {
		aboard = decodeURI(aboard);
		return $.globalResponseHandler({
			url: 'api/aboard/' + aboard + '/announce',
			dataType: 'json',
			type: 'post',
			data: {
				session: session,
				name: name,
				title: title,
				content: content,
				contact: contact
			}
		});
	};
	/**
	 * 获取公告的回复列表
	 * @return {obj} [$.globalResponseHandler]
	 */
	exports.queryNoticeReplies = function(noticeId, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/aboard/' + noticeId + '/replies?session=' + session + '&skip=' + skip + '&limit=' + limit,
			dataType: 'json',
			type: 'GET'
		});
	};
});