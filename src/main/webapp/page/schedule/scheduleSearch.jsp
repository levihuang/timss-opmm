<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="/page/common/common_header.jsp" %>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>排版查询</title>

<!-- fullcalendar  -->
<link href='${baseURL }/js/fullcalendar/fullcalendar.css' rel='stylesheet' />
<link href='${baseURL }/js/fullcalendar/fullcalendar.print.css' rel='stylesheet' media='print' />
<script src='${baseURL }/js/jquery.min.js'></script>
<script src='${baseURL }/js/fullcalendar/jquery-ui.custom.min.js'></script>
<script src='${baseURL }/js/fullcalendar/fullcalendar.min.js'></script>

<script type="text/javascript" src="${baseURL }/package/js/itcui.min.js"></script>
<script type="text/javascript" src="${baseURL }/js/schedule/scheduleSearch.js"></script>
<link rel="stylesheet" type="text/css" href="${baseURL }/package/css/itcui.min.css" media="all"/>
<script type="text/javascript" src="${baseURL }/js/itcui.js"></script>
<script type="text/javascript" src="${baseURL }/js/public.js"></script>

<!-- toolbar css  -->
<link rel="stylesheet" type="text/css" href="${baseURL }/css/content_table.css" media="all"/>
<link rel="stylesheet" type="text/css" href="${baseURL }/css/itcui.css" media="all"/>
<link rel="stylesheet" type="text/css" href="${baseURL }/css/base.css" media="all"/>
	
<style type="text/css">
	#content {
		width: 90%;
		margin: 8px auto;
	}
	
</style>

<script>

	$(function() {
		var menu = new $.ITCUI_DropDownMenu();
		menu.create_menu(itcui_menu2,"#menu2");
		
		
		$("#sortRule").ITCUI_ComboBox();  
		groupShow();
		$("#sortRule").ITCUI_ComboBox(null,{"onChange":function(val){
			$( "#calendar" ).html("");
			groupShow( );
		}});
		$("#sortRule2").ITCUI_ComboBox(null,{"onChange":function(val){
			$( "#personCalendar" ).html("");
			personShow( );
		}});
		
		personShow();
	});


</script>

</head>
<body>
	<div id="content">
		<div class="toolbar">
			<span class="itcui_btn_base itcui_btn_gray itcui_btn_grp_l"
				style="width: 80px; margin-left: -1px" onclick="personShow()">个人视图</span>
			<span class="itcui_btn_base itcui_btn_gray itcui_btn_grp_r"
				style="width: 80px; margin-left: -1px" onclick="groupShow()">班组视图</span>
			<div id="searchCondition" style="float: right; height: 28px;display: none;">
				<label for="sortRule">&nbsp;排班规则</label> 
				<select id="sortRule" style="width: 150px; float: left;" class="itcui_btn_base itcui_btn_gray ">
					<option value="1">船闸排班</option>
					<option value="2">运行值班员排班</option>
					<option value="3">运行值长排班</option>
					<option value="4">经理排班</option>
					<option value="5">车船排班</option>
				</select>
			</div>
			<div id="searchCondition2" style="float: right; height: 28px;">
				<label for="sortRule2">&nbsp;班组</label>
				<select id="sortRule2" style="width: 150px; float: left;" class="itcui_btn_base itcui_btn_gray ">
					<option value="1">一班</option>
					<option value="2">二班</option>
					<option value="3">三班</option>
					<option value="4">四班</option>
					<option value="5">五班</option>
				</select>
			</div>
		</div>

		<div id='personCalendar'></div>
		<div id='calendar' style="display: none;"></div>
	</div>
</body>
</html>