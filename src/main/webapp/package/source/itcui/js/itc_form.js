/**
* 自动隐藏没有内容的表单
*/
(function($){
	$.fn.extend({ 
		ITC_AutoHide : function(opt){
			var _this = $(this);
			opt = opt || {};
			var isDel = opt.isDel || false;
			var method = opt.method || "auto";

			hideOrRemove = function(l){				
				for(var i=0;i<l.length;i++){
					obj = l[i];
					if(!isDel){
						obj.hide();
					}
					else{
						obj.remove();
					}
				}
			}

			autoHide = function(){
				_this.find("input[type='text']").each(function(){
					var __this = $(this);
					var val = __this.val();
					var hideList = [];
					if(!val || val=="null"){
						hideList.push(__this);
						var p = __this.parent("div");
						hideList.push(p);
						hideList.push(p.parent())
						hideList.push(p.prev("label"));
					}
					hideOrRemove(hideList);
				})
			};

			attrHide = function(){

			};

			ruleHide = function(){

			};

			if(method=="auto"){
				autoHide();
			}
		}
	});
})(jQuery);

/**
* 将显示null的文本框置空
*/
(function($){
	$.fn.extend({ 
		ITC_CleanNull : function(){
			_this.find("input[type='text']").each(function(){
				var __this = $(this);
				if(__this.val()=="null"){
					__this.val("");
				}
			});
		}
	});
})(jQuery);

/**
* 自动表单
*/
(function($){
	$.fn.extend({ 
		ITC_Form : function(opts,fields){
			var _this = $(this);
			var _t = this;
			var comboToInit = [];
			
			_t.parseOpts = function(){
				opts = opts || {};
				opts.xsWidth = opts.xsWidth || 6;//小屏幕占1/2
				opts.mdWidth = opts.mdWidth || 4;//大屏幕占1/3
				opts.labelWidth = opts.labelWidth || 3;
				opts.labelFixWidth = opts.labelFixWidth || "100px";
				opts.container = opts.container || false;//不限制最大宽度
				opts.validate = opts.validate || false;//不开启表单验证
				opts.fieldPrefix = opts.fieldPrefix || "f_";
				opts.namePrefix = opts.namePrefix || "f_";
				opts.fixLabelWidth = opts.fixLabelWidth || false;
				opts.labelColon = (opts.labelColon===false)?false:true;//在标签后自动加冒号
				opts.noPrivAct = opts.noPrivAct || "hide";//没有权限的动作
				var defValidMsg = {
					"minlength" : "%f至少需要%l个字符",
					"maxlength" : "%f不能超过%l个字符",
					"mail" : "请输入合法的邮件地址",
					"alphanumeric" : "%f只能由字母和数字组成",
					"regex" : "%f已经被注册",
					"required" : "%f不能为空",
					"greaterThan" : "%f不能晚于%f2",
					"equalTo" : "两次密码输入必须一致",
					"digits" : "%f只能由0-9组成",
					"number" : "%f不是合法的数字"
				};
				opts.defValidMsg = opts.defValidMsg || {};
				for(var k in defValidMsg){
					opts.defValidMsg[k]	 = opts.defValidMsg[k] || defValidMsg[k];
				}
				//生成map格式的映射
				var mapping = {};
				for(var i=0;i<fields.length;i++){
					mapping[fields[i].id] = fields[i];
				}
				_this.data("mapping",mapping);
				_this.data("opts",opts);				
			};

			_t.createObject = function(field,fhtml,xsWidth,mdWidth){
				var iptStr = field.type=="text"?"input-group-sm":"";
				fhtml += '<div class="' + iptStr + ' col-xs-' + xsWidth + ' col-md-' + mdWidth + '">';
				if(field.type=="text"){
					fhtml += '<input type="text" class="form-control input-group-sm" id="' + field._id + '" name="' + field._name +'"/>';
				}
				else if(field.type=="textarea"){
					fhtml += '<textarea style="width:100%;height:' + (field.height || 80) + 'px" id="' + field._id + '" name="' + field._name +'"></textarea>'
				}
				else if(field.type=="checkbox"||field.type=="radio"){
					if(isArray(field.data)){
						for(var i=0;i<field.data.length;i++){
							var cb = field.data[i];
							var chkStr = (cb.length==3 && cb[2])?"checked":"";
							fhtml += '<input class="autoform_cb" type="' + field.type + '" id="' + field._id + '_' + cb[0] + '" name="' + field._name + '" ' + chkStr + '/>';
							fhtml += '<label style="margin-right:6px">' + cb[1] + '</label>';
						}
					}
				}
				else if(field.type="combobox"){
					fhtml += '<select nofix=1 style="width:100%" id="' + field._id + '" name="' + field._name +'"></select>';
					var opt = field.options || {};
					opt.data = opt.data || field.data;
					comboToInit.push([field._id,opt]);
				}
				fhtml += '</div>';//end of input-group
				return fhtml;
			};

			_t.createFloatField = function(field,fhtml){
				var wrapXsWidth = field.wrapXsWidth || opts.xsWidth;
				var wrapMdWidth = field.wrapMdWidth || opts.mdWidth;
				var labelXsWidth = field.labelXsWidth || opts.labelXsWidth || opts.labelWidth;
				var labelMdWidth = field.labelMdWidth || opts.labelMdWidth || opts.labelWidth;
				var inputXsWidth = field.inputXsWidth || (12-labelXsWidth);
				var inputMdWidth = field.inputMdWidth || (12-labelMdWidth);
				fhtml += '<div class="col-xs-' + wrapXsWidth + ' col-md-' + wrapMdWidth + '">';
				fhtml += '<label class="col-xs-' + labelXsWidth + ' col-md-' + labelMdWidth + ' control-label">' + field.title 
				fhtml += (opts.labelColon?"：":"") + '</label>';
				fhtml = _t.createObject(field,fhtml,inputXsWidth,inputMdWidth);
				fhtml += '</div>';//end of form-group
				return fhtml;
			};

			_t.creatFixField = function(field,fhtml){
				var wrapXsWidth = field.wrapXsWidth || opts.xsWidth;
				var wrapMdWidth = field.wrapMdWidth || opts.mdWidth;
				fhtml += '<table class="col-xs-' + wrapXsWidth + ' col-md-' + wrapMdWidth + ' pull-left"><tr>';
				fhtml += '<td width="' + (field.labelFixWidth || opts.labelFixWidth)  + '" class="ctrl-label">';
				fhtml += field.title + (opts.labelColon?"：":"")
				fhtml += '</td><td>';
				fhtml = _t.createObject(field,fhtml,12,12);
				fhtml += '</td></tr></table>';
				return fhtml;
			};


			_t.createForm = function(){
				var fhtml = "";
				comboToInit = [];
				if(opts.container){
					fhtml += "<div class='container' style='width:100%'>";
				}
				fhtml += "<div class='row bbox'>";
				for(var i=0;i<fields.length;i++){
					var field = fields[i];
					if(!field.id || !field.title){
						continue;
					}
					field._name = opts.namePrefix + (field.name || field.id);
					field.id = field.id;
					field._id = opts.fieldPrefix + field.id;
					field.type = field.type || "text";
					if(field.linebreak){
						//强制换行
						fhtml += "</div>";
						fhtml += "<div class='row bbox'>";
					}
					if(!opts.fixLabelWidth){
						fhtml = _t.createFloatField(field,fhtml);
					}
					else{
						fhtml = _t.creatFixField(field,fhtml);
					}
				}
				
				fhtml += "</div>";//end of row
				if(opts.container){
					fhtml += "</div>";
				}
				if(opts.validate){
					var rules = {};
					var messages = {};
					for(var i=0;i<fields.length;i++){
						var field = fields[i];						
						if(field.rules){
							rules[field._name] = {};
							messages[field._name] = {};
							for(var k in field.rules){
								rules[field._name][k] = field.rules[k];
								var msg = (field.messages && field.messages[k])?field.messages[k]:null;
								msg = msg || opts.defValidMsg[k] || "字段填写错误";
								msg = msg.replace("%f",field.title);
								messages[field._name][k] = msg;
							}
						}
					}
					_this.validate({
						"rules":rules,
						"messages":messages,
						"errorPlacement":opts.errorPlacement || ITC_ValidStyle1,
						"success":opts.validSuccess || ITC_ValidSucc1
					});
				}
				_this.html(fhtml).addClass('autoform');
				//初始化单选复选框的样式
				_this.find(".autoform_cb").iCheck({
				    checkboxClass: 'icheckbox_flat-blue',
				    radioClass: 'iradio_flat-blue',
				});
				//combobox样式
				if(comboToInit.length>0){
					for(var i=0;i<comboToInit.length;i++){
						$("#" + comboToInit[i][0]).ITCUI_ComboBox(null,comboToInit[i][1]);
						$("#" + comboToInit[i][0]).prev(".itcui_combo").css('height',"26px");//修正浮动错误
					}
				}
			}

			_t.loadData = function(data){
				var mapping = _this.data("mapping");
				for(var k in data){
					var field = mapping[k];
					if(!field){
						continue;
					}
					if(!field.type || field.type=="text" || field.type=="textarea"){
						$("#" + field._id).val(data[k]);
					}
					else if(field.type=="checkbox" || field.type=="radio"){
						//先取消所有选择
						_this.find("input[name='" + field._name + "']").iCheck('uncheck');
						var selList = data[k].split(",");
						for(var i=0;i<selList.length;i++){
							$("#" + field._id + "_" + selList[i]).iCheck('check');
						}
					}
					else if(field.type=="combobox"){
						$("#" + field._id).ITCUI_ComboBox("select",data[k]);
					}
				}
			};

			_t.getData = function(){
				var mapping = _this.data("mapping");
				var result = {};
				for(var k in mapping){
					var field = mapping[k];
					if(!field.type || field.type=="text" || field.type=="textarea"){
						result[field.id] = $("#" + field._id).val();
					}
					else if(field.type=="checkbox" || field.type=="radio"){
						var data = field.data || field.options.data;
						var selList = [];
						for(var i=0;i<data.length;i++){
							if($("#" + field._id + "_" + data[i][0]).parent().hasClass("checked")){
								selList.push(data[i][0]);
							}
						}
						result[field.id] = selList.join(',');
					}
					else if(field.type=="combobox"){
						var sel = $("#" + field._id);
						result[field.id] = sel.attr("multiselect")?sel.ITCUI_ComboBox("getSelected"):sel.val();
					}
				}
				return result;
			};

			if(!opts || typeof(opts)=="object"){
				if(fields==null){
					return;
				}
				_t.parseOpts();
				_t.createForm();	
			}
			else if(opts=="getdata"){
				return _t.getData();
			}
			else if(opts=="loaddata"){
				_t.loadData(fields);
			}
			
		}
	});
})(jQuery);