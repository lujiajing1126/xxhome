define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		template = require('build/template'),
		Helper = require('scripts/public/helper'),
		OrganizationService = require('scripts/services/OrgService'),
		bowser = require('scripts/public/bowser'),
		b = bowser.bowser;
	var Controller = function(orgId) {
		this.namespace = "organizationInfo";
		this.orgId = orgId;
	};
	bC.extend(Controller);
	Controller.prototype.init = function(session) {
		var orgId = this.orgId;
		if (!orgId) {
			window.location.href = "404.html";
		}

		(OrganizationService.getOrganizationInfo(orgId, session).then(function(data) {
			if (data.status == "OK") {
				if (b.android || b.ios || b.wx) {
					$(".body").css({
						"padding-top": 0
					});
					data.mobile = true;
				}
				data.pageType = "responsive";
				data.organizationInfo.descriptions = data.organizationInfo.description ? data.organizationInfo.description.split(/\r\n/g) : ["无简介"];
				$('.body').html(template('app/templates/organization', data));
			}
		}))["catch"](function(error) {
			Helper.errorToast(error);
		}).done(function() {
			Helper.userStatus();
		});
	};
	module.exports = Controller;
});