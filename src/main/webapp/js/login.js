function switchTab(tab)
{
	//取消用户名输入框的焦点 防止自动清空失效
	$("#ipt_username").val("");	
	ipt_username.blur();
	ipt_password_fake.blur();
	if(tab=="left")
	{
		$(".tab_login").css("background-image","url('images/tab_left.png')");
		$(".checkbox_wrap").html('<span class="itcui_chkbox" style="float:left"></span><span class="login_chbox_text" style="float:left;margin-left:4px">记住工号</span><span class="login_chbox_text" style="float:right;margin-left:4px">使用指纹登录</span><span class="itcui_chkbox" style="float:right"></span>');
		var d1 = new $.ITCUI_DeafultText("#ipt_username","工号");
		var d2 = new $.ITCUI_DeafultText("#ipt_password_fake","密码");	
	}
	else
	{
		$(".tab_login").css("background-image","url('images/tab_right.png')");
		$(".checkbox_wrap").html('<span class="itcui_chkbox" style="float:left"></span><span class="login_chbox_text" style="float:left;margin-left:4px">记住用户名</span><a href="#" class="lnk_forget" style="margin-left:86px;">忘记密码？</a>');
		var d1 = new $.ITCUI_DeafultText("#ipt_username","用户名");
		var d2 = new $.ITCUI_DeafultText("#ipt_password_fake","密码");
	}	
	$(".itcui_chkbox").click(function(){
		var cls = $(this).attr("class");
		if(cls.indexOf("itcui_chkbox_checked")>0){
			$(this).removeClass("itcui_chkbox_checked");
		}
		else
		{
			$(this).addClass("itcui_chkbox_checked");
		}
	});
	$("#ipt_password_fake").show();
	$("#ipt_password").hide()
}

function login()
{
	var username = $("#ipt_username").val();
	var password = $("#ipt_password").val();
	if(username==""||password=="")
	{
		$(".error_box").show();
		$(".error_box").html("用户名和密码不能为空！");
		return;
	}
	if(username!="admin"||password!="123456")
	{
		$(".error_box").show();
		$(".error_box").html("用户名admin密码123456");
		return;
	}
	window.location.href = "main.html";
}
