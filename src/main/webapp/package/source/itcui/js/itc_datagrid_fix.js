(function($){
	$.fn.extend({
		ITCUI_FixTableChkBox : function(){
			var t = $(this).prev(".datagrid-view2");
			//表头部分
			t.find(".datagrid-header").find(".datagrid-header-check > input").iCheck({
				checkboxClass: 'icheckbox_flat-blue',
				radioClass: 'iradio_flat-blue'
			}).on('ifChecked', function(event){
				var datagrid = $(this).parents(".datagrid-view2").next("table");
				datagrid.datagrid("selectAll");
			}).on('ifUnchecked', function(event){
				var datagrid = $(this).parents(".datagrid-view2").next("table");
				datagrid.datagrid("unselectAll");
			});
			//数据行部分
			t.find(".datagrid-body").find(".datagrid-cell-check > input").iCheck({
				checkboxClass: 'icheckbox_flat-blue',
				radioClass: 'iradio_flat-blue'
			}).on('ifChecked', function(event){
				var datagrid = $(this).parents(".datagrid-view2").next("table");
				var rownum = $(this).parents(".datagrid-row").attr("datagrid-row-index");
				datagrid.datagrid("selectRow",rownum);
			}).on('ifUnchecked', function(event){
				var datagrid = $(this).parents(".datagrid-view2").next("table");
				var rownum = $(this).parents(".datagrid-row").attr("datagrid-row-index");
				datagrid.datagrid("unselectRow",rownum);
			});
			
		}
	});
})(jQuery);

(function($){
    $.fn.extend({
        ITCUI_GridSearch : function(action,opts){
            var that = $(this);
            var outWrap = that.parents(".panel");
            var _t = this;
            _t.beginSearch = function(){
            	//选项处理
            	opts = opts || {};
            	opts.remoteSearch = opts.remoteSearch || false;
            	that.data("searchOpts",opts);
                var thead = outWrap.find(".datagrid-view2").children(".datagrid-header").find(".datagrid-header-row");
                var fields = thead.children("td");
                sHtml = "";
                for(var i=0;i<fields.length;i++){
                    var field = $(fields[i]);
                    var width = field.width() - (i!=fields.length-1?8:0);
                    var mlStr = i>0?"margin-left:8px":"";
                    sHtml += '<div class="input-group-sm pull-left" style="width:' + width + 'px;' + mlStr + '">' +
    								'<input type="text" icon="itcui_btn_mag" field="' + field.attr("field") + '">' + 
    						 '</div>';
                }
                $("<div class='bbox itc_gridsearch' style='height:28px;clear:both'></div>").prependTo(outWrap).html(sHtml);
                //搜索框回车事件
                outWrap.children(".itc_gridsearch").find("input").each(function(){
                	$(this).keypress(function(e) {
					    if(e.which == 13) {
					        _t.doSearch(this);
					    }
					}).ITCUI_Input();
                });
            };


            _t.endSearch = function(){
                that.parents(".panel").children(".itc_gridsearch").remove();
            };

            /*搜索的入口函数 必须从某个文本框开始*/
            _t.doSearch = function(target){
            	var searchWrap = $(target).parents(".itc_gridsearch");
            	var that = searchWrap.parent(".datagrid")
				            		 .children(".datagrid-wrap")
				            		 .children(".datagrid-view")
				            		 .children("table");
				var sOpts = that.data("searchOpts");
				//合成搜索参数
				var inputs = searchWrap.find("input");
                var sArg = {};
				for(var i=0;i<inputs.length;i++){
                    var ipt = $(inputs[i]);
                    sArg[ipt.attr("field")] = ipt.val();
                }
				if(!sOpts.remoteSearch){
					that.ITCUI_Pagination("search",sArg);
				}

            };

            if(action=="init"){
            	_t.beginSearch();
            }
            else if(action=="end"){
            	_t.endSearch();
            }
            else if(action=="search"){
            	//_t.doSearch()
            }
        }   
     });
})(jQuery);

//覆盖原EasyUI的编辑器
$.extend($.fn.datagrid.defaults.editors, {
	//文字框
    text: {
        init: function(container, options){
            var input = $('<div class="input-group-sm bbox"><input type="text" class="form-control validatebox-text" /></div>').appendTo(container);
            return input;
        },
        destroy: function(target){
            $(target).remove();
        },
        getValue: function(target){
            return $(target).children("input").val();
        },
        setValue: function(target, value){
            $(target).children("input").val(value);
        },
        resize: function(target, width){
            $(target)._outerWidth(width);
        }
    },
    //单选/复选框 限定样式icheckbox_flat-blue
    checkbox: {
        init: function(container, options){
            var input = $('<input type="checkbox">').appendTo(container);
            input.iCheck({
			    checkboxClass: 'icheckbox_flat-blue',
			    radioClass: 'iradio_flat-blue',
			});
            return input;
        },
        destroy: function(target){
            $(target).parent().remove();
        },
        getValue: function(target){
            return $(target).parent().hasClass("checked");
        },
        setValue: function(target, value){
        	var tp = $(target);
        	if(value){
        		tp.iCheck('check');
        	}
        	else{
        		tp.iCheck('uncheck');
        	}
            $(target).children("input").val(value);
        },
        resize: function(target, width){
            
        }
    },
    //日期/时间选择器
    datebox : {
        init: function(container, options){
            var o = $('<div class="itc_lazypicker bbox" style="width:100%"></div>').appendTo(container);
            o.ITCUI_LazyLoadPicker(null,options);
            return o;
        },
        destroy: function(target){
            $(target).remove();
        },
        getValue: function(target){
            return $(target).children("input").val();
        },
        setValue: function(target, value){
            $(target).children("input").val(value);
        },
        resize: function(target, width){
            $(target)._outerWidth(width);
        }
    },
    //单选框
    combobox : {
        init: function(container, options){
            maxlength = options.maxlength || 18;
            var o = $('<select style="width:100%" maxlength=' + maxlength + ' nofix=1>').appendTo(container);
            o.ITCUI_ComboBox(null,options);
            return o;
        },
        destroy: function(target){
            $(target).prev(".itcui_combo").remove();
            $(target).remove();
        },
        getValue: function(target){
            return $(target).val();
        },
        setValue: function(target, value){
            $(target).ITCUI_ComboBox("select",value);
        },
        resize: function(target, width){
            $(target)._outerWidth(width);
        }
    }
});

//覆盖validatebox方法
(function($){
	$.fn.extend({
		validatebox : function(arg){
			return true;
		}
	});
})(jQuery);