<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	
	<%@ include file="/page/common/common_header.jsp" %>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>运行管理</title>
	<script type="text/javascript" src="${baseURL}/js/jquery-1.10.2.js"></script>
	<script type="text/javascript" src="${baseURL}/js/jquery.cookie.js"></script>
	<script type="text/javascript" src="${baseURL}/js/config.js"></script>
	<script type="text/javascript" src="${baseURL}/package/js/itcui.dev.js"></script>
	<link rel="stylesheet" type="text/css" href="${baseURL}/package/css/itcui.dev.css" />
	<script type="text/javascript" src="${baseURL}/package/js/itcui_frame.dev.js"></script>
	<link rel="stylesheet" type="text/css" href="${baseURL}/package/css/itcui_frame.dev.css" />
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" /> 
	
<script>
		
		var skinMenuBefore = '<li><a class="menuitem">用户设置</a><li><a class="menuitem">历史</a><li>';
		var skinMenuAfter = '<li><a class="menuitem">版本信息</a>';
		var nav;
		$(document).ready(function(){	
			_ITC.init(opts);
			_ITC.switchDefaultTab();
			//$("#link_setting").ITCUI_AddSkinMenu({menuBefore:skinMenuBefore,menuAfter:skinMenuAfter});
		});
		
	</script>
	<style>
		.title_username{
			font-weight: bold;font-size: 12px;float: left;height: 50px;line-height: 50px;vertical-align: middle;margin-top: 3px;color: rgb(180, 180, 180);
		}
		.head_link{
			line-height: 26px;
			height: 20px;
			display: inline-block;
			margin-top:12px;
			float:right;
			margin-right:12px
		}

		.head_link li{
			float: right;
			list-style: none;
			font-size: 12px;
			padding-left: 6px;
			color:rgb(102, 102, 102);
		}
		
		.system_logo{
			background-image:url('${baseURL}/images/system_logo.png');
			margin-top: 3px;
			float: left;
			width:255px;
			height:50px;
		}

		.li_username{color:rgb(34, 34, 34)!important;}
		.dropdown .open{z-index: 13333}
	</style>
</head>
<body style="overflow-y:hidden" class="bbox">
	<div style="width: 100%;position:absolute;z-index:-15" id="itcui_skin">
		<div sytle="width:100%;height:90px" class="itcui_skin_top">
			
		</div>
	</div>
	<div style="width: 100%;height:90px;overflow:hidden;position:absolute">
		<span class="system_logo"></span>
		<span class="title_username">admin/开发部</span>
		<ul class="head_link">
			<li class="li_username"><a class="itcui_link" href="#">退出</a></li>
			<li>|</li>
			<li><a class="itcui_link" id="link_setting">设置</a></li>
			<li>|</li>
			<li><a class="itcui_link" href="#">帮助</a></li>
		</ul>
		<div class="itcui_nav_tab_container" id="itcui_nav_tab_container" style="clear:both;height: 36px;width: 100%">
			
		</div>
	</div>
	<div class="mainframe_bottom" id="mainframe_bottom" style="width:100%;height:100%;position:absolute;top:90px">		
		<div id="mainframe_navtree" style="width:200px;height:400px;float:left;overflow:hidden;background-color:#F5F5F5" class="cbox">
			
		</div>
		<div id="mainframe_content" style="float:left">
			
		</div>
	</div>
</body>
</html>