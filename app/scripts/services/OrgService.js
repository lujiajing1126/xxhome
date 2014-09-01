define(function(require, exports, module) {
	var $ = SUI.$;
	require('scripts/public/helper');
	/**
	 * 获取组织信息
	 * @param  {int} orgId   	organization id
	 * @param  {string} session  	user session
	 * @return {obj}         		$.globalResponseHandler ----in helpers
	 */
	exports.getOrganizationInfo = function(orgId, session) {
		var fields = ['organizationInfo.id',
			'organizationInfo.name',
			'organizationInfo.parent',
			'organizationInfo.email',
			'organizationInfo.contact',
			'organizationInfo.description',
			'extendedOrganizationInfo.type',
			'extendedOrganizationInfo.credit',
			'dynamic.numberOfMembers',
			'dynamic.numberOfFollowers',
			'dynamic.numberOfExecutingEvents',
			//'dynamic.roleType' //?: "member:admin", "member:member", "follower"
		];
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/info?session=' + session + '&fields=' + fields.join(','),
			type: 'GET',
			dataType: 'JSON'
		});
	};
});