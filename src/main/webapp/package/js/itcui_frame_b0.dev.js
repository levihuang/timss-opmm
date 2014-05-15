
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_core.js
*/
var itcui = itcui || {};
itcui.combo_displayed = false;
function ITC_GetAbsPos(obj)
{
	var o = $(obj);
	var obj_x = o.offset().left;
	var obj_y = o.offset().top;
	while(o.attr("parentNode"))
	{
		o = o.parent();
		obj_x += o.offset().left;
		obj_y += o.offset().top;
	}
	var p = {"left":obj_x,"top":obj_y};
	return p;
}

function _parent(){
	if(window.parent.document==document){
		return window;
	}
	else{
		return window.parent;
	}
}

function ITC_Len(str){
	var len = str.length;
	var reLen = 0; 
	    for (var i = 0; i < len; i++) {        
	        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) { 
	            // 全角    
	            reLen += 2; 
	        } else { 
	            reLen++; 
	        } 
	    } 
	return reLen;  
}

function ITC_Substr(str, startp, endp) {
    var i=0; c = 0; unicode=0; rstr = '';
    var len = str.length;
    var sblen = ITC_Len(str);

    if (startp < 0) {
        startp = sblen + startp;
    }

    if (endp < 1) {
        endp = sblen + endp;// - ((str.charCodeAt(len-1) < 127) ? 1 : 2);
    }
    // 寻找起点
    for(i = 0; i < len; i++) {
        if (c >= startp) {
            break;
        }
	    var unicode = str.charCodeAt(i);
		if (unicode < 127) {
			c += 1;
		} else {
			c += 2;
		}
	}
	// 开始取
	for(i = i; i < len; i++) {
	    var unicode = str.charCodeAt(i);
		if (unicode < 127) {
			c += 1;
		} else {
			c += 2;
		}
		rstr += str.charAt(i);
		if (c >= endp) {
		    break;
		}
	}
	return rstr;
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]'; 
}
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_163frame.js
*/
var USE_ITC_FRAME = true;

//框架相关
var curr_nav_state,nav_tree_show,_container,navtree_width;
if(USE_ITC_FRAME){
	curr_nav_state = 1;
	nav_tree_show = true;
	_container = new ITCUI_Container("#mainframe_content");
	navtree_width = 200;
}
function ITCUI_FrameAdjust()
{
	var scn_height = document.documentElement.clientHeight;
	var scn_width = parseInt(document.documentElement.clientWidth);

	if(scn_width<740)
	{
		scn_width = 740;
		if(!$("body").hasClass("ovfx-s"))
		{
			$("body").addClass("ovfx-s");
		}
		$("#mainframe_bottom").css("width",scn_width);
	}
	else
	{
		$("body").removeClass("ovfx-s");
		$("#mainframe_bottom").css("width","100%");
	}
	
	$("#mainframe_bottom,#mainframe_navtree,#mainframe_content").css("height",scn_height - 90);
	if(scn_width<940&&nav_tree_show==true)
	{
		$('#mainframe_navtree').css("width","0px");
		$('#btn_tree_fold').css("left","1px").html("<img src=\"images/nav_arrow_expand.png\" />");
		curr_nav_state = 0;
		nav_tree_show = false;
		navtree_width = 0;
	}
	else if(scn_width>=940&&nav_tree_show==false)
	{
		$('#mainframe_navtree').css("width","200px");
		$('#btn_tree_fold').css("left","201px").html("<img src=\"images/nav_arrow_fold.png\" />");
		navtree_width = parseInt($("#mainframe_navtree").css("width"));
		curr_nav_state = 1;
		nav_tree_show = true;
	}
	$("#mainframe_content").css("width",scn_width-navtree_width-1)
	_container.resize();
}




/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_container.js
*/
/*
	多iframe容器
*/
function ITCUI_Container(targetId){
	var _targetId = targetId;
	var frames = {};
	var currFrame = null;
	var currWidth = 

	this.switchTo = function(id,url,options){
		//判断上一个iframe是移除还是缓存
		var lastFrame = $(_targetId).children(".ITCUI_Iframe_" + currFrame);
		if(frames[currFrame]&&frames[currFrame].cache){
			lastFrame.css("display","none");
		}
		else{
			lastFrame.remove();
			delete(frames[currFrame]);
		}
		if(frames[id]&&frames[id].cache){
			$(_targetId).children(".ITCUI_Iframe_" + id).css("display","block");
		}
		else{		
			$("<iframe  frameborder='no' border='0'></iframe").addClass("ITCUI_ContainerFrame").addClass("ITCUI_Iframe_" + id).appendTo(targetId);
			frames[id] = options;
			currFrame = id;
			this.resize();
			$(targetId).children(".ITCUI_Iframe_" + id).attr("src",url);
		}
	}

	this.resize = function(){
		var _parent = $(targetId);
		_parent.children(".ITCUI_Iframe_" + currFrame).css({
			width : _parent.css("width"),
			height : _parent.css("height")
		});

	}

	this.remove = function(id){
		delete(frames[id]);
		$(_targetId).children(".ITCUI_Iframe_" + id).remove();
	}
}
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_eventhandler.js
*/
ITCUI_EventHandler  = function(){
	var events = {};//事件列表 事件名->触发函数1，触发函数2，....
	var evtCount = 0;
	var invMapping = [];//反向映射 事件编号->事件内编号，事件ID
	var variables = {};

	this.registerEvent = function(eventId,f){
		var t = events[eventId];
		if(!t){
			events[eventId] = [];
			t = events[eventId];
		}
		var innerId = t.length
		var hasPlace = false;
		for(var i=0;i<t.length;i++){
			if(t[i]==f){
				return -1;
			}
			if(t[i]==null){
				hasPlace = true;
				t[i] = f;
				innerId = i;
			}
		}
		if(!hasPlace){
			t.push(f);
			
		}
		invMapping.push([innerId,eventId]);
		return invMapping.length - 1;
	};

	this.unregisterEvent = function(evtNo){
		var t = invMapping[evtNo];
		if(!t){
			return;
		}
		var evtId = t[1];
		var innerId = t[0];
		invMapping[evtNo] = null;
		events[eventId][innerId] = null;

	};

	this.triggerEvent = function(eventId,args){
		if(events[eventId]){
			for(var i=0;i<events[eventId].length;i++){
				var f = events[eventId][i];
				f(args);
			}
		}
	}

	this.setVariable = function(v,val){

	}

	this.getVariable = function(v){
		
	}
}

var _event_handler = _event_handler || new ITCUI_EventHandler();
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_navtree.js
*/
(function($){
	$.fn.extend({
		/*
			导航树（只支持两层）
			data : [{"grouptitle":"组标题","items":[{"title":"项标题","action":"点击后的动作"}],"initexpand":true}]
			opts:
				expandOnlyOne - 每次只能展开一层
				width - 树宽度
				treeId - 树Id，如果需要在一个页面产生多个导航树需要修改这个
		*/
		ITCUI_NavTree:function(action,data,opts){
			var expandedNode = null;
			var treeWidth = 200;
			var treeName = "itc_navtree";
			var _this = $(this);
			var eventList = {};
			var expandOnlyOne = false;


			this.initTree = function(data,opts){
				var treeHtml = '<div class="mainframe_navtree" id="' + treeName + '">';
				for(var j=0;j<data.length;j++){
					treeGroup = data[j];
					var grpId = treeName + "_" + j;
					if(!treeGroup.items){
						treeHtml += '<div class="itcui_navtree_nochildren" id="' + treeGroup.id + '">' + treeGroup["grouptitle"] + '</div>';
						continue;
					}
					treeHtml += '<div class="itcui_navtree_grouptitle" id="' + grpId + '">' + treeGroup["grouptitle"] + '</div>';
					var subItemid = grpId + "_subitem";
					treeHtml += '<div id="' + subItemid + '" class="navtree_subitem"';
					if(!treeGroup["initexpand"]){
						treeHtml += ' style="display:none"';
					}
					else{
						expandedNode = grpId;
					}
					treeHtml += '>';
					//tree sub item
					if(treeGroup["items"]){
						for(var i=0;i<treeGroup['items'].length;i++){
							var treeitem = treeGroup['items'][i];
							var itemId = treeitem.id || treeName + "_item_" + j + "_" + i;
							treeHtml += '<div class="itcui_navtree_item" id="' + itemId + '">';
							treeHtml += treeitem["title"] + "</div>";
							if(treeitem["click"]){
								eventList[itemId] = treeitem["click"];
							}
						}
					}
					treeHtml += '</div>';//end of subitem
				}
				treeHtml += '</div>';//end of tree
				_this.html(treeHtml);
			};

			this.addEvents = function(data,opts){
				//鼠标点击时对子项高亮
				$("#" + treeName).find(".itcui_navtree_item,.itcui_navtree_nochildren").click(function(){
					$("#" + treeName).find(".itcui_navtree_item_selected").removeClass("itcui_navtree_item_selected");
					$(this).addClass("itcui_navtree_item_selected");
					var evt = eventList[this.id];
					if(_event_handler){
						_event_handler.triggerEvent("navTreeItemClick",this.id)
					}
					if(evt){
						if(typeof(evt)=="function"){
							evt(this.id);
						}
						else{
							eval(evt);
						}
					}
				});

				//树折叠效果
				$("#" + treeName + " .itcui_navtree_grouptitle").click(function(){
					var box_id = this.id + "_subitem";
					var is_fold = $("#" + box_id).css("display")=="none"?true:false;
					//收起其他的选项卡
					if(expandOnlyOne){
						$("#" + expandedNode).removeClass("itcui_navtree_grouptitle_expand");
						$("#" + expandedNode + "_subitem").slideUp();
					}
					if(is_fold)
					{
						expandedNode = this.id;
						$("#" + box_id).slideDown();
						$(this).addClass("itcui_navtree_grouptitle_expand");
					}
					else
					{
						$("#" + box_id).slideUp();
						$(this).removeClass("itcui_navtree_grouptitle_expand");
					}
				});
			}

			if(action=="init"){
				if(opts){
					if(opts["width"] && opts["width"]>100){
						treeWidth = opts["width"];
					}
					if(opts["expandOnlyOne"]){
						expandOnlyOne = true;
					}
				}			
				this.initTree(data,opts);
				this.addEvents(data,opts);
			}
		}
	});
})(jQuery);

/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_navigation.js
*/
ITCUI_Navigation = function(renderTo,items,options){
	this.MAX_TAB = 6;
	var currTabCount = 0;
	this.handle = {};
	this._items = items;
	this._options = options || {};
	this._renderTo = renderTo;
	var _events = {};
	var _this = this;
	var hidTabs = [];
	
	
	this.init = function(){
		_handle = this.handle;
		_handle["container"] = $(this._renderTo).html("");
		_handle["navigation"] = $('<div></div>').addClass('itcui-navigation')
                .appendTo(_handle["container"]);
        _handle["navigation"].data("obj",this);
		_handle["ul"] = $('<ul></ul>').addClass('itcui-navigation-ul')
			.appendTo(_handle["navigation"]);
			
		_handle["separator"] = $('<div></div>').addClass('itcui-navigation-separator')
                .appendTo(_handle["navigation"]);
				
		var navHtml = "";
		for(var i=0;i<items.length;i++){
			var item = items[i];
			navHtml += this._makeTabHtml(item);
			if(item.id){
				_events[item.id] = {};
				if(item.click) _events[item.id]["click"] = item.click;
				if(item.beforeClose) _events[item.id]["beforeClose"] = item.beforeClose;
				if(item.afterClose) _events[item.id]["afterClose"] = item.afterClose;
				if(item.beforeClick) _events[item.id]["beforeClick"] = item.beforeClick;
			}
		}
		//配置菜单
		navHtml += '<li class="itcui-navigation-item-options-menu-button itcui-navigation-item" style="float:left">';
		navHtml += '<b></b></li>';
		menuHtml = '<div class="dropdown" style="position:absolute" id="itcui_nav_toggler_wrap">';
		menuHtml += '<a data-toggle="dropdown" id="itcui_nav_toggler"></a>';
		menuHtml += '<ul class="dropdown-menu" role="menu">'
		menuHtml += '</ul>';
		menuHtml += '</div>';
		$("body").append(menuHtml);
		_handle["ul"].html(navHtml);
		this._bindEvent();
		_this.arrangeTab();
	}
	
	this._makeTabHtml = function(item){
		var tabHtml = "";
		if(!typeof(item)=="object"||!item.name){
			//参数必须是json对象 而且得有一个名字
			return "";
		}
		if(!item.front){
			item.front = "";
		}		
		if(item.id){
			tabHtml += "<li class='itcui-navigation-item' style='width:120px' id='itcui_nav_tab_" + item.id + "'>";	
		}
		else{
			tabHtml += "<li class='itcui-navigation-item' style='width:120px'>";		
		}
		tabHtml += "<span class='itcui-navigation-item-front'>" + item.front + "</span>";
		//鼠标提示信息
		item.title = item.title?item.title:item.name;
		tabHtml += "<span class='itcui-navigation-item-name' title='" + item.title + "'>" + item.name + "</span>";
		
		tabHtml += "<span class='itcui-navigation-item-rear' style='display:inline'>";
		if(item.closeable){
			tabHtml += "<a class='itcui-navigation-item-close-button'><b>x</b></a>";
		}
		else{
			tabHtml += "<a class='itcui-navigation-item-close-button' style='display:none'><b>x</b></a>";
		}
		tabHtml += "</span>";
		
		tabHtml += "</li>";	
		currTabCount += 1;	
		return tabHtml;
	}
	
	this._bindEvent = function(){
		_handle = this.handle;
		_handle["container"].find(".itcui-navigation-item").each(function(e){
			_this._bindSingleEvent($(this));
		});
	}
	
	this._bindSingleEvent = function(obj){
		obj.on('mouseenter', function(e){
            if(!$(this).hasClass('itcui-navigation-item-selected')){
				$(this).removeClass('itcui-navigation-item').addClass('itcui-navigation-item-hover');
			}
        }).on('mouseleave', function(e){
			if(!$(this).hasClass('itcui-navigation-item-selected')){
				$(this).addClass('itcui-navigation-item');
			}
			$(this).removeClass('itcui-navigation-item-hover')
        }).on('click',function(e){
        	e.stopPropagation();
        	var _this = $(this);
        	var ptr = _this.parents(".itcui-navigation").data("obj");			
			if(_this.attr("id")){								
				var id = _this.attr("id").replace("itcui_nav_tab_","");
				ptr.activeById(id);
			}
			if(_this.hasClass("itcui-navigation-item-options-menu-button")){
				menuHtml = '<li targettab="_all"><a class="menuitem"><i class="itcui_close_tab"></i>关闭所有选项卡</a></li>';
				if(hidTabs.length>0){
					menuHtml += '<li class="divider"></li>';
					for(var i=0;i<hidTabs.length;i++){
						menuHtml += '<li targettab="' + hidTabs[i][0] + '"><a class="menuitem"><i class="itcui_menu_icon"></i>' + hidTabs[i][1] + '</a></li>';
					}
				}
				$("#itcui_nav_toggler_wrap ul").html(menuHtml);
				$("#itcui_nav_toggler_wrap").data("ptr",ptr);
				//选项卡管理菜单事件绑定
				$("#itcui_nav_toggler_wrap ul li").click(function(){
					var _this = $(this);
					var ptr = _this.parent().parent().data("ptr");
					var target = _this.attr("targettab");
					if(target=="_all"){
						ptr._closeAll();
					}
					else{
						ptr.activeById(target);
					}
				});
				var pos = ITC_GetAbsPos(this);
				$("#itcui_nav_toggler_wrap").css({
					"top":pos.top+32,
					"left":pos.left
				});
				$("#itcui_nav_toggler").dropdown("toggle");
			}
		});			
		obj.find('.itcui-navigation-item-close-button').on('click',function(e){
			e.stopPropagation();
		}).on('mouseover',function(e){
			$(this).addClass("itcui-navigation-item-close-button-hover");
		}).on('mouseleave',function(e){
			$(this).removeClass("itcui-navigation-item-close-button-hover");
		}).on('click',function(e){
			var _this = $(this);
			var id = _this.parent().parent().attr("id").replace("itcui_nav_tab_","");
			var ptr = _this.parents(".itcui-navigation");
			ptr.data("obj").removeById(id);
		});
	}

	//options中的position只支持after:id/before:id/first/last四个选项，默认为last
	this.insert = function(item,options){
		options = options || {};
		var position = options.position || "last";
		if(!item){
			return;
		}
		var tabHtml = this._makeTabHtml(item);
		if(item.id){
			_events[item.id] = {};
			if(item.click) _events[item.id]["click"] = item.click;
			if(item.beforeClose) _events[item.id]["beforeClose"] = item.beforeClose;
			if(item.afterClose) _events[item.id]["afterClose"] = item.afterClose;
			if(item.beforeClick) _events[item.id]["beforeClick"] = item.beforeClick;
		}
		if(position=="first"){
			_handle["ul"].prepend(tabHtml);
			_this._bindSingleEvent(_handle["ul"].find(".itcui-navigation-item").first());
		}
		else if(position=="last"){
			_this._bindSingleEvent(_handle["ul"].children(".itcui-navigation-item-options-menu-button").
				before(tabHtml).prev(".itcui-navigation-item"));
		}
		else if(/before/.test(position)){
			var targetid = "#itcui_nav_tab_" + position.replace("before:","");
			_this._bindSingleEvent(_handle["ul"].find(targetid).before(tabHtml).prev(".itcui-navigation-item"));
		}
		else if(/after/.test(position)){
			var targetid = "#itcui_nav_tab_" + position.replace("after:","");
			_this._bindSingleEvent(_handle["ul"].find(targetid).after(tabHtml).next(".itcui-navigation-item"));
		}
		_this.arrangeTab();
	}	
	
	this.arrangeTab = function(){
		if(currTabCount<=_this.MAX_TAB){
			_handle["ul"].find(".itcui-navigation-item").first().css('margin-left',"0px");
			return;
		}
		var firstTab = _handle["ul"].find(".itcui-navigation-item-options-menu-button");
		var flag = true;
		var findCnt = 0;
		var findOneMore = false;
		hidTabs = [];
		while(flag){
			firstTab = firstTab.prev("li");
			if(firstTab.length>0){
				findCnt ++;
				//一共找N个tab 前N-1个可以随便找 但是找最后1个的时候一定要有一个已激活的
				if(findCnt<_this.MAX_TAB){
					if(firstTab.css("display")=="none"){
						firstTab.css({"display":"block"}).addClass("itcui-navigation-item");
					}
					if(firstTab.hasClass("itcui-navigation-item-selected")){
						//在前N-1个里已经有一个激活的 后面还可以显示一个
						findOneMore = true;
					}
				}
				else{
					if(findOneMore){
						if(firstTab.css("display")=="none"){
							firstTab.css({"display":"block"}).addClass("itcui-navigation-item");
						}	
						findOneMore = false;
					}
					else{
						if(!firstTab.hasClass("itcui-navigation-item-selected")){
							firstTab.css("display","none").removeClass("itcui-navigation-item");
							hidTabs.push([firstTab.attr("id").replace("itcui_nav_tab_",""),firstTab.children(".itcui-navigation-item-name").html()]);
						}
						else{
							firstTab.addClass("itcui-navigation-item").css("display","inline-block");
						}
					}
				}
			}
			else{
				flag = false;
			}
			firstTab.css('margin-left',"-1px");
		}
		_handle["ul"].find(".itcui-navigation-item").first().css('margin-left',"0px");
	}

	this.activeById = function(id){
		var tabId = "#itcui_nav_tab_" + id;
		if(!this._run(_events[id]["beforeClick"],id)){
			return;
		}
		var _this = $(this._renderTo).find(tabId);
		if(_this.hasClass("itcui-navigation-item-options-menu-button")){
    		return;
    	}
		_this.parent().find("li").removeClass("itcui-navigation-item-selected");
		_this.addClass("itcui-navigation-item-selected").addClass("itcui-navigation-item");
		if(_event_handler){
			_event_handler.triggerEvent("tabSwitch",id);
		}
		var fun2 = _events[id]["click"];
		if(fun2){
			this._run(fun2,id);
		}
		if(hidTabs.length>0){
			this.arrangeTab();
		}
	}
	
	this._run = function(fun,arg){
		if(!fun){
			return true;
		}
		if(typeof(fun)=="string"){
			eval(fun);
			return true;
		}
		else{
			return fun(arg);
		}
	}

	this.removeById = function(id){
		if(!this._run(_events[id].beforeClose,id)){
			return;
		}
		var tabId = "#itcui_nav_tab_" + id;
		_handle["ul"].find(tabId).remove();
		if(hidTabs.length>0){
			this.arrangeTab();
		}
		currTabCount -= 1;
		this._run(_events[id].afterClose,id);
	}

	this.updateById = function(item){
		if(!item || !item.id){
			return;
		}
		var tabId = "#itcui_nav_tab_" + item.id;
		if(item.name){
			_handle["ul"].find(tabId).find(".itcui-navigation-item-name").html(item.name);
		}
	}

	this._closeAll = function(){
		_handle["ul"].children("li").each(function(){
			var closeBtn = $(this).find(".itcui-navigation-item-close-button");
			if(closeBtn.length>0 && closeBtn.css("display")!="none"){
				var id = $(this).attr("id").replace("itcui_nav_tab_","");
				_this.removeById(id);
			}
		});
	}
}
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_skinner.js
*/
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

/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
var _1=false;
function _2(_3){
var _4=$.data(_3,"layout");
var _5=_4.options;
var _6=_4.panels;
var cc=$(_3);
if(_3.tagName=="BODY"){
cc._fit();
}else{
_5.fit?cc.css(cc._fit()):cc._fit(false);
}
var _7={top:0,left:0,width:cc.width(),height:cc.height()};
_8(_9(_6.expandNorth)?_6.expandNorth:_6.north,"n");
_8(_9(_6.expandSouth)?_6.expandSouth:_6.south,"s");
_a(_9(_6.expandEast)?_6.expandEast:_6.east,"e");
_a(_9(_6.expandWest)?_6.expandWest:_6.west,"w");
_6.center.panel("resize",_7);
function _b(pp){
var _c=pp.panel("options");
return Math.min(Math.max(_c.height,_c.minHeight),_c.maxHeight);
};
function _d(pp){
var _e=pp.panel("options");
return Math.min(Math.max(_e.width,_e.minWidth),_e.maxWidth);
};
function _8(pp,_f){
if(!pp.length){
return;
}
var _10=pp.panel("options");
var _11=_b(pp);
pp.panel("resize",{width:cc.width(),height:_11,left:0,top:(_f=="n"?0:cc.height()-_11)});
_7.height-=_11;
if(_f=="n"){
_7.top+=_11;
if(!_10.split&&_10.border){
_7.top--;
}
}
if(!_10.split&&_10.border){
_7.height++;
}
};
function _a(pp,_12){
if(!pp.length){
return;
}
var _13=pp.panel("options");
var _14=_d(pp);
pp.panel("resize",{width:_14,height:_7.height,left:(_12=="e"?cc.width()-_14:0),top:_7.top});
_7.width-=_14;
if(_12=="w"){
_7.left+=_14;
if(!_13.split&&_13.border){
_7.left--;
}
}
if(!_13.split&&_13.border){
_7.width++;
}
};
};
function _15(_16){
var cc=$(_16);
cc.addClass("layout");
function _17(cc){
cc.children("div").each(function(){
var _18=$.fn.layout.parsePanelOptions(this);
if("north,south,east,west,center".indexOf(_18.region)>=0){
_1b(_16,_18,this);
}
});
};
cc.children("form").length?_17(cc.children("form")):_17(cc);
cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
cc.bind("_resize",function(e,_19){
var _1a=$.data(_16,"layout").options;
if(_1a.fit==true||_19){
_2(_16);
}
return false;
});
};
function _1b(_1c,_1d,el){
_1d.region=_1d.region||"center";
var _1e=$.data(_1c,"layout").panels;
var cc=$(_1c);
var dir=_1d.region;
if(_1e[dir].length){
return;
}
var pp=$(el);
if(!pp.length){
pp=$("<div></div>").appendTo(cc);
}
var _1f=$.extend({},$.fn.layout.paneldefaults,{width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),doSize:false,collapsible:true,cls:("layout-panel layout-panel-"+dir),bodyCls:"layout-body",onOpen:function(){
var _20=$(this).panel("header").children("div.panel-tool");
_20.children("a.panel-tool-collapse").hide();
var _21={north:"up",south:"down",east:"right",west:"left"};
if(!_21[dir]){
return;
}
var _22="layout-button-"+_21[dir];
var t=_20.children("a."+_22);
if(!t.length){
t=$("<a href=\"javascript:void(0)\"></a>").addClass(_22).appendTo(_20);
t.bind("click",{dir:dir},function(e){
_2f(_1c,e.data.dir);
return false;
});
}
$(this).panel("options").collapsible?t.show():t.hide();
}},_1d);
pp.panel(_1f);
_1e[dir]=pp;
if(pp.panel("options").split){
var _23=pp.panel("panel");
_23.addClass("layout-split-"+dir);
var _24="";
if(dir=="north"){
_24="s";
}
if(dir=="south"){
_24="n";
}
if(dir=="east"){
_24="w";
}
if(dir=="west"){
_24="e";
}
_23.resizable($.extend({},{handles:_24,onStartResize:function(e){
_1=true;
if(dir=="north"||dir=="south"){
var _25=$(">div.layout-split-proxy-v",_1c);
}else{
var _25=$(">div.layout-split-proxy-h",_1c);
}
var top=0,_26=0,_27=0,_28=0;
var pos={display:"block"};
if(dir=="north"){
pos.top=parseInt(_23.css("top"))+_23.outerHeight()-_25.height();
pos.left=parseInt(_23.css("left"));
pos.width=_23.outerWidth();
pos.height=_25.height();
}else{
if(dir=="south"){
pos.top=parseInt(_23.css("top"));
pos.left=parseInt(_23.css("left"));
pos.width=_23.outerWidth();
pos.height=_25.height();
}else{
if(dir=="east"){
pos.top=parseInt(_23.css("top"))||0;
pos.left=parseInt(_23.css("left"))||0;
pos.width=_25.width();
pos.height=_23.outerHeight();
}else{
if(dir=="west"){
pos.top=parseInt(_23.css("top"))||0;
pos.left=_23.outerWidth()-_25.width();
pos.width=_25.width();
pos.height=_23.outerHeight();
}
}
}
}
_25.css(pos);
$("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
},onResize:function(e){
if(dir=="north"||dir=="south"){
var _29=$(">div.layout-split-proxy-v",_1c);
_29.css("top",e.pageY-$(_1c).offset().top-_29.height()/2);
}else{
var _29=$(">div.layout-split-proxy-h",_1c);
_29.css("left",e.pageX-$(_1c).offset().left-_29.width()/2);
}
return false;
},onStopResize:function(e){
cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
pp.panel("resize",e.data);
_2(_1c);
_1=false;
cc.find(">div.layout-mask").remove();
}},_1d));
}
};
function _2a(_2b,_2c){
var _2d=$.data(_2b,"layout").panels;
if(_2d[_2c].length){
_2d[_2c].panel("destroy");
_2d[_2c]=$();
var _2e="expand"+_2c.substring(0,1).toUpperCase()+_2c.substring(1);
if(_2d[_2e]){
_2d[_2e].panel("destroy");
_2d[_2e]=undefined;
}
}
};
function _2f(_30,_31,_32){
if(_32==undefined){
_32="normal";
}
var _33=$.data(_30,"layout").panels;
var p=_33[_31];
var _34=p.panel("options");
if(_34.onBeforeCollapse.call(p)==false){
return;
}
var _35="expand"+_31.substring(0,1).toUpperCase()+_31.substring(1);
if(!_33[_35]){
_33[_35]=_36(_31);
_33[_35].panel("panel").bind("click",function(){
var _37=_38();
p.panel("expand",false).panel("open").panel("resize",_37.collapse);
p.panel("panel").animate(_37.expand,function(){
$(this).unbind(".layout").bind("mouseleave.layout",{region:_31},function(e){
if(_1==true){
return;
}
_2f(_30,e.data.region);
});
});
return false;
});
}
var _39=_38();
if(!_9(_33[_35])){
_33.center.panel("resize",_39.resizeC);
}
p.panel("panel").animate(_39.collapse,_32,function(){
p.panel("collapse",false).panel("close");
_33[_35].panel("open").panel("resize",_39.expandP);
$(this).unbind(".layout");
});
function _36(dir){
var _3a;
if(dir=="east"){
_3a="layout-button-left";
}else{
if(dir=="west"){
_3a="layout-button-right";
}else{
if(dir=="north"){
_3a="layout-button-down";
}else{
if(dir=="south"){
_3a="layout-button-up";
}
}
}
}
var p=$("<div></div>").appendTo(_30);
p.panel($.extend({},$.fn.layout.paneldefaults,{cls:("layout-expand layout-expand-"+dir),title:"&nbsp;",closed:true,doSize:false,tools:[{iconCls:_3a,handler:function(){
_3c(_30,_31);
return false;
}}]}));
p.panel("panel").hover(function(){
$(this).addClass("layout-expand-over");
},function(){
$(this).removeClass("layout-expand-over");
});
return p;
};
function _38(){
var cc=$(_30);
var _3b=_33.center.panel("options");
if(_31=="east"){
var ww=_3b.width+_34.width-28;
if(_34.split||!_34.border){
ww++;
}
return {resizeC:{width:ww},expand:{left:cc.width()-_34.width},expandP:{top:_3b.top,left:cc.width()-28,width:28,height:_3b.height},collapse:{left:cc.width(),top:_3b.top,height:_3b.height}};
}else{
if(_31=="west"){
var ww=_3b.width+_34.width-28;
if(_34.split||!_34.border){
ww++;
}
return {resizeC:{width:ww,left:28-1},expand:{left:0},expandP:{left:0,top:_3b.top,width:28,height:_3b.height},collapse:{left:-_34.width,top:_3b.top,height:_3b.height}};
}else{
if(_31=="north"){
var hh=_3b.height;
if(!_9(_33.expandNorth)){
hh+=_34.height-28+((_34.split||!_34.border)?1:0);
}
_33.east.add(_33.west).add(_33.expandEast).add(_33.expandWest).panel("resize",{top:28-1,height:hh});
return {resizeC:{top:28-1,height:hh},expand:{top:0},expandP:{top:0,left:0,width:cc.width(),height:28},collapse:{top:-_34.height,width:cc.width()}};
}else{
if(_31=="south"){
var hh=_3b.height;
if(!_9(_33.expandSouth)){
hh+=_34.height-28+((_34.split||!_34.border)?1:0);
}
_33.east.add(_33.west).add(_33.expandEast).add(_33.expandWest).panel("resize",{height:hh});
return {resizeC:{height:hh},expand:{top:cc.height()-_34.height},expandP:{top:cc.height()-28,left:0,width:cc.width(),height:28},collapse:{top:cc.height(),width:cc.width()}};
}
}
}
}
};
};
function _3c(_3d,_3e){
var _3f=$.data(_3d,"layout").panels;
var p=_3f[_3e];
var _40=p.panel("options");
if(_40.onBeforeExpand.call(p)==false){
return;
}
var _41=_42();
var _43="expand"+_3e.substring(0,1).toUpperCase()+_3e.substring(1);
if(_3f[_43]){
_3f[_43].panel("close");
p.panel("panel").stop(true,true);
p.panel("expand",false).panel("open").panel("resize",_41.collapse);
p.panel("panel").animate(_41.expand,function(){
_2(_3d);
});
}
function _42(){
var cc=$(_3d);
var _44=_3f.center.panel("options");
if(_3e=="east"&&_3f.expandEast){
return {collapse:{left:cc.width(),top:_44.top,height:_44.height},expand:{left:cc.width()-_3f["east"].panel("options").width}};
}else{
if(_3e=="west"&&_3f.expandWest){
return {collapse:{left:-_3f["west"].panel("options").width,top:_44.top,height:_44.height},expand:{left:0}};
}else{
if(_3e=="north"&&_3f.expandNorth){
return {collapse:{top:-_3f["north"].panel("options").height,width:cc.width()},expand:{top:0}};
}else{
if(_3e=="south"&&_3f.expandSouth){
return {collapse:{top:cc.height(),width:cc.width()},expand:{top:cc.height()-_3f["south"].panel("options").height}};
}
}
}
}
};
};
function _9(pp){
if(!pp){
return false;
}
if(pp.length){
return pp.panel("panel").is(":visible");
}else{
return false;
}
};
function _45(_46){
var _47=$.data(_46,"layout").panels;
if(_47.east.length&&_47.east.panel("options").collapsed){
_2f(_46,"east",0);
}
if(_47.west.length&&_47.west.panel("options").collapsed){
_2f(_46,"west",0);
}
if(_47.north.length&&_47.north.panel("options").collapsed){
_2f(_46,"north",0);
}
if(_47.south.length&&_47.south.panel("options").collapsed){
_2f(_46,"south",0);
}
};
$.fn.layout=function(_48,_49){
if(typeof _48=="string"){
return $.fn.layout.methods[_48](this,_49);
}
_48=_48||{};
return this.each(function(){
var _4a=$.data(this,"layout");
if(_4a){
$.extend(_4a.options,_48);
}else{
var _4b=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),_48);
$.data(this,"layout",{options:_4b,panels:{center:$(),north:$(),south:$(),east:$(),west:$()}});
_15(this);
}
_2(this);
_45(this);
});
};
$.fn.layout.methods={resize:function(jq){
return jq.each(function(){
_2(this);
});
},panel:function(jq,_4c){
return $.data(jq[0],"layout").panels[_4c];
},collapse:function(jq,_4d){
return jq.each(function(){
_2f(this,_4d);
});
},expand:function(jq,_4e){
return jq.each(function(){
_3c(this,_4e);
});
},add:function(jq,_4f){
return jq.each(function(){
_1b(this,_4f);
_2(this);
if($(this).layout("panel",_4f.region).panel("options").collapsed){
_2f(this,_4f.region,0);
}
});
},remove:function(jq,_50){
return jq.each(function(){
_2a(this,_50);
_2(this);
});
}};
$.fn.layout.parseOptions=function(_51){
return $.extend({},$.parser.parseOptions(_51,[{fit:"boolean"}]));
};
$.fn.layout.defaults={fit:false};
$.fn.layout.parsePanelOptions=function(_52){
var t=$(_52);
return $.extend({},$.fn.panel.parseOptions(_52),$.parser.parseOptions(_52,["region",{split:"boolean",minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number"}]));
};
$.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{region:null,split:false,minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000});
})(jQuery);

