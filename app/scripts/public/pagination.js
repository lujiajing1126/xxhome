define(function(require,exports,module){
	var $ = SUI.$;
	$.pagination = function(totalpage,currentPage,hashBase) {
		var navs = [],
			sIndex, eIndex,
			$ul = $("<ul>").addClass('pagination');
		if (totalPage == 1) {
			return navs;
		} else if (currentPage <= 3) {
			sIndex = 1;
			eIndex = totalPage > 5 ? 5 : totalPage;
		} else {
			eIndex = totalPage > currentPage + 2 ? currentPage + 2 : totalPage;
			sIndex = eIndex - 4;
		}
		for (var i = sIndex; i <= eIndex; i++) {
			var href = "#" + hashBase + "?page=" + i;
			if (i == currentPage)
				navs.push('<li class="active"><a>' + i + '</a></li>');
			else
				navs.push('<li><a href="' + href + '">' + i + '</a></li>');
		}
		return navs;
	}
});