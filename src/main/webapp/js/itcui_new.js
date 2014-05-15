var itcui = {}
ITCUI_EventHandler  = function(){
	var events = {};//事件列表 事件名->触发函数1，触发函数2，....
	var evtCount = 0;
	var invMapping = [];//反向映射 事件编号->事件内编号，事件ID
	var variables = {};

	this.registerEvent = function(eventId,f){
		var t = events[eventId];
		if(!t){
			t = [];
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
				f = events[eventId][i];
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



itcui.navigation = function(renderTo,items,options){
	this.handle = {};
	this._items = items;
	this._options = options;
	this._renderTo = renderTo;
	this._events = {};
	
	
	this.init = function(){
		_handle = this.handle;
		_handle["container"] = $(this._renderTo).html("");
		
		_handle["navigation"] = $('<div></div>').addClass('itcui-navigation')
                .appendTo(_handle["container"]);
            
		_handle["ul"] = $('<ul></ul>').addClass('itcui-navigation-ul')
			.appendTo(_handle["navigation"]);
			
		_handle["separator"] = $('<div></div>').addClass('itcui-navigation-separator')
                .appendTo(_handle["navigation"]);
				
		var navHtml = "";
		for(var i=0;i<items.length;i++){
			var item = items[i];
			navHtml += this._makeTabHtml(item);
		}
		navHtml += '<li class="itcui-navigation-item-options-menu-button itcui-navigation-item" style="float:left"><b></b></li>';
		_handle["ul"].html(navHtml).find("li").first().css("margin-left","0px");
		this.bindEvent();
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
			tabHtml += "<li class='itcui-navigation-item' style='width:91px' id='itcui_nav_tab_" + item.id + "'>";	
		}
		else{
			tabHtml += "<li class='itcui-navigation-item' style='width:91px'>";		
		}
		tabHtml += "<span class='itcui-navigation-item-front'>" + item.front + "</span>";
		//鼠标提示信息
		item.title = item.title?item.title:item.name;
		tabHtml += "<span class='itcui-navigation-item-name' title='" + item.title + "'>" + item.name + "</span>";
		
		tabHtml += "<span class='itcui-navigation-item-rear' style='display:inline'>";
		if(item.closeable){
			tabHtml += "<a class='itcui-navigation-item-close-button''><b>x</b></a>";
		}
		else{
			tabHtml += "<a class='itcui-navigation-item-close-button' style='display:none'><b>x</b></a>";
		}
		tabHtml += "</span>";
		
		tabHtml += "</li>";		
		return tabHtml;
	}
	
	this.bindEvent = function(){
		_handle = this.handle;
		_handle["container"].find(".itcui-navigation-item").each(function(e){
			$(this).on('mouseenter', function(e){
                if(!$(this).hasClass('itcui-navigation-item-selected')){
					$(this).removeClass('itcui-navigation-item').addClass('itcui-navigation-item-hover');
				}
            }).on('mouseleave', function(e){
				if(!$(this).hasClass('itcui-navigation-item-selected')){
					$(this).addClass('itcui-navigation-item');
				}
				$(this).removeClass('itcui-navigation-item-hover')
            }).on('click',function(e){
            	var _this = $(this);
            	if(_this.hasClass("itcui-navigation-item-options-menu-button")){
            		return;
            	}
				_this.parent().find("li").removeClass("itcui-navigation-item-selected");
				_this.addClass("itcui-navigation-item-selected").addClass("itcui-navigation-item");
			});
			
			$(this).find('.itcui-navigation-item-close-button').on('click',function(e){
				e.stopPropagation();
			}).on('mouseover',function(e){
				$(this).addClass("itcui-navigation-item-close-button-hover");
			}).on('mouseleave',function(e){
				$(this).removeClass("itcui-navigation-item-close-button-hover");
			});
		});
	}
	
	this.insert = function(item,options){
	
	}
	
	this.activeByIndex = function(index){
	
	}
	
	this.activeById = function(name){
	
	}
	
	this.updateById = function(name,item){
		
	}
	
	this.updateByIndex = function(index,item){
		
	}
	
	this.loadData = function(item){
	
	}
}