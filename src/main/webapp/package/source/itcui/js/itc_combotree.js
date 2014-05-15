(function($){
	$.fn.extend({
		ITCUI_ComboTree : function(action,opt,args){
			var width = 150;
			var _this = $(this);

			initComboBox = function(){				
				width = parseInt(_this.css("width"));
				var wrapWidth = _this.attr("treewidth");
				var wrapHeight = _this.attr("treeheight");
				_this.data("wrapWidth",wrapWidth);
				_this.data("wrapHeight",wrapHeight);
				_this.data("opt",opt);
				//覆盖onSelect事件
				var onSelect = opt["onSelect"] || function(){};
				var labelMode = opt.labelMode || "tree";//初始化文字是来自树还是来自deftext属性
				delete(opt.onSelect);
				_this.data("_onSelect",onSelect);
				//获取初始化已选择的内容
				var comboLabel = _this.attr("deftext") || "";
				if(opt["checkbox"]){
					multiSelect = true;
				}
				else{
					multiSelect = false;	
				}
				_this.data("multiSelect", multiSelect);
				var fStr = _this.css("float");
				if(fStr){
					fStr = ";float:" + fStr;
				}
				else{
					fStr = "";
				}
				var comboHtml = "<div class='itcui_combo bbox' style='position:relative;width:" + width + "px" + fStr + "'>";
				comboHtml += "<span class='itcui_combo_text'>" + comboLabel + "</span><span class='itcui_combo_arrow_wrap'><b class='itcui_combo_arrow'></b></span>";
				comboHtml += "</div>";
				_this.css("display","none");
				_this.before(comboHtml);
				_this.prev(".itcui_combo").click(function(e){
					e.stopPropagation();
					__this = $(this).next("select");
					popUp(__this);
				});
				if(labelMode=="tree"){
					setInitText(_this);
				}
			};

			popUp = function(__this){
				var wrap = __this.next("div");
				if(wrap.hasClass("itcui_dropdown_menu")){
					wrap.css("display","block");
				}
				else{
					var wrapWidth = __this.data("wrapWidth");
					var wrapHeight = __this.data("wrapHeight");
					var opt = __this.data("opt");
					var fix = __this.attr("fix");
					var wrapHtml = "<div id='itc_combo_wrap' class='itcui_dropdown_menu' style='padding-top:6px;padding-bottom:6px;height:" + wrapHeight + ";width:" + wrapWidth + "'><div class='itcui_combotree' style='width:100%'></div>";
					wrapHtml += "</div>";
					__this.after(wrapHtml);
					/*
					if(fix){
						var pos = ITC_GetAbsPos(__this.prev(".itcui_combo"));
						$("#itc_combo_wrap").css({
							"left":pos.left,
							"top":pos.top + parseInt($(__this).css("height"))
						});
					}
					*/
					opt["onSelect"] = function(node){
						var wrap = $(this).parents(".itcui_dropdown_menu");
						var p = wrap.prev("select");
						//单选时点击一项就隐藏树
						var isMultiSelect = p.data("multiSelect");
						var realEvent = p.data("_onSelect");
						if(!isMultiSelect){
							wrap.hide();
						}
						var tree = wrap.find(".itcui_combotree");
						var selectNode = tree.tree("getSelected");
						wrap.prev().prev().find(".itcui_combo_text").html(selectNode.text);
						__this.data("val",selectNode.id)
						realEvent(node);
					};
					opt["onCheck"] = function(e){
						var __this = $(this).parent().prev("select");
					};
					//创建树
					var tree = __this.next('.itcui_dropdown_menu').find('.itcui_combotree').tree(opt);
					bindEvent(__this);					
					//初始选择 仅用于单选树
					var initId = __this.data("initSelected");
					if(initId){
						var targetNode = tree.tree("find",initId);
						tree.tree("select",targetNode.target);
					}
				}

			};

			bindEvent = function(__this){
				var tree = __this.next('.itcui_dropdown_menu').find('.itcui_combotree');
				var multiSelect = __this.data("multiSelect");
				$("body").click(function(e){
					var wrap = $("#itc_combo_wrap");
					wrap.remove();
				});
				//多选时点击树时不消失			
			};

			/*
				遍历树节点，获取满足某条件的节点列表
				parent - 父节点
				resultList - 返回的结果列表
				property - 要获取的属性
				needCondition - 满足true的条件，如checked 				
			*/
			visitNode = function(parent,resultList,property,needCondition){
				if(!parent){
					return;
				}
				for(var i=0;i<parent.length;i++){
					node = parent[i];
					if(node[needCondition]){
						resultList.push(node[property]);
					}
					visitNode(node["children"],resultList,property,needCondition);
				}
				
			};		

			setInitText = function(__this){
				var multiSelect = __this.data("multiSelect");
				var opt = __this.data("opt");
				if(!opt["data"]){
					return;
				}
				var resultList = [];
				if(multiSelect){
					visitNode(opt["data"],resultList,"text","checked");
				}
				else{
					var resultIdList = [];
					visitNode(opt["data"],resultList,"text","selected");	
					visitNode(opt["data"],resultIdList,"id","selected");	
					//如果找到，还要标记一下，因为单选树没有默认选择的功能
					if(resultList.length>0){
						__this.data("initSelected",resultIdList[0]);
					}
				}
				__this.prev(".itcui_combo").find(".itcui_combo_text").html(resultList.join(" "));
			};

			
			getSelectedText = function(__this){
				var multiSelect = __this.data("multiSelect");
				var tree = __this.next('.itcui_dropdown_menu').find('.itcui_combotree');
				if(multiSelect){
					var nodes = tree.tree("getChecked");
					var nodesName = [];
					for(var i=0;i<nodes.length;i++){
						var node = nodes[i];
						nodesName.push(node.text);
					}
					return nodesName.join(" ");
				}
				else{
					var node = tree.tree("getSelected");
					if(node){
						return node.text;
					}
				}
			};

			if(action=="create"){
				initComboBox();
			}
			else if(action=="getValue"){
				return _this.data("val") || _this.attr("defval");
			}
			else{
				_this.next(".itcui_dropdown_menu").children(".itcui_combotree").tree(action,opt);
			}
		}
	});
})(jQuery);