function ITC_AddValidationStyle(label, element)
{
	//获取被验证元素的绝对位置 因为某些表单布局在文本框后面没有空间 直接用相对位置无法插入
	var pos = ITC_GetAbsPos(element);
	//这里的长度还要加上文本框的长度
	var objWidth = parseInt($(element).css("width"));
	//注意这里如果用display:none会被后续代码覆盖，因而无效，用remove会导致信息无法刷新
	label.children("label").css("width","0px");
	label.children("label").css("overflow","hidden");
	//为标签加上惊叹号图标
	label.addClass('itcui_icon_warn_mid').css({
		left: pos.left+ 6 +objWidth,
		top: pos.top+2
	});
	//这里的placement如果不改 也就是默认显示在图标上面 会出现对齐问题
	var myTooltip = $(label).tooltip({"title":"info","placement":"right"});
	myTooltip.on("shown.bs.tooltip",function(e){
		var info = $(this).children("label").html();
		//错误验证信息第二次出现不会重新触发errorPlacement 因而只能动态刷新内容
		$(this).next("div").find(".tooltip-inner").html(info);
	});
	label.insertAfter(element);
}