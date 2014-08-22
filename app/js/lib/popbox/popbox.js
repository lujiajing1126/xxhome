/**
 * function:轮播图对象
 * author:Picker
 * date:2014-07-07
 */
define(function(require, exports, module) {
	var Popbox = function() {
			this.uid = popBoxHelper.getId();
			popBoxHelper.instance[this.uid] = this;
			this.items = [];
			this.currentIndex = 0;
			this.width = 800;
			this.height = 450;
			this.titleHeight = 60;
			this.autoplayer = 3;
		}
		//渲染
	Popbox.prototype.render = function(containerId) {
		this.init(containerId);
		this.boxHtml();
	};
	//初始化
	Popbox.prototype.init = function(containerId) {
		var len = this.items.length;
		this.flashWidth = this.width * len;
		this.BoxId = "Main_Box_" + this.uid; // 容器
		this.ImgId = "Img_Box_" + this.uid; // 图片
		this.IdxId = "Idx_Box_" + this.uid; // 索引
		this.TitleId = "Title_Box_" + this.uid; // 标题
		var html = "<div class='xx-popbox-container' id='" + this.BoxId + "' style='width:" + this.width + "px;height:" + (this.height + this.titleHeight) + "px;'>";
		html += "<div class='xx-img-container' id='" + this.ImgId + "' style='width:" + this.flashWidth + "px;height:" + this.height + "px;'></div>";
		html += "<div class='xx-idx-container' id='" + this.IdxId + "' style='width:" + this.width + "px;height:18px;bottom:30px;'></div>";
		html += "<div class='xx-title-container' id='" + this.TitleId + "' style='width:" + this.flashWidth + "px;height:" + this.titleHeight + "px;bottom:20px;'></div>";
		html += "</div>";
		this.$get(containerId).innerHTML = html;
	};

	// 添加图片对象
	Popbox.prototype.add = function(item) {
		if (item instanceof Array)
			this.items = this.items.concat(item);
		else
			this.items.push(item);
	};
	// 填充轮播图容器
	Popbox.prototype.boxHtml = function() {
		var len = this.items.length;
		var imgHtml = "",
			idxHtml = "",
			titleHtml = "";
		var eventstr = "popBoxHelper.instance['" + this.uid + "']";
		for (var i = 0; i < len; i++) {
			var item = this.items[i];
			imgHtml += this.imgHtml(item.url, item.href, i, this.width, this.height);
			idxHtml += this.indexHtml(i, item.title, eventstr);
			titleHtml += this.titleHtml(i, item.type, item.title, item.href, item.date, item.org, eventstr, this.width, this.titleHeight);
		}
		this.$get(this.ImgId).innerHTML = imgHtml;
		this.$get(this.IdxId).innerHTML = idxHtml;
		this.$get(this.TitleId).innerHTML = titleHtml;

		this.mouseoverPic(0);
	};
	// 图片创建
	Popbox.prototype.imgHtml = function(url, href, idx, width, height, type) {
		return "<div class='xx-img-wrapper' style='width:" + width + "px;height:" + height + "px;'><img src='" + url + "' /></div>";
	};
	// 索引创建
	Popbox.prototype.indexHtml = function(idx, title, popbox) {
		return "<div class='xx-idx-wrapper " + ((idx == 0) ? "curimg" : "defimg") + "' title='" + title + "' onclick=\"" + popbox + ".clickPic(" + idx + ")\" onmouseover=\"" + popbox + ".mouseoverPic(" + idx + ")\"></div>";
	};
	// 标题创建
	Popbox.prototype.titleHtml = function(idx, type, title, href, date, org, popbox, width, height) {
		date = new Date(date);
		var gd = (date.getDate() > 9 ? "" : "0") + date.getDate();
		var gm = ((date.getMonth() + 1) > 9) ? "" : "0" + (date.getMonth() + 1);
		var tdate = gd + "/" + gm;
		return "<div class='xx-title-wrapper inline clearfix' style='width:" + this.width + "px;height:" + this.titleHeight + "px;line-height:" + this.titleHeight + "px;'><div class='focus'>" + this.getType(type) + "</div><div class='info'><p class='date'>" + tdate + "</p><p class='title'><span class='org'>" + org + "</span>—<a href='" + href + "'><span class=''>" + title + "</span></a></p></div></div>";
	};
	// 鼠标悬浮事件
	Popbox.prototype.mouseoverPic = function(idx) {
		this.changeIndex(idx);
		if (this.autoplayer > 0) {
			clearInterval(this._autoplay);
			var eventstr = "popBoxHelper.instance['" + this.uid + "']._play()";
			this._autoplay = setInterval(eventstr, this.autoplayer * 1000);
		}
	};
	// 鼠标点击事件
	Popbox.prototype.clickPic = function(idx) {
		var parame = this.items[idx];
		if (parame.href && parame.href != "") {
			window.open(parame.href, this.target);
		}
	};
	//轮播向前进
	Popbox.prototype.changeIndex = function(idx) {
		var parame = this.items[idx];
		popBoxHelper.moveElement(this.ImgId, -(idx * this.width), 10);
		popBoxHelper.moveElement(this.TitleId, -(idx * this.width), 10);
		var imgs = this.$get(this.IdxId).getElementsByTagName("div");
		imgs[this.currentIndex].className = "xx-idx-wrapper defimg";
		imgs[idx].className = "xx-idx-wrapper curimg";
		this.currentIndex = idx;
	};
	// 播放
	Popbox.prototype._play = function() {
		clearInterval(this._autoplay);
		var idx = this.currentIndex + 1;
		if (idx >= this.items.length) {
			idx = 0;
		}
		this.changeIndex(idx);
		var eventstr = "popBoxHelper.instance['" + this.uid + "']._play()";
		this._autoplay = setInterval(eventstr, this.autoplayer * 1000);
	};
	//根据id返回对象
	Popbox.prototype.$get = function(id) {
		return document.getElementById(id);
	};
	//根据类型返回旗帜
	Popbox.prototype.getType = function(type) {
		switch (type + "") {
			case "1": //讲座
				return "<span class='type-wrapper lecture'><span class='square'>讲</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			case "2": //
				return "<span class='type-wrapper show'><span class='square'>演</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			case "3":
				return "<span class='type-wrapper benefit'><span class='square'>益</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			case "4":
				return "<span class='type-wrapper competition'><span class='square'>赛</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			case "5":
				return "<span class='type-wrapper party'><span class='square'>聚</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			case "6":
				return "<span class='type-wrapper attract'><span class='square'>招</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			case "7":
				return "<span class='type-wrapper else'><span class='square'>其</span><span class='triangle left'></span><span class='triangle right'></span></span>";
			default:
				return "<span class='type-wrapper else'><span class='square'>其</span><span class='triangle left'></span><span class='triangle right'></span></span>";
		}
	};


	window.popBoxHelper = {
		count: 0,
		instance: {},
		getId: function() {
			return '_ppt_box-' + (this.count++);
		},
		moveElement: function (elementID, final_x, interval) {
			if (!document.getElementById) return false;
			if (!document.getElementById(elementID)) return false;
			var elem = document.getElementById(elementID);
			if (elem.movement) {
				clearTimeout(elem.movement);
			}
			if (!elem.style.left) {
				elem.style.left = "0px";
			}
			var xpos = parseInt(elem.style.left);
			if (xpos == final_x) {
				return true;
			}
			if (xpos < final_x) {
				var dist = Math.ceil((final_x - xpos) / 5);
				xpos = xpos + dist;
			}
			if (xpos > final_x) {
				var dist = Math.ceil((xpos - final_x) / 5);
				xpos = xpos - dist;
			}
			elem.style.left = xpos + "px";
			var repeat = "popBoxHelper.moveElement('" + elementID + "'," + final_x + "," + interval + ")";
			elem.movement = setTimeout(repeat, interval);
		}

	};



	module.exports = Popbox;
});