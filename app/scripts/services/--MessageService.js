define(function(require,exports,module){
	var $ =SUI.$;
	require("scripts/public/helpers");
	exports.getMessages = function(orgId,data) {
		return $.globalResponseHandler({
			url: '/api/org/'+orgId+'/received_messages',
			data: data,
			type: 'get',
			dataType: 'json'
		});
	};
});