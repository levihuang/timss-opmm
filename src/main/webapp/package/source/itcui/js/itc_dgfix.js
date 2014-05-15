(function($){
	$.fn.extend({		
		/**
		 * 具有延迟加载功能的日期选择器
		 * @param optTextBox 控制文本框的选项，包括图标等，用于初始化ITCUI_Input
		 * @param optDatePicker 控制日期选择器的选项
		 * 
		 * 这两个选项都可以为空
		 */
		ITCUI_LazyLoadPicker : function(optTextBox,optDatePicker){
			var optText = optTextBox || {};
			var optPicker = optDatePicker || {};
			var _this = $(this);
			optPicker.language = 'ch';
			optPicker.autoclose = optPicker.autoclose || true;
			optPicker.forceParse = true;
			var placeHolder = optText.placeholder || "";
			optText.inputId = optText.inputId || ("itc_dp" + $(".itcui_btn_calander").length);
			_this.addClass("input-group input-group-sm");
			
			$("<input id='" + optText.inputId + "' type='text' icon='itcui_btn_calander' style='width:10px'></input>").attr("placeholder",placeHolder).appendTo(_this);
			var ipt = $(_this.children(":input"));
			ipt.ITCUI_Input();
			var icon = ipt.next("span");
			_this.children("input").data("opts",optPicker);
			_this.children("input").data("inited",false);
			_this.children("input").click(function(){
				var __this = $(this);
				var inited = __this.data("inited");
				var opts = __this.data("opts");
				if(!inited){
					__this.data("inited",true);
					__this.datetimepicker(opts).datetimepicker("show");
				}
			});
			//保证点图标也能弹出来
			icon.click(function(e){
				var __this = $(this);
				var ipt = __this.prev("input");
				var inited = ipt.data("inited");				
				if(!inited){
					var opts = ipt.data("opts");
					ipt.datetimepicker(opts).datetimepicker("show");
					ipt.data("inited",true);
				}
				else{
					ipt.datetimepicker("show");
				}
			});
		}
	});
})(jQuery);