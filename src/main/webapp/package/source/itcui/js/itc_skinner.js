var skinList = [
	{
		"name":"none",
		"css" : "skin/skin_no.css",
		"icon" : "skin/skin_no_t.png"
	},{
		"name":"sky",
		"css" : "skin/skin_sky.css",
		"icon" : "skin/theme_sky_banner_t.png"
	},/*{
		"name":"皮肤2",
		"css" : "skin/skin_wooden.css",
		"icon" : "skin/theme_wooden_full_banner_t.png"
	},{
		"name":"皮肤3",
		"css" : "skin/skin_yellow.css",
		"icon" : "skin/theme_yellow_banner_t.png"
	},{
		"name":"皮肤4",
		"css" : "skin/skin_grass.css",
		"icon" : "skin/theme_ntp_banner_t.png"
	},*/{
		"name":"皮肤5",
		"css" : "skin/skin_women.css",
		"icon" : "skin/theme_women_full_banner_t.png"
	},{
		"name":"leaf",
		"css" : "skin/skin_leaf.css",
		"icon" : "skin/theme_leaf_full_banner_t.png"
	},{
		"name":"green",
		"css" : "skin/skin_green.css",
		"icon" : "skin/theme_green_full_banner.png"
	},{
		"name":"red",
		"css" : "skin/skin_red.css",
		"icon" : "skin/theme_red_full_banner_t.png"
	}
];

(function($){
	$.fn.extend({ 
		ITCUI_AddSkinMenu : function(options){
			var options = options || {};
			applySkin = function(skin){
				if(document.createStyleSheet){
					//IE8-10
					document.createStyleSheet(skin);	
				}
				else{
					//IE11和chrome
					//移除所有组件库加上的节点
					$("head").find("link").each(function(){
						var _this = $(this);
						if(_this.attr("itcskin")){
							_this.remove();
						}
					})
					$('<link />').attr('rel', 'stylesheet').attr('href', skin).attr('itcskin',true).appendTo("head");
				}
			};

			menuHtml = '<div class="dropdown" style="position:absolute;" id="itcui_skinner_wrap">';
			menuHtml += '<a data-toggle="dropdown" id="itcui_skinner_toggler"></a>';
			menuHtml += '<ul class="dropdown-menu" role="menu">'
			if(options.menuBefore){
				menuHtml += options.menuBefore;
			}
			menuHtml += '<li><a class="menuitem">修改密码</a><li>';
			menuHtml += '<li class="divider"></li>';
			menuHtml += '<div style="width:190px;height:132px">';
			menuHtml += '<p style="margin-left:12px;font-size:12px;font-weight:bold">选择主题</p>';
			menuHtml += '<div style="width:180px;height:106px;margin-left:14px">'
			for(var i=0;i<skinList.length;i++){
				var skin = skinList[i];
				menuHtml += '<span class="itcui_skin_icon" style="background-image:url(\'' + skin.icon + '\')" targetcss="' + skin.css + '">'
				menuHtml += '</span>';
			}
			menuHtml += '</div>';
			menuHtml += '</div>';
			if(options.menuAfter){
				menuHtml += '<li class="divider"></li>';
				menuHtml += options.menuAfter;
			}
			menuHtml += '</ul>';
			menuHtml += '</div>';

			$("body").append(menuHtml);

			//加载cookies中的skin
			var cookieSkin = $.cookie("itcui_skin");
			if(cookieSkin){
				applySkin(cookieSkin);
			}

			$("#itcui_skinner_wrap").find(".itcui_skin_icon").each(function(){
				$(this).click(function(){
					var css = $(this).attr("targetcss");
					if($.cookie){
						$.cookie("itcui_skin",css,{"expires":180});
					}
					applySkin(css);
				});
			});

			$(this).click(function(e){
				e.stopPropagation();				
				$("#itcui_skinner_toggler").dropdown("toggle");
				var pos = ITC_GetAbsPos(this);
				$("#itcui_skinner_wrap").css({
					top: pos.top + 16,
					left : pos.left - 170
				});
			});
		}
	});
})(jQuery);