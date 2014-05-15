function ITC_LoadCSS(url){
	if(document.createStyleSheet){
		//IE8-10
		document.createStyleSheet(url);	
	}
	else{
		//IE11和chrome
		//移除所有组件库加上的节点
		$("head").find("link").each(function(){
			var _this = $(this);
			if(_this.attr("itc_tbl")){
				_this.remove();
			}
		})
		$('<link />').attr('rel', 'stylesheet').attr('href', url).attr('itc_tbl',true).appendTo("head");
	}
}
(function($){
	$.fn.extend({
		/*
			此翻页器依赖EasyUi的Pagination，仅提供样式
		*/
		ITCUI_Pagination:function(action,arg,opts){
			var _this = $(this);
			var _t = this;
			var _pagination = $(_this.datagrid('getPager'));
			var options = _pagination.pagination("options")
			var PG_STEP = 2;
			var NO_SEL_TEXT = "";//可以写"请选择xxxx"

			_t.bindMenuPagerEvents = function(){
				var p = $(arg);
				//绑定菜单翻页器的事件
				p.find(".itc_pagination_menu li").click(function(e){
					var __this = $(this);
					var num = __this.attr("turnto");
					_t.turnTo(__this.parents(".itc_pagination_container"),num);
					
				});
				p.find(".itc_pagination_psize li").click(function(e){
					var pgSize = $(this).children("a").html().replace(/<.*>/,"").replace("每页","").replace("条","");
					var container = $(this).parents(".itc_pagination_container");
					var targetPager = container.data("targetPager");
					if(!targetPager){
						return;
					}
					targetPager.pagination({"pageSize":pgSize}).pagination("select",1);
					_this = container.data('ptrGrid');
					targetDiv = container.data('targetDiv');
					_this.ITCUI_Pagination("create",targetDiv,container.data("opts"));
					container.data("onChangePageSize")(pgSize);
				});
				p.find(".itc_pagination_style li").click(function(e){
					var __this = $(this);
					var style = __this.attr("tblStyle");
					var container = __this.parents(".itc_pagination_container");
					__this.parent().find(".dropdown-selected").removeClass("dropdown-selected").addClass("dropdown-unselected");
					__this.find(".dropdown-unselected").removeClass("dropdown-unselected").addClass("dropdown-selected");
					container.data("onChangeStyle")(style);
				});
			}

			_t.turnTo = function(itcPagination,pageNumber){
				var style = "TIMSS";
				var pagination = itcPagination.data("targetPager");
				pagination.pagination("select",pageNumber);
				_t.adjustButtons(itcPagination);
				//刷新当前页数
				var wrap = itcPagination.find(".itc_pg_selector_wrap");
				wrap.find(".currpage").html(pageNumber);
				//刷新翻页菜单
				var opts = pagination.pagination("options");
				var currPage = parseInt(opts.pageNumber);
				var maxPage = Math.ceil(opts.total/opts.pageSize) || 1;//没有任何数据时也显示1页 2014.3.4
				if(style!="TIMSS"){
					//标准翻页风格 只显示几页加首位链接
					var pStart = -1;
					var pEnd = -1;
					if(maxPage<=1 + 2*PG_STEP){
						pStart = 1;
						pEnd = maxPage;
					}
					else if(currPage-PG_STEP>1&&currPage+PG_STEP<maxPage){
						//两头都不着边界 取p-2 p-1 p p+1 p+2
						pStart = currPage - PG_STEP;
						pEnd = currPage + PG_STEP;
					}
					else if(currPage-PG_STEP<=1){
						//左边不够长
						pStart = 1;
						pEnd = 1 + 2*PG_STEP;
					}
					else if(currPage+PG_STEP>=maxPage){
						//右边不够长
						pEnd = maxPage;
						pStart = maxPage - 1 - 2*PG_STEP;
					}
					var liHtml = "";
					for(var i=pStart;i<=pEnd;i++){
						liHtml += "<li turnto=" + i + "><a class='menuitem'>" + i +"/" + maxPage + "</a></li>";
					}
					liHtml += "<li class='divider'></li>";
					liHtml += "<li turnto=1><a class='menuitem'>首页</a></li>";
					liHtml += "<li turnto=" + maxPage + "><a class='menuitem'>末页</a></li>";
					setTimeout('$("div .itc_pagination_menu").html(\"' + liHtml + '\");_t.bindMenuPagerEvents();',200);				
				}				
			};



			_t.createPagination = function(){
				//保存分页器的参数
				_t.data("target",arg);
				_t.data("styleOpt",opts);
				//为本地翻页增加相关的回调函数
				var dgOpts = _this.datagrid("options");
				if(!dgOpts.url && dgOpts._data){
					if(action!="createPg"){
						dgOpts.__data = dgOpts._data;//这里还要备份_data数据 因为搜索时_data都要被重置
					}
					options.datagrid = _this;
					options.onSelectPage = function(pageNumber, pageSize, filter){
						var pgOpts = $(this).data("pagination")["options"];
						var data = pgOpts.datagrid.datagrid("options")._data.rows;
						var dCnt = 0;
						var dspRows = [];
						while(dCnt<pageSize){
							var num = (pageNumber-1)*pageSize+dCnt;
							if(num<data.length){
								dspRows.push(data[num]);	
							}
							else{
								break;
							}							
							dCnt++;
						}
						pgOpts.datagrid.datagrid("loadData",{"total":data.length,"rows":dspRows});
					}
				}
				
				$(arg).addClass("itc_pagination_container");
				var btnHtml = "";
				var pgSizeList = options.pageList;
				//设置菜单
				btnHtml += "<div class='dropdown bbox' style='float:right'><span data-toggle='dropdown' class='itc_pg_btn itc_pg_setting'></span>";
				btnHtml += "<ul class='dropdown-menu pull-right' role='menu'>";
				if(opts&&opts.defStyle&&opts.styles){
					//表格样式部分
					btnHtml += "<li class='dropdown-submenu pull-left'><a>显示设置</a><ul class='dropdown-menu itc_pagination_style'>";
					for(var i=0;i<opts.styles.length;i++){
						var style = opts.styles[i];
						btnHtml += "<li tblStyle='" + style.id + "'><a class='menuitem'>" 
						if(style.id==opts.defStyle){
							btnHtml += "<span class='dropdown-selected'></span>";
						}
						else{
							btnHtml += "<span class='dropdown-unselected'></span>";	
						}
						btnHtml += style.title + "</a></li>";
					}
					$(arg).data("onChangeStyle",opts.onChangeStyle || function(){});
					$(arg).data("onChangePageSize",opts.onChangePageSize || function(){});
					$(arg).data("opts",opts);
					btnHtml += "</ul></li>"	
				}
				btnHtml += "<li class='dropdown-submenu pull-left'><a>分页设置</a><ul class='dropdown-menu itc_pagination_psize'>";
				for(var i=0;i<pgSizeList.length;i++){
					btnHtml += "<li><a class='menuitem'>" 
					if(pgSizeList[i]==options.pageSize){
						btnHtml += "<span class='dropdown-selected'></span>";
					}
					else{
						btnHtml += "<span class='dropdown-unselected'></span>";	
					}
					btnHtml += "每页" + pgSizeList[i] + "条</a></li>";
				}
				btnHtml += "</ul></li>"
				
				btnHtml += "</ul></div>";
				//前后翻页按钮
				btnHtml += "<span class='itc_pg_btn itc_pg_next'></span>"
				btnHtml += "<span class='itc_pg_btn itc_pg_prev'></span>";				
				//菜单式翻页器
				var totalPage = Math.ceil(options.total/options.pageSize) || 1;
				btnHtml += "<div class='dropdown bbox' style='float:right'><div class='itc_pg_selector_wrap' data-toggle='dropdown'><span class='currpage'>";
				btnHtml += options.pageNumber + "</span><span class='itc_pagination_divider'>/</span><span>" + totalPage;
				btnHtml += "</span><span class='itc_pg_selector_icon'></span></div>";
				btnHtml += "<ul class='itc_pagination_menu dropdown-menu' role='menu' style='overflow-y:auto;overflow-x:hidden;max-height:208px'>";
				var pEnd = totalPage>8?8:totalPage;
					for(var i=1;i<=totalPage;i++){
					btnHtml += "<li turnto=" + i + "><a class='menuitem'>" + i +"<span class='itc_pagination_divider'>/</span>" + totalPage + "</a></li>";
				}
				//btnHtml += "<li class='divider'></li>";
				//btnHtml += "<li turnto=1><a class='menuitem'>首页</a></li>";
				//btnHtml += "<li turnto=" + totalPage + "><a class='menuitem'>末页</a></li>";
				btnHtml += "</ul></div>";
				$(arg).html(btnHtml);
				_pagination.css("display","none");
				_t.bindMenuPagerEvents();				
			};

			_t.adjustButtons = function(tgtITCPager){				
				tgt = tgtITCPager==null?$(arg):tgtITCPager;
				var opt = tgtITCPager==null?options:tgt.data("targetPager").pagination("options");
				if(opt.pageNumber>1){
					tgt.find(".itc_pg_prev_disable").removeClass("itc_pg_prev_disable").addClass("itc_pg_prev");
				}
				else{
					tgt.find(".itc_pg_prev").addClass("itc_pg_prev_disable").removeClass("itc_pg_prev");
				}

				if(opt.pageNumber*opt.pageSize<opt.total){
					tgt.find(".itc_pg_next_disable").removeClass("itc_pg_next_disable").addClass("itc_pg_next");
				}
				else{
					tgt.find(".itc_pg_next").addClass("itc_pg_next_disable").removeClass("itc_pg_next");
				}
			};

			_t.addEvents = function(){				
				var pgBtn = $(arg).find(".itc_pg_btn");
				$(arg).data("targetPager",_pagination);
				$(arg).data("targetDiv",arg);
				$(arg).data('ptrGrid',_this);
				pgBtn.click(function(e){
					var __this = $(this);
					if(!__this.hasClass("itc_pg_setting")){						
						var targetPager = __this.parent().data("targetPager");	
						var opt = targetPager.pagination("options");
						if(__this.hasClass("itc_pg_prev")){
							_t.turnTo($(arg),parseInt(opt.pageNumber) - 1);
						}
						if(__this.hasClass("itc_pg_next")){
							_t.turnTo($(arg),parseInt(opt.pageNumber) + 1);
						}
					}
				});
			};

			_t.search = function(opts){
				var dgOpts = _this.datagrid("options");
				if(!dgOpts.url && dgOpts.__data){
					_t.localSearch(opts);
				}
			};

			_t.localSearch = function(opts){
				var dgOpts = _this.datagrid("options");
				var newData = [];
				var oldData = dgOpts.__data.rows;
				for(var i=0;i<oldData.length;i++){
					var canAdd = true;
					var row = oldData[i];
					for(var field in row){
						if(opts[field]){
							if(row[field].indexOf(opts[field])<0){
								canAdd=false;
								break;
							}
						}
					}
					if(canAdd){
						newData.push(row);
					}
				}
				//重建datagrid和分页器
				dgOpts["_data"] = {"rows":newData,"total":newData.length};
				dgOpts["data"] = {"rows":newData.slice(0,dgOpts.pageSize),"total":newData.length};
				_t.datagrid(dgOpts);
				_t.ITCUI_Pagination("createPg",_t.data("target"),_t.data("styleOpt"));
			};

			_t.cancelLocalSearch = function(opts){
				
			};

			_t.remoteSearch = function(opts){

			};

			if(action=="create"||action=="createPg"){
				_t.createPagination();
				_t.adjustButtons();
				_t.addEvents();
			}
			else if(action=="search"){
				_t.search(arg);
			}
		}
	});
})(jQuery);