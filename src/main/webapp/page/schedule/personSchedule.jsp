<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@ include file="/page/common/common_header.jsp"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>排版查询</title>

<link href='${baseURL }/js/fullcalendar/fullcalendar.css'
	rel='stylesheet' />
<link href='${baseURL }/js/fullcalendar/fullcalendar.print.css'
	rel='stylesheet' media='print' />
<script src='${baseURL }/js/jquery.min.js'></script>
<script src='${baseURL }/js/fullcalendar/jquery-ui.custom.min.js'></script>
<script src='${baseURL }/js/fullcalendar/fullcalendar.min.js'></script>
<style type="text/css">
#calendar {
	width: 90%;
	margin: 0 auto;
}
</style>

<script>
	$(function() {

		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		var eventsArray = new Array();

		for (var i = 0; i < 30; i++) {
			if (i % 9 == 0) {
				eventsArray.push({
					title : '中班',
					start : new Date(y, m, i + 1),
					color : '#DCB86A'
				});

				eventsArray.push({
					title : '休息',
					start : new Date(y, m, i + 2),
					color : '#82C247'
				});
				eventsArray.push({
					title : '休息',
					start : new Date(y, m, i + 3),
					color : '#82C247'
				});
				eventsArray.push({
					title : '白班',
					start : new Date(y, m, i + 4),
					color : '#018ED6'

				});
				eventsArray.push({
					title : '白班',
					start : new Date(y, m, i + 5),
					color : '#018ED6'
				});
				eventsArray.push({
					title : '休息',
					start : new Date(y, m, i + 6),
					color : '#82C247'
				});
				eventsArray.push({
					title : '休息',
					start : new Date(y, m, i + 7),
					color : '#82C247'
				});
				eventsArray.push({
					title : '夜班',
					start : new Date(y, m, i + 8),
					color : '#352D2B'
				});
				eventsArray.push({
					title : '夜班',
					start : new Date(y, m, i + 9),
					color : '#352D2B'
				});

			}
		}

		$('#calendar').fullCalendar(
				{
					header : {
						right : 'prev,next today',
						center : 'title',
						left : 'prevYear,nextYear'
					},
					buttonText : {
						prev : '上月',
						next : '下月',
						prevYear : '去年',
						nextYear : '明年',
						today : '今天'
					},
					titleFormat : {
						month : 'yyyy MM'
					},
					height : '600',
					dayNames : [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五",
							"星期六" ],
					dayNamesShort : [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五",
							"星期六" ],
					editable : true,
					events : eventsArray
				});

		//$("#sortRule").
		
		

	});
</script>

</head>
<body>
	
	<div id='calendar'></div>
</body>
</html>