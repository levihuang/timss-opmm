#coding:utf-8
import os
#打包的输出路径
JS_PATH = "js"
IMG_PATH = "images"
CSS_PATH = "css"
selected_components = ["itc_163frame","itc_navtree","itc_navitab","bs_core","itc_skinner"];
components = {
	"itc_163frame":{
		"file":["itc_163frame.js","itc_container.js","itc_eventhandler.js"],
		"dependency":["itc_base"]
	},
	"itc_navitab" : {
		"file":["itc_navigation.js","itc_navigation.css","arrow_down.png","bgx.png","close_tab.png"],
		"dependency":["itc_base"]
	},
	"itc_navtree" : {
		"file":["itc_navtree.js","tree_arrow_expand.png","tree_arrow_fold.png","itc_navtree.css","nav_arrow_fold.png","nav_arrow_expand.png"],
		"dependency":["itc_base"]
	},
	"itc_skinner" : {
		"file":["itc_skinner.js","itcui_skinner.css"],
		"dependency":[]
	},
	"bs_menu" : {
		"file":["bs_menu.js","bs_menu.css"],
		"dependency" : ["bs_core"]
	},
	"bs_core" : {
		"file":["bs_core.css"]
	},	
	"itc_base" : {
		"file":["itc_core.js","itc_core.css"],
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
	t_css = ""
	t_js = ""
	if not os.path.exists(IMG_PATH):
		os.mkdir(IMG_PATH)
	if not os.path.exists(JS_PATH):
		os.mkdir(JS_PATH)
	if not os.path.exists(CSS_PATH):
		os.mkdir(CSS_PATH)
	for f in file_list:	
		print "merging " + f
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
		
	handle_js = open(os.path.join(JS_PATH,"itcui_frame.dev.js"),"w")
	handle_js.write(t_js)
	handle_js.close()
	handle_css = open(os.path.join(CSS_PATH,"itcui_frame.dev.css"),"w")
	handle_css.write(t_css)
	handle_css.close()

def compress_file():
	os.system("java -jar yuicompressor.jar " + CSS_PATH + "\\itcui_frame.dev.css > " + CSS_PATH +"\\itcui_frame.min.css")
	os.system("java -jar yuicompressor.jar " + JS_PATH + "\\itcui_frame.dev.js > " + JS_PATH + "\\itcui_frame.min.js")
	
pack()
	

