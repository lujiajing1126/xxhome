/**
 * 
 */
define(function(require, exports, module) {
	/**
	 * config & rules
	 */
	var jumpRouters = {
		"vote|:voteId|player|:playerId": {
			regExp: /^vote\|([\d]+)\|player\|([\d]+)$/,
			jumpUrl: 'voteplayer.html?vid=:voteId&pid=:playerId'
		},
		"vote|:voteId": {
			regExp: /^vote\|([\d]+)$/,
			jumpUrl: 'vote.html?vid=:voteId'
		},
		"event|:eventId": {
			regExp: /^event\|([\d\w]{24})$/,
			jumpUrl: 'event.html?eid=:eventId'
		},
		"organization|:oid": {
			regExp: /^organization\|([\d]+)$/,
			jumpUrl: 'organization.html?oid=:oid'
		},
		"job|:jid"{
			regExp: /^job\|([\d]+)$/,
			jumpUrl: 'discovery/job.html?jid=:jid'
		}
	};

	var router = function(param) {
		if (jumpRouters.hasOwnProperty(param))
			return jumpRouters[param];
		var jumpRouter, jumpUrl, routeRegExp;
		for (routerName in jumpRouters) {
			jumpRouter = jumpRouters[routerName];
			jumpUrl = jumpRouters[routerName]["jumpUrl"];
			if (jumpRouter.hasOwnProperty('regExp')) {
				routeRegExp = jumpRouter.regExp;
				if (routeRegExp.test(param)) {
					var valueArr = param.match(routeRegExp);
					var paramArr = routerName.match(/:([\w]*)/g);
					for (var i = 1, len = valueArr.length; i < len; i++) {
						jumpRouter[paramArr[i - 1].slice(1)] = valueArr[i];
						jumpUrl = jumpUrl.replace(paramArr[i - 1], valueArr[i]);
					}
					return jumpUrl;
				}
			}
		}
		return null;
	};
	module.exports = router;
});