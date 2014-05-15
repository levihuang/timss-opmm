var Notice = {};
/**
*	弹出提示（兼容乐学的参数顺序）
*	msg - 显示的信息
*	funcs - 点击确认后需要执行的函数
*	arg - 对funcs传入的参数
*	icon - 图标，默认为info，可以选alert,error
*/
Notice.confirm = function(msg,funcs,arg,icon){
	var p = _parent();
	icon = icon || "info"
	if(p.$("#confirmDlg").length==0){
		var cHtml = '<div id="confirmDlg" style="padding-left:20px;padding-top:20px">' +
		'<span class="cfmicon itcui_' + icon + 'mid" style="float:left"></span><span style="width:340px;float:left;font-size:14px;color:#555555;font-weight:bold;line-height:20px;padding-left:10px;" id="confirmMsg"></span><span style="width:340px;float:left;font-size:14px;color:#555555;margin-top:4px;height:40px;line-height:20px;padding-left:10px;" id="confirmMsg2"></span>' +
		'</div>' +
		'<div id="confirmDlgBtn" style="height:40px;display:none;padding-top:4px" class="bbox">' +		
		'<div class="btn-group btn-group-sm pull-right">'+
			'<button type="button" class="btn btn-default" id="confirmCancel">取消</button>'+
		'</div>' +
		'<div class="btn-group btn-group-sm pull-right">' +
		'<button type="button" class="btn btn-success" id="confirmOK" style="margin-right:8px">确定</button>'+
		'</div>' +
		'</div>';
		p.$("body").append(cHtml);
	}
	else{
		p.$("#confirmDlg").find('.cfmicon').removeClass("itcui_infomid")
					   .removeClass("itcui_okmid")
					   .removeClass("itcui_errormid")
					   .addClass("itcui_" + icon + "mid");
	}
	if(msg.indexOf("|")<0){
		p.$('#confirmMsg').html(msg);	
		p.$("#confirmMsg2").hide();
	}
	else{
		msgSplit = msg.split("|");
		p.$('#confirmMsg').html(msgSplit[0]);
		p.$("#confirmMsg2").html(msgSplit[1]).show();	
	}
	p.$('#confirmOK').unbind("click").click(function(){
		p.$("#confirmDlg").dialog("close");
		if(funcs){
			funcs(arg);//执行的函数
		}
	});
	p.$('#confirmCancel').unbind("click").click(function(){
		p.$("#confirmDlg").dialog("close");
	});
	p.$("#confirmDlg").dialog({
		closed : false,
		closable : false,
		buttons:"#confirmDlgBtn",
		width:450,
		title:' ',
		height:170,	
		modal:true
	});
};


/**
 * 输入框
 * msg  - 提示信息
 * toDo - 确定后执行的函数，参数为输入的值
 */
Notice.input = function(msg,toDo){
	var p = _parent();
	if(p.$("#inputDlg").length==0){
		var cHtml = '<div id="inputDlg" style="padding-left:20px;padding-top:20px">' + 
						'<span style="width:350px;font-size:14px;color:#555555;font-weight:bold;line-height:20px;" id="inputMsg"></span>' +
						'<input style="width:400px" id="inputdlg_val"/>' + 
					'</div>' + 
					'<div id="inputDlgBtn" style="height:40px;display:none;padding-top:4px" class="bbox">' + 
						'<div class="btn-group btn-group-sm pull-right">'+
							'<button type="button" class="btn btn-default" id="inputCancel">取消</button>'+
						'</div>' +
						'<div class="btn-group btn-group-sm pull-right">' +
						'<button type="button" class="btn btn-success" id="inputOK" style="margin-right:8px">确定</button>'+
						'</div>' +
					'</div>';
		p.$("body").append(cHtml);
	}
	p.$('#inputMsg').html(msg);
	p.$('#inputOK').unbind("click").click(function(){
		p.$("#inputDlg").dialog("close");
		toDo(p.$("#inputdlg_val").val());//执行的函数
	});
	p.$('#inputCancel').unbind("click").click(function(){
		p.$("#inputDlg").dialog("close");
	});
	p.$("#inputDlg").dialog({
		closed : false,
		buttons:"#inputDlgBtn",
		width:450,
		title:' ',
		height:170,	
		modal:true
	});
};

Notice.dialog = function(src,dlgOpts,btnOpts){
	dlgOpts = dlgOpts || {};	
	dlgOpts.closed = false;
	dlgOpts.cls = "noscroll";
	var p = _parent();
	var suffix = dlgOpts.idSuffix || "";
	if(!dlgOpts.noButtons){
		dlgOpts.buttons = "#itcDlg" + suffix + "Btn";
	}
	else{
		dlgOpts.buttons = null;
	}
	if(p.$("#itcDlg" + suffix).length==0){
		var dHtml = '<div id="itcDlg' + suffix + '">' +
						'<iframe style="width:100%;height:99%;overflow:auto;" frameborder="no" border="0" id="itcDlg' + suffix + 'Content"></iframe>' + 
					'</div>' + 
					'<div id="itcDlg' + suffix + 'Btn" style="height:40px;display:none;padding-top:4px" class="bbox">' +
						'<div id="itcDlg' + suffix + 'BtnWrap" style="width:100%;height:100%">' + 
						'</div>' + 
					'</div>';
		p.$("body").append(dHtml);
	}
	btnOpts = btnOpts || [];
	//默认情况下至少得有一个关闭按钮
	if(btnOpts.length == 0){
		btnOpts.push({
			"name" : "关闭",
			"float" : "right",
			"style" : "btn-default",
			"onclick" : function(){
				_parent().$("#itcDlg").dialog("close");
			}
		});
	}
	p.$("#itcDlg" + suffix + "BtnWrap").html("");
	var btnHtml = "";
	//按钮html
	var firstRight = true;
	var firstLeft = true;
	var hasMiddle = false;
	if(!dlgOpts.noButtons){
		for(var i=0;i<btnOpts.length;i++){		
			var opt = btnOpts[i];
			opt["float"] = opt["float"] || "right";
			opt.style = opt.style || "btn-default";
			//根据按钮在左/右侧的编号判断是否需要加间距
			var styleStr = "";
			if(opt["float"]=="left"){
				if(firstLeft==true){
					firstLeft = false;				
				}
				else{
					styleStr = "margin-left:8px;";
				}
			}
			else if(opt["float"]=="right"){
				if(firstRight==true){
					firstRight = false;				
				}
				else{
					styleStr = "margin-right:8px;";
				}
			}
			else{
				opt["float"] = "middle";
				hasMiddle = true;
			}
			var widthStr = "";
			if(opt.width){
				widthStr = " style=\"width:" + opt.width + "px\" ";
			}
			btnHtml += '<div class="btn-group btn-group-sm pull-' + opt["float"] + '" id="itcDlg' + suffix + 'Btn_' + i + '" style="' + styleStr + '">';
			btnHtml += '<button type="button" class="btn ' + opt.style + '" id="inputCancel" ' + widthStr + '>' + opt.name +'</button>';
			btnHtml += '</div>';		
		}
		p.$("#itcDlg" + suffix + "BtnWrap").append(btnHtml);
		if(hasMiddle){
			//必须有这句才算居中 光pull-middle不够
			p.$("#itcDlg" + suffix + "BtnWrap").css("text-align","center");
		}
	}
	//事件绑定
	for(var i=0;i<btnOpts.length;i++){		
		var opt = btnOpts[i];
		p.$("#itcDlg" + suffix + "Btn_" + i).data("func",opt.onclick);
		p.$("#itcDlg" + suffix + "Btn_" + i).click(function(){
			if(_parent().$("#" + $(this).attr("id")).data("func")()){
				var id = $(this).attr('id');
				var sfx = id.substring(6,id.length-5);
				_parent().$("#itcDlg" + sfx).dialog("close");
			}
		});
	}
	//显示对话框
	
	p.$("#itcDlg" + suffix).dialog(dlgOpts);
	if(src){
		p.$("#itcDlg" + suffix + "Content").attr("src",src);
	}
};

Notice.screenTopMsg = function(msg,msgtype,parent){
	Notice.screenMsgId = Notice.screenMsgId || null; 
	var p = parent?_parent():window;
	p.$("#itcui_screen_top_msg").remove();
	var scn_width = parseInt(document.documentElement.clientWidth);
	var msg_html = "";
	if(msgtype=="success"){
		msg_html = "<div class='itcui_tips_success";
	}
	else if(msgtype=="error"){
		msg_html = "<div class='itcui_tips_error";
	}
	else if(msgtype=="loading")	{
		msg_html = "<div class='itcui_tips_loading";
	}
	else{
		return;
	}
	msg_html += " itcui_tips_top' style='left:" + (scn_width - 194)/2 + "px;width:auto' id='itcui_screen_top_msg'>";
	msg_html += msg + "</div>";
	p.$("body").append(msg_html);
	p.$("#itcui_screen_top_msg").hide();
	p.$("#itcui_screen_top_msg").slideDown();
	if(Notice.screenMsgId){
		clearTimeout(Notice.screenMsgId);
	}
	if(parent){
		Notice.screenMsgId=setTimeout("_parent().$('#itcui_screen_top_msg').slideUp()",5000);
	}
	else{
		Notice.screenMsgId=setTimeout("$('#itcui_screen_top_msg').slideUp()",5000);
	}
};

Notice.successTopNotice = function(msg){
	Notice.screenTopMsg(msg,"success",true);
};

Notice.errorTopNotice = function(msg){
	Notice.screenTopMsg(msg,"error",true);
};

Notice.successNotice = function(msg){
	Notice.screenTopMsg(msg,"success",false);
};

Notice.errorNotice = function(msg){
	Notice.screenTopMsg(msg,"error",false);
};