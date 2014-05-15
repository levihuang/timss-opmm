var opts = {};
opts.tabs = [
	{"name":"首页","id":"nav1"},
	{"name":"运行管理","id":"nav2"}
];

var treeData = [
];
var treeData2 = [
	{
		"grouptitle" : "排班查询",
		/*"initexpand" : true,
		"items" : [
		]*/
		"id" : "nav2_1"
	},
	{
		"grouptitle" : "排班管理",
		"initexpand" : true,
		"items" : [
			{"title":"值次管理","id":"nav2_21"},
			{"title":"班次管理","id":"nav2_22"},
			{"title":"排班规则管理","id":"nav2_23"},
			{"title":"排班生成","id":"nav2_24"}
		]
	},
	{
		"grouptitle" : "日志查询",
		"id" : "nav2_3"
			
	},
	{
		"grouptitle" : "交接班",
		"initexpand" : true,
		"items" : [
			{"title":"我要交班","id":"nav4_41"},
			{"title":"我要接班","id":"nav4_42"}
		]
	},
	{
		"grouptitle" : "角色管理"
	}
];
opts.tabMapping = {
	"nav1":{
		"cache":true,
		"tree":treeData
	},
	"nav2":{
		"cache":true,
		"tree":treeData2
	}
};

opts.treeMapping = {
	"nav2_1":"page/schedule/scheduleSearch.jsp",

	"nav2_21":"component/oaframe.html",
	"nav2_22":"component/navtab.html",
	"nav2_23":"component/navtree.html",
	"nav2_24":"component/innernav.html",
	"nav2_25":"component/foldable.html",
	"nav2_26":"component/notify.html",
	"nav2_27":"component/form.html",
	"nav2_28":"component/innertab.html",

	"nav2_3":"page/operationlog/logSearch.jsp",

	"nav2_41":"component/datagrid.html",
	"nav2_42":"component/datagrid2.html",
	"nav2_43":"component/datagrid3.html",
	"nav2_44":"component/datagrid4.html",
	"nav2_45":"component/datagrid5.html"
};