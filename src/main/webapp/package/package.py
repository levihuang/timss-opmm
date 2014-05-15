#coding:utf-8
import os
import time
#打包的输出路径
ISOTIMEFORMAT='%Y-%m-%d %X'
JS_PATH = "js"
IMG_PATH = "images"
CSS_PATH = "css"
selected_components = ["bs_core","bs_ext","bs_tooltip","bs_grid","bs_form","bs_button","bs_menu","itc_input","eu_datagrid","itc_pagination","itc_combo","eu_tree","eu_window","eu_dialog","itc_foldable","bs_tab","itc_combotree","eu_layout","itc_dgfix","itc_dtfix","itc_tools"];
components = {
	"eu_window" : {
		"file":["jquery.window.js","eu_window.css"],
		"dependency":["eu_draggable"]
	},
	"eu_dialog" : {
		"file":["jquery.dialog.js","eu_dialog.css"]
	},
	#数据表格
	"eu_datagrid" : {
		"dependency":["eu_panel","eu_resizable","eu_linkbutton","eu_pagination","eu_core","eu_resizable"],
		"file":["jquery.datagrid.js","eu_datagrid.css"]
	},
	#面板 依存
	"eu_panel" : {
		"file":["jquery.panel.js","eu_panel.css"],
		"dependency":["eu_core"]
	},
	#可变大小必须
	"eu_resizable" : {
		"file":["jquery.resizable.js"],
		"dependency":["eu_core"]
	},
	#链接按钮 datagrid依存
	"eu_linkbutton" : {
		"file":["jquery.linkbutton.js"],
		"dependency":["eu_core"]
	},
	#EasyUI树
	"eu_tree" : {
		"file":["jquery.tree.js","tree_icons.png","eu_tree.css"],
		"dependency" : ["eu_linkbutton","eu_core"]
	},
	#EasyUI翻页器 datagrid依存
	"eu_pagination" : {
		"file":["jquery.pagination.js"],
		"dependency" : ["eu_linkbutton","eu_core"]
	},
	#EasyUI核心代码
	"eu_core" : {
		"file":["jquery.parser.js"]
	},
	"eu_validatebox" : {
		"file":["jquery.validatebox.js","eu_validatebox.css"],
		"dependency":["eu_core"]
	},
	"eu_combo" : {
		"file":["jquery.combo.js","eu_combo.css"],
		"dependency":["eu_validatebox"]
	},
	"eu_combotree" : {
		"file":["jquery.combotree.js"],
		"dependency" : ["eu_combo"]
	},
	"eu_resizable" : {
		"file":["jquery.resizable.js"],
		"dependency" : []
	},
	"eu_draggable" : {
		"file":["jquery.draggable.js"],
		"dependency" : []
	},
	"eu_layout" : {
		"file":["jquery.layout.js","eu_layout.css"],
		"dependency" : []
	},
	#BS菜单
	"bs_menu" : {
		"file":["bs_menu.js","bs_menu.css"],
		"dependency" : ["bs_core"]
	},
	#BS核心文件
	"bs_core" : {
		"file":["bs_core.css"]
	},
	#BS页内选项卡
	"bs_tab" : {
		"file":["bs_tab.css","bs_tab.js"],
		"dependency" : ["bs_core"]
	},
	#BS按钮
	"bs_button" : {
		"file":["bs_button.css","bs_button.js"],
		"dependency" : ["bs_core"]
	},
	#BS表单部分，包括输入框、按钮组、输入框组、行、容器的定义
	"bs_form": {
		"file":["bs_form.css"],
		"dependency" : ["bs_core"]
	},
	#BS扩展样式，自行开发可以不打包，但是需要重新定义段落、项目列表、标题等样式
	"bs_ext" : {
		"file":["bs_ext.css"]
	},
	#BS栅格系统
	"bs_grid" : {
		"file":["bs_grid.css"],
		"dependency" : ["3rd_response"]
	},
	#tooltip 表格验证需要
	"bs_tooltip" : {
		"file":["bs_tooltip.css","bs_tooltip.js"]
	},
	#BS时间日期选择器
	"3rd_datetimepicker" : {
		"file":["bootstrap-datetimepicker.js","bootstrap-datetimepicker.css"],
		"dependency" : ["itc_dtfix"]
	},
	#日期选择器fix
	"itc_dtfix" : {
		"file":["itc_dgfix.js"],
		"dependency" : ["3rd_datetimepicker"]
	},
	#翻页器
	"itc_pagination" : {
		"file":["itc_pagination.js","itc_pagination.png","itc_pagination.css"],
		"dependency" : ["bs_menu","itc_base"]
	},
	#下拉框
	"itc_combo" : {
		"file":["itc_combobox.js","itc_combo.css"],
		"dependency" : ["itc_base","bs_menu","3rd_checkbox"]
	},
	#输入框功能扩展
	"itc_input" : {
		"file":["itc_input.js"],
		"dependency" : ["itc_base"]
	},
	"itc_combotree" : {
		"file":["itc_combotree.js"],
		"dependency" : ["itc_base"]
	},
	"itc_foldable" : {
		"file" : ["itc_foldable.js","itc_foldable.css"],
		"dependency" : ["itc_base"]
	},
	"itc_dgfix" : {
		"file" : ["itc_datagrid_fix.js"],
		"dependency" : ["eu_datagrid"]
	},
	#ITC实用工具 
	"itc_tools" : {
		"file" : ["itc_notify.js","itc_form.js"],
		"dependency" : []
	},
	#ITCUI基础类库
	"itc_base" : {
		"file":["itc_core.js","itc_core.css","itc_eventhandler.js"],
	},
	#ICheck
	"3rd_checkbox" : {
		"file":["icheck.js","blue.css","icheck_blue.png","icheck_blue@2x.png"]
	},
	#IE8响应式布局必须加载respond.min.js
	"3rd_response" : {
		"file":["respond.min.js"]
	},
	#jQuery validation
	"3rd_validation" : {
		"file":["jquery.validate.js"]
	},
}

components_hash = {}
file_list = []
curr_path = os.path.abspath('.')
def pack():
	for c_name in selected_components:
		add_dependency(c_name) 	
	merge_file()
	compress_file()

def add_dependency(c_name):
	component = components[c_name]
	if not components_hash.has_key(c_name):
		#这里注意必须先把依存加进去 否则easyui的某些组件会出错
		if component.has_key("dependency"):
			for dep in component["dependency"]:
				if not components_hash.has_key(dep):
					add_file(dep)
		add_file(c_name)

def add_file(c_name):
	components_hash[c_name] = True
	component = components[c_name]
	
	for f in component["file"]:
		path = os.path.join(curr_path,"source")
		if c_name.startswith("eu"):
			path = os.path.join(path,"easyui")
		elif c_name.startswith("bs"):
			path = os.path.join(path,"bootstrap")
		elif c_name.startswith("itc"):
			path = os.path.join(path,"itcui")
		else:
			path = os.path.join(path,"thirdparty")
		if f.endswith("css"):
			path = os.path.join(path,"css")
		elif f.endswith("js"):
			path = os.path.join(path,"js")
		else:
			path = os.path.join(path,"images")
		path = os.path.join(path,f)
		file_list.append(path)

def merge_file():
	now = time.strftime(ISOTIMEFORMAT, time.localtime(time.time()))
	t_css = "/*packaged at " + now + "*/"
	t_js = "/*packaged at " + now + "*/"
	if not os.path.exists(IMG_PATH):
		os.mkdir(IMG_PATH)
	if not os.path.exists(JS_PATH):
		os.mkdir(JS_PATH)
	if not os.path.exists(CSS_PATH):
		os.mkdir(CSS_PATH)
	for f in file_list:		
		if f.endswith("css"):
			handle = open(f)
			t_css = t_css + "\n/*\nFile:" + f + "\n*/\n" + handle.read().replace("IMG_PATH",IMG_PATH)
			handle.close()
		elif f.endswith("js"):
			handle = open(f)
			t_js = t_js + "\n/*\nFile:" + f + "\n*/\n" + handle.read()
			handle.close()
		elif f.endswith("png") or f.endswith("jpg") or f.endswith("gif"):			
			fp1 = open(f,"rb")
			c= fp1.read()
			newpath = os.path.join(curr_path,IMG_PATH)
			newpath = os.path.join(newpath,os.path.basename(f))
			fp2 = open(newpath,"wb")
			fp2.write(c)
			fp2.close();
			fp1.close()
		
	handle_js = open(os.path.join(JS_PATH,"itcui.dev.js"),"w")
	handle_js.write(t_js)
	handle_js.close()
	handle_css = open(os.path.join(CSS_PATH,"itcui.dev.css"),"w")
	handle_css.write(t_css)
	handle_css.close()

def compress_file():
	os.system("java -jar yuicompressor.jar " + CSS_PATH + "\\itcui.dev.css > " + CSS_PATH +"\\itcui.min.css")
	os.system("java -jar yuicompressor.jar " + JS_PATH + "\\itcui.dev.js > " + JS_PATH + "\\itcui.min.js")
	
pack()
	

