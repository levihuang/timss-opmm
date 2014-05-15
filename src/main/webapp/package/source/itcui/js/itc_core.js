var itcui = itcui || {};
itcui.combo_displayed = false;
function ITC_GetAbsPos(obj){	
	var obj_x = 0;
	var obj_y = 0;
	while(obj.parentNode){		    
		var o = $(obj);
		obj_x += o.offset().left;
		obj_y += o.offset().top;
	    obj = obj.parentNode;
	}
	var p = {"left":obj_x,"top":obj_y};
	return p;
}

function _parent(){
	if(window.parent.document==document){
		return window;
	}
	else{
		return window.parent;
	}
}

function ITC_Len(str){
	var len = str.length;
	var reLen = 0; 
	    for (var i = 0; i < len; i++) {        
	        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) { 
	            // 全角    
	            reLen += 2; 
	        } else { 
	            reLen++; 
	        } 
	    } 
	return reLen;  
}

function ITC_Substr(str, startp, endp) {
    var i=0; c = 0; unicode=0; rstr = '';
    var len = str.length;
    var sblen = ITC_Len(str);

    if (startp < 0) {
        startp = sblen + startp;
    }

    if (endp < 1) {
        endp = sblen + endp;// - ((str.charCodeAt(len-1) < 127) ? 1 : 2);
    }
    // 寻找起点
    for(i = 0; i < len; i++) {
        if (c >= startp) {
            break;
        }
	    var unicode = str.charCodeAt(i);
		if (unicode < 127) {
			c += 1;
		} else {
			c += 2;
		}
	}
	// 开始取
	for(i = i; i < len; i++) {
	    var unicode = str.charCodeAt(i);
		if (unicode < 127) {
			c += 1;
		} else {
			c += 2;
		}
		rstr += str.charAt(i);
		if (c >= endp) {
		    break;
		}
	}
	return rstr;
}

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]'; 
}