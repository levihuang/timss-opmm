<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="/page/common/common_header.jsp" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>日志查询</title>

<script src='${baseURL }/js/jquery.min.js'></script>

<script type="text/javascript" src="${baseURL }/package/js/itcui.min.js"></script>
<script type="text/javascript" src="${baseURL }/js/itcui.js"></script>
<script type="text/javascript" src="${baseURL }/js/public.js"></script>
<script type="text/javascript" src="${baseURL }/js/jquery.ui.datepicker-zh-CN.js"></script>
<link rel="stylesheet" type="text/css" href="${baseURL }/package/css/itcui.min.css" media="all"/>
<script type="text/javascript" src="${baseURL }/js/jquery-ui-1.10.3.custom.min.js"></script>

<!-- toolbar css  -->
<link rel="stylesheet" type="text/css" href="${baseURL }/css/content_table.css" media="all"/>
<link rel="stylesheet" type="text/css" href="${baseURL }/css/itcui.css" media="all"/>
<link rel="stylesheet" type="text/css" href="${baseURL }/css/base.css" media="all"/>
<link rel="stylesheet" type="text/css" href="${baseURL }/css/smoothness/jquery-ui-1.10.3.custom.min.css" media="all"/>
	
<style type="text/css">
	
</style>

<script>

var combo1 = [{"name":"选项1"},{"name":"选项2"},{"name":"选项3"},{"name":"选项4"}];
var validator;
var input1;
var input3;

	function newrow( i )
	{
		var html = "<tr>"
			+"<td><span class='itcui_chkbox'></span></td>"
			+"<td>"+(i+1)+"</td>"
			+"<td><div id='td"+i+"_1' style='width:120px'></div></td>"
			+"<td><div id='td"+i+"_2' style='width: 80px'></td>"
			+"<td><div id='td"+i+"_3' style='width: 80px'></td>"
			+"<td><div id='td"+i+"_4' style='width: 60px'></td>"
			+"<td><div id='td"+i+"_5' style='width: 60px'></td>"
			+"<td><div id='td"+i+"_6' style='width: 80px'></td>"
			+"<td><div id='td"+i+"_7' style='width: 80px'></td>"
			+"<td><div id='td"+i+"_8' style='width: 140px'></td>"
			+"<td><div id='td"+i+"_9' style='width: 110px'></td>"
			+"<td><div id='td"+i+"_10' style='width: 60px'></td>"
			+"</tr>";
			
		$(".itcui_table").append(html)
		$('#td' + i +'_1').html( "CHHV140510092" + i );
		$('#td' + i +'_2').html( "值长日志" );
		$('#td' + i +'_3').html( "2014-05-" + ( i + 1 ) );
		$('#td' + i +'_4').html( " 常白班" );
		$('#td' + i +'_5').html( (i % 2 + 1) + "值" );
		$('#td' + i +'_6').html( "工人" + ( i%4 + 1 ) );
		$('#td' + i +'_7').html( "工人" + ( i%4 + 4 ) );
		$('#td' + i +'_8').html( "2014-05-05 16:28:17" );
		$('#td' + i +'_9').html( "交接成功");
		$('#td' + i +'_10').html( "CHH");
	}

$(document).ready(function(){
	input1 = new $.ITCUI_Input("#username");
	var input2 = new $.ITCUI_Input("#birthday");
	input1.turnDatePicker();
	input2.turnDatePicker();
	input3 = new $.ITCUI_Input("#mail");
	var input7 = new $.ITCUI_Input("#usedname");
	var input8 = new $.ITCUI_Input("#status");
	var radio1 = new $.ITCUI_Radio("#gender_male","gender",true);
	var radio2 = new $.ITCUI_Radio("#gender_female","gender",false);
	var foldable1 = new $.ITCUI_Foldable("#base_info");
	validator = new $.ITCUI_Validator();
	var test1 = new $.ITCUI_Input("#test1");
	var test2 = new $.ITCUI_Input("#test2");
	var test3 = new $.ITCUI_Input("#test3");
	var test4 = new $.ITCUI_Input("#test4");
	var test5 = new $.ITCUI_Input("#test5");	
	
	for( var j = 0; j < 15; j ++ ){
		newrow( j );
	}
});

</script>

</head>
<body class="ml12 mr12 mt12">
	<div id="content">
		<!-- <div class="toolbar" style="margin-left: 34px;">
			<span class="itcui_btn_base itcui_btn_gray itcui_btn_grp_l"
				style="width: 80px; margin-left: -1px" onclick="">月度记事查询</span>
			<span class="itcui_btn_base itcui_btn_gray itcui_btn_grp_r"
				style="width: 80px; margin-left: -1px" onclick="">刷新</span>
		</div> -->
		
		
		<div id="form_main">
		<div id="base_info_subitem" style="width:100%;min-height:100px;">
			<div class="itcui_frm_row_auto mt4">
				<div class="itcui_frm_col">
					<span class="itcui_frm_field_name" style="float:left">值班日期：</span>
					<div id="username" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col fl">
					<span class="itcui_frm_field_name" style="float:left">-至-</span>
					<div id="birthday" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col fl">
					<span class="itcui_frm_field_name" style="float:left">类型：</span>
					<div id="usedname" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col fl">
					<span class="itcui_frm_field_name" style="float:left">状态：</span>
					<div id="status" style="float:left;width:160px;"></div>
				</div>
			</div>
			<div class="itcui_frm_row_auto">
				<div class="itcui_frm_col">
					<span class="itcui_frm_field_name" style="float:left">班次：</span>
					<div id="test1" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col">
					<span class="itcui_frm_field_name" style="float:left">值别：</span>
					<div id="test2" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col">
					<span class="itcui_frm_field_name" style="float:left">值班人：</span>
					<div id="test3" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col">
					<span class="itcui_frm_field_name" style="float:left">记事内容：</span>
					<div id="test4" style="float:left;width:160px;"></div>
				</div>
				<div class="itcui_frm_col">
					<span class="itcui_btn_base itcui_btn_gray" style="width:60px;float:left;margin-left: 60px;" onclick="showFormErr();">查询</span>
					<span class="itcui_btn_base itcui_btn_gray" style="width:120px;float:left;margin-left: 8px;">月度记事查询</span>
				</div>
			</div>
	</div>
	</div>
	
	<table class="itcui_table" style="clear:both" width="100%" cellspacing="0">
		<tr style="height:24px">
			<th width="26"><span class="itcui_chkbox"></span></th>
			<th width="26">序号</th>
			<th width="120">日志编号</th>
			<th width="80" class="th_sortable">账簿名称<img style="margin-left:4px" src="${baseURL }/images/arrow_ascend.png"/></th>
			<th width="80" class="th_sortable">值班时间</th>
			<th width="60" class="th_sortable">班次</th>
			<th width="60" class="th_sortable">值别</th>
			<th width="80" class="th_sortable">值班人</th>
			<th width="80" class="th_sortable">接班人</th>
			<th width="140" class="th_sortable">交接班时间</th>
			<th width="110" class="th_sortable">状态</th>
			<th width="60" class="th_sortable">站点</th>
		</tr>
			
	</table>
	</div>
</body>
</html>