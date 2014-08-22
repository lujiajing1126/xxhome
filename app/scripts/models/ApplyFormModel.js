define(function(require,exports,module){
	var $ =SUI.$;
	var ApplyForm = function(){
	};
	ApplyForm.prototype.create = function(session,orgId) {
		return $.globalResponseHandler({
			url:'/api/org/'+orgId+'/appform/create_appform',
			type: 'post',
			dataType:'json',
			data: {
				session:session
			}
		});
	};
	module.exports = ApplyForm;
});