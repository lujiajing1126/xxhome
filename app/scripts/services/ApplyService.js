define(function(require, exports, module) {
	var $ = SUI.$;
	exports.getApplyInfo = function(session, orgId, applyId, fields) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + applyId + '/load?session=' + session + '&fields=' + fields.join(','),
			dataType: 'json'
		});
	};
	exports.updateApplyInfo = function(orgId, afId, data) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/update',
			type: 'post',
			dataType: 'json',
			data: data
		});
	};
	exports.uploadAttachment = function(afId, session, orgId, file, fnCallback, errorCallback) {
		// Uploading - for Firefox, Google Chrome and Safari
		var xhr = new XMLHttpRequest();
		var data = new FormData();
		data.append("session", session);
		data.append("file", file);
		// Update progress bar
		xhr.upload.addEventListener("progress", function(evt) {
			if (evt.lengthComputable) {
				$("div.progress-wrap").find(".progress-bar").eq(0).css('width', (evt.loaded / evt.total) * 100 + "%");
			} else {
				// No data to calculate on
			}
		}, false);
		xhr.open("post", "/api/org/" + orgId + "/appform/" + afId + "/attachment/add", true);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		// Set appropriate headers
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				// 上传成功的处理方法
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
					$.isFunction(fnCallback) && fnCallback(xhr.responseText);
				} else { // 上传失败的处理，移除预览
					$.isFunction(errorCallback) && errorCallback();
					$("div.progress-wrap").hide();
				}
				xhr = null;
			}
		}
		xhr.send(data);
	};
	exports.bindAct = function(orgId, afId, session, eventId) {
		// Interface /org/{orgId}/appform/{afId}/event/add   POST
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/event/add',
			type: 'post',
			data: {
				session: session,
				eventId: eventId
			},
			dataType: 'json'
		});
	};
	exports.submitAct = function(orgId, afId, session) {
		// Interface /org/{orgId}/appform/{afId}/submit
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/submit',
			type: 'post',
			data: {
				session: session
			},
			dataType: 'json'
		});
	};
	/**
	 *
	 * @param  {[type]} orgId   [description]
	 * @param  {[type]} session [description]
	 * @return {[type]}         [description]
	 * @url:
	 * /org/{orgId}/appform/list_appforms  GET
	 * 		orgId
	 *  	stage
	 */
	exports.getApplyList = function(orgId, session, stage, skip, limit) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/list_appforms?session=' + session + '&stage=' + stage + '&skip=' + skip + '&limit=' + limit,
			dataType: 'json'
		});
	};
	exports.sendToBox = function(orgId, afId, session, boxId) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/box/add',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
				box: boxId
			}
		});
	};
	exports.delApplyForm = function(orgId, afId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/drop',
			type: 'post',
			dataType: 'json',
			data: {
				session: session
			}
		});
	};
	//删除已关联的活动
	exports.delEvent = function(orgId, afId, eventId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/event/drop',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
				fileId: eventId
			}
		});
	};
	//删除申请资料
	exports.delAttachment = function(orgId, afId, fileId, session) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/appform/' + afId + '/attachment/drop',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
				fileId: fileId
			}
		});
	};
});