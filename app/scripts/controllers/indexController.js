define(function(require, exports, module) {
	var $ = SUI.$,
		baseController = require('scripts/baseController'),
		bC = new baseController(),
		Helper = require('scripts/public/helper');
	var Controller = function() {
		this.namespace = "homepage";
		this.actions = {
			createOrganization: function() {
				var session = $.cookie("userSession");
				if (!session) {
					alert("请先登录！");
					return;
				}
				var orgName = prompt("请输入组织名称");
				if (orgName) {
					(Helper.globalResponseHandler({
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
					}).then(function(data) {
						if (data.status == "OK") {
							alert("组织创建成功，您可以进入组织管理系统！");
							window.location.reload();
						}
					})["catch"])(function(err) {
						alert(msg);
						//console.log(msg);
					});
				}
			}
		};
	};
	bC.extend(Controller);
	Controller.prototype.init = function() {
		var _controller = this;
		$(document).on("click", "[data-xx-action]", function() {
			var fn = $(this).attr("data-xx-action");
			_controller.actions[fn] && $.isFunction(_controller.actions[fn]) && _controller.actions[fn].call(this);
		});
		$(document).on("touchstart", "[data-xx-action]", function() {
			var fn = $(this).attr("data-xx-action");
			_controller.actions[fn] && $.isFunction(_controller.actions[fn]) && _controller.actions[fn].call(this);
		});
	};
	module.exports = Controller;
});