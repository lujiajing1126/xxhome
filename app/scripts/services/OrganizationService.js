define(function(require, exports, module) {
	var $ = SUI.$;
	require('scripts/public/helpers');

	/**
	 * 创建组织
	 * @param  {string} name        	[组织名称]
	 * @param  {string} email       	[组织联系邮箱]
	 * @param  {string} description [简介]
	 * @param  {string} session     	[用户session]
	 * @return {obj}             	$.globalResponseHandler ----in helpers
	 */
	exports.createOrganization = function(name, email, description, session) {
		return $.globalResponseHandler({
			"url": "/api/account/create_organization",
			"type": "POST",
			"dataType": "JSON",
			"data": {
				parentId: "",
				email: email,
				name: name,
				decription: description,
				session: session
			}
		});
	};
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
			'dynamic.roleType' //?: "member:admin", "member:member", "follower"
		];
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/info?session=' + session + '&fields=' + fields.join(','),
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 更新组织信息
	 * @param  {int} orgId		organization id
	 * @param  {obj} data    	update info   & user session[session is required]
	 * @return {obj}      		 $.globalResponseHandler ----in helpers
	 */
	exports.updateOrganizationInfo = function(orgId, data) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/update',
			type: 'POST',
			dataType: 'JSON',
			data: data
		});
	};
	/**
	 * 设置组织管理员
	 * @param {int} orgId   [组织ID]
	 * @param {int} userId  [要设置为管理员的用户ID]
	 * @param {string} session [当前用户会话]
	 */
	exports.setAdministrator = function(orgId, userId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/set_administrators',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				userId: userId
			}
		});
	};
	/**
	 * 取消组织管理员
	 * @param {int} orgId   [组织ID]
	 * @param {int} userId  [要设置为管理员的用户ID]
	 * @param {string} session [当前用户会话]
	 */
	exports.removeAdministrators = function() {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/remove_administrators',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				userId: userId
			}
		});
	};

	/**
	 * 获取组织直接成员信息
	 * @param  {int} orgId   	[组织ID]
	 * @param  {string} session 	[申请进入组织的用户ID]
	 * @param  {int} skip    		[跳过的数据条数]
	 * @param  {int} limit   		[调取的数据条数：-1为全部]
	 * @return {obj}         		[$.globalResponseHandler ----in helpers]
	 */
	exports.queryDirectMembers = function(orgId, session, skip, limit) {
		var url = '/api/org/' + orgId + '/direct_members?session=' + session + '&skip=' + skip + '&limit=' + limit;
		return $.globalResponseHandler({
			url: url,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 获取组织新申请成员信息
	 * @param  {int} orgId   	[组织ID]
	 * @param  {string} session 	[申请进入组织的用户ID]
	 * @param  {int} skip    		[跳过的数据条数]
	 * @param  {int} limit   		[调取的数据条数：-1为全部]
	 * @return {obj}         		[$.globalResponseHandler ----in helpers]
	 */
	exports.queryApplyMembers = function(orgId, session, skip, limit) {
		var url = '/api/org/' + orgId + '/jreq/list?session=' + session + '&skip=' + skip + '&limit=' + limit;
		return $.globalResponseHandler({
			url: url,
			type: 'GET',
			dataType: 'JSON'
		});
	};

	/**
	 * 组织管理员标记一条申请已读
	 * @param  {int} orgId   	[组织ID]
	 * @param  {int} requestId  	[申请进入组织的请求ID]
	 * @param  {string} session 	[用户Session]
	 * @return {obj}         		$.globalResponseHandler ----in helpers
	 */
	exports.readJoinRequest = function(orgId, requestId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/jreq/process/' + requestId + '/read',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session
			}
		});
	};
	/**
	 * 组织管理员批准一条加入申请
	 * @param  {int} orgId   	[组织ID]
	 * @param  {int} requestId  	[申请进入组织的请求ID]
	 * @param  {string} session 	[用户Session]
	 * @return {obj}         		$.globalResponseHandler ----in helpers
	 */
	exports.acceptJoinRequest = function(orgId, requestId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/jreq/process/' + requestId + '/accept',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session
			}
		});
	};
	/**
	 * 组织管理员拒绝一条加入申请
	 * @param  {int} orgId   	[组织ID]
	 * @param  {int} requestId  	[申请进入组织的请求ID]
	 * @param  {string} session 	[用户Session]
	 * @return {obj}         		$.globalResponseHandler ----in helpers
	 */
	exports.rejectJoinRequest = function(orgId, requestId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/jreq/process/' + requestId + '/reject',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session
			}
		});
	};
	/**
	 * 组织管理员忽略一条加入申请
	 * @param  {int} orgId   	[组织ID]
	 * @param  {int} requestId  	[申请进入组织的请求ID]
	 * @param  {string} session 	[用户Session]
	 * @return {obj}         		$.globalResponseHandler ----in helpers
	 */
	exports.ignoreJoinRequest = function(orgId, requestId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/jreq/process/' + requestId + '/ignore',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session
			}
		});
	};
	/**
	 * 组织删除成员
	 * @param  {int} orgId   [组织ID]
	 * @param  {int} userId  [要删除的用户ID]
	 * @param  {string} session [用户session]
	 * @return {obj}         [Q]
	 */
	exports.delMember = function(orgId, userId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/remove_member',
			type: 'POST',
			dataType: 'JSON',
			data: {
				userId: userId,
				session: session
			}
		});
	};
	/**
	 * 获取组织拥有的所有发布版块
	 * @param  {int} orgId   	[组织ID]
	 * @param  {string} session 	[用户Session]
	 * @return {obj}         		[$.globalResponseHandler ----in helpers]
	 */
	exports.getOwnedEventBoards = function(orgId, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/list_owned_event_boards?session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 模糊查询相关社团目录
	 * @param  {string} assodirName 	[需要检索的社团名称关键字]
	 * @param  {string} session     		[用户Session]
	 * @return {obj}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.queryAssociationdDir = function(assodirName, session, skip, limit) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/search?name=' + assodirName + '&session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 获取组织已加入的上级目录
	 */
	exports.queryOwnerAssociationdDir = function(orgId, session, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/list_including_assodirs?session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 获取某个目录中所有的社团
	 * @param  {string} assodirName 	[目录名称]
	 * @param  {string} session     		[用户Session]
	 * @param  {int} skip    			[跳过的数据条数]
	 * @param  {int} limit   			[调取的数据条数：-1为全部]
	 * @return {obj}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.queryAllOrganizationOfAssociation = function(assodirName, session, skip, limit) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/load?session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	}
	/**
	 * 获取某个目录中所有的新申请社团
	 * @param  {string} assodirName 	[目录名称]
	 * @param  {string} session     		[用户Session]
	 * @param  {int} skip    			[跳过的数据条数]
	 * @param  {int} limit   			[调取的数据条数：-1为全部]
	 * @return {obj}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.queryApplyOfAssociation = function(assodirName, session, skip, limit) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/list_request_join?session=' + session + '&skip=' + skip + '&limit=' + limit,
			type: 'GET',
			dataType: 'JSON'
		});
	};
	/**
	 * 通过邀请码直接进入组织
	 * @param  {string} assodirName 	[需要进入的社团目录名称]
	 * @param  {int} orgId       		[本组织ID]
	 * @param  {[string]} session     		[用户session]
	 * @param  {string} secret      		[邀请码]
	 * @return {obj}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.enterAssociationdDir = function(assodirName, orgId, session, secret) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/enter',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				orgId: orgId,
				secret: secret
			}
		});
	};
	/**
	 * 申请加入目录
	 * @param  {string} assodirName 	[需要进入的社团目录名称]
	 * @param  {int} orgId       		[本组织ID]
	 * @param  {[string]} session     		[用户session]
	 * @return {[type]}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.applyAssociationdDir = function(assodirName, orgId, session) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/apply',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				orgId: orgId
			}
		});
	};
	/**
	 * 组织退出社团目录
	 * @param  {string} assodirName 	[社团目录名称]
	 * @param  {int} orgId       		[本组织ID]
	 * @param  {[string]} session     		[用户session]
	 * @return {[type]}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.quitAssociationdDir = function(assodirName, orgId, session) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/quit',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				orgId: orgId
			}
		});
	};
	/**
	 * 目录管理者允许加入
	 * @param  {string} assodirName 	[需要进入的社团目录名称]
	 * @param  {int} orgId       		[本组织ID]
	 * @param  {[string]} session     		[用户session]
	 * @return {[type]}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.acceptApplyAssociationdDir = function(assodirName, adminOrgId, orgId, session) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/accept',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				orgId: orgId,
				adminOrgId: adminOrgId
			}
		});
	};
	/**
	 * 目录管理者拒绝加入
	 * @param  {string} assodirName 	[需要进入的社团目录名称]
	 * @param  {int} orgId       		[本组织ID]
	 * @param  {[string]} session     		[用户session]
	 * @return {[type]}             		[$.globalResponseHandler ----in helpers]
	 */
	exports.rejectApplyAssociationdDir = function(assodirName, adminOrgId, orgId, session) {
		assodirName = encodeURI(assodirName);
		return $.globalResponseHandler({
			url: '/api/assodir/' + assodirName + '/reject',
			type: 'POST',
			dataType: 'JSON',
			data: {
				session: session,
				orgId: orgId,
				adminOrgId: adminOrgId
			}
		});
	};

	/**
	 * [queryOwnedAssodirs description]
	 * @param  {[type]} orgId   [description]
	 * @param  {[type]} session [description]
	 * @return {[type]}         [description]
	 */
	exports.queryOwnedAssodirs = function(orgId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/list_owned_assodirs?session=' + session,
			type: 'GET',
			dataType: 'JSON'
		});
	};

});