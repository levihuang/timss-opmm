(function($){
	$.fn.extend({ 
		ITCUI_ComboBox:function(action,opts){
			//_this指针用于函数调用
			//__this用于事件中参数传递
			//这两个都是指向原始select的指针
			var displayItemCount = 6;
			var multiSelect = false;
			var maxStrLength = 12;
			var width = 150;
			var _this = $(this);
			var _t = this;
			opts = opts || {};
			

			//getVal=true时返回显示值 false返回实际值（option的value）
			_t.getMultiSelected = function(getVal,__this){
				var mul = __this.data("multiSelectedVal");
				var rStr = "";
				var i = 0;				
				__this.children("option").each(function(){
					var sel = false;
					var itemValue = !getVal?$(this).attr("value"):$(this).html();
					var initChecked = $(this).attr("multichecked");
					if(mul == null){
						if(initChecked){
							sel = true;
						}
					}
					else{
						if(mul[i]){
							sel = true;
						}
					}
					if(sel){
						rStr += itemValue + " ";
					}
					i++;
				});
				return rStr;
			};

			_t.initComboBox = function(){				
				width = parseInt(_this.css("width"));
				var maxLen = _this.attr("maxlength") || maxStrLength;
				_this.data("maxLen",maxLen);
				//以json方式初始化
				if(opts.data){
					var dataHtml = "";
					if(isArray(opts.data)){
						for(var i=0;i<opts.data.length;i++){
							var obj = opts.data[i];
							var selStr = "";
							if(obj.length==3){
								if(obj[2]=="selected"){
									selStr = " selected='selected'";
								}
								else if(obj[2]=="multichecked"){
									selStr = " multichecked=true";	
								}
							}
							dataHtml += "<option value='" + obj[0] + "'" + selStr + ">" + obj[1] + "</option>";
						}
					}
					else{
						for(var k in opts.data){
							dataHtml += "<option value='" + k + "'>" + opts.data[k] + "</option>";
						}
					}
					_this.html(dataHtml);
				}
				//获取初始化已选择的内容
				var comboLabel = _this.children("option:selected").text();
				if(_this.attr("multiselect") || opts.multiselect){
					multiSelect = true;
					comboLabel = _t.getMultiSelected(true,_this);
					if(ITC_Len(comboLabel)>maxLen){
						comboLabel = ITC_Substr(comboLabel,0,maxLen) + "...";
					}
				}
				_this.data("multiSelect", multiSelect);
				_this.data("dataMapping", []);
				_this.data("multiSelectedVal", null);
				_this.data("comboWidth",opts.wrapWidth || width);
				_this.data("onChange",opts["onChange"] || function(){});
				var fStr = "";
				if(_this.css("float")){
					fStr = "float:" + _this.css("float");
				}
				var comboHtml = "<div class='itcui_combo bbox' style='position:relative;width:" + width + "px;" + fStr + "'>";
				comboHtml += "<span class='itcui_combo_text' style='width:" + (width-30) + "px'>" + comboLabel + "</span><span class='itcui_combo_arrow_wrap'><b class='itcui_combo_arrow'></b></span>";
				comboHtml += "</div>";
				//删除之前生成的combobox
				if(_this.prev("div").hasClass("itcui_combo")){
					_this.prev("div").remove();
				}
				_this.css("display","none");
				_this.before(comboHtml);				
			};

			

			_t.updateComboText = function(__this){
				var mul = __this.data("multiSelect");
				var maxLen = __this.data('maxLen');
				var changeEvt = __this.data('onChange');
				var txt = "";
				if(mul){
					txt = _t.getMultiSelected(true,__this);
					if(ITC_Len(txt)>maxLen){
						txt = ITC_Substr(txt,0,maxLen) + "...";
					}
				}
				else{
					txt = __this.find(":selected").first().html();					
				}
				__this.prev(".itcui_combo").children(".itcui_combo_text").html(txt);
				changeEvt(mul?_t.getMultiSelected(false,__this):__this.val());
			};

			_t.initMultiSelectMapping = function(){
				var multiSelectedVal = {};
				var multiMapping = {};
				var i = 0;		
				_this.children("option").each(function(){
					var itemValue = $(this).attr("value");
					var initChecked = $(this).attr("multichecked");
					multiMapping[itemValue] = i;
					if(initChecked){
						multiSelectedVal[i] = true;
					}
					else{
						multiSelectedVal[i] = false;	
					}
					i++;
				});
				_this.data("multiSelectedVal",multiSelectedVal);
				_this.data("multiMapping",multiMapping);
			};
			
			_t.display = function(__this){				
				//生成元素项
				var listHtml = "";
				//必须先数出来有多少项才能确定宽度
				var itemCount = 0;
				var cbWidth = parseInt(__this.data("comboWidth"));
				itemWidth = cbWidth<100?100:cbWidth;
				__this.children("option").each(function(){
					itemCount ++;
				});
				if(itemCount>displayItemCount){
					itemWidth -= 18;//留出一个滚动条的宽度
				}				
				var wrapHeight = 25 * (itemCount>displayItemCount?displayItemCount:itemCount) + 16;
				listHtml += "<div id='itc_combo_wrap' class='itcui_dropdown_menu bbox' style='padding-top:6px;padding-bottom:6px;height:" + wrapHeight + "px;width:" + cbWidth+ "px;";
				if(itemCount>displayItemCount){
					listHtml += "overflow-y:scroll";
				}					
				listHtml += "'>";
				var multiSelect = __this.data("multiSelect");
				var multiSelectedVal = __this.data("multiSelectedVal");
				var dataMapping = __this.data("dataMapping");				
				var i = 0;
				__this.children("option").each(function(){
					var itemName = $(this).html();
					var itemValue = $(this).attr("value");					
					if(multiSelect==false){
						dataMapping.push([itemValue,itemName]);
						listHtml += "<div id='itcui_combo_item_" + i + "' class='itcui_dropdown_item' style='width:" + itemWidth + "px'>";
						listHtml += "<span class='itcui_dropdown_text'>" + itemName + "</span>";
						listHtml += "</div>";
					}
					else{
						listHtml += "<div id='itcui_combo_item_" + i + "' class='itcui_dropdown_item' style='width:" + itemWidth + "px'>";
						if(!multiSelectedVal[i]){
							listHtml += '<input class="itcui_dropdown_checkbox" type="checkbox" id="itcui_combo_chkbox_' + i + '">';
						}
						else{
							listHtml += '<input class="itcui_dropdown_checkbox" type="checkbox" id="itcui_combo_chkbox_' + i + '" checked>';
						}
						listHtml += '<label for="itcui_combo_chkbox_' + i + '">' + itemName + '</label>';
						listHtml += "</div>";
					}
					i++;
				});
				listHtml += "</div>";
				__this.data("dataMapping",dataMapping);
				__this.after(listHtml);
			};
			

			_t.doSingleSelect = function(__this,sVal){
				__this.val(sVal);
				//这里需要更改原始select的值 否则显示文本和post会出错
				__this.children("[selected]").removeAttr("selected");
				__this.children("[value='" + sVal + "']").attr("selected","selected");
				_t.updateComboText(__this);
			};

			_t.doMultiSelect = function(__this,sVal){
				var multiSelectedVal = __this.data("multiSelectedVal");
				var multiMapping = __this.data("multiMapping");
				for(var k in sVal){
					var n = multiMapping[k];
					if(sVal[k]){
						multiSelectedVal[n] = true;
					}
					else{
						multiSelectedVal[n] = false;
					}
				}
				__this.data("multiSelectedVal",multiSelectedVal);
				_t.updateComboText(__this);
			};

			_t.changeSelect = function(){
				var mul = _this.data("multiSelect");
				if(mul){
					_t.doMultiSelect(_this,opts);
				}
				else{
					_t.doSingleSelect(_this,opts);
				}
			};

			_t.addSingleChoiceEvent = function(){
				$("#itc_combo_wrap .itcui_dropdown_item").click(function(e){
					var __this = $(this).parent("#itc_combo_wrap").prev("select");
					var dataMapping = __this.data("dataMapping");
					var id = this.id;
					var num = parseInt(id.substr(17));
					_t.doSingleSelect(__this,dataMapping[num][0]);
					$("#itc_combo_wrap").remove();	
					itcui.combo_displayed = false;				
				});
			};

			_t.addMultiChoiceEvent = function(){
				$("#itc_combo_wrap input").iCheck({
				    checkboxClass: 'icheckbox_flat-blue',
				    radioClass: 'iradio_flat-blue'
				});
				$("#itc_combo_wrap .itcui_dropdown_item").click(function(e){
					e.stopPropagation();
					//修改选项卡状态
					var id = this.id;
					var num = parseInt(id.substr(17));
					$("#itcui_combo_chkbox_" + num).iCheck('toggle');					
				});
				$('#itc_combo_wrap .itcui_dropdown_checkbox').on('ifChanged', function(event){
					var id = this.id;
					var num = parseInt(id.substr(19));					
					var __this = $(this).parents("#itc_combo_wrap").prev("select");
					var multiSelectedVal = __this.data("multiSelectedVal");
					multiSelectedVal[num] = !multiSelectedVal[num];
					__this.data("multiSelectedVal", multiSelectedVal);
					_t.updateComboText(__this);
				});
			};

			_t.addEvents = function(){
				_this.prev(".itcui_combo").click(function(e){
					e.stopPropagation();
					var inputPtr = $(this).next("select");
					var nofix = inputPtr.attr("nofix");
					$("#itc_combo_wrap").remove();
					if(itcui.combo_displayed==false){
						_t.display(inputPtr);
						if(multiSelect){
							_t.addMultiChoiceEvent(inputPtr);
						}
						else{
							_t.addSingleChoiceEvent(inputPtr);
						}
						//重新调整下拉框的位置
						/*
						if(!nofix){
							var pos = ITC_GetAbsPos(this);
							$("#itc_combo_wrap").css({
								"left":pos.left,
								"top":pos.top + parseInt($(this).css("height"))
							});
						}
						*/
						itcui.combo_displayed = true;
						
					}
					else{
						itcui.combo_displayed = false;
					}
				});
				$("body").click(function(e){
					if(itcui.combo_displayed==true){
						$("#itc_combo_wrap").remove();
						itcui.combo_displayed = false;
					}
				});
			};

			
			if(!action){
				_t.initComboBox();
				if(multiSelect==true){
					_t.initMultiSelectMapping();
				}
				_t.addEvents();
			}
			else if(action=="getSelected"){
				return _this.attr("multiselect")?_t.getMultiSelected(false,_this):_this.val();
			}
			else if(action=="select"){
				_t.changeSelect();
			}
		}
	});
})(jQuery);