define(function(require, exports, module) {
	var $ = SUI.$;
	exports.publishAct = function(eventId, session) {
		return $.globalResponseHandler({
			url: '/api/event/' + eventId + '/publish',
			type: 'post',
			dataType: 'json',
			data: {
				session: session
			}
		});
	}
	exports.updateAct = function(eventId, data) {
		return $.globalResponseHandler({
			url: '/api/event/' + eventId + '/update',
			type: 'post',
			dataType: 'json',
			data: data
		});
	};
	exports.getActivityList = function(orgId, data) {
		return $.globalResponseHandler({
			url: '/api/org/' + orgId + '/list_own_events',
			data: data,
			dataType: 'json'
		});
	};
	exports.getActInfo = function(eventId, session, fields) {
		return $.globalResponseHandler({
			url: '/api/event/' + eventId + '/load?session=' + session + '&fields=' + fields.join(','),
			dataType: 'JSON'
		});
	};
	exports.dropAttachment = function(eventId, fileId, session) {
		return $.globalResponseHandler({
			url: '/api/event/' + eventId + '/attachment/drop/'+fileId,
			dataType: 'JSON',
			type: "POST",
			data: {
				session: session,
				fileId: fileId
			}
		});
	};
	/**
	 * 删除版块
	 */
	exports.dropBoard=function(eventId,Board,session){
		return $.globalResponseHandler({
			url: '/api/event/' + eventId + '/target/drop',
			dataType: 'JSON',
			type: "POST",
			data: {
				session: session,
				board_name: Board
			}
		});
	};
	/**
	 * 上传活动海报
	 * @param  {MongoId} eventId    活动ID
	 * @param  {uuid} session       用户Session
	 * @param  {File} file          上传的文件
	 * @param  {Function} fnCallback 上传成功的处理函数
	 *         @param {String} responseText
	 * @param  {Function} errorCallback 上传失败的处理函数
	 */
	exports.uploadPoster = function(eventId, session, file, fnCallback, errorCallback) {
		// Uploading - for Firefox, Google Chrome and Safari
		var xhr = new XMLHttpRequest();
		var data = new FormData();
		data.append("session", session);
		data.append("file", file);
		/*
        SUI.$.ajax({
        	type:'post',
        	url: "/api/event/"+eventId+"/image/add",
        	data: data,
        	processData:false,
        	contentType:false
        }).done(function(data){console.log(data)}).fail(function(err){console.log(err);});
		*/
		// Update progress bar
		xhr.upload.addEventListener("progress", function(evt) {
			if (evt.lengthComputable) {
				$("div.progress-wrap").find(".progress-bar").eq(0).css('width', (evt.loaded / evt.total) * 100 + "%");
			} else {
				// No data to calculate on
			}
		}, false);
		xhr.open("post", "/api/event/" + eventId + "/poster/set", true);
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
	}
	/**
	 * 上传活动策划案
	 * @param  {Integer} eventId       [description]
	 * @param  {uuid} session       [description]
	 * @param  {File} file          [description]
	 * @param  {Function} fnCallback 上传成功的处理函数
	 *         @param {String} responseText
	 * @param  {Function} errorCallback 上传失败的处理函数
	 */
	exports.uploadAttachment = function(eventId, session, file, fnCallback, errorCallback) {
		// Uploading - for Firefox, Google Chrome and Safari
		var xhr = new XMLHttpRequest();
		var data = new FormData();
		data.append("session", session);
		data.append("file", file);
		/*
        SUI.$.ajax({
        	type:'post',
        	url: "/api/event/"+eventId+"/image/add",
        	data: data,
        	processData:false,
        	contentType:false
        }).done(function(data){console.log(data)}).fail(function(err){console.log(err);});
		*/
		// Update progress bar
		xhr.upload.addEventListener("progress", function(evt) {
			if (evt.lengthComputable) {
				$("div.progress-wrap").find(".progress-bar").eq(0).css('width', (evt.loaded / evt.total) * 100 + "%");
			} else {
				// No data to calculate on
			}
		}, false);
		xhr.open("post", "/api/event/" + eventId + "/attachment/add", true);
		/**
		 * Fix Bug: 修复Http Request Header中的Content-Type，设置为默认自动添加
		 * @example
		 * Content-Type: multipart/form-data; boundary=---------------------------40612316912668
		 */
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		// Set appropriate headers
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
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
	}
	exports.uploadImage = function(eventId, session, file, fnCallback, errorCallback) {
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
		xhr.open("post", "/api/event/" + eventId + "/image/add", true);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		// Set appropriate headers
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
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
	}
	exports.archiveAct = function(session,eventId) {
		// /api/event/{eventId}/archive POST
		return $.globalResponseHandler({
			url: '/api/event/'+eventId+'/archive',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
			}
		});
	}
});