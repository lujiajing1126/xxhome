define(function(require, exports, module) {
	var $ = SUI.$;
	require('scripts/public/helpers');
	/**
	 * 创建赞助申请
	 * @param  {int} orgId   	[组织ID]
	 * @param  {string} session 	[用户session]
	 * @return {string}         		[赞助申请的ID]
	 */
	exports.applySponsorCreate = function(orgId, session, fnc) {
		$.globalResponseHandler({
			url: '/api/org/' + orgId + '/sponsor/create',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				publicity: true,
				// demanding: "",
				title: "新建赞助申请",
				// providing: ""
			}
		}).then(function(data) {
			console.log(data);
			location.hash = "sponsor/apply/" + data.sponsorId;
		}).catch(function(err) {
			$.errMsg(err, 3000);
		}).done(function() {
			fnc && $.isFunction(fnc) && fnc();
		});
	};
	/**
	 * 获取赞助申请信息
	 */
	exports.getApplySponsorInfo = function(sponsorId, session, fields) {
		fields = fields || ['demanding', 'title', 'providing', 'publicity'];
		return $.globalResponseHandler({
			url: '/api/sponsor/' + sponsorId + '/load?session=' + session + '&fields=' + fields.join(','),
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 更新赞助申请信息
	 */
	exports.updateApplySponsor = function(sponsorId, data) {
		return $.globalResponseHandler({
			url: '/api/sponsor/' + sponsorId + '/update',
			type: 'POST',
			dataType: 'JSON',
			data: data
		});
	};
	/**
	 * 添加申请资料
	 */
	exports.addAttachment = function() {
		
	};
	/**
	 * 移除申请资料
	 */
	exports.removeAttachment = function() {};
	/**
	 * 为申请赞助关联活动
	 * @param {string} sponsorId  	[赞助ID]
	 * @param {[string]} activityId 	[活动ID]
	 * @param {string} session    	[用户Session]
	 */
	exports.addActivity = function(sponsorId, activityId, session) {
		return $.globalResponseHandler({
			url: '/api/sponsor/' + sponsorId + '/relation_event',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				eventId: activityId
			}
		});
	};
	/**
	 * 为申请赞助移除活动
	 */
	exports.removeActivity = function() {};
	/**
	 * 已保存的赞助申请列表
	 */
	exports.getSavedSponsorList = function(orgId, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/sponsor/list?session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 保存并发布的申请列表
	 */
	exports.getSavedApplySponsorList = function(orgId, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/sponsor/list?session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 协商阶段的赞助事物列表
	 */
	exports.transactionNegotiationList = function() {
		return $.globalResponseHandler({
			url: '/api/',
			type: 'POST',
			dataType: 'JSON',
			data: {}
		});
	};


	/**
	 * 获取新申请赞助认证的列表
	 */
	exports.certificationApplyList = function() {

	};
	/**
	 * 申请认证
	 */
	exports.applyCertification = function(sponsorId, orgId, session) {
		return $.globalResponseHandler({
			url: '/api/sponsor/' + sponsorId + '/apply_certification',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				orgId: orgId
			}
		});
	};
	/**
	 * 同意赞助认证
	 */
	exports.acceptCertificationApply = function() {

	};
	/**
	 * 拒绝赞助认证
	 */
	exports.rejectCertificationApply = function() {

	};
	/**
	 * 忽略赞助认证
	 */
	exports.ignoreCertificationApply = function() {

	};
});