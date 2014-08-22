define(function(require,exports,module){
	var Router = require('./dsl');
	Router.map(function(){
		this.resource("organization",{path:'org'},function(){
			this.route('info');
		});
		
	});
});