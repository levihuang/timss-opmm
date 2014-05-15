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
					var grpTitle = treeGroup["grouptitle"] || treeGroup["title"];
					if(!treeGroup.items){
						treeHtml += '<div class="itc_navtree_nochildren" id="' + treeGroup.id + '">' + grpTitle + '</div>';
						continue;
					}
					var expStr = "";
					if(treeGroup["initexpand"]){
						expStr = " itc_navtree_grouptitle_expand";
					}
					treeHtml += '<div class="itc_navtree_grouptitle' + expStr + '" id="' + grpId + '">' + grpTitle + '</div>';
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