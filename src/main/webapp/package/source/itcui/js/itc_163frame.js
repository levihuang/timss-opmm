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