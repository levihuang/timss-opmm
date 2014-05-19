<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="/page/common/common_header.jsp"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>值次管理</title>

<script src='${baseURL }/js/jquery.min.js'></script>

<script type="text/javascript" src="${baseURL }/package/js/itcui.min.js"></script>
<script type="text/javascript" src="${baseURL }/js/itcui.js"></script>
<script type="text/javascript" src="${baseURL }/js/public.js"></script>
<script type="text/javascript"
	src="${baseURL }/js/jquery.ui.datepicker-zh-CN.js"></script>
<link rel="stylesheet" type="text/css"
	href="${baseURL }/package/css/itcui.min.css" media="all" />
<script type="text/javascript"
	src="${baseURL }/js/jquery-ui-1.10.3.custom.min.js"></script>

<!-- toolbar css  -->
<link rel="stylesheet" type="text/css"
	href="${baseURL }/css/content_table.css" media="all" />
<link rel="stylesheet" type="text/css" href="${baseURL }/css/itcui.css"
	media="all" />
<link rel="stylesheet" type="text/css" href="${baseURL }/css/base.css"
	media="all" />
<link rel="stylesheet" type="text/css"
	href="${baseURL }/css/smoothness/jquery-ui-1.10.3.custom.min.css"
	media="all" />

<style type="text/css">
</style>

<script>
	var combo1 = [ {
		"name" : "选项1"
	}, {
		"name" : "选项2"
	}, {
		"name" : "选项3"
	}, {
		"name" : "选项4"
	} ];
	var validator;
	var input1;
	var input3;

	function newrow(i) {
		var html = "<tr>" + "<td><span class='itcui_chkbox'></span></td>"
				+ "<td>" + (i + 1) + "</td>"
				+ "<td><div id='td"+i+"_1' style='width:120px'></div></td>"
				+ "<td><div id='td"+i+"_2' style='width: 80px'></td>"
				+ "<td><div id='td"+i+"_3' style='width: 80px'></td>"
				/* +"<td><div id='td"+i+"_4' style='width: 60px'></td>"
				+"<td><div id='td"+i+"_5' style='width: 60px'></td>"
				+"<td><div id='td"+i+"_6' style='width: 80px'></td>"
				+"<td><div id='td"+i+"_7' style='width: 80px'></td>"
				+"<td><div id='td"+i+"_8' style='width: 140px'></td>"
				+"<td><div id='td"+i+"_9' style='width: 110px'></td>"
				+"<td><div id='td"+i+"_10' style='width: 60px'></td>" */
				+ "</tr>";

		$(".itcui_table").append(html)
		$('#td' + i + '_1').html("10000" + i);
		//$('#td' + i + '_2').html(i + 1 + "班");
		$('#td' + i + '_3').html(1 + i);
		/* $('#td' + i +'_4').html( " 常白班" );
		$('#td' + i +'_5').html( (i % 2 + 1) + "值" );
		$('#td' + i +'_6').html( "工人" + ( i%4 + 1 ) );
		$('#td' + i +'_7').html( "工人" + ( i%4 + 4 ) );
		$('#td' + i +'_8').html( "2014-05-05 16:28:17" );
		$('#td' + i +'_9').html( "交接成功");
		$('#td' + i +'_10').html( "CHH"); */
	}

	$(document).ready(function() {
		input1 = new $.ITCUI_Input("#username");
		var input2 = new $.ITCUI_Input("#birthday");
		input1.turnDatePicker();
		input2.turnDatePicker();
		input3 = new $.ITCUI_Input("#mail");
		var input7 = new $.ITCUI_Input("#usedname");
		var input8 = new $.ITCUI_Input("#status");
		var radio1 = new $.ITCUI_Radio("#gender_male", "gender", true);
		var radio2 = new $.ITCUI_Radio("#gender_female", "gender", false);
		var foldable1 = new $.ITCUI_Foldable("#base_info");
		validator = new $.ITCUI_Validator();
		var test1 = new $.ITCUI_Input("#test1");
		var test2 = new $.ITCUI_Input("#test2");
		var test3 = new $.ITCUI_Input("#test3");
		var test4 = new $.ITCUI_Input("#test4");
		var test5 = new $.ITCUI_Input("#test5");

		for (var j = 0; j < 5; j++) {
			newrow(j);
		}
		$('#td' + 0 + '_2').html("A班");
		$('#td' + 1 + '_2').html("B班");
		$('#td' + 2 + '_2').html("C班");
		$('#td' + 3 + '_2').html("D班");
		$('#td' + 4 + '_2').html("E班");
	});
</script>

</head>
<body class="ml12 mr12 mt12">
	<div id="content">
		<div class="toolbar">
			<div id="btn_setting" class="itcui_btn_circle fr"
				style="margin-right: 2px">
				<span class="itcui_btn_circle_setting itcui_btn_circle_icon"></span>
			</div>
			<div class="itcui_btn_circle fr" style="margin-right: 2px">
				<span class="itcui_btn_circle_next itcui_btn_circle_icon"></span>
			</div>
			<div class="itcui_btn_circle_disable fr" style="margin-right: 2px">
				<span
					class="itcui_btn_circle_prev_disable itcui_btn_circle_icon_disable"></span>
			</div>
			<div class="itcui_pager fr" id="pager">
				<span style="line-height: 22px">1/5</span><img
					src="${baseURL }/images/pager_arrow.png" />
			</div>
		</div>
		<table class="itcui_table" style="clear: both" width="100%"
			cellspacing="0">
			<tr style="height: 24px">
				<th width="26"><span class="itcui_chkbox"></span></th>
				<th width="26">序号</th>
				<th width="120">值别编号</th>
				<th width="80" class="th_sortable">值别名称<img
					style="margin-left: 4px" src="${baseURL }/images/arrow_ascend.png" /></th>
				<th width="80" class="th_sortable">排序</th>
			</tr>

		</table>
	</div>
</body>
</html>