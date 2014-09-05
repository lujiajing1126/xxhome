define(function(require, exports, module) {
	var $ = SUI.$,
		Helper = require('scripts/public/helper');
	/**
	 * 获取组织信息
	 * @param  {int} orgId   	organization id
	 * @param  {string} session  	user session
	 * @return {obj}         		$.globalResponseHandler ----in helper
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
		return Helper.globalResponseHandler({
			url: '/api/org/' + orgId + '/info?session=' + session + '&fields=' + fields.join(','),
			type: 'GET',
			dataType: 'JSON'
		});
	};

	exports.createOrganization = function(orgName, session) {
		return Helper.globalResponseHandler({
			"url": "/api/account/create_organization",
			"type": "POST",
			"dataType": "JSON",
			"data": {
				parentId: "",
				email: "",
				name: orgName,
				decription: "",
				session: session
			}
		});
	};
});