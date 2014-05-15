(function($){
	$.fn.extend({ 
		/*
		 * 扩展输入框
		 */
		ITCUI_Input : function(opt){
			var _this = $(this);			
			var options = opt || {};
			var _parent = _this.parent();
			
			init = function(){
				var icon = options["icon"] || _this.attr("icon") || null;
				var placeholder = options["placeholder"] || _this.attr("placeholder") || null;
				var onlyLabel = options["onlylabel"] || _this.attr("onlylabel") || null;
				var inputWidth = "100%";
				if(icon){				
					$("<span class='itcui_input_icon'></span>").appendTo(_parent).addClass(icon).css({
						"float":"right",
						"margin-right" : "4px",
						"vertical-align" : "middle"
					});
					//调整图标的位置
					var iconSpan = _parent.children(".itcui_input_icon");
					var wrapHeight = parseInt(_parent.css("height"));
					var iconHeight = parseInt(iconSpan.css("height"));
					iconSpan.css("margin-top",/*(wrapHeight - iconHeight)/2-1*/6);
					//重新计算input的大小
					var wrapWidth = parseInt(_parent.css("width"));
					var iconWidth = parseInt(iconSpan.css("width"));
					inputWidth = (wrapWidth - iconWidth - 17) + "px";
					
				}
				if(placeholder){
					//新版jquery判断ie6-ie8
					if(!$.support.leadingWhitespace){
						$("<span class='itcui_placeholder'>" + placeholder +  "</span>").prependTo(_parent).addClass("itcui_placeholder").css({
							"width" : inputWidth
						});
						_parent.children("input").css("display","none").blur(function(){
							var _this = $(this);
							if(!_this.val()){
								_this.css("display","none");
								_this.prev("span").css("display","block");
							}
						});
						_parent.children(".itcui_placeholder").click(function(){
							var _this = $(this);
							_this.css("display","none");
							_this.next("input").css("display","block").focus();
						});
					}
				}
				if(placeholder||icon){
					_this.css({
						"float":"left",
						"width" : inputWidth,
						"border-width" : "0px",
						"outline":"none",
						"margin-left":"4px",
						"font-size":"12px",
						"margin-top":"2px"
					});
					_parent.addClass("form-control-style");
				}
				if(onlyLabel){
					addLabel();
				}
			};
			
			addLabel = function(){
				_parent.addClass("borderless").find(".itcui_input_icon").css("display","none");
				_parent.find("input").css("visibility","hidden");
				_parent.css("height",_parent.css("height")).css("overflow","hidden");
				var text = _this.val();
				$("<span class='itcui_onlylabel'>" + text + "</span>").prependTo(_parent);
			};
			
			removeLabel = function(){
				
			};
			
			if(!opt || typeof(opt)=="object"){
				init();
			}
			else if(typeof(opt)=="string"){
				if(opt=="label"){
					addLabel();
				}
			}
		}
	});
})(jQuery);

(function($){
	$.fn.extend({ 
		ITCUI_HintList : function(opt){
			var _this = $(this);
			opt = opt || {};			
			if(!opt.datasource && !opt.datafunc){
				return;
			}
			opt.maxItemCount = opt.maxItemCount || 10; //最多显示10项
			opt.filterHere = opt.filterHere || false;
			opt.getDataOnKeyPress = opt.getDataOnKeyPress || false;//是否在每次按键都重新获取数据
			opt.extArgName = opt.extArgName || null;//在每次显示外框之前执行的动作，结果作为补充参数传入函数或者post内
			opt.extArgFunc = opt.extArgFunc || function(){};
			opt.highlight = opt.highlight || false;//是否需要高亮关键字
			opt.clickEvent = opt.clickEvent || function(){};//点击提示项的动作，参数依次为id,name
			_this.data("opt",opt);

			_this.click(function(){
				event.stopPropagation();
				//创建最基本外框
				$("#ITC_HintList_Wrap").remove();
				var target = $(this);
				var wrapWidth = target.css("width");
				var hlHtml = '<ul class="dropdown-menu" role="menu" id="ITC_HintList_Wrap" style="overflow:hidden;position:absolute;min-width:200px;width:' + wrapWidth + '">';
				hlHtml += '<li><span class="menuitem noclick">正在加载，请稍后</span></li>';
				hlHtml += '</ul>';
				target.after(hlHtml);
				var pos = ITC_GetAbsPos(target);
				$("#ITC_HintList_Wrap").css({
					"left" : pos.left,
					"top" : pos.top + parseInt(target.css("height") + 4),
					"display" : "block"
				});
				target.data("hintdata",null);
				changeData(target);
			});

			_this.on("input",function(){
				changeData($(this));
			});
			
			$("body").click(function(){
				$("#ITC_HintList_Wrap").remove();
			})
			
			
			changeData = function(target){
				var kw = target.val();
				var opt = target.data("opt");
				if(opt.datafunc){
					var data = opt.datafunc(kw);
					if(isArray(data)){
						genList(kw,data,target);
					}
				}
				else if(opt.datasource){
					var form = {
						"kw" : kw 
					};
					if(opt.extArgName){
						form[opt.extArgName] = opt.extArgFunc();
					}
					$.ajax({
						url : opt.datasource,
						type : "POST",
						data : form,
						success : function(result){							
							if(!isArray(result)){
								result = eval("(" + result + ")");
							}
							if(isArray(result)){
								genList(kw,result,target);
							}
						}
					});
				}
			};

			genList = function(kw,data,target){
				var opt = target.data("opt");
				var lHtml = "";
				var l = data.length>opt.maxItemCount?opt.maxItemCount:data.length;
				for(var i=0;i<l;i++){
					var o = data[i];
					lHtml += '<li><a class="menuitem" hintid="' + o.id + '">' + o.name + '</a></li>';
				}
				if(data.length>opt.maxItemCount){
					lHtml += '<li><span class="noclick">结果多于' + opt.maxItemCount + '条，请补充关键字</span></li>';
				}
				$("#ITC_HintList_Wrap").html(lHtml).find(".menuitem").click(function(){
					var __this = $(this);
					var id = __this.attr("hintid");
					var name = __this.html();
					var target = __this.parents("#ITC_HintList_Wrap").prev("input");
					var opt = target.data("opt");
					opt.clickEvent(id,name);
					$("#ITC_HintList_Wrap").remove();
				});
			};
		}
	});
})(jQuery);

/*
jQuery `input` special event v1.2
http://whattheheadsaid.com/projects/input-special-event

(c) 2010-2011 Andy Earnshaw
forked by dodo (https://github.com/dodo)
MIT license
www.opensource.org/licenses/mit-license.php
*/
(function($, udf) {
var ns = ".inputEvent ",
    // A bunch of data strings that we use regularly
    dataBnd = "bound.inputEvent",
    dataVal = "value.inputEvent",
    dataDlg = "delegated.inputEvent",
    // Set up our list of events
    bindTo = [
        "input", "textInput",
        "propertychange",
        "paste", "cut",
        "keydown", "keyup",
        "drop",
    ""].join(ns),
    // Events required for delegate, mostly for IE support
    dlgtTo = [ "focusin", "mouseover", "dragstart", "" ].join(ns) + bindTo,
    // Elements supporting text input, not including contentEditable
    supported = {TEXTAREA:udf, INPUT:udf},
    // Events that fire before input value is updated
    delay = { paste:udf, cut:udf, keydown:udf, drop:udf, textInput:udf };

// this checks if the tag is supported or has the contentEditable property
function isSupported(elem) {
    return $(elem).prop('contenteditable') == "true" ||
             elem.tagName in supported;
};

$.event.special.txtinput = {
    setup: function(data, namespaces, handler, onChangeOnly) {
        var timer,
            bndCount,
            // Get references to the element
            elem  = this,
            $elem = $(this),
            triggered = false;

        if (isSupported(elem)) {
            bndCount = $.data(elem, dataBnd) || 0;

            if (!bndCount)
                $elem.bind(bindTo, handler);

            $.data(elem, dataBnd, ++bndCount);
            $.data(elem, dataVal, elem.value);
        } else {
            $elem.bind(dlgtTo, function (e) {
                var target = e.target;
                if (isSupported(target) && !$.data(elem, dataDlg)) {
                    bndCount = $.data(target, dataBnd) || 0;

                    if (!bndCount) {
                        $(target).bind(bindTo, handler);
                        handler.apply(this, arguments);
                    }

                    // make sure we increase the count only once for each bound ancestor
                    $.data(elem, dataDlg, true);
                    $.data(target, dataBnd, ++bndCount);
                    $.data(target, dataVal, target.value);
                }
            });
        }
        function handler (e) {
            var elem = e.target;

            // Clear previous timers because we only need to know about 1 change
            window.clearTimeout(timer), timer = null;

            // Return if we've already triggered the event
            if (triggered)
                return;

            // paste, cut, keydown and drop all fire before the value is updated
            if (e.type in delay && !timer) {
                // ...so we need to delay them until after the event has fired
                timer = window.setTimeout(function () {
                    if (elem.value !== $.data(elem, dataVal)) {
                        $(elem).trigger("txtinput");
                        $.data(elem, dataVal, elem.value);
                    }
                }, 0);
            }
            else if (e.type == "propertychange") {
                if (e.originalEvent.propertyName == "value") {
                    $(elem).trigger("txtinput");
                    $.data(elem, dataVal, elem.value);
                    triggered = true;
                    window.setTimeout(function () {
                        triggered = false;
                    }, 0);
                }
            }
            else {
                var change = onChangeOnly !== undefined ? onChangeOnly :
                    $.fn.input.settings.onChangeOnly;
                if ($.data(elem, dataVal) == elem.value && change)
                    return;
                
                $(elem).trigger("txtinput");
                $.data(elem, dataVal, elem.value);
                triggered = true;
                window.setTimeout(function () {
                    triggered = false;
                }, 0);
            }
        }
    },
    teardown: function () {
        var elem = $(this);
        elem.unbind(dlgtTo);
        elem.find("input, textarea").andSelf().each(function () {
            bndCount = $.data(this, dataBnd, ($.data(this, dataBnd) || 1)-1);

            if (!bndCount)
                elem.unbind(bindTo);
        });
    }
};

// Setup our jQuery shorthand method
$.fn.input = function (handler) {
    return handler ? $(this).bind("txtinput", handler) : this.trigger("txtinput");
}

$.fn.input.settings = {
    onChangeOnly: false
};

})(jQuery);