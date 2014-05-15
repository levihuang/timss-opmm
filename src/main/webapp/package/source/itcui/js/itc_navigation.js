ITCUI_Navigation = function(renderTo,items,options){	
	var currTabCount = 0;
	this.handle = {};
	this._items = items;
	this._options = options || {};
	this.MAX_TAB = options.maxTab || 10;
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
			//检查权限
			if(privMapping && _ITC && _ITC.opts){
				if(!privMapping[_ITC.opts.tabMapping[item.id].privilege]){
					continue;
				}
			}
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
		menuHtml += '<ul class="dropdown-menu" role="menu">';
		menuHtml += '</ul>';
		menuHtml += '</div>';		
		_handle["ul"].html(navHtml);
		$("body").append(menuHtml);
		this._bindEvent();
		_this.arrangeTab();
	};
	
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
		tabHtml += "<span class='itcui-navigation-item-name'>" + item.name + "</span>";
		
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
	};
	
	this._bindEvent = function(){
		_handle = this.handle;
		_handle["container"].find(".itcui-navigation-item").each(function(e){
			_this._bindSingleEvent($(this));
		});
	};
	
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
				var pos = _this.offset();
				$("#itcui_nav_toggler_wrap").css({
					"top":pos.top + 32,
					"left":pos.left + 3
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
	};

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
	};
	
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
	};

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
	};
	
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
	};

	this.removeById = function(id){
		if(!this._run(_events[id].beforeClose,id)){
			return;
		}
		var tabId = "#itcui_nav_tab_" + id;
		var needActive = _handle["ul"].find(tabId).hasClass('itcui-navigation-item-selected');
		_handle["ul"].find(tabId).remove();
		//如果正在激活的选项卡被关闭 需要再激活一个 否则重拍选项卡会出错
		if(needActive){
			var tab = _handle.ul.find(".itcui-navigation-item ").first();
			var id = tab.attr('id').replace("itcui_nav_tab_","");
			this.activeById(id);
		}
		if(hidTabs.length>0){
			this.arrangeTab();
		}
		currTabCount -= 1;
		this._run(_events[id].afterClose,id);
	};

	this.updateById = function(item){
		if(!item || !item.id){
			return;
		}
		var tabId = "#itcui_nav_tab_" + item.id;
		if(item.name){
			_handle["ul"].find(tabId).find(".itcui-navigation-item-name").html(item.name);
		}
	};

	this._closeAll = function(){
		_handle["ul"].children("li").each(function(){
			var closeBtn = $(this).find(".itcui-navigation-item-close-button");
			if(closeBtn.length>0 && closeBtn.css("display")!="none"){
				var id = $(this).attr("id").replace("itcui_nav_tab_","");
				_this.removeById(id);
			}
		});
	};
}