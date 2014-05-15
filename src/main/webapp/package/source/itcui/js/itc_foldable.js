(function($){
	$.fn.extend({
		ITCUI_Foldable:function(action,opts){
			var title = "无标题栏目"
			var _this = $(this);
			var _t = this;

			_t.initFoldable = function(){
				opts = opts || {};
				opts.onExpand = opts.onExpand || function(){};
				opts.onFold = opts.onFold || function(){};
				opts.hideOnEmpty = opts.hideOnEmpty===false?true:false;
				_this.data("opts",opts);
				if(_this.attr("grouptitle")){
					title = _this.attr("grouptitle");
				}
				if(opts){
					if(opts["grouptitle"]){
						title = opts["grouptitle"];
					}
				}
				var fStr = "";
				if(_this.css("float")){
					fStr = "float:" + _this.css("float");
				}
				var prepHtml = '<div class="itcui_frm_grp_title" style="width:100%;' + fStr + '">';
				prepHtml += '<span class="itcui_frm_grp_title_arrow'
				if(_this.css("display")!="none"){
					prepHtml += '  itcui_frm_grp_title_arrow_expand';
				}
				prepHtml += '"></span>';
				prepHtml += '<span class="itcui_frm_grp_title_txt">' + title + '</span>';
				prepHtml += '</div>';
				_this.before(prepHtml);
				_t.hideOnEmpty();
			}

			_t.hideOnEmpty = function(){
				var objects = _this.children();
				var canHide = true;
				for(var i=0;i<objects.length;i++){
					if($(objects[i]).css("display")!="none"){
						canHide = false;
						break;
					}
				}
				if(canHide){
					_t.hideAll();
				}
			};

			_t.hideAll = function(){
				_this.hide();
				_this.prev(".itcui_frm_grp_title").hide();
			};

			_t.showAll = function(){
				_this.show();
				_this.prev(".itcui_frm_grp_title").show();	
			};

			_t.fold = function(){
				var grpTitle = _this.prev(".itcui_frm_grp_title");
				_t.foldOrExpand(grpTitle,"fold");
			};

			_t.expand = function(){
				var grpTitle = _this.prev(".itcui_frm_grp_title");
				_t.foldOrExpand(grpTitle,"expand");
			};

			_t.toggle = function(){
				var grpTitle = _this.prev(".itcui_frm_grp_title");
				_t.foldOrExpand(grpTitle);
			}

			_t.foldOrExpand = function(grouptitle,action){
				var mainPart = $(grouptitle).next("div");
				var opts = mainPart.data("opts");
				if((mainPart.css('display')=="none" || action=="expand") && action!="fold"){
					grouptitle.children(".itcui_frm_grp_title_arrow").addClass("itcui_frm_grp_title_arrow_expand");
					mainPart.slideDown("normal",opts.onExpand);
				}
				else if(action!="expand"){
					mainPart.slideUp("normal",opts.onFold);	
					grouptitle.children(".itcui_frm_grp_title_arrow").removeClass("itcui_frm_grp_title_arrow_expand");
				}
			}

			_t.addEvents = function(){
				var grpTitle = _this.prev(".itcui_frm_grp_title");				
				grpTitle.click(function(e){
					_t.foldOrExpand(grpTitle);
				});
			}

			if(!action){
				_t.initFoldable();
				_t.addEvents();
			}
			else if(action=="show"){
				_t.showAll();
			}
			else if(action=="hide"){
				_t.hideAll();
			}
			else if(action=="fold"){
				_t.fold();
			}
			else if(action=="expand"){
				_t.expand();
			}
			else if(action=="toggle"){
				_t.toggle();
			}
		}
	});
})(jQuery);