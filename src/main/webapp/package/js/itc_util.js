/**
* ITC实用工具集
*/
var ITCUtil = ITCUtil || {};
ITCUtil._currMenu = null;

/**
	创建菜单的主入口函数
*/
ITCUtil.createMenu = function(target,menu,opts){
	opts = opts || {};
	opts.direction = opts.direction || "right";
	opts.menuAlign = opts.menuAlign || "left";
	opts.offsetFunc = opts.offsetFunc || function(target){
		return $(target).offset();
	};
	var me = $(target);
	//bootstrap模式
	var menuHtml = ITCUtil._createUlHtml(menu,opts);
	if(me.hasClass("dropdown") || me.find(".dropdown-toggle").length>0){
		me.append(menuHtml);
		ITCUtil._bindCheckEvent(target);
	}
	//经典模式
	else{
		if(!opts.id){
			return;
		}
		me.data("targetmenu",opts.id);
		me.data("offsetfunc",opts.offsetFunc);
		$("body").append(menuHtml);
		me.click(function(){
			event.stopPropagation();
			var mid = "#" + $(this).data("targetmenu");
			var menu = $(mid);
			if(menu.css("display")=="none"){
				menu.css("display","block");
				var offset = $(this).data("offsetfunc")(this);
				menu.css({
					left : offset.left,
					top : offset.top + $(this).height()
				});
				ITCUtil._currMenu = mid;
			}
			else{
				menu.css("display","none");	
			}			
		});
		$("body").click(function(){
			$(ITCUtil._currMenu).hide();
		});
	}
};

ITCUtil.getMenuCheckVal = function(id){
	return $("#" + id).find(".dropdown-checked").length>0
};

ITCUtil.getMenuSelectVal = function(target,group){
	return $(target).find(".dropdown-selected[group='" + group + "']").parents("li").attr("id");
};

ITCUtil._bindCheckEvent = function(target){
	$(target).find(".dropdown-selected,.dropdown-unselected").parent("a").click(function(e){
		e.stopPropagation();
		var _this = $(this);
		_this.parents("ul").find(".dropdown-selected").removeClass("dropdown-selected");
		_this.find(".dropdown-unselected").addClass("dropdown-selected");
	});
};

ITCUtil._createUlHtml = function(menu,opts){
	if(!isArray(menu)){
		return;
	}
	var idStr = opts.id?" id='" + opts.id + "'":"";
	var h = "<ul class='dropdown-menu' role='menu' " + idStr + ">";
	//遍历一圈看有没有需要加图标或者加勾勾的
	var enableCheck = false;
	var enableIcon = false;
	for(var i=0;i<menu.length;i++){
		var o = menu[i];
		if(o.select||o.check){
			enableCheck = true;
		}
		if(o.iconCls){
			enableIcon = true;
		}
	}
	for(var i=0;i<menu.length;i++){
		var o = menu[i];
		var oid = o.id?' id="' + o.id + '"':'';
		if(o.title=="-"){
			h += '<li class="divider"></li>';
			continue;
		}
		h += o.submenu?'<li class="dropdown-submenu pull-' + opts.direction + '"' + oid + '>':'<li ' + oid + '>';
		var chkStr = "";
		if(enableCheck){
			if(o.select){
				var selStr = o.selected?"dropdown-unselected dropdown-selected":"dropdown-unselected";
				var grpStr = o.group?' group="' + o.group + '"':'';
				chkStr = '<span class="' + selStr + '" ' + grpStr + '></span>';				
			}
			else if(o.check){
				var selStr = o.checked?"dropdown-unchecked dropdown-checked":"dropdown-unchecked";
				chkStr = '<span class="' + selStr + '"></span>';
			}
			else{
				chkStr = '<span class="dropdown-holder"></span>';
			}
		}
		if(enableIcon){
			
		}
		var clkStr = o.onclick?'onclick="' + o.onclick + '"':'';
		h += '<a ' + clkStr + '>' + chkStr + o.title + '</a>';
		if(o.submenu){
			h += ITCUtil._createUlHtml(o.submenu,opts);
		}
		h += '</li>';
	}
	h += "</ul>";
	return h;
};

ITCUtil.createBtnToolBar = function(target,items,opts){

};