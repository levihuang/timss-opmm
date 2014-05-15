/*
	多iframe容器
*/
function ITCUI_Container(targetId){
	var _targetId = targetId;
	var frames = {};
	var currFrame = null;

	this.switchTo = function(id,url,options){
		//判断上一个iframe是移除还是缓存
		var lastFrame = $(_targetId).children(".ITCUI_Iframe_" + currFrame);
		if(frames[currFrame]){
			if(frames[currFrame].cache){
				lastFrame.css("display","none");
			}
			else{
				lastFrame.remove();
				delete(frames[currFrame]);
			}
		}
		currFrame = id;
		if(frames[id]&&frames[id].cache){
			$(_targetId).children(".ITCUI_Iframe_" + id).css("display","block");
		}
		else{
			var idStr = "";
			if(options.id){
				idStr = " id='" + options.id + "' ";
			}
			$("<iframe frameborder='no'" + idStr + " border='0'></iframe").addClass("ITCUI_ContainerFrame").addClass("ITCUI_Iframe_" + id).appendTo(targetId);
			frames[id] = options;			
			this.resize();
			$(targetId).children(".ITCUI_Iframe_" + id).attr("src",url);
		}

	}

	this.navigate = function(url){
		if(currFrame!=null){
			$(_targetId).children(".ITCUI_Iframe_" + currFrame).attr("src","about:blank");
			$(_targetId).children(".ITCUI_Iframe_" + currFrame).attr("src",url);
		}
	};

	this.resize = function(){
		var _parent = $(_targetId);
		_parent.children(".ITCUI_Iframe_" + currFrame).css({
			width : _parent.css("width"),
			height : _parent.css("height")
		});

	};

	this.remove = function(id){
		delete(frames[id]);
		$(_targetId).children(".ITCUI_Iframe_" + id).remove();
	};
}