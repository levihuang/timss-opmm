var itcui_submenu = {"width":"170px","items":
		[{"name":"菜单项A_1","icon":"images/menu_icon.png"},{"name":"菜单项A_2"},{"name":"菜单项A_3"},{"name":"-"},
		{"name":"菜单项B_1"},{"name":"菜单项B_2"},{"name":"菜单项B_3"}]
	};
var itcui_menu1 = {"width":"170px","items":
		[{"name":"菜单项1_1","icon":"images/menu_icon.png"},{"name":"菜单项1_2","submenu":itcui_submenu},{"name":"菜单项1_3"},{"name":"-"},
		{"name":"菜单项2_1"},{"name":"菜单项2_2"},{"name":"菜单项2_3"}]
	};
var itcui_menu2 = {"width":"170px","items":
		[{"name":"菜单项1_1"},{"name":"菜单项1_2"},{"name":"菜单项1_3"},{"name":"菜单项1_4"},{"name":"菜单项1_5"},{"name":"-"},
		{"name":"菜单项2_1"},{"name":"菜单项2_2"},{"name":"菜单项2_3"},{"name":"菜单项2_4"},{"name":"菜单项2_5"}]
	};
var itcui_menu3 = {"width":"170px","items":
		[{"name":"跳转到首页"},{"name":"跳转到末页"},{"name":"-"},{"name":"每页显示5条"},{"name":"每页显示10条"},{"name":"每页显示15条"},{"name":"每页显示20条"},{"name":"每页显示25条"}]
	};
var itcui_menu4 = {"width":"150px","items":
		[{"name":"1/5"},{"name":"2/5"},{"name":"3/5"},{"name":"4/5"},{"name":"5/5"}]
	};

var _current_menu;
var _last_mouse_over_menu;
/*
	公用函数
*/
function get_abs_position(obj)
{
	var o = $(obj);
	var obj_x = o.offset().left;
	var obj_y = o.offset().top;
	while(o.attr("parentNode"))
	{
		o = o.parent();
		obj_x += o.offset().left;
		obj_y += o.offset().top;
	}
	var p = {"left":obj_x,"top":obj_y};
	return p;
}

function adjDatepicker(div_id)
{
	var abs_pos = get_abs_position(div_id);
	var o_top = parseInt($(div_id).css("height"));
	$("#ui-datepicker-div").css("top",abs_pos.top + o_top +4);
	$("#ui-datepicker-div").css("left",abs_pos.left);
}

(function($){

	//获取某的对象相对于<HTML>的绝对坐标
	
	/*
	--------------------------------------
				输入框默认文字
	--------------------------------------
	*/
	$.ITCUI_DeafultText = function(input_id,default_text){
		$(input_id).val(default_text);
		$(input_id).addClass("itcui_default_text");
		$(input_id).focus(function(){
			var v = $(input_id).val();
			if(v==default_text){
				$(input_id).val("");
				$(input_id).removeClass("itcui_default_text");
			}
		});
		$(input_id).blur(function(){
			var v = $(input_id).val();
			if(v==""){
				$(input_id).val(default_text);
				$(input_id).addClass("itcui_default_text");
			}
		});
	}
	/*
	--------------------------------------
				验证错误信息
	--------------------------------------
	*/
	$.ITCUI_Validator = function(){
		this.errormsg = function(target,left_offset,message)
		{
			var pos = get_abs_position(target);
			var obj_width = parseInt($(target).css("width"));
			var obj_height = parseInt($(target).css("height"));
			var hint_left = pos.left+obj_width+left_offset;
			var hint_top = pos.top + Math.abs((20-obj_height)/2)+2;
			var warn_html = "<span class='itcui_icon_warn_mid' style='cursor:pointer;top:" + hint_top + "px;left:" + hint_left + "px;z-index:199' title='" + message + "'></span>"
			$("body").append(warn_html)
		};
	};
	/*
	--------------------------------------
				上方提示信息
	--------------------------------------
	*/
	$.ITCUI_ScreenTopMessage = function(){
		this.show = function(msg,msgtype){
			$("#itcui_screen_top_msg").remove();
			var scn_width = parseInt(document.documentElement.clientWidth);
			if(msgtype=="success"){
				var msg_html = "<div class='itcui_tips_success";
			}
			else if(msgtype=="error"){
				var msg_html = "<div class='itcui_tips_error";
			}
			else if(msgtype=="loading")
			{
				var msg_html = "<div class='itcui_tips_loading";
			}
			else
			{
				return;
			}
			msg_html += " itcui_tips_top' style='left:" + (scn_width - 194)/2 + "px' id='itcui_screen_top_msg'>";
			msg_html += msg + "</div>";
			$("body").append(msg_html);
			$("#itcui_screen_top_msg").hide();
			$("#itcui_screen_top_msg").slideDown();
			setTimeout("$('#itcui_screen_top_msg').slideUp()",5000);
		};
	};
	/*
	--------------------------------------
			弹出式对话框（DIV能动）
	--------------------------------------
	*/
	$.ITCUI_Popup = function(){
		this.show = function(div_id,title,html_src,btns){
			//注意！这里是从子框架向父框架弹窗
			var scn_height = window.parent.document.documentElement.clientHeight;
			var scn_width = window.parent.document.documentElement.clientWidth;
			var dlg_width = parseInt($(div_id).css("width"));
			var dlg_height = parseInt($(div_id).css("height")) + 66;
			var dlg_top = (scn_height - dlg_height)/2;
			var dlg_left = (scn_width - dlg_width)/2
			var dlg_html = "<div id='itcui_popup_wrap' class='itcui_messagebox_wrap' style='z-index:3999;top:" + dlg_top + "px;left:" + dlg_left + "px;width:" + dlg_width + "px;height:" + dlg_height + "px;'>"
			dlg_html += "<div id='itcui_popup_title' class='itcui_messagebox_title' width='100%'><span class='itcui_popup_title_text'>" + title + "</span><span id='itcui_popup_cross' class='itcui_btn_cross' style='margin-top:8px;float:right' onclick='$(\"#itcui_popup_wrap\").remove();',300)';></span></div>";//标题栏
			dlg_html += "<iframe frameborder='no' border='0'src='" + html_src + "' id='itcui_messagebox_content'></iframe>";
			dlg_html += "<div class='itcui_messagebox_button_wrap' style='width:" + (dlg_width-6) + "px'>";
			if(btns.del)
			{
				dlg_html += "<span id='itcui_messagebox_cancel' onclick='$(\"#itcui_popup_wrap\").remove();' class='itcui_btn_base itcui_btn_gray' style='width:60px;margin-left:6px;float:left'>删除</span>";
			}
			if(btns.cancel)
			{
				dlg_html += "<span id='itcui_messagebox_cancel' onclick='$(\"#itcui_popup_wrap\").remove();' class='itcui_btn_base itcui_btn_gray' style='width:60px;margin-left:6px;float:right'>取消</span>";				
			}
			if(btns.ok)
			{
				dlg_html += "<span id='itcui_messagebox_ok' class='itcui_btn_green itcui_btn_base' style='width:60px;margin-left:8px;float:right' onclick='$(\"#itcui_popup_wrap\").remove();'>确定</span></div>";
			}
			dlg_html += "</div>";
			$("body",window.parent.document).append(dlg_html);
			$("#itcui_messagebox_content",window.parent.document).css("width",dlg_width);
			$("#itcui_messagebox_content",window.parent.document).css("height",dlg_height-66);
			_set_mouse_move();
			//关闭按钮
		};
		var moving = 0; 
		var _x, _y; 
		function _set_mouse_move()
		{
		    $("#itcui_popup_title",window.parent.document).mousedown(function(event){ 

		        //debugger; 
		        this.setCapture(); 
		        moving = 1; //开始移动标识 
		        _x = event.clientX; 
		        _y = event.clientY; 
		        //记录鼠标当前位置 
		    }); 
		    $("#itcui_popup_title",window.parent.document).mouseup(function(event){ 
		        this.releaseCapture(); 
		        moving = 0;		        
		    }); 
		    $("#itcui_popup_title",window.parent.document).mousemove(function(event){ 
		        if (moving == 1) { 
		            //获取鼠标移动中的位置 
		            var x = event.clientX; 
		            var y = event.clientY;          
		            //为窗体赋新位置 
		            var X0 = parseInt($("#itcui_popup_wrap",window.parent.document).css("left")); 
		            var Y0 = parseInt($("#itcui_popup_wrap",window.parent.document).css("top")); 
		            $("#itcui_popup_wrap",window.parent.document).css("top", (Y0 + y - _y)); 
		            $("#itcui_popup_wrap",window.parent.document).css("left", (X0 + x - _x)); 
		            _x = x; 
		            _y = y; 
		        } 
		    }); 
		}
	};
	/*
	--------------------------------------
				弹出式对话框
	--------------------------------------
	*/
	$.ITCUI_MessageBox = function(){
		this.show = function(dlgwidth,dlgheight,title,message){
			var scn_height = document.documentElement.clientHeight;
			var scn_width = parseInt(document.documentElement.clientWidth);
			var dlg_top = (scn_height - dlgheight)/2;
			var dlg_left = (scn_width - dlgwidth)/2
			var inner_wrap_width = dlgwidth - 32;
			var inner_wrap_height = dlgheight - 32;
			var dlg_html = "<div class='itcui_messagebox_wrap' style='top:" + dlg_top + "px;left:" + dlg_left + "px;width:" + dlgwidth + "px;height:" + dlgheight + "px;'>"
			dlg_html += "<div class='itcui_messagebox_title' width='100%'><span id='itcui_messagebox_cross' class='itcui_btn_cross' style='margin-top:8px;float:right'></span></div>";//标题栏
			dlg_html += "<div style='height:" + (dlgheight-26-56) + "px;width:100%'>";
			dlg_html += "<div style='width:" + inner_wrap_width + "px;height:" + inner_wrap_height + "px;margin-top:16px;margin-left:16px'>";
			dlg_html += "<div style='width:32px;height:" + inner_wrap_height + "px;'><span class='itcui_icon_warn_big' style='float:left;margin-top:" + ((inner_wrap_height - 48-40-26)/2) + "px'></span>";//大号图标
			dlg_html += "<div style='width:" + (inner_wrap_width-48) + "px;height:32px;padding-top:6px;' class='itcui_messagebox_content_title'><span style='margin-left:16px;'>" + title + '</span></div>';//对话框标题
			dlg_html += "<div class='itcui_messagebox_content' style='width:" + (inner_wrap_width-48) + "px;'><span style='margin-left:16px'>" + message + "</span></div>";//对话框内容
			dlg_html += "</div>";//内层信息
			dlg_html += "</div>";//内层wrap
			dlg_html += "</div>"//中间内容
			dlg_html += "<div class='itcui_messagebox_button_wrap' style='width:" + (dlgwidth-6) + "px'>";
			dlg_html += "<span id='itcui_messagebox_cancel' class='itcui_btn_base itcui_btn_gray' style='width:60px;margin-left:6px;float:right'>取消</span><span id='itcui_messagebox_ok' class='itcui_btn_green itcui_btn_base' style='width:60px;margin-left:8px;float:right'>确定</span></div>"
			dlg_html += "</div>";//最外层
			dlg_html += "<div class='itcui_background_mask' style='height:" + scn_height + ";width:" + scn_width + "px'></div>";//外层遮罩		
			$("body").append(dlg_html);

			$("#itcui_messagebox_cross,#itcui_messagebox_cancel,#itcui_messagebox_ok").click(function(){
				hide_dlg();
			});
		};
		this.hide = function(){
			hide_dlg();	
		};
		function hide_dlg()
		{
			$(".itcui_messagebox_wrap").fadeOut();
			$(".itcui_messagebox_wrap").remove();
			$(".itcui_background_mask").remove();
		}
	}
	/*
	--------------------------------------
				可以折叠的效果
	--------------------------------------
	*/
	$.ITCUI_Foldable = function(div_id){
		var sub_item_id = div_id.substr(1) + "_subitem";
		$(div_id).click(function(){
			if($("#" + sub_item_id).css("display")=="none")
			{
				$("#" + sub_item_id).slideDown();
				$(div_id + "_arrow").addClass("itcui_form_group_title_arrow_expand")
				if($(div_id).hasClass("itcui_form_group_last"))
				{
					$(div_id).css("border-bottom-style","solid");
				}
			}
			else
			{
				$("#" + sub_item_id).slideUp();
				$(div_id + "_arrow").removeClass("itcui_form_group_title_arrow_expand");
				if($(div_id).hasClass("itcui_form_group_last"))
				{
					$(div_id).css("border-bottom-style","none");
				}
			}
		});		
	}
	/*
	--------------------------------------
				单选框
	--------------------------------------
	*/
	$.ITCUI_Radio = function(div_id,group_name,selected){
		if(selected==true)
		{
			$(div_id).addClass("itcui_radio_select")
		}
		else
		{
			$(div_id).addClass("itcui_radio_unselect");
		}
		//自动居中
		var p = $(div_id).parent();
		var p_height = parseInt(p.css("height"));
		var new_top = (p_height - 14)/2 -1;//14px的选项框比文字略大 所以这里不是刚好居中
		$(div_id).css("margin-top",new_top);
		$(div_id).click(function(){
			$("[name='" + group_name + "']").removeClass("itcui_radio_select");
			$("[name='" + group_name + "']").addClass("itcui_radio_unselect");
			$(this).addClass("itcui_radio_select");
		});
	}
	/*
	--------------------------------------
				输入框
	--------------------------------------
	*/
	$.ITCUI_Input = function(div_id,large){
		//初始化部分
		var disabled = false;
		var ipt_name = div_id.substr(1);
		var ipt_id = "itcui_input_" + ipt_name;
		var ipt_width = parseInt($(div_id).css("width"));
		$(div_id).addClass("itcui_input_wrap");
		$(div_id).html("<input class='itcui_input' type='text' id='" + ipt_id + "' name='" + ipt_name + "' style='width:" + ipt_width + "px'/>");
		if(large==true)
		{
			$(div_id).addClass("itcui_input_wrap_large");
		}
		$("#" + ipt_id).focus(function(){
			if(disabled==false)
			{
				$(div_id).addClass("itcui_input_wrap_hover");
			}
		});
		$("#" + ipt_id).blur(function(){
			if(disabled==false)
			{
				$(div_id).removeClass("itcui_input_wrap_hover");
			}
		});

		this.disable = function(){
			$("#" + ipt_id).attr("readOnly",true);
			$("#" + ipt_id).addClass("itcui_disable_mask");
			$(div_id).addClass("itcui_disable_mask");
			disabled = true;
		};

		this.enable = function(){
			$("#" + ipt_id).attr("readOnly",false);
			$("#" + ipt_id).removeClass("itcui_disable_mask");	
			$(div_id).removeClass("itcui_disable_mask");
			disabled = false;
		}
		
		this.onlyLabel = function()
		{
			$(div_id).removeClass("itcui_input_wrap");
			$(div_id).addClass("itcui_input_wrap_onlylabel");
			$("#" + ipt_id).attr("readOnly",true);
		}

		this.removeOnlyLabel = function()
		{
			$(div_id).addClass("itcui_input_wrap");
			$(div_id).removeClass("itcui_input_wrap_onlylabel");
			$("#" + ipt_id).attr("readOnly",false);
		}
		
		this.turnDatePicker = function(in_table){
			$("#" + ipt_id).css("width",ipt_width-26);
			if(in_table)
			{
				var icon_html = "<span class='itcui_btn_calander' style='display:inline-block;'></span>";
			}
			else
			{
				var icon_html = "<span class='itcui_btn_calander fr mt4' style='display:inline-block'></span>";
			}
			$(div_id).append(icon_html);
			$("#" + ipt_id).datepicker($.datepicker.regional["zh-CN"]);
			$("#" + ipt_id).focus(function(){
				setTimeout("adjDatepicker('" + div_id + "')",20);
			});
		};

		this.getValue = function(){
			return $("#" + ipt_id).val();
		};

		this.setValue = function(v){
			$("#" + ipt_id).val(v);
		};

		this.getDiv = function(){
			return div_id;
		};
	};
	/*
	--------------------------------------
				Combo框体
	--------------------------------------
	*/
	$.ITCUI_Combo = function(name,items,div_id,multi){
		
		$(div_id).addClass("itcui_combo");
		var combo_html = "<span class='itcui_combo_text'>" + name + "</span><span class='itcui_combo_arrow_wrap'><b class='itcui_combo_arrow'></b></span>";
		$(div_id).html(combo_html);
		if(multi==true)
		{
			$(div_id).click(function(e){
				e.stopPropagation();
				$("#itcui_combo_dropdown").remove();
				$(".itcui_dropdown_menu").remove();
				var abs_pos = get_abs_position(div_id);
				var real_top = abs_pos.top + parseInt($(div_id).css("height")) + 2;
				var cb_width = parseInt($(div_id).css("width")) + 10;
				var cb_height = items.length *25+6;
				var menu_html = "<div id='itcui_combo_dropdown' class='itcui_dropdown_menu' style='position:absolute;width:" + cb_width + "px;height:" + cb_height + "px;top:" + real_top + "px;left:" + abs_pos.left + "px'>";
				for(var i=0;i<items.length;i++)
				{
					menu_html += "<div id='itcui_dropdown_item_" + i + "' class='itcui_dropdown_item' style='width:" + cb_width + ";height:25px;'>"
					menu_html += "<span class='itcui_chkbox chkbox_combo' id='chkbox_combo_" + i + "' style='margin-left:4px;float:left;margin-top:5px'></span>";
					menu_html += "<span class='itcui_dropdown_text' style='float:left'>" + items[i] + "</span>"
					menu_html += "</div>"
				}			
				menu_html += "</div>";
				$("body").append(menu_html);
				$("#itcui_combo_dropdown").hide();
				$("#itcui_combo_dropdown").slideDown();
				$(".chkbox_combo").click(function(){
					e.stopPropagation();
					var cls = $(this).attr("class");
					if(cls.indexOf("itcui_chkbox_checked")>0){
						$(this).removeClass("itcui_chkbox_checked");
					}
					else
					{
						$(this).addClass("itcui_chkbox_checked");;
					}
				});
				$(document).click(function(e){
					e.stopPropagation();
					$("#itcui_combo_dropdown").remove();
				});
			});
		}
	};

	/*
	--------------------------------------
               	多层下拉菜单            
	--------------------------------------
	*/
	$.ITCUI_DropDownMenu = function(arg){
		this.create_menu = function(menu,button,direction){
			$(button).click(function(e){
				e.stopPropagation();
				if ($(".itcui_dropdown_menu").length>0)
				{
					$(".itcui_dropdown_menu").remove();
					if(_current_menu==menu)
					{
						return;
					}
				}
				var abs_pos = get_abs_position(this);
				var real_top = abs_pos.top + parseInt($(this).css("height")) + 2;
				if(direction!="right")
				{
					create_sub_menu(abs_pos.left,real_top,menu,1);
				}
				else
				{
					var new_left = abs_pos.left - (parseInt(menu.width)-parseInt($(button).css("width")));
					create_sub_menu(new_left,real_top,menu,1);
				}
				$(document).bind("click",function(e){
					$(".itcui_dropdown_menu").remove();
				});
				_current_menu = menu;
				$(".itcui_dropdown_menu").hide();
				$(".itcui_dropdown_menu").slideDown();
			});
		};
		
		function create_sub_menu(pos_x,pos_y,menu,level)
		{
			var menu_height = 6;
			for(var i=0;i<menu.items.length;i++)
			{
				if(menu.items[i].name=="-")
				{
					menu_height += 16;
				}
				else
				{
					menu_height += 25;
				}
			}
			var menu_html = "<div id='itcui_dropdown_menu_" + level + "' class='itcui_dropdown_menu' style='width:" + menu.width + ";height:";
			menu_html += menu_height + "px;left:" + pos_x + "px;top:" + pos_y + "px'>";
			for(var i=0;i<menu.items.length;i++)
			{
				if(menu.items[i].name!="-")
				{
					menu_html += "<div id='itcui_dropdown_item_" + level + "_" + i + "' class='itcui_dropdown_item' style='width:" + menu.width + ";height:25px;'>"
					if(menu.items[i].icon)
					{
						menu_html += "<img style='margin-top:5px' class='itcui_dropdown_icon' src='" + menu.items[i].icon + "' />";
					}
					else
					{
						menu_html += "<span class='itcui_dropdown_icon'></span>";
					}
					menu_html += "<span class='itcui_dropdown_text'>" + menu.items[i].name + "</span>"
					if(menu.items[i].submenu)
					{
						menu_html += "<img src='images/tree_arrow_fold.png' style='float:right;margin-right:8px' />";
					}
					menu_html += "</div>";
				}
				else
				{
					menu_html += "<div class='itcui_dropdown_split' style='width:" + menu.width + "'></div>"
				}
			}
			menu_html += "</div>";
			$("body").append(menu_html);
			//在鼠标滑动时删除所有该级菜单以下的子菜单
			$(".itcui_dropdown_item").mouseover(function(){
				if(_last_mouse_over_menu==$(this).attr("id"))
				{
					return;
				}
				var this_id = $(this).parent().attr("id");
				var new_pos_y = get_abs_position("#" + $(this).attr("id")).top;
				var this_num = parseInt(this_id.substr(20));
				$("div[id^='itcui_dropdown_menu_']").each(function(){
					var sub_id = $(this).attr("id");
					var sub_num = parseInt(sub_id.substr(20));
					if(sub_num>this_num)
					{
						$(this).remove();
					}
				});
				var t = $(this).attr("id").split("_");
				var this_seq = t[t.length-1];
				if(menu.items[this_seq].submenu)
				{
					create_sub_menu(pos_x+parseInt(menu.width),new_pos_y,menu.items[this_seq].submenu,level+1);
				}
				_last_mouse_over_menu=$(this).attr("id")
			});
		}		
	};
})(jQuery);