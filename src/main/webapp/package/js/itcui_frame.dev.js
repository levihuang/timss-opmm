
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_core.js
*/
var itcui = itcui || {};
itcui.combo_displayed = false;
function ITC_GetAbsPos(obj){	
	var obj_x = 0;
	var obj_y = 0;
	while(obj.parentNode){		    
		var o = $(obj);
		obj_x += o.offset().left;
		obj_y += o.offset().top;
	    obj = obj.parentNode;
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
var privMapping = privMapping || null;
var _ITC = _ITC || _parent().window._ITC || {};
_ITC.navTab = _ITC.navTab || null;
_ITC.navTree = _ITC.navTree || null;
_ITC.container = _ITC.container || null;
_ITC.switchTab = function(id){
	_ITC.opts.tabSwitchFunc(id);
};

_ITC._switchTab = function(id){	
	var opts = _ITC.opts;
	var prevTab = null;
	if(!opts.tabMapping){
		return;
	}
	//切换导航树时保存导航树的状态
	if(!_ITC.currTab){
		_ITC.currTab = id;
	}
	else{
		prevTab = _ITC.currTab;
		_ITC.currTab = id;
		_ITC.tabTreeStat[prevTab] = _ITC.navTree.ITCUI_NavTree('getstate');
	}
	var mapping = opts.tabMapping[id];
	if(!mapping){
		return;
	}
	if(mapping.tree){
		_ITC.noTree = false;
		_ITC.navTree = $("#" + opts.treeId).ITCUI_NavTree("init",mapping.tree,{expandOnlyOne:true});
		$("#" + _ITC.opts.treeId).show();
	}
	else{
		_ITC.noTree = true;
		$("#" + _ITC.opts.treeId).hide();
	}	
	if(_ITC.initedTab[id]){
		_ITC.container.switchTo(id,"",{"cache":true});		
	}	
	else{
		//找到树上一个有权限的节点
		var sOpt = {"cache":true};
		_ITC.initedTab[id] = true;
		if(opts.tabMapping[id].id){
			sOpt["id"] = opts.tabMapping[id].id;
		}
		if(mapping.tree){
			var flag = true;
			for(var i=0;i<mapping.tree.length;i++){
				if(!flag){
					break;
				}
				var node = mapping.tree[i];
				if(!privMapping || !node.privilege || privMapping[node.privilege]){
					if(!node.id && node.items){
						for(var j=0;j<node.items.length;j++){
							var subNode = node.items[j];
							if(!privMapping || !subNode.privilege || privMapping[subNode.privilege]){								
								_ITC.container.switchTo(id,opts.treeMapping[subNode.id],sOpt);
								_ITC.navTree.ITCUI_NavTree("highlight",subNode.id);
								flag = false;
								break;
							}
						}
					}
					else if(node.id){
						_ITC.container.switchTo(id,opts.treeMapping[node.id],sOpt);
						_ITC.navTree.ITCUI_NavTree("highlight",node.id);
						flag = false;
						break;
					}
				}
			}
		}
		else{
			if(mapping.url){
				_ITC.container.switchTo(id,mapping.url,sOpt);
			}
		}
	}
	_ITC.adjustFrame();
	if(_ITC.tabTreeStat[id]){
		_ITC.navTree.ITCUI_NavTree("loadstate",_ITC.tabTreeStat[id]);
	}
};

_ITC.switchTreeItem = function(id){
	_ITC.opts.treeSwitchFunc(id)
};

_ITC._switchTreeItem = function(id){
	var opts = _ITC.opts;
	if(!opts.treeMapping){
		return;
	}
	_ITC.container.navigate(opts.treeMapping[id]);
};

_ITC.addTab = function(tabOpt,mappingOpt){
	var opts = _ITC.opts;
	if(tabOpt==null){
		return;
	}
	if(!tabOpt.id || !tabOpt.name){
		return;
	}
	mappingOpt = mappingOpt || {};
	mappingOpt.cache = mappingOpt.cache || false;
	opts.tabMapping[tabOpt.id] = mappingOpt;
	_ITC.navTab.insert(tabOpt);
};

_ITC.deleteTab = function(id){
	var opts = _ITC.opts;
	delete(opts.tabMapping[id]);
	_ITC.container.remove(id);
	delete(_ITC.initedTab[id]);
};

_ITC.init = function(opts){
	if(!_event_handler){
		console.log("没有找到_event_handler,ITC前端框架初始化失败");
		return;
	}
	opts = opts || {};
	opts.tabId = opts.tabId || 'itcui_nav_tab_container';
	opts.bottomId = opts.bottomId || 'mainframe_bottom';
	opts.contentId = opts.contentId || 'mainframe_content';
	opts.treeId = opts.treeId || 'mainframe_navtree';
	$("#" + opts.treeId).css({
		"border-right-color": "rgb(198,198,198)",
		"border-right-style": "solid",
		"border-right-width": "1px"
	});
	opts.tabs = opts.tabs || null;
	opts.tabMapping = opts.tabMapping || null;
	opts.tabSwitchFunc = opts.tabSwitchFunc || _ITC._switchTab;
	opts.treeWidth = $("#" + opts.treeId).width();
	opts.treeSwitchFunc = opts.treeSwitchFunc || _ITC._switchTreeItem;
	_ITC.opts = opts;
	//用于状态的变量
	_ITC.noTree = false;
	_ITC.treeState = 1;
	_ITC.initedTab = {};
	_ITC.currTab = null;
	_ITC.tabTreeStat = {};
	//选项卡组初始化
	if(opts.tabs){
		_ITC.navTab = new ITCUI_Navigation("#" + opts.tabId,opts.tabs,{});
		_ITC.navTab.init();		
	}
	_ITC.container = new ITCUI_Container("#" + opts.contentId);
	_event_handler.registerEvent("tabSwitch", _ITC.switchTab);
	_event_handler.registerEvent("navTreeItemClick", _ITC.switchTreeItem);
	//展开/隐藏树的按钮
	$("<div id='itc_navtree_fold'><div class='itc_navtree_imgf'></div></div>").appendTo("body");
	$("#itc_navtree_fold").click(function(){
		var me = $(this);
		var btn = me.children("div");
		_ITC.btnAdjust = true;
		if(btn.hasClass("itc_navtree_imgf")){
			btn.removeClass("itc_navtree_imgf").addClass("itc_navtree_imge");
			_ITC.treeState = 0;
			setTimeout("$('#" + _ITC.opts.treeId + "').animate({'width':'0px'},_ITC.adjustFrame)",10);
			setTimeout("$('#itc_navtree_fold').animate({'left':'1px'})",10);
		}
		else{
			btn.removeClass("itc_navtree_imge").addClass("itc_navtree_imgf");
			_ITC.treeState = 1;
			setTimeout("$('#" + _ITC.opts.treeId + "').animate({'width':'200px'},_ITC.adjustFrame)",10);
			setTimeout("$('#itc_navtree_fold').animate({'left':'201px'})",10);
		}		
	});
	$("#itc_navtree_fold").css("left","201px");
	_ITC.adjustFrame();
	$(window).resize(function(){
		_ITC.adjustFrame();
	});	
};

//切换到默认有权限的选项卡
_ITC.switchDefaultTab = function(){
	var opts = _ITC.opts;
	for(var i=0;i<opts.tabs.length;i++){
		var tabId = opts.tabs[i].id;
		if(!privMapping || privMapping[opts.tabMapping[tabId].privilege]){
			_ITC.navTab.activeById(tabId);
			return;
		}
	}
};

_ITC.adjustFrame = function(){
	var scn_height = parseInt(document.documentElement.clientHeight);
	var scn_width = parseInt(document.documentElement.clientWidth);
	var opts = _ITC.opts;
	//当屏幕宽度小于740px时不再继续缩窄 而是显示滚动条
	if(scn_width<740){
		scn_width = 740;
		if(!$("body").hasClass("ovfx-s")){
			$("body").addClass("ovfx-s");
		}
		$("#" + opts.bottomId).css("width",scn_width);
	}
	else{
		$("body").removeClass("ovfx-s");
		$("#" + opts.bottomId).css("width","100%");
	}
	//调整底部高度
	$("#" + opts.bottomId + ",#" + opts.treeId + ",#" + opts.contentId).css("height",scn_height - 90);
	//根据屏幕宽度显示/隐藏导航树
	var hdl = $("#itc_navtree_fold");
	var btn = hdl.children("div");
	//标志位 btnAdjust表示手动调整导航树 不需要再算
	if(!_ITC.btnAdjust){
		if(!_ITC.noTree){
			if(scn_width<940 && _ITC.treeState==1){
				//收起导航树
				$('#' + opts.treeId).css("width","0px");
				_ITC.treeState=0;
				hdl.css('left',"0px");
				btn.removeClass("itc_navtree_imgf").addClass("itc_navtree_imge");
			}
			else if(scn_width>=940 && _ITC.treeState==0){
				$('#' + opts.treeId).css("width", opts.treeWidth + "px");
				_ITC.treeState=1;
				hdl.css('left',"201px");
				btn.removeClass("itc_navtree_imge").addClass("itc_navtree_imgf");
			}
			hdl.show().css({
				top : (scn_height-90-hdl.height())/2 + 90
			});
		}
		else{
			hdl.hide();
		}
	}
	var treeWidth = (_ITC.noTree || _ITC.treeState==0)?0:opts.treeWidth;
	$("#" + opts.contentId).css("width",scn_width-treeWidth-1 + "px");
	_ITC.container.resize();
	_ITC.btnAdjust = false;
};
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

	this.switchTo = function(id,url,options){
		//判断上一个iframe是移除还是缓存
		var lastFrame = $(_targetId).children(".ITCUI_Iframe_" + currFrame);
		if(frames[currFrame]){
			if(frames[currFrame].cache){
				lastFrame.css("display","none");
			}
			else{
				lastFrame.remove();
				delete(frames[currFrame]);
			}
		}
		currFrame = id;
		if(frames[id]&&frames[id].cache){
			$(_targetId).children(".ITCUI_Iframe_" + id).css("display","block");
		}
		else{
			var idStr = "";
			if(options.id){
				idStr = " id='" + options.id + "' ";
			}
			$("<iframe frameborder='no'" + idStr + " border='0'></iframe").addClass("ITCUI_ContainerFrame").addClass("ITCUI_Iframe_" + id).appendTo(targetId);
			frames[id] = options;			
			this.resize();
			$(targetId).children(".ITCUI_Iframe_" + id).attr("src",url);
		}

	}

	this.navigate = function(url){
		if(currFrame!=null){
			$(_targetId).children(".ITCUI_Iframe_" + currFrame).attr("src","about:blank");
			$(_targetId).children(".ITCUI_Iframe_" + currFrame).attr("src",url);
		}
	};

	this.resize = function(){
		var _parent = $(_targetId);
		_parent.children(".ITCUI_Iframe_" + currFrame).css({
			width : _parent.css("width"),
			height : _parent.css("height")
		});

	};

	this.remove = function(id){
		delete(frames[id]);
		$(_targetId).children(".ITCUI_Iframe_" + id).remove();
	};
}
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_eventhandler.js
*/
Function.prototype.clone = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for(var key in this) {
        if (this.hasOwnProperty(key)) {
            temp[key] = this[key];
        }
    }
    return temp;
};

ITCUI_EventHandler  = function(){
	var events = {};
	var invMapping = {};
	
	this.registerEvent = function(eventId,f,deepcopy){
		var evtList = events[eventId];
		if(!evtList){
			events[eventId] = [];
			evtList = events[eventId];
		}
		var evtNo = (new Date().getTime()%100000) + "" + Math.abs(Math.round(Math.random()*1000));
		if(!deepcopy){
			evtList.push([f,evtNo])
		}
		else{
			evtList.push([f.clone(),evtNo])	
		}
		invMapping[evtNo] = eventId;
		return evtNo;
	};

	this.unregisterEvent = function(evtNo){
		var eventId = invMapping[evtNo];
		if(!eventId){
			return;
		}
		var evtList = events[eventId];
		if(!evtList){
			return;
		}		
		var i = 0;	
		for(i=0;i<evtList.length;i++){
			var evt = evtList[i];
			if(evt[1]==evtNo){
				break;
			}
		}
		var newEvents = [];
		for(var j=0;j<evtList.length;j++){
			if(j!=i){
				newEvents.push(evtList[i]);
			}
		}
		evtList = newEvents;
		delete(invMapping[evtNo]);
	};

	this.triggerEvent = function(eventId,args){
		var evtList = events[eventId];
		var rtnList = [];
		if(evtList){
			for(var i=0;i<evtList.length;i++){
				var evt = evtList[i];
				if(evt && evt[0]){
					rtnList.push(evt[0](args));
				}
			}
		}
		if(rtnList.length>0){
			return rtnList;
		}
		return -1;
	};
}

var _event_handler = _event_handler || _parent()._event_handler || new ITCUI_EventHandler();
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_navtree.js
*/
(function($){
	$.fn.extend({
		/*
			导航树（只支持两层）
			data : [{"grouptitle":"组标题","items":[{"title":"项标题"}],"initexpand":true}]
			opts:
				expandOnlyOne - 每次只能展开一层
				width - 树宽度
				treeId - 树Id，如果需要在一个页面产生多个导航树需要修改这个
		*/
		ITCUI_NavTree:function(action,data,opts){
			var treeWidth = 200;
			var treeName = "itc_navtree";
			var _this = $(this);
			var _t = this;			
			var expandOnlyOne = true;


			_t.initTree = function(data,opts){
				var treeHtml = '<div class="itc_navtree" id="' + treeName + '">';
				for(var j=0;j<data.length;j++){
					treeGroup = data[j];
					var grpId = treeName + "_" + j;
					if(privMapping && _ITC && _ITC.opts && treeGroup.privilege){
						if(!privMapping[treeGroup.privilege]){
							continue;
						}
					}
					if(!treeGroup.items){
						treeHtml += '<div class="itc_navtree_nochildren" id="' + treeGroup.id + '">' + treeGroup["grouptitle"] + '</div>';
						continue;
					}
					var expStr = "";
					if(treeGroup["initexpand"]){
						expStr = " itc_navtree_grouptitle_expand";
					}
					treeHtml += '<div class="itc_navtree_grouptitle' + expStr + '" id="' + grpId + '">' + treeGroup["grouptitle"] + '</div>';
					var subItemid = grpId + "_subitem";
					treeHtml += '<div id="' + subItemid + '" class="navtree_subitem"';
					if(!treeGroup["initexpand"]){
						treeHtml += ' style="display:none"';
					}
					else{
						_this.data("expandedNode", grpId);
					}
					treeHtml += '>';
					//tree sub item
					if(treeGroup["items"]){
						for(var i=0;i<treeGroup['items'].length;i++){
							var treeitem = treeGroup['items'][i];
							if(privMapping && _ITC && _ITC.opts){
								if(!privMapping[treeitem.privilege]){
									continue;
								}
							}
							var itemId = treeitem.id || treeName + "_item_" + j + "_" + i;
							treeHtml += '<div class="itc_navtree_item" id="' + itemId + '">';
							treeHtml += treeitem["title"] + "</div>";
						}
					}
					treeHtml += '</div>';//end of subitem
				}
				treeHtml += '</div>';//end of tree
				_this.html(treeHtml);
			};

			_t.canTreeSwitch = function(id){
				//判断导航树是否允许切换 当navTreeItemBeforeClick事件有一个返回false 将阻止切换
				if(_event_handler){
					var rtn = _event_handler.triggerEvent("navTreeItemBeforeClick",id);
					for(var i=0;i<rtn.length;i++){
						if(rtn[i]===false){
							return false;
						}
					}
				}
				return true;
			};

			_t.addEvents = function(data,opts){
				//鼠标点击时对子项高亮
				$("#" + treeName).find(".itc_navtree_item,.itc_navtree_nochildren").click(function(){
					var that = $(this);
					if(!_t.canTreeSwitch(this.id)){
						return;
					}
					that.parents(".itc_navtree").find(".itc_navtree_item_selected").removeClass("itc_navtree_item_selected");
					that.addClass("itc_navtree_item_selected");
					if(_event_handler){
						_event_handler.triggerEvent("navTreeItemClick",this.id);
					}
				});

				//树折叠效果
				$("#" + treeName + " .itc_navtree_grouptitle").click(function(){
					_t.expandNode(this);
				});
			};

			_t.expandNode = function(ptr){
				var id = $(ptr).attr("id");
				var box_id = id + "_subitem";
				var is_fold = $("#" + box_id).css("display")=="none"?true:false;
				var p = $(ptr).parents(".itc_navtree");
				//收起其他的选项卡
				if(expandOnlyOne){
					p.find(".itc_navtree_grouptitle_expand").each(function(){
						if(p.attr("id")!=id){
							$(this).removeClass("itc_navtree_grouptitle_expand");
							$(this).next(".navtree_subitem").hide();
						}
					});					
				}
				if(is_fold)
				{
					$("#" + box_id).slideDown();
					$(ptr).addClass("itc_navtree_grouptitle_expand");
				}
				else
				{
					$("#" + box_id).slideUp();
					$(ptr).removeClass("itc_navtree_grouptitle_expand");
				}
			};

			_t.switchTo = function(id){
				if(!_t.canTreeSwitch(id)){
					return;
				}
				_t.highlight(id);
				if(_event_handler){
					_event_handler.triggerEvent("navTreeItemClick",id);
				}
			};

			_t.highlight = function(id,noexpand){
				var tree = $("#" + treeName);
				tree.find(".itc_navtree_item_selected").removeClass("itc_navtree_item_selected");
				var cNode = tree.find("#" + id);
				cNode.addClass("itc_navtree_item_selected");
				//判断是否需要展开树
				if(!noexpand){
					var cNodeP = cNode.parent(); 
					if(cNodeP.hasClass("navtree_subitem")){
						var expNode = cNodeP.prev(".itc_navtree_grouptitle");
						if(!expNode.hasClass("itc_navtree_grouptitle_expand")){
							_t.expandNode(expNode);
						}
					}
				}
			};

			_t.getTreeState = function(){
				var states = {};
				var grpTitle = _this.find(".itc_navtree_grouptitle");
				for(var i=0;i<grpTitle.length;i++){
					var o = $(grpTitle[i]);
					states[o.attr("id")] = {"items" : {}};
					if(o.hasClass("itc_navtree_grouptitle_expand")){
						states[o.attr("id")]["expanded"]  = true;
						var subItems = o.next(".navtree_subitem").find(".itc_navtree_item");
						for(var j=0;j<subItems.length;j++){
							var oo = $(subItems[j]);
							if(oo.hasClass("itc_navtree_item_selected")){
								states[o.attr("id")]["items"][oo.attr("id")] = {"selected" : true};
							}
						}
					}					
				}
				var noTitle = _this.find(".itc_navtree_nochildren");
				for(var i=0;i<noTitle.length;i++){
					var o = $(noTitle[i]);
					if(o.hasClass("itc_navtree_item_selected")){
						states[o.attr("id")] = {"selected" : true};
					}
				}
				return states;
			};

			_t.loadTreeState = function(states){
				for(var k in states){
					var o = $("#" + k);
					if(states[k].expanded){
						o.addClass("itc_navtree_grouptitle_expand");
						o.next(".navtree_subitem").show();
					}
					else{
						o.removeClass("itc_navtree_grouptitle_expand");	
						o.next(".navtree_subitem").hide();
					}
					if(states[k].selected){
						o.addClass("itc_navtree_item_selected");
					}
					if(states[k].items){
						for(var kk in states[k].items){
							var o = states[k].items[kk];
							if(o.selected){
								$("#" + kk).addClass("itc_navtree_item_selected");
							}
						}
					}
				}
			};

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
			else if(action=="highlight"){
				_t.highlight(data,opts);
			}
			else if(action=="switchto"){
				_t.switchTo(data);
			}
			else if(action=="getstate"){
				return _t.getTreeState();
			}
			else if(action=="loadstate"){
				_t.loadTreeState(data);
			}
			return _this;
		}
	});
})(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_navigation.js
*/
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