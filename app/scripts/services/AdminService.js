define(function(require,exports,module){
	var $ = SUI.$;
	exports.getAvailableApplyFormBox = function(orgId,session) {
		return $.globalResponseHandler({
			url: '/api/org/'+orgId+'/appform/list_boxes?archived=false&session='+session,
			dataType: 'json'
		});
	};
	exports.createBox = function(orgId,session,name) {
		return $.globalResponseHandler({
			url: '/api/org/'+orgId+'/appform/create_box',
			data: {
				session: session,
				name: name
			},
			type: 'post',
			dataType: 'json'
		});
	};
	exports.loadSpecifiedBox = function(orgId,afbId,session,stage,fields,skip,limit) {
		return $.globalResponseHandler({
			url: '/api/org/'+orgId+'/appform_box/'+afbId+'/load?stage='+stage+'&session='+session+'&fields='+fields.join(',')+'&skip='+skip+'&limit='+limit,
			dataType: 'json'
		});
	};
	exports.getMyBoxes = function(orgId,session) {
		return $.globalResponseHandler({
			url: '/api/org/'+orgId+'/appform/list_boxes?session='+session,
			dataType: 'json'
		});
	};
	exports.replyForm = function(orgId,afId,session,reason,approved){
		//org/{orgId}/appform/{afId}/reply
		return $.globalResponseHandler({
			url: '/api/org/'+orgId+'/appform/'+afId+'/reply',
			type: 'post',
			dataType: 'json',
			data: {
				session: session,
				reason: reason,
				approved: approved
			}
		});
	};
});