define(function(require, exports, module) {
	var $ = SUI.$,
	Helper=require('../js/public/helper');

	var XX = {};
	XX.actions = {
		createOrg: function() {
			var session = $.cookie("userSession");
			if (!session) {
				alert("请先登录！");
				return;
			}
			$.ajax({
				"url": "/api/account/create_organization",
				"type": "POST",
				"dataType": "JSON",
				"data": {
					parentId: "",
					email: "",
					name: "新建组织",
					decription: "",
					session: session
				}
			}).done(function(data) {
				if(data.status=="OK")
				alert("组织创建成功，您可以进入组织管理系统！");
			}).fail(function(msg) {
				alert(msg);
				console.log(msg);
			});
		},
		//轮播图
		popbox: function() {
			var Popbox = require('home/js/lib/popbox/popbox');
			$.ajax({
				"url": "/popbox",
				"type": "POST",
				"dataType": "JSON",
				"data": {}
			}).done(function(data) {
				var box = new Popbox();
				box.width = 960;
				box.height = 370;
				box.autoplayer = 2;
				box.add(data);
				box.render("popbox");
			}).fail(function(data) {
				data = Xiao.POPBOX_DATA;
				var box = new Popbox();
				box.width = 960;
				box.height = 370;
				box.autoplayer = 2;
				box.add(data);
				box.render("popbox");
			});
		},
		//切换
		toggleOrgZoneLayer: function() {
			$("#OrgZoneLayer").toggleClass("off").toggleClass("on");
		},
		selectOrgType: function() {
			this.siblings("span.org-type").removeClass("current").end().addClass("current");
		},
		showOrgActivities: function() {
			var target = this;
			//首先更新所选社团的样式
			$(target).siblings("li").removeClass("current").end().addClass("current");

			XX.actions.showOrgActivity();
		},

		toggleLayer: function(layerId, show) {
			var layer = $("#" + layerId);
			if (show) {
				layer.removeClass("off").addClass("on");
			} else {
				layer.removeClass("on").addClass("off");
			}
		},
		showOrgActivity: function() {
			var stid = $("#OrgList").find("li.current").attr("data-value");
			var activity_list_wrapper = $("#ArticleList");

			activity_list_wrapper.find("ul.activity-list").removeClass("current");

			var stActivityUl = activity_list_wrapper.find("ul.activity-list[data-value=" + stid + "]");
			if (stActivityUl.length > 0) {
				stActivityUl.addClass("current");
			} else {
				activity_list_wrapper.find(".loader").addClass("on");

				var ul = document.createElement("ul");
				$(ul).attr({
					"class": "activity-list current",
					"data-value": stid
				})
					.appendTo(activity_list_wrapper);

				// 获取社团列表
				XX.actions.requestOrgActivities();

			}
		},
		requestHotArticles: function() {
			$.ajax({
				url: '/requestHotArticles',
				type: 'POST',
				dataType: 'JSON',
				data: {}
			}).done(function(data) {
				fill(data);
			}).fail(function(error) {
				console.log(error);
				fill(Xiao.ARTICLEDATA);
			});

			function fill(data) {
				var html = "";
				for (i = 0, l = data.length; i < l; i++) {
					html += getHtml(data[i], i % 2 == 0);
				}
				$("#HotArticles").html(html);
			}
			/**
			 * 填充热门文章
			 * @param:
			 * 	typeData-->某类型的文章数据
			 * 	odd-->是否为奇数索引
			 */
			function getHtml(typeData, odd) {
				var className = odd ? "odd" : "even";
				var items = typeData.articles;
				var firstItem = items[0];

				var html = "";
				html += "<!--start--><div class='article-container " + className + "'><!--focus img start-->";
				html += "<div class='focus' style='background-image:url(" + firstItem.img + ");'>";
				html += "<!--<img src='" + firstItem.img + "' />--><!--title date start-->";
				html += "<div class='title-wrapper inline-block-wrapper'>";
				html += "<span class='title inline-block'>" + firstItem.title + "</span><span class='date inline-block'>" + firstItem.date + "</span>";
				html += "</div><!--title date end--></div><!--focus img end-->";
				html += "<!--info start--><div class='info'><ul class='article-list'>";

				for (var i = 0, l = items.length; i < l; i++) {
					var item = items[i];
					var id = item.id,
						title = item.title,
						date = item.date,
						img = item.img;
					var href = "#" + id;
					html += "<li><a href='" + href + "' target='_blank'><span class='title'>" + title + "</span><span class='date'>" + date + "</span></a></li>";
				}

				html += "</ul></div><!--info end-->";
				html += "</div><!--end-->";

				return html;
			}
		},
		requestOrgActivities: function() {
			$.ajax({
				"url": "/requestOrgActivities",
				"type": "POST",
				"dataType": "JSON"
			}).done(function(data) {
				fill(data);
			}).fail(function(error) {
				fill(Xiao.STACTIVITYDATA.object);
			});

			function fill(data) {
				var html = "";
				$(data).each(function(i, item) {
					var id = item.id,
						title = item.title,
						date = item.date,
						detail = item.detail,
						address = item.address,
						img = item.img,
						href = "";

					html += "<!--activity start-->"; //开始标识
					html += "<li><div class='activity-inner'><!--date start-->";
					html += "<p class='activity-date'><span>" + date + "</span></p><!--date end-->";
					html += "<div class='activity-wrapper clearfix'><!--focus img start-->";
					html += "<div class='focus' style='background-image:url(" + img + ");'><!--<img src='" + img + "' alt='" + title + "' border='0' />--></div><!--focus img end-->";
					html += "<div class='info'><!--title start-->"; //info start
					html += "<header class='activity-title'><h1><a target='_blank' href='" + href + "'>" + title + "</a></h1></header><!--title end--><!--content start-->";
					html += "<p class='activity-context'>" + detail + "</p><!--content end--><!--address strat-->";
					html += "<p class='activity-address'>地址：" + address + "</p><!--address end-->";
					html += "</div>"; //info end
					html += "</div>";
					html += "</div></li>";
					html += "<!--activity end-->"; //结束标识
				});
				var container = $(".activity-list.current");
				container.html(html);
				setTimeout(function() {
					container.parents(".activity-list-wrapper").find(".loader").removeClass("on");
				}, 3000);
			}
		},
		getOrgList: function() {
			$.ajax({
				"url": "/OrgList",
				"type": "POST",
				"dataType": "JSON",
				"data": {}
			}).done(function(data) {
				fillOrg(data);
				XX.actions.showOrgActivity();
			}).fail(function(error) {
				fillOrg(Xiao.ORGLIST);
				XX.actions.showOrgActivity();
			});

			function fillOrg(data) {
				var html = "";
				for (var i = 0, l = data.length; i < l; i++) {
					var item = data[i];
					var id = item.id,
						name = item.name,
						logo = item.logo,
						type = item.type,
						level = item.level;
					var href = "#" + id;
					var className = i == 0 ? "clearfix current" : "clearfix";
					html += "<li class='" + className + "' data-value='" + id + "' data-xx-action='showOrgActivities'>";
					html += "<div class='focus' style='background-image:url(" + logo + ");'><!--<img src='" + logo + "' />--><div class='st-type-icon-wrapper'><div class='" + getOrgFlag(type) + "'></div></div></div>";
					html += "<div class='info'><header class='st-name'><h1><a href='" + href + "' target='_blank'>" + name + "</a></h1></header><p class='st-type'>" + getOrgType(type) + "</p><!--<p class='st-level'><span>社团等级</span>-->" + getOrgLevel(level) + "</p></div>";
					html += "</li>";
				}
				//填充
				$("#OrgList").html(html);
			}
			//根据社团类型返回社团旗帜
			function getOrgFlag(type) {
				switch (type) {
					case 1:
						return "st-type-icon academic";
					default:
						return "st-type-icon academic";
				}
			}
			//根据社团类型返回社团类型名称
			function getOrgType(type) {
				switch (type) {
					case 1:
						return "学术类";
					default:
						return "其他";
				}
			}
			//获取社团等级（根据等级返回星星~）
			function getOrgLevel(level) {
				var stars = "";
				for (var i = 0; i < level; i++) {
					stars += "<span class='star'></span>";
				}
				return stars;
			}
		}
	};
	module.exports = XX.actions;
});