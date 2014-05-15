(function($){
	$.fn.extend({ 
		ITCUI_FileUpload : function(action,arg){
			var _this = $(this);
			var arg = arg || {};

			bindInputEvent = function(){
				_this.find(":file").last().on('change',function(e){
					var _this = $(this).parent().parent();
					var _ipt = $(this);
					var prefix = _this.data("prefix");
					var currCount = _this.data("currCount");
					//隐藏当前input 在后面创建一个新的
					var newName = prefix + '_' + currCount + "[]";
					var iptHtml = "<input type='file' name='" + newName + "' multiple />";
					_ipt.css("display","none").after(iptHtml);
					_this.ITCUI_FileUpload("bindInputEvent");
					_this.data("currCount",currCount + 1);
					_this.ITCUI_FileUpload("bindJQUploadEvent");

				});
			};
			
			bindJQUploadEvent = function(){
				_this.fileupload({
					add: function (e, data) {			
						var fileHtml = '<div class="itcui_upload_wrap">'
						fileHtml += '<div class="itcui_upload_icon_demo ml8"></div>';
						fileHtml += '<div class="itcui_upload_detail_wrap ml4">';
						fileHtml += '<div class="itcui_upload_filename" style="height:24px">';
						//处理文件名
						var fileName = data.files[0].name;
						if(fileName.length>25){
							fileName = fileName.substr(0,25) + "...";
						}
						//处理文件大小
						var fileSize = data.files[0].size;
						if(fileSize<10000){
							fileSize += " b";
						}
						else if(fileSize>=10000 & fileSize<1000000){
							fileSize = parseInt(fileSize/1000) + " kb";
						}
						else if(fileSize>=1000000){
							fileSize = parseInt(fileSize/1000000) + " mb";
						}
						fileHtml += '<span>' + fileName + '</span>';
						fileHtml += '<a class="itcui_link fr itcui_fileupload_cancel">取消</a>';
						fileHtml += '</div>';//end of filename
						fileHtml += '<div style="clear:both" class="itcui_upload_progress_line">';
						fileHtml += '<div class="ictui_upload_progress_txt" style="margin-left:-4px">';
						fileHtml += '<span>' + fileSize + '</span>';

						fileHtml += '</div>'
						fileHtml += '</div>';
						fileHtml += '</div>'; //end of detail
						fileHtml += '</div>';// end of wrap
						$(this).find(".itcui_fileupload_list").append(fileHtml);
					}
				});
			}

			initFileUpload = function(){
				//初始化值			
				var prefix = arg["prefix"] || "files";
				var currCount = 1;
				_this.data("prefix",prefix);
				_this.data("currCount",currCount);
				_this.data("fileMapping",{});
				var initHtml = '<span class="fileinput-button itcui_link"><span>选择文件</span><input type="file" name="' + prefix + '_' + currCount + '[]" multiple /></span>';
				initHtml += '<div style="width:100%;" class="itcui_fileupload_list"></div>';
				_this.html(initHtml);				
				bindInputEvent();
				bindJQUploadEvent();
				
			};

			if(!action||action=="init"){				
				initFileUpload();
			}
			else if(action=="bindInputEvent"){
				bindInputEvent();
			}
			else if(action=="bindJQUploadEvent"){
				bindJQUploadEvent();
			}
		}
	});
})(jQuery);