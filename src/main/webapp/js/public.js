$(document).ready(function(){
	//不允许选中
	$(".itcui_btn_gray,.itcui_btn_green,.tab_item").each(function(){
		 $(this).attr('unselectable', 'on').css({
                   '-moz-user-select':'none',
                   '-webkit-user-select':'none',
                   'user-select':'none'
         });
	}).each(function(){
		this.onselectstart = function() { return false; };
	});
	//保证点击圆形按钮里面的东西也有反应
	$(".itcui_btn_circle_icon").mousedown(function(){
		$(this).parent().addClass("itcui_btn_circle_active");
	});
	$(".itcui_btn_circle_icon").mouseup(function(){
		$(this).parent().removeClass("itcui_btn_circle_active");
	});
	//单选框
	$(".itcui_chkbox").click(function(){
		var cls = $(this).attr("class");
		if(cls.indexOf("itcui_chkbox_checked")>0){
			$(this).removeClass("itcui_chkbox_checked");
			$(this).parent().parent("tr").removeClass("itcui_tr_selected");
		}
		else
		{
			$(this).addClass("itcui_chkbox_checked");
			$(this).parent().parent("tr").addClass("itcui_tr_selected");
		}
	});
});