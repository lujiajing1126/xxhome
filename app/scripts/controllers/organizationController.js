define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		OrganizationService = require('scripts/services/OrgService');
	var Controller = function(orgId) {
		this.namespace = "organizationInfo";
		this.orgId = orgId;
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		var orgId = this.orgId;
		if (!orgId) {
			window.location.href="404.html";
		}
		
		(OrganizationService.getOrganizationInfo(orgId, session).then(function(data) {
			//console.log(data);
			if (data.status == "OK") {
				data.organizationInfo.descriptions = data.organizationInfo.description ? data.organizationInfo.description.split(/\r\n/g) : ["无简介"];
				$('.body').html(template('app/templates/organization', data));
			}
		}))["catch"](function(error) {
			//console.log(error);
		}).done();
	};
	module.exports = Controller;
});