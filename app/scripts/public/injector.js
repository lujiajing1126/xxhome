/**
 * Global Dependency Injector
 * @author megrez
 */
define(function(require,exports,module){
	/**
	 * [injector description]
	 * @param  {[type]} $scope [description]
	 * @return {[type]}        [description]
	 */
	var injector = function($scope) {
		this.all = {
			'$EventModel': require('scripts/models/EventModel'),
			'$UserModel': require('scripts/models/UserModel'),
			'$ApplyFormModel': require('scripts/models/ApplyFormModel')
		};
		this.deps = [];
		this.depStr = "";
	};
	/**
	 * [instantiate description]
	 * @param  {[type]} controller [description]
	 * @param  {[type]} $scope     [description]
	 * @return {[type]}            [description]
	 */
	injector.prototype.instantiate = function(controller,$scope) {
		var $inject = controller['$inject'] || [];
		this.all['$scope'] = $scope;
		this.deps = [];
		this.depStr = "";
		for(var i=0,len=$inject.length;i<len;i++) {
			this.deps.push(this.all[$inject[i]]);
			this.depStr += "args["+i+"],";
		}
		var IController = new Function('fn','args','return new fn('+ this.depStr.slice(0,-1) +');');
		return IController.apply(null,[controller,this.deps]);
	};
	/**
	 * [register description]
	 * @param  {[type]} moduleName [description]
	 * @param  {[type]} value      [description]
	 * @return {[type]}            [description]
	 */
	injector.prototype.register = function(moduleName,value) {
		this.all[moduleName] = value;
	};
	module.exports = injector;
});