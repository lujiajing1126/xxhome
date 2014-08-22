define(function(require,exports,module){
	var $ = SUI.$,
	Q = require('sui/async/q');
	require('scripts/public/helpers');
	var Event = function(User) {
		this.user = User;
		this.session = User.getSession();
		this.org = User.org.id;
	};
	Event.prototype.create = function(){
		$.globalResponseHandler({
			url:'/api/org/' + this.org + '/event/create',
			type:'POST',
			dataType:'JSON',
			data:{
				session: this.session,
			}
		}).then(function(data){
			console.log(data);
			location.hash = "activity/" + data.eventId;
		});
	};
	module.exports = Event;
});