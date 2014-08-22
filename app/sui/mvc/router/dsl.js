define(function(require,exports,module){
	var DSL = function(name) {
		this.parent = name;
		this.matches = [];
	};
	DSL.prototype = {
		route: function(name, options, callback) {
			if(arguments.length === 2 && typeof options === 'function') {

			}
			if (arguments.length === 1) {
				options = {};
			}
			var type = options.resetNamespace === true ? 'resource' : 'route';

			if (typeof options.path !== 'string') {// Default Route Rule
				options.path = '' + name;
			}
			if (canNest(this) && options.resetNamespace !== true) {
				name = this.parent + "/" + name;
    		}
    		if (callback) {

    		} else {
    			this.push(options.path,name,null);
    		}
		},
		push: function(url,name,callback) {
			var parts = name.split('.');
			if (url === "" || url === "/" || parts[parts.length-1] === "index") { this.explicitIndex = true; }
			this.matches.push([url, name, callback]);
		}
	};
	/**
	 * 路由映射
	 * @param  {Function} callback 匿名路由定义模块
	 * @return {DSL}            [description]
	 */
	DSL.map = function(callback) {
		var dsl = new DSL();
		callback.call(dsl);
		return dsl;
	};

	function canNest(dsl) {
		return dsl.parent && dsl.parent !== 'application';
	}

	function route(dsl, name, options) {
		options = options || {};

		if (typeof options.path !== 'string') {
			options.path = "/" + name;
		}

		if (canNest(dsl) && options.resetNamespace !== true) {
			name = dsl.parent + "." + name;
		}

  		dsl.push(options.path, name, null);
	}
	module.exports = DSL;
});