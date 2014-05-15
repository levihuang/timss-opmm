/*packaged at 2014-03-24 14:17:05*/
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\thirdparty\js\respond.min.js
*/
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
(function(w) {
  "use strict";
  w.matchMedia = w.matchMedia || function(doc, undefined) {
    var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);
    return function(q) {
      div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
      docElem.insertBefore(fakeBody, refNode);
      bool = div.offsetWidth === 42;
      docElem.removeChild(fakeBody);
      return {
        matches: bool,
        media: q
      };
    };
  }(w.document);
})(this);

/*! Respond.js v1.4.0: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function(w) {
  "use strict";
  var respond = {};
  w.respond = respond;
  respond.update = function() {};
  var requestQueue = [], xmlHttp = function() {
    var xmlhttpmethod = false;
    try {
      xmlhttpmethod = new w.XMLHttpRequest();
    } catch (e) {
      xmlhttpmethod = new w.ActiveXObject("Microsoft.XMLHTTP");
    }
    return function() {
      return xmlhttpmethod;
    };
  }(), ajax = function(url, callback) {
    var req = xmlHttp();
    if (!req) {
      return;
    }
    req.open("GET", url, true);
    req.onreadystatechange = function() {
      if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
        return;
      }
      callback(req.responseText);
    };
    if (req.readyState === 4) {
      return;
    }
    req.send(null);
  }, isUnsupportedMediaQuery = function(query) {
    return query.replace(respond.regex.minmaxwh, "").match(respond.regex.other);
  };
  respond.ajax = ajax;
  respond.queue = requestQueue;
  respond.unsupportedmq = isUnsupportedMediaQuery;
  respond.regex = {
    media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
    keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
    comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
    urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
    findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
    only: /(only\s+)?([a-zA-Z]+)\s?/,
    minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
    maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
    minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
    other: /\([^\)]*\)/g
  };
  respond.mediaQueriesSupported = w.matchMedia && w.matchMedia("only all") !== null && w.matchMedia("only all").matches;
  if (respond.mediaQueriesSupported) {
    return;
  }
  var doc = w.document, docElem = doc.documentElement, mediastyles = [], rules = [], appendedEls = [], parsedSheets = {}, resizeThrottle = 30, head = doc.getElementsByTagName("head")[0] || docElem, base = doc.getElementsByTagName("base")[0], links = head.getElementsByTagName("link"), lastCall, resizeDefer, eminpx, getEmValue = function() {
    var ret, div = doc.createElement("div"), body = doc.body, originalHTMLFontSize = docElem.style.fontSize, originalBodyFontSize = body && body.style.fontSize, fakeUsed = false;
    div.style.cssText = "position:absolute;font-size:1em;width:1em";
    if (!body) {
      body = fakeUsed = doc.createElement("body");
      body.style.background = "none";
    }
    docElem.style.fontSize = "100%";
    body.style.fontSize = "100%";
    body.appendChild(div);
    if (fakeUsed) {
      docElem.insertBefore(body, docElem.firstChild);
    }
    ret = div.offsetWidth;
    if (fakeUsed) {
      docElem.removeChild(body);
    } else {
      body.removeChild(div);
    }
    docElem.style.fontSize = originalHTMLFontSize;
    if (originalBodyFontSize) {
      body.style.fontSize = originalBodyFontSize;
    }
    ret = eminpx = parseFloat(ret);
    return ret;
  }, applyMedia = function(fromResize) {
    var name = "clientWidth", docElemProp = docElem[name], currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp, styleBlocks = {}, lastLink = links[links.length - 1], now = new Date().getTime();
    if (fromResize && lastCall && now - lastCall < resizeThrottle) {
      w.clearTimeout(resizeDefer);
      resizeDefer = w.setTimeout(applyMedia, resizeThrottle);
      return;
    } else {
      lastCall = now;
    }
    for (var i in mediastyles) {
      if (mediastyles.hasOwnProperty(i)) {
        var thisstyle = mediastyles[i], min = thisstyle.minw, max = thisstyle.maxw, minnull = min === null, maxnull = max === null, em = "em";
        if (!!min) {
          min = parseFloat(min) * (min.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!!max) {
          max = parseFloat(max) * (max.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
        }
        if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
          if (!styleBlocks[thisstyle.media]) {
            styleBlocks[thisstyle.media] = [];
          }
          styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
        }
      }
    }
    for (var j in appendedEls) {
      if (appendedEls.hasOwnProperty(j)) {
        if (appendedEls[j] && appendedEls[j].parentNode === head) {
          head.removeChild(appendedEls[j]);
        }
      }
    }
    appendedEls.length = 0;
    for (var k in styleBlocks) {
      if (styleBlocks.hasOwnProperty(k)) {
        var ss = doc.createElement("style"), css = styleBlocks[k].join("\n");
        ss.type = "text/css";
        ss.media = k;
        head.insertBefore(ss, lastLink.nextSibling);
        if (ss.styleSheet) {
          ss.styleSheet.cssText = css;
        } else {
          ss.appendChild(doc.createTextNode(css));
        }
        appendedEls.push(ss);
      }
    }
  }, translate = function(styles, href, media) {
    var qs = styles.replace(respond.regex.comments, "").replace(respond.regex.keyframes, "").match(respond.regex.media), ql = qs && qs.length || 0;
    href = href.substring(0, href.lastIndexOf("/"));
    var repUrls = function(css) {
      return css.replace(respond.regex.urls, "$1" + href + "$2$3");
    }, useMedia = !ql && media;
    if (href.length) {
      href += "/";
    }
    if (useMedia) {
      ql = 1;
    }
    for (var i = 0; i < ql; i++) {
      var fullq, thisq, eachq, eql;
      if (useMedia) {
        fullq = media;
        rules.push(repUrls(styles));
      } else {
        fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
        rules.push(RegExp.$2 && repUrls(RegExp.$2));
      }
      eachq = fullq.split(",");
      eql = eachq.length;
      for (var j = 0; j < eql; j++) {
        thisq = eachq[j];
        if (isUnsupportedMediaQuery(thisq)) {
          continue;
        }
        mediastyles.push({
          media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
          rules: rules.length - 1,
          hasquery: thisq.indexOf("(") > -1,
          minw: thisq.match(respond.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
          maxw: thisq.match(respond.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
        });
      }
    }
    applyMedia();
  }, makeRequests = function() {
    if (requestQueue.length) {
      var thisRequest = requestQueue.shift();
      ajax(thisRequest.href, function(styles) {
        translate(styles, thisRequest.href, thisRequest.media);
        parsedSheets[thisRequest.href] = true;
        w.setTimeout(function() {
          makeRequests();
        }, 0);
      });
    }
  }, ripCSS = function() {
    for (var i = 0; i < links.length; i++) {
      var sheet = links[i], href = sheet.href, media = sheet.media, isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
      if (!!href && isCSS && !parsedSheets[href]) {
        if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
          translate(sheet.styleSheet.rawCssText, href, media);
          parsedSheets[href] = true;
        } else {
          if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
            if (href.substring(0, 2) === "//") {
              href = w.location.protocol + href;
            }
            requestQueue.push({
              href: href,
              media: media
            });
          }
        }
      }
    }
    makeRequests();
  };
  ripCSS();
  respond.update = ripCSS;
  respond.getEmValue = getEmValue;
  function callMedia() {
    applyMedia(true);
  }
  if (w.addEventListener) {
    w.addEventListener("resize", callMedia, false);
  } else if (w.attachEvent) {
    w.attachEvent("onresize", callMedia);
  }
})(this);

/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\bootstrap\js\bs_button.js
*/
/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)

    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\bootstrap\js\bs_menu.js
*/
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_core.js
*/
var itcui = itcui || {};
itcui.combo_displayed = false;
function ITC_GetAbsPos(obj)
{
	var o = $(obj);
	var obj_x = o.offset().left;
	var obj_y = o.offset().top;
	while(o.attr("parentNode"))
	{
		o = o.parent();
		obj_x += o.offset().left;
		obj_y += o.offset().top;
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
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_input.js
*/
(function($){
	$.fn.extend({ 
		/*
		 * 扩展输入框
		 */
		ITCUI_Input : function(opt){
			var _this = $(this);			
			var options = opt || {};
			var _parent = _this.parent();
			
			init = function(){
				var icon = options["icon"] || _this.attr("icon") || null;
				var placeholder = options["placeholder"] || _this.attr("placeholder") || null;
				var onlyLabel = options["onlylabel"] || _this.attr("onlylabel") || null;
				var inputWidth = "100%";
				if(icon){				
					$("<span class='itcui_input_icon'></span>").appendTo(_parent).addClass(icon).css({
						"float":"right",
						"margin-right" : "4px",
						"vertical-align" : "middle"
					});
					//调整图标的位置
					var iconSpan = _parent.children(".itcui_input_icon");
					var wrapHeight = parseInt(_parent.css("height"));
					var iconHeight = parseInt(iconSpan.css("height"));
					iconSpan.css("margin-top",(wrapHeight - iconHeight)/2-1);
					//重新计算input的大小
					var wrapWidth = parseInt(_parent.css("width"));
					var iconWidth = parseInt(iconSpan.css("width"));
					inputWidth = (wrapWidth - iconWidth - 17) + "px";
					
				}
				if(placeholder){
					//新版jquery判断ie6-ie8
					if(!$.support.leadingWhitespace){
						$("<span class='itcui_placeholder'>" + placeholder +  "</span>").prependTo(_parent).addClass("itcui_placeholder").css({
							"width" : inputWidth
						});
						_parent.children("input").css("display","none").blur(function(){
							var _this = $(this);
							if(!_this.val()){
								_this.css("display","none");
								_this.prev("span").css("display","block");
							}
						});
						_parent.children(".itcui_placeholder").click(function(){
							var _this = $(this);
							_this.css("display","none");
							_this.next("input").css("display","block").focus();
						});
					}
				}
				if(placeholder||icon){
					_this.css({
						"float":"left",
						"width" : inputWidth,
						"border-width" : "0px",
						"outline":"none",
						"margin-left":"4px",
						"font-size":"12px",
						"margin-top":"2px"
					});
					_parent.addClass("form-control-style");
				}
				if(onlyLabel){
					addLabel();
				}
			};
			
			addLabel = function(){
				_parent.addClass("borderless").find(".itcui_input_icon").css("display","none");
				_parent.find("input").css("visibility","hidden");
				_parent.css("height",_parent.css("height")).css("overflow","hidden");
				var text = _this.val();
				$("<span class='itcui_onlylabel'>" + text + "</span>").prependTo(_parent);
			};
			
			removeLabel = function(){
				
			};
			
			if(!opt || typeof(opt)=="object"){
				init();
			}
			else if(typeof(opt)=="string"){
				if(opt=="label"){
					addLabel();
				}
			}
		}
	});
})(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.panel.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
$.fn._remove=function(){
return this.each(function(){
$(this).remove();
try{
this.outerHTML="";
}
catch(err){
}
});
};
function _1(_2){
_2._remove();
};
function _3(_4,_5){
var _6=$.data(_4,"panel").options;
var _7=$.data(_4,"panel").panel;
var _8=_7.children("div.panel-header");
var _9=_7.children("div.panel-body");
if(_5){
$.extend(_6,{width:_5.width,height:_5.height,left:_5.left,top:_5.top});
}
_6.fit?$.extend(_6,_7._fit()):_7._fit(false);
_7.css({left:_6.left,top:_6.top});
if(!isNaN(_6.width)){
_7._outerWidth(_6.width);
}else{
_7.width("auto");
}
_8.add(_9)._outerWidth(_7.width());
if(!isNaN(_6.height)){
_7._outerHeight(_6.height);
_9._outerHeight(_7.height()-_8._outerHeight());
}else{
_9.height("auto");
}
_7.css("height","");
_6.onResize.apply(_4,[_6.width,_6.height]);
$(_4).find(">div,>form>div").triggerHandler("_resize");
};
function _a(_b,_c){
var _d=$.data(_b,"panel").options;
var _e=$.data(_b,"panel").panel;
if(_c){
if(_c.left!=null){
_d.left=_c.left;
}
if(_c.top!=null){
_d.top=_c.top;
}
}
_e.css({left:_d.left,top:_d.top});
_d.onMove.apply(_b,[_d.left,_d.top]);
};
function _f(_10){
$(_10).addClass("panel-body");
var _11=$("<div class=\"panel\"></div>").insertBefore(_10);
_11[0].appendChild(_10);
_11.bind("_resize",function(){
var _12=$.data(_10,"panel").options;
if(_12.fit==true){
_3(_10);
}
return false;
});
return _11;
};
function _13(_14){
var _15=$.data(_14,"panel").options;
var _16=$.data(_14,"panel").panel;
if(_15.tools&&typeof _15.tools=="string"){
_16.find(">div.panel-header>div.panel-tool .panel-tool-a").appendTo(_15.tools);
}
_1(_16.children("div.panel-header"));
if(_15.title&&!_15.noheader){
var _17=$("<div class=\"panel-header\"><div class=\"panel-title\">"+_15.title+"</div></div>").prependTo(_16);
if(_15.iconCls){
_17.find(".panel-title").addClass("panel-with-icon");
$("<div class=\"panel-icon\"></div>").addClass(_15.iconCls).appendTo(_17);
}
var _18=$("<div class=\"panel-tool\"></div>").appendTo(_17);
_18.bind("click",function(e){
e.stopPropagation();
});
if(_15.tools){
if($.isArray(_15.tools)){
for(var i=0;i<_15.tools.length;i++){
var t=$("<a href=\"javascript:void(0)\"></a>").addClass(_15.tools[i].iconCls).appendTo(_18);
if(_15.tools[i].handler){
t.bind("click",eval(_15.tools[i].handler));
}
}
}else{
$(_15.tools).children().each(function(){
$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(_18);
});
}
}
if(_15.collapsible){
$("<a class=\"panel-tool-collapse\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click",function(){
if(_15.collapsed==true){
_3c(_14,true);
}else{
_2c(_14,true);
}
return false;
});
}
if(_15.minimizable){
$("<a class=\"panel-tool-min\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click",function(){
_47(_14);
return false;
});
}
if(_15.maximizable){
$("<a class=\"panel-tool-max\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click",function(){
if(_15.maximized==true){
_4b(_14);
}else{
_2b(_14);
}
return false;
});
}
if(_15.closable){
$("<a class=\"panel-tool-close\" href=\"javascript:void(0)\"></a>").appendTo(_18).bind("click",function(){
_19(_14);
return false;
});
}
_16.children("div.panel-body").removeClass("panel-body-noheader");
}else{
_16.children("div.panel-body").addClass("panel-body-noheader");
}
};
function _1a(_1b){
var _1c=$.data(_1b,"panel");
var _1d=_1c.options;
if(_1d.href){
if(!_1c.isLoaded||!_1d.cache){
if(_1d.onBeforeLoad.call(_1b)==false){
return;
}
_1c.isLoaded=false;
_1e(_1b);
if(_1d.loadingMessage){
$(_1b).html($("<div class=\"panel-loading\"></div>").html(_1d.loadingMessage));
}
$.ajax({url:_1d.href,cache:false,dataType:"html",success:function(_1f){
_20(_1d.extractor.call(_1b,_1f));
_1d.onLoad.apply(_1b,arguments);
_1c.isLoaded=true;
}});
}
}else{
if(_1d.content){
if(!_1c.isLoaded){
_1e(_1b);
_20(_1d.content);
_1c.isLoaded=true;
}
}
}
function _20(_21){
$(_1b).html(_21);
if($.parser){
$.parser.parse($(_1b));
}
};
};
function _1e(_22){
var t=$(_22);
t.find(".combo-f").each(function(){
$(this).combo("destroy");
});
t.find(".m-btn").each(function(){
$(this).menubutton("destroy");
});
t.find(".s-btn").each(function(){
$(this).splitbutton("destroy");
});
t.find(".tooltip-f").each(function(){
$(this).tooltip("destroy");
});
};
function _23(_24){
$(_24).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible").each(function(){
$(this).triggerHandler("_resize",[true]);
});
};
function _25(_26,_27){
var _28=$.data(_26,"panel").options;
var _29=$.data(_26,"panel").panel;
if(_27!=true){
if(_28.onBeforeOpen.call(_26)==false){
return;
}
}
_29.show();
_28.closed=false;
_28.minimized=false;
var _2a=_29.children("div.panel-header").find("a.panel-tool-restore");
if(_2a.length){
_28.maximized=true;
}
_28.onOpen.call(_26);
if(_28.maximized==true){
_28.maximized=false;
_2b(_26);
}
if(_28.collapsed==true){
_28.collapsed=false;
_2c(_26);
}
if(!_28.collapsed){
_1a(_26);
_23(_26);
}
};
function _19(_2d,_2e){
var _2f=$.data(_2d,"panel").options;
var _30=$.data(_2d,"panel").panel;
if(_2e!=true){
if(_2f.onBeforeClose.call(_2d)==false){
return;
}
}
_30._fit(false);
_30.hide();
_2f.closed=true;
_2f.onClose.call(_2d);
};
function _31(_32,_33){
var _34=$.data(_32,"panel").options;
var _35=$.data(_32,"panel").panel;
if(_33!=true){
if(_34.onBeforeDestroy.call(_32)==false){
return;
}
}
_1e(_32);
_1(_35);
_34.onDestroy.call(_32);
};
function _2c(_36,_37){
var _38=$.data(_36,"panel").options;
var _39=$.data(_36,"panel").panel;
var _3a=_39.children("div.panel-body");
var _3b=_39.children("div.panel-header").find("a.panel-tool-collapse");
if(_38.collapsed==true){
return;
}
_3a.stop(true,true);
if(_38.onBeforeCollapse.call(_36)==false){
return;
}
_3b.addClass("panel-tool-expand");
if(_37==true){
_3a.slideUp("normal",function(){
_38.collapsed=true;
_38.onCollapse.call(_36);
});
}else{
_3a.hide();
_38.collapsed=true;
_38.onCollapse.call(_36);
}
};
function _3c(_3d,_3e){
var _3f=$.data(_3d,"panel").options;
var _40=$.data(_3d,"panel").panel;
var _41=_40.children("div.panel-body");
var _42=_40.children("div.panel-header").find("a.panel-tool-collapse");
if(_3f.collapsed==false){
return;
}
_41.stop(true,true);
if(_3f.onBeforeExpand.call(_3d)==false){
return;
}
_42.removeClass("panel-tool-expand");
if(_3e==true){
_41.slideDown("normal",function(){
_3f.collapsed=false;
_3f.onExpand.call(_3d);
_1a(_3d);
_23(_3d);
});
}else{
_41.show();
_3f.collapsed=false;
_3f.onExpand.call(_3d);
_1a(_3d);
_23(_3d);
}
};
function _2b(_43){
var _44=$.data(_43,"panel").options;
var _45=$.data(_43,"panel").panel;
var _46=_45.children("div.panel-header").find("a.panel-tool-max");
if(_44.maximized==true){
return;
}
_46.addClass("panel-tool-restore");
if(!$.data(_43,"panel").original){
$.data(_43,"panel").original={width:_44.width,height:_44.height,left:_44.left,top:_44.top,fit:_44.fit};
}
_44.left=0;
_44.top=0;
_44.fit=true;
_3(_43);
_44.minimized=false;
_44.maximized=true;
_44.onMaximize.call(_43);
};
function _47(_48){
var _49=$.data(_48,"panel").options;
var _4a=$.data(_48,"panel").panel;
_4a._fit(false);
_4a.hide();
_49.minimized=true;
_49.maximized=false;
_49.onMinimize.call(_48);
};
function _4b(_4c){
var _4d=$.data(_4c,"panel").options;
var _4e=$.data(_4c,"panel").panel;
var _4f=_4e.children("div.panel-header").find("a.panel-tool-max");
if(_4d.maximized==false){
return;
}
_4e.show();
_4f.removeClass("panel-tool-restore");
$.extend(_4d,$.data(_4c,"panel").original);
_3(_4c);
_4d.minimized=false;
_4d.maximized=false;
$.data(_4c,"panel").original=null;
_4d.onRestore.call(_4c);
};
function _50(_51){
var _52=$.data(_51,"panel").options;
var _53=$.data(_51,"panel").panel;
var _54=$(_51).panel("header");
var _55=$(_51).panel("body");
_53.css(_52.style);
_53.addClass(_52.cls);
if(_52.border){
_54.removeClass("panel-header-noborder");
_55.removeClass("panel-body-noborder");
}else{
_54.addClass("panel-header-noborder");
_55.addClass("panel-body-noborder");
}
_54.addClass(_52.headerCls);
_55.addClass(_52.bodyCls);
if(_52.id){
$(_51).attr("id",_52.id);
}else{
$(_51).attr("id","");
}
};
function _56(_57,_58){
$.data(_57,"panel").options.title=_58;
$(_57).panel("header").find("div.panel-title").html(_58);
};
var TO=false;
var _59=true;
$(window).unbind(".panel").bind("resize.panel",function(){
if(!_59){
return;
}
if(TO!==false){
clearTimeout(TO);
}
TO=setTimeout(function(){
_59=false;
var _5a=$("body.layout");
if(_5a.length){
_5a.layout("resize");
}else{
$("body").children("div.panel,div.accordion,div.tabs-container,div.layout").triggerHandler("_resize");
}
_59=true;
TO=false;
},200);
});
$.fn.panel=function(_5b,_5c){
if(typeof _5b=="string"){
return $.fn.panel.methods[_5b](this,_5c);
}
_5b=_5b||{};
return this.each(function(){
var _5d=$.data(this,"panel");
var _5e;
if(_5d){
_5e=$.extend(_5d.options,_5b);
_5d.isLoaded=false;
}else{
_5e=$.extend({},$.fn.panel.defaults,$.fn.panel.parseOptions(this),_5b);
$(this).attr("title","");
_5d=$.data(this,"panel",{options:_5e,panel:_f(this),isLoaded:false});
}
_13(this);
_50(this);
if(_5e.doSize==true){
_5d.panel.css("display","block");
_3(this);
}
if(_5e.closed==true||_5e.minimized==true){
_5d.panel.hide();
}else{
_25(this);
}
});
};
$.fn.panel.methods={options:function(jq){
return $.data(jq[0],"panel").options;
},panel:function(jq){
return $.data(jq[0],"panel").panel;
},header:function(jq){
return $.data(jq[0],"panel").panel.find(">div.panel-header");
},body:function(jq){
return $.data(jq[0],"panel").panel.find(">div.panel-body");
},setTitle:function(jq,_5f){
return jq.each(function(){
_56(this,_5f);
});
},open:function(jq,_60){
return jq.each(function(){
_25(this,_60);
});
},close:function(jq,_61){
return jq.each(function(){
_19(this,_61);
});
},destroy:function(jq,_62){
return jq.each(function(){
_31(this,_62);
});
},refresh:function(jq,_63){
return jq.each(function(){
$.data(this,"panel").isLoaded=false;
if(_63){
$.data(this,"panel").options.href=_63;
}
_1a(this);
});
},resize:function(jq,_64){
return jq.each(function(){
_3(this,_64);
});
},move:function(jq,_65){
return jq.each(function(){
_a(this,_65);
});
},maximize:function(jq){
return jq.each(function(){
_2b(this);
});
},minimize:function(jq){
return jq.each(function(){
_47(this);
});
},restore:function(jq){
return jq.each(function(){
_4b(this);
});
},collapse:function(jq,_66){
return jq.each(function(){
_2c(this,_66);
});
},expand:function(jq,_67){
return jq.each(function(){
_3c(this,_67);
});
}};
$.fn.panel.parseOptions=function(_68){
var t=$(_68);
return $.extend({},$.parser.parseOptions(_68,["id","width","height","left","top","title","iconCls","cls","headerCls","bodyCls","tools","href",{cache:"boolean",fit:"boolean",border:"boolean",noheader:"boolean"},{collapsible:"boolean",minimizable:"boolean",maximizable:"boolean"},{closable:"boolean",collapsed:"boolean",minimized:"boolean",maximized:"boolean",closed:"boolean"}]),{loadingMessage:(t.attr("loadingMessage")!=undefined?t.attr("loadingMessage"):undefined)});
};
$.fn.panel.defaults={id:null,title:null,iconCls:null,width:"auto",height:"auto",left:null,top:null,cls:null,headerCls:null,bodyCls:null,style:{},href:null,cache:true,fit:false,border:true,doSize:true,noheader:false,content:null,collapsible:false,minimizable:false,maximizable:false,closable:false,collapsed:false,minimized:false,maximized:false,closed:false,tools:null,href:null,loadingMessage:"Loading...",extractor:function(_69){
var _6a=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
var _6b=_6a.exec(_69);
if(_6b){
return _6b[1];
}else{
return _69;
}
},onBeforeLoad:function(){
},onLoad:function(){
},onBeforeOpen:function(){
},onOpen:function(){
},onBeforeClose:function(){
},onClose:function(){
},onBeforeDestroy:function(){
},onDestroy:function(){
},onResize:function(_6c,_6d){
},onMove:function(_6e,top){
},onMaximize:function(){
},onRestore:function(){
},onMinimize:function(){
},onBeforeCollapse:function(){
},onBeforeExpand:function(){
},onCollapse:function(){
},onExpand:function(){
}};
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.resizable.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
$.fn.resizable=function(_1,_2){
if(typeof _1=="string"){
return $.fn.resizable.methods[_1](this,_2);
}
function _3(e){
var _4=e.data;
var _5=$.data(_4.target,"resizable").options;
if(_4.dir.indexOf("e")!=-1){
var _6=_4.startWidth+e.pageX-_4.startX;
_6=Math.min(Math.max(_6,_5.minWidth),_5.maxWidth);
_4.width=_6;
}
if(_4.dir.indexOf("s")!=-1){
var _7=_4.startHeight+e.pageY-_4.startY;
_7=Math.min(Math.max(_7,_5.minHeight),_5.maxHeight);
_4.height=_7;
}
if(_4.dir.indexOf("w")!=-1){
var _6=_4.startWidth-e.pageX+_4.startX;
_6=Math.min(Math.max(_6,_5.minWidth),_5.maxWidth);
_4.width=_6;
_4.left=_4.startLeft+_4.startWidth-_4.width;
}
if(_4.dir.indexOf("n")!=-1){
var _7=_4.startHeight-e.pageY+_4.startY;
_7=Math.min(Math.max(_7,_5.minHeight),_5.maxHeight);
_4.height=_7;
_4.top=_4.startTop+_4.startHeight-_4.height;
}
};
function _8(e){
var _9=e.data;
var t=$(_9.target);
t.css({left:_9.left,top:_9.top});
if(t.outerWidth()!=_9.width){
t._outerWidth(_9.width);
}
if(t.outerHeight()!=_9.height){
t._outerHeight(_9.height);
}
};
function _a(e){
$.fn.resizable.isResizing=true;
$.data(e.data.target,"resizable").options.onStartResize.call(e.data.target,e);
return false;
};
function _b(e){
_3(e);
if($.data(e.data.target,"resizable").options.onResize.call(e.data.target,e)!=false){
_8(e);
}
return false;
};
function _c(e){
$.fn.resizable.isResizing=false;
_3(e,true);
_8(e);
$.data(e.data.target,"resizable").options.onStopResize.call(e.data.target,e);
$(document).unbind(".resizable");
$("body").css("cursor","");
return false;
};
return this.each(function(){
var _d=null;
var _e=$.data(this,"resizable");
if(_e){
$(this).unbind(".resizable");
_d=$.extend(_e.options,_1||{});
}else{
_d=$.extend({},$.fn.resizable.defaults,$.fn.resizable.parseOptions(this),_1||{});
$.data(this,"resizable",{options:_d});
}
if(_d.disabled==true){
return;
}
$(this).bind("mousemove.resizable",{target:this},function(e){
if($.fn.resizable.isResizing){
return;
}
var _f=_10(e);
if(_f==""){
$(e.data.target).css("cursor","");
}else{
$(e.data.target).css("cursor",_f+"-resize");
}
}).bind("mouseleave.resizable",{target:this},function(e){
$(e.data.target).css("cursor","");
}).bind("mousedown.resizable",{target:this},function(e){
var dir=_10(e);
if(dir==""){
return;
}
function _11(css){
var val=parseInt($(e.data.target).css(css));
if(isNaN(val)){
return 0;
}else{
return val;
}
};
var _12={target:e.data.target,dir:dir,startLeft:_11("left"),startTop:_11("top"),left:_11("left"),top:_11("top"),startX:e.pageX,startY:e.pageY,startWidth:$(e.data.target).outerWidth(),startHeight:$(e.data.target).outerHeight(),width:$(e.data.target).outerWidth(),height:$(e.data.target).outerHeight(),deltaWidth:$(e.data.target).outerWidth()-$(e.data.target).width(),deltaHeight:$(e.data.target).outerHeight()-$(e.data.target).height()};
$(document).bind("mousedown.resizable",_12,_a);
$(document).bind("mousemove.resizable",_12,_b);
$(document).bind("mouseup.resizable",_12,_c);
$("body").css("cursor",dir+"-resize");
});
function _10(e){
var tt=$(e.data.target);
var dir="";
var _13=tt.offset();
var _14=tt.outerWidth();
var _15=tt.outerHeight();
var _16=_d.edge;
if(e.pageY>_13.top&&e.pageY<_13.top+_16){
dir+="n";
}else{
if(e.pageY<_13.top+_15&&e.pageY>_13.top+_15-_16){
dir+="s";
}
}
if(e.pageX>_13.left&&e.pageX<_13.left+_16){
dir+="w";
}else{
if(e.pageX<_13.left+_14&&e.pageX>_13.left+_14-_16){
dir+="e";
}
}
var _17=_d.handles.split(",");
for(var i=0;i<_17.length;i++){
var _18=_17[i].replace(/(^\s*)|(\s*$)/g,"");
if(_18=="all"||_18==dir){
return dir;
}
}
return "";
};
});
};
$.fn.resizable.methods={options:function(jq){
return $.data(jq[0],"resizable").options;
},enable:function(jq){
return jq.each(function(){
$(this).resizable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).resizable({disabled:true});
});
}};
$.fn.resizable.parseOptions=function(_19){
var t=$(_19);
return $.extend({},$.parser.parseOptions(_19,["handles",{minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number",edge:"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.resizable.defaults={disabled:false,handles:"n, e, s, w, ne, se, sw, nw, all",minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000,edge:5,onStartResize:function(e){
},onResize:function(e){
},onStopResize:function(e){
}};
$.fn.resizable.isResizing=false;
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.linkbutton.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
function _1(_2){
var _3=$.data(_2,"linkbutton").options;
var t=$(_2);
t.addClass("l-btn").removeClass("l-btn-plain l-btn-selected l-btn-plain-selected");
if(_3.plain){
t.addClass("l-btn-plain");
}
if(_3.selected){
t.addClass(_3.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
}
t.attr("group",_3.group||"");
t.attr("id",_3.id||"");
t.html("<span class=\"l-btn-left\">"+"<span class=\"l-btn-text\"></span>"+"</span>");
if(_3.text){
t.find(".l-btn-text").html(_3.text);
if(_3.iconCls){
t.find(".l-btn-text").addClass(_3.iconCls).addClass(_3.iconAlign=="left"?"l-btn-icon-left":"l-btn-icon-right");
}
}else{
t.find(".l-btn-text").html("<span class=\"l-btn-empty\">&nbsp;</span>");
if(_3.iconCls){
t.find(".l-btn-empty").addClass(_3.iconCls);
}
}
t.unbind(".linkbutton").bind("focus.linkbutton",function(){
if(!_3.disabled){
$(this).find(".l-btn-text").addClass("l-btn-focus");
}
}).bind("blur.linkbutton",function(){
$(this).find(".l-btn-text").removeClass("l-btn-focus");
});
if(_3.toggle&&!_3.disabled){
t.bind("click.linkbutton",function(){
if(_3.selected){
$(this).linkbutton("unselect");
}else{
$(this).linkbutton("select");
}
});
}
_4(_2,_3.selected);
_5(_2,_3.disabled);
};
function _4(_6,_7){
var _8=$.data(_6,"linkbutton").options;
if(_7){
if(_8.group){
$("a.l-btn[group=\""+_8.group+"\"]").each(function(){
var o=$(this).linkbutton("options");
if(o.toggle){
$(this).removeClass("l-btn-selected l-btn-plain-selected");
o.selected=false;
}
});
}
$(_6).addClass(_8.plain?"l-btn-selected l-btn-plain-selected":"l-btn-selected");
_8.selected=true;
}else{
if(!_8.group){
$(_6).removeClass("l-btn-selected l-btn-plain-selected");
_8.selected=false;
}
}
};
function _5(_9,_a){
var _b=$.data(_9,"linkbutton");
var _c=_b.options;
$(_9).removeClass("l-btn-disabled l-btn-plain-disabled");
if(_a){
_c.disabled=true;
var _d=$(_9).attr("href");
if(_d){
_b.href=_d;
$(_9).attr("href","javascript:void(0)");
}
if(_9.onclick){
_b.onclick=_9.onclick;
_9.onclick=null;
}
_c.plain?$(_9).addClass("l-btn-disabled l-btn-plain-disabled"):$(_9).addClass("l-btn-disabled");
}else{
_c.disabled=false;
if(_b.href){
$(_9).attr("href",_b.href);
}
if(_b.onclick){
_9.onclick=_b.onclick;
}
}
};
$.fn.linkbutton=function(_e,_f){
if(typeof _e=="string"){
return $.fn.linkbutton.methods[_e](this,_f);
}
_e=_e||{};
return this.each(function(){
var _10=$.data(this,"linkbutton");
if(_10){
$.extend(_10.options,_e);
}else{
$.data(this,"linkbutton",{options:$.extend({},$.fn.linkbutton.defaults,$.fn.linkbutton.parseOptions(this),_e)});
$(this).removeAttr("disabled");
}
_1(this);
});
};
$.fn.linkbutton.methods={options:function(jq){
return $.data(jq[0],"linkbutton").options;
},enable:function(jq){
return jq.each(function(){
_5(this,false);
});
},disable:function(jq){
return jq.each(function(){
_5(this,true);
});
},select:function(jq){
return jq.each(function(){
_4(this,true);
});
},unselect:function(jq){
return jq.each(function(){
_4(this,false);
});
}};
$.fn.linkbutton.parseOptions=function(_11){
var t=$(_11);
return $.extend({},$.parser.parseOptions(_11,["id","iconCls","iconAlign","group",{plain:"boolean",toggle:"boolean",selected:"boolean"}]),{disabled:(t.attr("disabled")?true:undefined),text:$.trim(t.html()),iconCls:(t.attr("icon")||t.attr("iconCls"))});
};
$.fn.linkbutton.defaults={id:null,disabled:false,toggle:false,selected:false,group:null,plain:false,text:"",iconCls:null,iconAlign:"left"};
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.pagination.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
function _1(_2){
var _3=$.data(_2,"pagination");
var _4=_3.options;
var bb=_3.bb={};
var _5=$(_2).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
var tr=_5.find("tr");
var aa=$.extend([],_4.layout);
if(!_4.showPageList){
_6(aa,"list");
}
if(!_4.showRefresh){
_6(aa,"refresh");
}
if(aa[0]=="sep"){
aa.shift();
}
if(aa[aa.length-1]=="sep"){
aa.pop();
}
for(var _7=0;_7<aa.length;_7++){
var _8=aa[_7];
if(_8=="list"){
var ps=$("<select class=\"pagination-page-list\"></select>");
ps.bind("change",function(){
_4.pageSize=parseInt($(this).val());
_4.onChangePageSize.call(_2,_4.pageSize);
_10(_2,_4.pageNumber);
});
for(var i=0;i<_4.pageList.length;i++){
$("<option></option>").text(_4.pageList[i]).appendTo(ps);
}
$("<td></td>").append(ps).appendTo(tr);
}else{
if(_8=="sep"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
if(_8=="first"){
bb.first=_9("first");
}else{
if(_8=="prev"){
bb.prev=_9("prev");
}else{
if(_8=="next"){
bb.next=_9("next");
}else{
if(_8=="last"){
bb.last=_9("last");
}else{
if(_8=="manual"){
$("<span style=\"padding-left:6px;\"></span>").html(_4.beforePageText).appendTo(tr).wrap("<td></td>");
bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
if(e.keyCode==13){
var _a=parseInt($(this).val())||1;
_10(_2,_a);
return false;
}
});
bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
}else{
if(_8=="refresh"){
bb.refresh=_9("refresh");
}else{
if(_8=="links"){
$("<td class=\"pagination-links\"></td>").appendTo(tr);
}
}
}
}
}
}
}
}
}
}
if(_4.buttons){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
if($.isArray(_4.buttons)){
for(var i=0;i<_4.buttons.length;i++){
var _b=_4.buttons[i];
if(_b=="-"){
$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
a[0].onclick=eval(_b.handler||function(){
});
a.linkbutton($.extend({},_b,{plain:true}));
}
}
}else{
var td=$("<td></td>").appendTo(tr);
$(_4.buttons).appendTo(td).show();
}
}
$("<div class=\"pagination-info\"></div>").appendTo(_5);
$("<div style=\"clear:both;\"></div>").appendTo(_5);
function _9(_c){
var _d=_4.nav[_c];
var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
a.wrap("<td></td>");
a.linkbutton({iconCls:_d.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
_d.handler.call(_2);
});
return a;
};
function _6(aa,_e){
var _f=$.inArray(_e,aa);
if(_f>=0){
aa.splice(_f,1);
}
return aa;
};
};
function _10(_11,_12){
var _13=$.data(_11,"pagination").options;
_14(_11,{pageNumber:_12});
_13.onSelectPage.call(_11,_13.pageNumber,_13.pageSize);
};
function _14(_15,_16){
var _17=$.data(_15,"pagination");
var _18=_17.options;
var bb=_17.bb;
$.extend(_18,_16||{});
var ps=$(_15).find("select.pagination-page-list");
if(ps.length){
ps.val(_18.pageSize+"");
_18.pageSize=parseInt(ps.val());
}
var _19=Math.ceil(_18.total/_18.pageSize)||1;
if(_18.pageNumber<1){
_18.pageNumber=1;
}
if(_18.pageNumber>_19){
_18.pageNumber=_19;
}
if(bb.num){
bb.num.val(_18.pageNumber);
}
if(bb.after){
bb.after.html(_18.afterPageText.replace(/{pages}/,_19));
}
var td=$(_15).find("td.pagination-links");
if(td.length){
td.empty();
var _1a=_18.pageNumber-Math.floor(_18.links/2);
if(_1a<1){
_1a=1;
}
var _1b=_1a+_18.links-1;
if(_1b>_19){
_1b=_19;
}
_1a=_1b-_18.links+1;
if(_1a<1){
_1a=1;
}
for(var i=_1a;i<=_1b;i++){
var a=$("<a class=\"pagination-link\" href=\"javascript:void(0)\"></a>").appendTo(td);
a.linkbutton({plain:true,text:i});
if(i==_18.pageNumber){
a.linkbutton("select");
}else{
a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
_10(_15,e.data.pageNumber);
});
}
}
}
var _1c=_18.displayMsg;
_1c=_1c.replace(/{from}/,_18.total==0?0:_18.pageSize*(_18.pageNumber-1)+1);
_1c=_1c.replace(/{to}/,Math.min(_18.pageSize*(_18.pageNumber),_18.total));
_1c=_1c.replace(/{total}/,_18.total);
$(_15).find("div.pagination-info").html(_1c);
if(bb.first){
bb.first.linkbutton({disabled:(_18.pageNumber==1)});
}
if(bb.prev){
bb.prev.linkbutton({disabled:(_18.pageNumber==1)});
}
if(bb.next){
bb.next.linkbutton({disabled:(_18.pageNumber==_19)});
}
if(bb.last){
bb.last.linkbutton({disabled:(_18.pageNumber==_19)});
}
_1d(_15,_18.loading);
};
function _1d(_1e,_1f){
var _20=$.data(_1e,"pagination");
var _21=_20.options;
_21.loading=_1f;
if(_21.showRefresh&&_20.bb.refresh){
_20.bb.refresh.linkbutton({iconCls:(_21.loading?"pagination-loading":"pagination-load")});
}
};
$.fn.pagination=function(_22,_23){
if(typeof _22=="string"){
return $.fn.pagination.methods[_22](this,_23);
}
_22=_22||{};
return this.each(function(){
var _24;
var _25=$.data(this,"pagination");
if(_25){
_24=$.extend(_25.options,_22);
}else{
_24=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),_22);
$.data(this,"pagination",{options:_24});
}
_1(this);
_14(this);
});
};
$.fn.pagination.methods={options:function(jq){
return $.data(jq[0],"pagination").options;
},loading:function(jq){
return jq.each(function(){
_1d(this,true);
});
},loaded:function(jq){
return jq.each(function(){
_1d(this,false);
});
},refresh:function(jq,_26){
return jq.each(function(){
_14(this,_26);
});
},select:function(jq,_27){
return jq.each(function(){
_10(this,_27);
});
}};
$.fn.pagination.parseOptions=function(_28){
var t=$(_28);
return $.extend({},$.parser.parseOptions(_28,[{total:"number",pageSize:"number",pageNumber:"number",links:"number"},{loading:"boolean",showPageList:"boolean",showRefresh:"boolean"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)});
};
$.fn.pagination.defaults={total:1,pageSize:10,pageNumber:1,pageList:[10,20,30,50],loading:false,buttons:null,showPageList:true,showRefresh:true,links:10,layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh"],onSelectPage:function(_29,_2a){
},onBeforeRefresh:function(_2b,_2c){
},onRefresh:function(_2d,_2e){
},onChangePageSize:function(_2f){
},beforePageText:"Page",afterPageText:"of {pages}",displayMsg:"Displaying {from} to {to} of {total} items",nav:{first:{iconCls:"pagination-first",handler:function(){
var _30=$(this).pagination("options");
if(_30.pageNumber>1){
$(this).pagination("select",1);
}
}},prev:{iconCls:"pagination-prev",handler:function(){
var _31=$(this).pagination("options");
if(_31.pageNumber>1){
$(this).pagination("select",_31.pageNumber-1);
}
}},next:{iconCls:"pagination-next",handler:function(){
var _32=$(this).pagination("options");
var _33=Math.ceil(_32.total/_32.pageSize);
if(_32.pageNumber<_33){
$(this).pagination("select",_32.pageNumber+1);
}
}},last:{iconCls:"pagination-last",handler:function(){
var _34=$(this).pagination("options");
var _35=Math.ceil(_34.total/_34.pageSize);
if(_34.pageNumber<_35){
$(this).pagination("select",_35);
}
}},refresh:{iconCls:"pagination-refresh",handler:function(){
var _36=$(this).pagination("options");
if(_36.onBeforeRefresh.call(this,_36.pageNumber,_36.pageSize)!=false){
$(this).pagination("select",_36.pageNumber);
_36.onRefresh.call(this,_36.pageNumber,_36.pageSize);
}
}}}};
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.parser.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
$.parser={auto:true,onComplete:function(_1){
},plugins:["draggable","droppable","resizable","pagination","tooltip","linkbutton","menu","menubutton","splitbutton","progressbar","tree","combobox","combotree","combogrid","numberbox","validatebox","searchbox","numberspinner","timespinner","calendar","datebox","datetimebox","slider","layout","panel","datagrid","propertygrid","treegrid","tabs","accordion","window","dialog"],parse:function(_2){
var aa=[];
for(var i=0;i<$.parser.plugins.length;i++){
var _3=$.parser.plugins[i];
var r=$(".easyui-"+_3,_2);
if(r.length){
if(r[_3]){
r[_3]();
}else{
aa.push({name:_3,jq:r});
}
}
}
if(aa.length&&window.easyloader){
var _4=[];
for(var i=0;i<aa.length;i++){
_4.push(aa[i].name);
}
easyloader.load(_4,function(){
for(var i=0;i<aa.length;i++){
var _5=aa[i].name;
var jq=aa[i].jq;
jq[_5]();
}
$.parser.onComplete.call($.parser,_2);
});
}else{
$.parser.onComplete.call($.parser,_2);
}
},parseOptions:function(_6,_7){
var t=$(_6);
var _8={};
var s=$.trim(t.attr("data-options"));
if(s){
if(s.substring(0,1)!="{"){
s="{"+s+"}";
}
_8=(new Function("return "+s))();
}
if(_7){
var _9={};
for(var i=0;i<_7.length;i++){
var pp=_7[i];
if(typeof pp=="string"){
if(pp=="width"||pp=="height"||pp=="left"||pp=="top"){
_9[pp]=parseInt(_6.style[pp])||undefined;
}else{
_9[pp]=t.attr(pp);
}
}else{
for(var _a in pp){
var _b=pp[_a];
if(_b=="boolean"){
_9[_a]=t.attr(_a)?(t.attr(_a)=="true"):undefined;
}else{
if(_b=="number"){
_9[_a]=t.attr(_a)=="0"?0:parseFloat(t.attr(_a))||undefined;
}
}
}
}
}
$.extend(_8,_9);
}
return _8;
}};
$(function(){
var d=$("<div style=\"position:absolute;top:-1000px;width:100px;height:100px;padding:5px\"></div>").appendTo("body");
d.width(100);
$._boxModel=parseInt(d.width())==100;
d.remove();
if(!window.easyloader&&$.parser.auto){
$.parser.parse();
}
});
$.fn._outerWidth=function(_c){
if(_c==undefined){
if(this[0]==window){
return this.width()||document.body.clientWidth;
}
return this.outerWidth()||0;
}
return this.each(function(){
if($._boxModel){
$(this).width(_c-($(this).outerWidth()-$(this).width()));
}else{
$(this).width(_c);
}
});
};
$.fn._outerHeight=function(_d){
if(_d==undefined){
if(this[0]==window){
return this.height()||document.body.clientHeight;
}
return this.outerHeight()||0;
}
return this.each(function(){
if($._boxModel){
$(this).height(_d-($(this).outerHeight()-$(this).height()));
}else{
$(this).height(_d);
}
});
};
$.fn._scrollLeft=function(_e){
if(_e==undefined){
return this.scrollLeft();
}else{
return this.each(function(){
$(this).scrollLeft(_e);
});
}
};
$.fn._propAttr=$.fn.prop||$.fn.attr;
$.fn._fit=function(_f){
_f=_f==undefined?true:_f;
var t=this[0];
var p=(t.tagName=="BODY"?t:this.parent()[0]);
var _10=p.fcount||0;
if(_f){
if(!t.fitted){
t.fitted=true;
p.fcount=_10+1;
$(p).addClass("panel-noscroll");
if(p.tagName=="BODY"){
$("html").addClass("panel-fit");
}
}
}else{
if(t.fitted){
t.fitted=false;
p.fcount=_10-1;
if(p.fcount==0){
$(p).removeClass("panel-noscroll");
if(p.tagName=="BODY"){
$("html").removeClass("panel-fit");
}
}
}
}
return {width:$(p).width(),height:$(p).height()};
};
})(jQuery);
(function($){
var _11=null;
var _12=null;
var _13=false;
function _14(e){
if(e.touches.length!=1){
return;
}
if(!_13){
_13=true;
dblClickTimer=setTimeout(function(){
_13=false;
},500);
}else{
clearTimeout(dblClickTimer);
_13=false;
_15(e,"dblclick");
}
_11=setTimeout(function(){
_15(e,"contextmenu",3);
},1000);
_15(e,"mousedown");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _16(e){
if(e.touches.length!=1){
return;
}
if(_11){
clearTimeout(_11);
}
_15(e,"mousemove");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _17(e){
if(_11){
clearTimeout(_11);
}
_15(e,"mouseup");
if($.fn.draggable.isDragging||$.fn.resizable.isResizing){
e.preventDefault();
}
};
function _15(e,_18,_19){
var _1a=new $.Event(_18);
_1a.pageX=e.changedTouches[0].pageX;
_1a.pageY=e.changedTouches[0].pageY;
_1a.which=_19||1;
$(e.target).trigger(_1a);
};
if(document.addEventListener){
document.addEventListener("touchstart",_14,true);
document.addEventListener("touchmove",_16,true);
document.addEventListener("touchend",_17,true);
}
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.datagrid.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
var _1=0;
function _2(a,o){
for(var i=0,_3=a.length;i<_3;i++){
if(a[i]==o){
return i;
}
}
return -1;
};
function _4(a,o,id){
if(typeof o=="string"){
for(var i=0,_5=a.length;i<_5;i++){
if(a[i][o]==id){
a.splice(i,1);
return;
}
}
}else{
var _6=_2(a,o);
if(_6!=-1){
a.splice(_6,1);
}
}
};
function _7(a,o,r){
for(var i=0,_8=a.length;i<_8;i++){
if(a[i][o]==r[o]){
return;
}
}
a.push(r);
};
function _9(_a){
var cc=_a||$("head");
var _b=$.data(cc[0],"ss");
if(!_b){
_b=$.data(cc[0],"ss",{cache:{},dirty:[]});
}
return {add:function(_c){
var ss=["<style type=\"text/css\">"];
for(var i=0;i<_c.length;i++){
_b.cache[_c[i][0]]={width:_c[i][1]};
}
var _d=0;
for(var s in _b.cache){
var _e=_b.cache[s];
_e.index=_d++;
ss.push(s+"{width:"+_e.width+"}");
}
ss.push("</style>");
$(ss.join("\n")).appendTo(cc);
setTimeout(function(){
cc.children("style:not(:last)").remove();
},0);
},getRule:function(_f){
var _10=cc.children("style:last")[0];
var _11=_10.styleSheet?_10.styleSheet:(_10.sheet||document.styleSheets[document.styleSheets.length-1]);
var _12=_11.cssRules||_11.rules;
return _12[_f];
},set:function(_13,_14){
var _15=_b.cache[_13];
if(_15){
_15.width=_14;
var _16=this.getRule(_15.index);
if(_16){
_16.style["width"]=_14;
}
}
},remove:function(_17){
var tmp=[];
for(var s in _b.cache){
if(s.indexOf(_17)==-1){
tmp.push([s,_b.cache[s].width]);
}
}
_b.cache={};
this.add(tmp);
},dirty:function(_18){
if(_18){
_b.dirty.push(_18);
}
},clean:function(){
for(var i=0;i<_b.dirty.length;i++){
this.remove(_b.dirty[i]);
}
_b.dirty=[];
}};
};
function _19(_1a,_1b){
var _1c=$.data(_1a,"datagrid").options;
var _1d=$.data(_1a,"datagrid").panel;
if(_1b){
if(_1b.width){
_1c.width=_1b.width;
}
if(_1b.height){
_1c.height=_1b.height;
}
}
if(_1c.fit==true){
var p=_1d.panel("panel").parent();
_1c.width=p.width();
_1c.height=p.height();
}
_1d.panel("resize",{width:_1c.width,height:_1c.height});
};
function _1e(_1f){
var _20=$.data(_1f,"datagrid").options;
var dc=$.data(_1f,"datagrid").dc;
var _21=$.data(_1f,"datagrid").panel;
var _22=_21.width();
var _23=_21.height();
var _24=dc.view;
var _25=dc.view1;
var _26=dc.view2;
var _27=_25.children("div.datagrid-header");
var _28=_26.children("div.datagrid-header");
var _29=_27.find("table");
var _2a=_28.find("table");
_24.width(_22);
var _2b=_27.children("div.datagrid-header-inner").show();
_25.width(_2b.find("table").width());
if(!_20.showHeader){
_2b.hide();
}
_26.width(_22-_25._outerWidth());
_25.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_25.width());
_26.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(_26.width());
var hh;
_27.css("height","");
_28.css("height","");
_29.css("height","");
_2a.css("height","");
hh=Math.max(_29.height(),_2a.height());
_29.height(hh);
_2a.height(hh);
_27.add(_28)._outerHeight(hh);
if(_20.height!="auto"){
var _2c=_23-_26.children("div.datagrid-header")._outerHeight()-_26.children("div.datagrid-footer")._outerHeight()-_21.children("div.datagrid-toolbar")._outerHeight();
_21.children("div.datagrid-pager").each(function(){
//_2c-=$(this)._outerHeight();
});
dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({position:"absolute",top:dc.header2._outerHeight()});
var _2d=dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
_25.add(_26).children("div.datagrid-body").css({marginTop:_2d,height:(_2c-_2d)});
}
_24.height(_26.height());
};
function _2e(_2f,_30,_31){
var _32=$.data(_2f,"datagrid").data.rows;
var _33=$.data(_2f,"datagrid").options;
var dc=$.data(_2f,"datagrid").dc;
if(!dc.body1.is(":empty")&&(!_33.nowrap||_33.autoRowHeight||_31)){
if(_30!=undefined){
var tr1=_33.finder.getTr(_2f,_30,"body",1);
var tr2=_33.finder.getTr(_2f,_30,"body",2);
_34(tr1,tr2);
}else{
var tr1=_33.finder.getTr(_2f,0,"allbody",1);
var tr2=_33.finder.getTr(_2f,0,"allbody",2);
_34(tr1,tr2);
if(_33.showFooter){
var tr1=_33.finder.getTr(_2f,0,"allfooter",1);
var tr2=_33.finder.getTr(_2f,0,"allfooter",2);
_34(tr1,tr2);
}
}
}
_1e(_2f);
if(_33.height=="auto"){
var _35=dc.body1.parent();
var _36=dc.body2;
var _37=_38(_36);
var _39=_37.height;
if(_37.width>_36.width()){
_39+=18;
}
_35.height(_39);
_36.height(_39);
dc.view.height(dc.view2.height());
}
dc.body2.triggerHandler("scroll");
function _34(_3a,_3b){
for(var i=0;i<_3b.length;i++){
var tr1=$(_3a[i]);
var tr2=$(_3b[i]);
tr1.css("height","");
tr2.css("height","");
var _3c=Math.max(tr1.height(),tr2.height());
tr1.css("height",_3c);
tr2.css("height",_3c);
}
};
function _38(cc){
var _3d=0;
var _3e=0;
$(cc).children().each(function(){
var c=$(this);
if(c.is(":visible")){
_3e+=c._outerHeight();
if(_3d<c._outerWidth()){
_3d=c._outerWidth();
}
}
});
return {width:_3d,height:_3e};
};
};
function _3f(_40,_41){
var _42=$.data(_40,"datagrid");
var _43=_42.options;
var dc=_42.dc;
if(!dc.body2.children("table.datagrid-btable-frozen").length){
dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
}
_44(true);
_44(false);
_1e(_40);
function _44(_45){
var _46=_45?1:2;
var tr=_43.finder.getTr(_40,_41,"body",_46);
(_45?dc.body1:dc.body2).children("table.datagrid-btable-frozen").append(tr);
};
};
function _47(_48,_49){
function _4a(){
var _4b=[];
var _4c=[];
$(_48).children("thead").each(function(){
var opt=$.parser.parseOptions(this,[{frozen:"boolean"}]);
$(this).find("tr").each(function(){
var _4d=[];
$(this).find("th").each(function(){
var th=$(this);
var col=$.extend({},$.parser.parseOptions(this,["field","align","halign","order",{sortable:"boolean",checkbox:"boolean",resizable:"boolean",fixed:"boolean"},{rowspan:"number",colspan:"number",width:"number"}]),{title:(th.html()||undefined),hidden:(th.attr("hidden")?true:undefined),formatter:(th.attr("formatter")?eval(th.attr("formatter")):undefined),styler:(th.attr("styler")?eval(th.attr("styler")):undefined),sorter:(th.attr("sorter")?eval(th.attr("sorter")):undefined)});
if(th.attr("editor")){
var s=$.trim(th.attr("editor"));
if(s.substr(0,1)=="{"){
col.editor=eval("("+s+")");
}else{
col.editor=s;
}
}
_4d.push(col);
});
opt.frozen?_4b.push(_4d):_4c.push(_4d);
});
});
return [_4b,_4c];
};
var _4e=$("<div class=\"datagrid-wrap\">"+"<div class=\"datagrid-view\">"+"<div class=\"datagrid-view1\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\">"+"<div class=\"datagrid-body-inner\"></div>"+"</div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"<div class=\"datagrid-view2\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\"></div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"</div>"+"</div>").insertAfter(_48);
_4e.panel({doSize:false});
_4e.panel("panel").addClass("datagrid").bind("_resize",function(e,_4f){
var _50=$.data(_48,"datagrid").options;
if(_50.fit==true||_4f){
_19(_48);
setTimeout(function(){
if($.data(_48,"datagrid")){
_51(_48);
}
},0);
}
return false;
});
$(_48).hide().appendTo(_4e.children("div.datagrid-view"));
var cc=_4a();
var _52=_4e.children("div.datagrid-view");
var _53=_52.children("div.datagrid-view1");
var _54=_52.children("div.datagrid-view2");
var _55=_4e.closest("div.datagrid-view");
if(!_55.length){
_55=_52;
}
var ss=_9(_55);
return {panel:_4e,frozenColumns:cc[0],columns:cc[1],dc:{view:_52,view1:_53,view2:_54,header1:_53.children("div.datagrid-header").children("div.datagrid-header-inner"),header2:_54.children("div.datagrid-header").children("div.datagrid-header-inner"),body1:_53.children("div.datagrid-body").children("div.datagrid-body-inner"),body2:_54.children("div.datagrid-body"),footer1:_53.children("div.datagrid-footer").children("div.datagrid-footer-inner"),footer2:_54.children("div.datagrid-footer").children("div.datagrid-footer-inner")},ss:ss};
};
function _56(_57){
var _58=$.data(_57,"datagrid");
var _59=_58.options;
var dc=_58.dc;
var _5a=_58.panel;
_5a.panel($.extend({},_59,{id:null,doSize:false,onResize:function(_5b,_5c){
setTimeout(function(){
if($.data(_57,"datagrid")){
_1e(_57);
_8d(_57);
_59.onResize.call(_5a,_5b,_5c);
}
},0);
},onExpand:function(){
_2e(_57);
_59.onExpand.call(_5a);
}}));
_58.rowIdPrefix="datagrid-row-r"+(++_1);
_58.cellClassPrefix="datagrid-cell-c"+_1;
_5d(dc.header1,_59.frozenColumns,true);
_5d(dc.header2,_59.columns,false);
_5e();
dc.header1.add(dc.header2).css("display",_59.showHeader?"block":"none");
dc.footer1.add(dc.footer2).css("display",_59.showFooter?"block":"none");
if(_59.toolbar){
if($.isArray(_59.toolbar)){
$("div.datagrid-toolbar",_5a).remove();
var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_5a);
var tr=tb.find("tr");
for(var i=0;i<_59.toolbar.length;i++){
var btn=_59.toolbar[i];
if(btn=="-"){
$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var _5f=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
_5f[0].onclick=eval(btn.handler||function(){
});
_5f.linkbutton($.extend({},btn,{plain:true}));
}
}
}else{
$(_59.toolbar).addClass("datagrid-toolbar").prependTo(_5a);
$(_59.toolbar).show();
}
}else{
$("div.datagrid-toolbar",_5a).remove();
}
$("div.datagrid-pager",_5a).remove();
if(_59.pagination){
var _60=$("<div class=\"datagrid-pager\"></div>");
if(_59.pagePosition=="bottom"){
_60.appendTo(_5a);
}else{
if(_59.pagePosition=="top"){
_60.addClass("datagrid-pager-top").prependTo(_5a);
}else{
var _61=$("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(_5a);
_60.appendTo(_5a);
_60=_60.add(_61);
}
}
_60.pagination({total:(_59.pageNumber*_59.pageSize),pageNumber:_59.pageNumber,pageSize:_59.pageSize,pageList:_59.pageList,onSelectPage:function(_62,_63){
_59.pageNumber=_62;
_59.pageSize=_63;
_60.pagination("refresh",{pageNumber:_62,pageSize:_63});
_16b(_57);
}});
_59.pageSize=_60.pagination("options").pageSize;
}
function _5d(_64,_65,_66){
if(!_65){
return;
}
$(_64).show();
$(_64).empty();
var _67=[];
var _68=[];
if(_59.sortName){
_67=_59.sortName.split(",");
_68=_59.sortOrder.split(",");
}
var t=$("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(_64);
for(var i=0;i<_65.length;i++){
var tr=$("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody",t));
var _69=_65[i];
for(var j=0;j<_69.length;j++){
var col=_69[j];
var _6a="";
if(col.rowspan){
_6a+="rowspan=\""+col.rowspan+"\" ";
}
if(col.colspan){
_6a+="colspan=\""+col.colspan+"\" ";
}
var td=$("<td "+_6a+"></td>").appendTo(tr);
if(col.checkbox){
td.attr("field",col.field);
$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
}else{
if(col.field){
td.attr("field",col.field);
td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
$("span",td).html(col.title);
$("span.datagrid-sort-icon",td).html("&nbsp;");
var _6b=td.find("div.datagrid-cell");
var pos=_2(_67,col.field);
if(pos>=0){
_6b.addClass("datagrid-sort-"+_68[pos]);
}
if(col.resizable==false){
_6b.attr("resizable","false");
}
if(col.width){
_6b._outerWidth(col.width);
col.boxWidth=parseInt(_6b[0].style.width);
}else{
col.auto=true;
}
_6b.css("text-align",(col.halign||col.align||""));
col.cellClass=_58.cellClassPrefix+"-"+col.field.replace(/[\.|\s]/g,"-");
_6b.addClass(col.cellClass).css("width","");
}else{
$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
}
}
if(col.hidden){
td.hide();
}
}
}
if(_66&&_59.rownumbers){
var td=$("<td rowspan=\""+_59.frozenColumns.length+"\"><div class=\"datagrid-header-rownumber\"></div></td>");
if($("tr",t).length==0){
td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody",t));
}else{
td.prependTo($("tr:first",t));
}
}
};
function _5e(){
var _6c=[];
var _6d=_6e(_57,true).concat(_6e(_57));
for(var i=0;i<_6d.length;i++){
var col=_6f(_57,_6d[i]);
if(col&&!col.checkbox){
_6c.push(["."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto"]);
}
}
_58.ss.add(_6c);
_58.ss.dirty(_58.cellSelectorPrefix);
_58.cellSelectorPrefix="."+_58.cellClassPrefix;
};
};
function _70(_71){
var _72=$.data(_71,"datagrid");
var _73=_72.panel;
var _74=_72.options;
var dc=_72.dc;
var _75=dc.header1.add(dc.header2);
_75.find("input[type=checkbox]").unbind(".datagrid").bind("click.datagrid",function(e){
if(_74.singleSelect&&_74.selectOnCheck){
return false;
}
if($(this).is(":checked")){
_106(_71);
}else{
_10c(_71);
}
e.stopPropagation();
});
var _76=_75.find("div.datagrid-cell");
_76.closest("td").unbind(".datagrid").bind("mouseenter.datagrid",function(){
if(_72.resizing){
return;
}
$(this).addClass("datagrid-header-over");
}).bind("mouseleave.datagrid",function(){
$(this).removeClass("datagrid-header-over");
}).bind("contextmenu.datagrid",function(e){
var _77=$(this).attr("field");
_74.onHeaderContextMenu.call(_71,e,_77);
});
_76.unbind(".datagrid").bind("click.datagrid",function(e){
var p1=$(this).offset().left+5;
var p2=$(this).offset().left+$(this)._outerWidth()-5;
if(e.pageX<p2&&e.pageX>p1){
var _78=$(this).parent().attr("field");
var col=_6f(_71,_78);
if(!col.sortable||_72.resizing){
return;
}
var _79=[];
var _7a=[];
if(_74.sortName){
_79=_74.sortName.split(",");
_7a=_74.sortOrder.split(",");
}
var pos=_2(_79,_78);
var _7b=col.order||"asc";
if(pos>=0){
$(this).removeClass("datagrid-sort-asc datagrid-sort-desc");
var _7c=_7a[pos]=="asc"?"desc":"asc";
if(_74.multiSort&&_7c==_7b){
_79.splice(pos,1);
_7a.splice(pos,1);
}else{
_7a[pos]=_7c;
$(this).addClass("datagrid-sort-"+_7c);
}
}else{
if(_74.multiSort){
_79.push(_78);
_7a.push(_7b);
}else{
_79=[_78];
_7a=[_7b];
_76.removeClass("datagrid-sort-asc datagrid-sort-desc");
}
$(this).addClass("datagrid-sort-"+_7b);
}
_74.sortName=_79.join(",");
_74.sortOrder=_7a.join(",");
if(_74.remoteSort){
_16b(_71);
}else{
var _7d=$.data(_71,"datagrid").data;
_c6(_71,_7d);
}
_74.onSortColumn.call(_71,_74.sortName,_74.sortOrder);
}
}).bind("dblclick.datagrid",function(e){
var p1=$(this).offset().left+5;
var p2=$(this).offset().left+$(this)._outerWidth()-5;
var _7e=_74.resizeHandle=="right"?(e.pageX>p2):(_74.resizeHandle=="left"?(e.pageX<p1):(e.pageX<p1||e.pageX>p2));
if(_7e){
var _7f=$(this).parent().attr("field");
var col=_6f(_71,_7f);
if(col.resizable==false){
return;
}
$(_71).datagrid("autoSizeColumn",_7f);
col.auto=false;
}
});
var _80=_74.resizeHandle=="right"?"e":(_74.resizeHandle=="left"?"w":"e,w");
_76.each(function(){
$(this).resizable({handles:_80,disabled:($(this).attr("resizable")?$(this).attr("resizable")=="false":false),minWidth:25,onStartResize:function(e){
_72.resizing=true;
_75.css("cursor",$("body").css("cursor"));
if(!_72.proxy){
_72.proxy=$("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
}
_72.proxy.css({left:e.pageX-$(_73).offset().left-1,display:"none"});
setTimeout(function(){
if(_72.proxy){
_72.proxy.show();
}
},500);
},onResize:function(e){
_72.proxy.css({left:e.pageX-$(_73).offset().left-1,display:"block"});
return false;
},onStopResize:function(e){
_75.css("cursor","");
$(this).css("height","");
$(this)._outerWidth($(this)._outerWidth());
var _81=$(this).parent().attr("field");
var col=_6f(_71,_81);
col.width=$(this)._outerWidth();
col.boxWidth=parseInt(this.style.width);
col.auto=undefined;
$(this).css("width","");
_51(_71,_81);
_72.proxy.remove();
_72.proxy=null;
if($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")){
_1e(_71);
}
_8d(_71);
_74.onResizeColumn.call(_71,_81,col.width);
setTimeout(function(){
_72.resizing=false;
},0);
}});
});
dc.body1.add(dc.body2).unbind().bind("mouseover",function(e){
if(_72.resizing){
return;
}
var tr=$(e.target).closest("tr.datagrid-row");
if(!_82(tr)){
return;
}
var _83=_84(tr);
_eb(_71,_83);
e.stopPropagation();
}).bind("mouseout",function(e){
var tr=$(e.target).closest("tr.datagrid-row");
if(!_82(tr)){
return;
}
var _85=_84(tr);
_74.finder.getTr(_71,_85).removeClass("datagrid-row-over");
e.stopPropagation();
}).bind("click",function(e){
var tt=$(e.target);
var tr=tt.closest("tr.datagrid-row");
if(!_82(tr)){
return;
}
var _86=_84(tr);
if(tt.parent().hasClass("datagrid-cell-check")){
if(_74.singleSelect&&_74.selectOnCheck){
if(!_74.checkOnSelect){
_10c(_71,true);
}
_f8(_71,_86);
}else{
if(tt.is(":checked")){
_f8(_71,_86);
}else{
_100(_71,_86);
}
}
}else{
var row=_74.finder.getRow(_71,_86);
var td=tt.closest("td[field]",tr);
if(td.length){
var _87=td.attr("field");
_74.onClickCell.call(_71,_86,_87,row[_87]);
}
if(_74.singleSelect==true){
_f0(_71,_86);
}else{
if(tr.hasClass("datagrid-row-selected")){
_f9(_71,_86);
}else{
_f0(_71,_86);
}
}
_74.onClickRow.call(_71,_86,row);
}
e.stopPropagation();
}).bind("dblclick",function(e){
var tt=$(e.target);
var tr=tt.closest("tr.datagrid-row");
if(!_82(tr)){
return;
}
var _88=_84(tr);
var row=_74.finder.getRow(_71,_88);
var td=tt.closest("td[field]",tr);
if(td.length){
var _89=td.attr("field");
_74.onDblClickCell.call(_71,_88,_89,row[_89]);
}
_74.onDblClickRow.call(_71,_88,row);
e.stopPropagation();
}).bind("contextmenu",function(e){
var tr=$(e.target).closest("tr.datagrid-row");
if(!_82(tr)){
return;
}
var _8a=_84(tr);
var row=_74.finder.getRow(_71,_8a);
_74.onRowContextMenu.call(_71,e,_8a,row);
e.stopPropagation();
});
dc.body2.bind("scroll",function(){
var b1=dc.view1.children("div.datagrid-body");
b1.scrollTop($(this).scrollTop());
var c1=dc.body1.children(":first");
var c2=dc.body2.children(":first");
if(c1.length&&c2.length){
var _8b=c1.offset().top;
var _8c=c2.offset().top;
if(_8b!=_8c){
b1.scrollTop(b1.scrollTop()+_8b-_8c);
}
}
dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
dc.body2.children("table.datagrid-btable-frozen").css("left",-$(this)._scrollLeft());
});
function _84(tr){
if(tr.attr("datagrid-row-index")){
return parseInt(tr.attr("datagrid-row-index"));
}else{
return tr.attr("node-id");
}
};
function _82(tr){
return tr.length&&tr.parent().length;
};
};
function _8d(_8e){
var _8f=$.data(_8e,"datagrid");
var _90=_8f.options;
var dc=_8f.dc;
dc.body2.css("overflow-x",_90.fitColumns?"hidden":"");
if(!_90.fitColumns){
return;
}
if(!_8f.leftWidth){
_8f.leftWidth=0;
}
var _91=dc.view2.children("div.datagrid-header");
var _92=0;
var _93;
var _94=_6e(_8e,false);
for(var i=0;i<_94.length;i++){
var col=_6f(_8e,_94[i]);
if(_95(col)){
_92+=col.width;
_93=col;
}
}
if(!_92){
return;
}
if(_93){
_96(_93,-_8f.leftWidth);
}
var _97=_91.children("div.datagrid-header-inner").show();
var _98=_91.width()-_91.find("table").width()-_90.scrollbarSize+_8f.leftWidth;
var _99=_98/_92;
if(!_90.showHeader){
_97.hide();
}
for(var i=0;i<_94.length;i++){
var col=_6f(_8e,_94[i]);
if(_95(col)){
var _9a=parseInt(col.width*_99);
_96(col,_9a);
_98-=_9a;
}
}
_8f.leftWidth=_98;
if(_93){
_96(_93,_8f.leftWidth);
}
_51(_8e);
function _96(col,_9b){
col.width+=_9b;
col.boxWidth+=_9b;
};
function _95(col){
if(!col.hidden&&!col.checkbox&&!col.auto&&!col.fixed){
return true;
}
};
};
function _9c(_9d,_9e){
var _9f=$.data(_9d,"datagrid");
var _a0=_9f.options;
var dc=_9f.dc;
var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-9999px\"></div>").appendTo("body");
if(_9e){
_19(_9e);
if(_a0.fitColumns){
_1e(_9d);
_8d(_9d);
}
}else{
var _a1=false;
var _a2=_6e(_9d,true).concat(_6e(_9d,false));
for(var i=0;i<_a2.length;i++){
var _9e=_a2[i];
var col=_6f(_9d,_9e);
if(col.auto){
_19(_9e);
_a1=true;
}
}
if(_a1&&_a0.fitColumns){
_1e(_9d);
_8d(_9d);
}
}
tmp.remove();
function _19(_a3){
var _a4=dc.view.find("div.datagrid-header td[field=\""+_a3+"\"] div.datagrid-cell");
_a4.css("width","");
var col=$(_9d).datagrid("getColumnOption",_a3);
col.width=undefined;
col.boxWidth=undefined;
col.auto=true;
$(_9d).datagrid("fixColumnSize",_a3);
var _a5=Math.max(_a6("header"),_a6("allbody"),_a6("allfooter"));
_a4._outerWidth(_a5);
col.width=_a5;
col.boxWidth=parseInt(_a4[0].style.width);
_a4.css("width","");
$(_9d).datagrid("fixColumnSize",_a3);
_a0.onResizeColumn.call(_9d,_a3,col.width);
function _a6(_a7){
var _a8=0;
if(_a7=="header"){
_a8=_a9(_a4);
}else{
_a0.finder.getTr(_9d,0,_a7).find("td[field=\""+_a3+"\"] div.datagrid-cell").each(function(){
var w=_a9($(this));
if(_a8<w){
_a8=w;
}
});
}
return _a8;
function _a9(_aa){
return _aa.is(":visible")?_aa._outerWidth():tmp.html(_aa.html())._outerWidth();
};
};
};
};
function _51(_ab,_ac){
var _ad=$.data(_ab,"datagrid");
var _ae=_ad.options;
var dc=_ad.dc;
var _af=dc.view.find("table.datagrid-btable,table.datagrid-ftable");
_af.css("table-layout","fixed");
if(_ac){
fix(_ac);
}else{
var ff=_6e(_ab,true).concat(_6e(_ab,false));
for(var i=0;i<ff.length;i++){
fix(ff[i]);
}
}
_af.css("table-layout","auto");
_b0(_ab);
setTimeout(function(){
_2e(_ab);
_b5(_ab);
},0);
function fix(_b1){
var col=_6f(_ab,_b1);
if(!col.checkbox){
_ad.ss.set("."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto");
}
};
};
function _b0(_b2){
var dc=$.data(_b2,"datagrid").dc;
dc.body1.add(dc.body2).find("td.datagrid-td-merged").each(function(){
var td=$(this);
var _b3=td.attr("colspan")||1;
var _b4=_6f(_b2,td.attr("field")).width;
for(var i=1;i<_b3;i++){
td=td.next();
_b4+=_6f(_b2,td.attr("field")).width+1;
}
$(this).children("div.datagrid-cell")._outerWidth(_b4);
});
};
function _b5(_b6){
var dc=$.data(_b6,"datagrid").dc;
dc.view.find("div.datagrid-editable").each(function(){
var _b7=$(this);
var _b8=_b7.parent().attr("field");
var col=$(_b6).datagrid("getColumnOption",_b8);
_b7._outerWidth(col.width);
var ed=$.data(this,"datagrid.editor");
if(ed.actions.resize){
ed.actions.resize(ed.target,_b7.width());
}
});
};
function _6f(_b9,_ba){
function _bb(_bc){
if(_bc){
for(var i=0;i<_bc.length;i++){
var cc=_bc[i];
for(var j=0;j<cc.length;j++){
var c=cc[j];
if(c.field==_ba){
return c;
}
}
}
}
return null;
};
var _bd=$.data(_b9,"datagrid").options;
var col=_bb(_bd.columns);
if(!col){
col=_bb(_bd.frozenColumns);
}
return col;
};
function _6e(_be,_bf){
var _c0=$.data(_be,"datagrid").options;
var _c1=(_bf==true)?(_c0.frozenColumns||[[]]):_c0.columns;
if(_c1.length==0){
return [];
}
var _c2=[];
function _c3(_c4){
var c=0;
var i=0;
while(true){
if(_c2[i]==undefined){
if(c==_c4){
return i;
}
c++;
}
i++;
}
};
function _c5(r){
var ff=[];
var c=0;
for(var i=0;i<_c1[r].length;i++){
var col=_c1[r][i];
if(col.field){
ff.push([c,col.field]);
}
c+=parseInt(col.colspan||"1");
}
for(var i=0;i<ff.length;i++){
ff[i][0]=_c3(ff[i][0]);
}
for(var i=0;i<ff.length;i++){
var f=ff[i];
_c2[f[0]]=f[1];
}
};
for(var i=0;i<_c1.length;i++){
_c5(i);
}
return _c2;
};
function _c6(_c7,_c8){
var _c9=$.data(_c7,"datagrid");
var _ca=_c9.options;
var dc=_c9.dc;
_c8=_ca.loadFilter.call(_c7,_c8);
_c8.total=parseInt(_c8.total);
_c9.data=_c8;
if(_c8.footer){
_c9.footer=_c8.footer;
}
if(!_ca.remoteSort&&_ca.sortName){
var _cb=_ca.sortName.split(",");
var _cc=_ca.sortOrder.split(",");
_c8.rows.sort(function(r1,r2){
var r=0;
for(var i=0;i<_cb.length;i++){
var sn=_cb[i];
var so=_cc[i];
var col=_6f(_c7,sn);
var _cd=col.sorter||function(a,b){
return a==b?0:(a>b?1:-1);
};
r=_cd(r1[sn],r2[sn])*(so=="asc"?1:-1);
if(r!=0){
return r;
}
}
return r;
});
}
if(_ca.view.onBeforeRender){
_ca.view.onBeforeRender.call(_ca.view,_c7,_c8.rows);
}
_ca.view.render.call(_ca.view,_c7,dc.body2,false);
_ca.view.render.call(_ca.view,_c7,dc.body1,true);
if(_ca.showFooter){
_ca.view.renderFooter.call(_ca.view,_c7,dc.footer2,false);
_ca.view.renderFooter.call(_ca.view,_c7,dc.footer1,true);
}
if(_ca.view.onAfterRender){
_ca.view.onAfterRender.call(_ca.view,_c7);
}
_c9.ss.clean();
_ca.onLoadSuccess.call(_c7,_c8);
var _ce=$(_c7).datagrid("getPager");
if(_ce.length){
var _cf=_ce.pagination("options");
if(_cf.total!=_c8.total){
_ce.pagination("refresh",{total:_c8.total});
if(_ca.pageNumber!=_cf.pageNumber){
_ca.pageNumber=_cf.pageNumber;
_16b(_c7);
}
}
}
_2e(_c7);
dc.body2.triggerHandler("scroll");
_d0();
$(_c7).datagrid("autoSizeColumn");
function _d0(){
if(_ca.idField){
for(var i=0;i<_c8.rows.length;i++){
var row=_c8.rows[i];
if(_d1(_c9.selectedRows,row)){
_ca.finder.getTr(_c7,i).addClass("datagrid-row-selected");
}
if(_d1(_c9.checkedRows,row)){
_ca.finder.getTr(_c7,i).find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
}
}
function _d1(a,r){
for(var i=0;i<a.length;i++){
if(a[i][_ca.idField]==r[_ca.idField]){
a[i]=r;
return true;
}
}
return false;
};
};
};
function _d2(_d3,row){
var _d4=$.data(_d3,"datagrid");
var _d5=_d4.options;
var _d6=_d4.data.rows;
if(typeof row=="object"){
return _2(_d6,row);
}else{
for(var i=0;i<_d6.length;i++){
if(_d6[i][_d5.idField]==row){
return i;
}
}
return -1;
}
};
function _d7(_d8){
var _d9=$.data(_d8,"datagrid");
var _da=_d9.options;
var _db=_d9.data;
if(_da.idField){
return _d9.selectedRows;
}else{
var _dc=[];
_da.finder.getTr(_d8,"","selected",2).each(function(){
var _dd=parseInt($(this).attr("datagrid-row-index"));
_dc.push(_db.rows[_dd]);
});
return _dc;
}
};
function _de(_df){
var _e0=$.data(_df,"datagrid");
var _e1=_e0.options;
if(_e1.idField){
return _e0.checkedRows;
}else{
var _e2=[];
_e1.finder.getTr(_df,"","checked",2).each(function(){
_e2.push(_e1.finder.getRow(_df,$(this)));
});
return _e2;
}
};
function _e3(_e4,_e5){
var _e6=$.data(_e4,"datagrid");
var dc=_e6.dc;
var _e7=_e6.options;
var tr=_e7.finder.getTr(_e4,_e5);
if(tr.length){
if(tr.closest("table").hasClass("datagrid-btable-frozen")){
return;
}
var _e8=dc.view2.children("div.datagrid-header")._outerHeight();
var _e9=dc.body2;
var _ea=_e9.outerHeight(true)-_e9.outerHeight();
var top=tr.position().top-_e8-_ea;
if(top<0){
_e9.scrollTop(_e9.scrollTop()+top);
}else{
if(top+tr._outerHeight()>_e9.height()-18){
_e9.scrollTop(_e9.scrollTop()+top+tr._outerHeight()-_e9.height()+18);
}
}
}
};
function _eb(_ec,_ed){
var _ee=$.data(_ec,"datagrid");
var _ef=_ee.options;
_ef.finder.getTr(_ec,_ee.highlightIndex).removeClass("datagrid-row-over");
_ef.finder.getTr(_ec,_ed).addClass("datagrid-row-over");
_ee.highlightIndex=_ed;
};
function _f0(_f1,_f2,_f3){
var _f4=$.data(_f1,"datagrid");
var dc=_f4.dc;
var _f5=_f4.options;
var _f6=_f4.selectedRows;
if(_f5.singleSelect){
_f7(_f1);
_f6.splice(0,_f6.length);
}
if(!_f3&&_f5.checkOnSelect){
_f8(_f1,_f2,true);
}
var row=_f5.finder.getRow(_f1,_f2);
if(_f5.idField){
_7(_f6,_f5.idField,row);
}
_f5.finder.getTr(_f1,_f2).addClass("datagrid-row-selected");
_f5.onSelect.call(_f1,_f2,row);
_e3(_f1,_f2);
};
function _f9(_fa,_fb,_fc){
var _fd=$.data(_fa,"datagrid");
var dc=_fd.dc;
var _fe=_fd.options;
var _ff=$.data(_fa,"datagrid").selectedRows;
if(!_fc&&_fe.checkOnSelect){
_100(_fa,_fb,true);
}
_fe.finder.getTr(_fa,_fb).removeClass("datagrid-row-selected");
var row=_fe.finder.getRow(_fa,_fb);
if(_fe.idField){
_4(_ff,_fe.idField,row[_fe.idField]);
}
_fe.onUnselect.call(_fa,_fb,row);
};
function _101(_102,_103){
var _104=$.data(_102,"datagrid");
var opts=_104.options;
var rows=_104.data.rows;
var _105=$.data(_102,"datagrid").selectedRows;
if(!_103&&opts.checkOnSelect){
_106(_102,true);
}
opts.finder.getTr(_102,"","allbody").addClass("datagrid-row-selected");
if(opts.idField){
for(var _107=0;_107<rows.length;_107++){
_7(_105,opts.idField,rows[_107]);
}
}
opts.onSelectAll.call(_102,rows);
};
function _f7(_108,_109){
var _10a=$.data(_108,"datagrid");
var opts=_10a.options;
var rows=_10a.data.rows;
var _10b=$.data(_108,"datagrid").selectedRows;
if(!_109&&opts.checkOnSelect){
_10c(_108,true);
}
opts.finder.getTr(_108,"","selected").removeClass("datagrid-row-selected");
if(opts.idField){
for(var _10d=0;_10d<rows.length;_10d++){
_4(_10b,opts.idField,rows[_10d][opts.idField]);
}
}
opts.onUnselectAll.call(_108,rows);
};
function _f8(_10e,_10f,_110){
var _111=$.data(_10e,"datagrid");
var opts=_111.options;
if(!_110&&opts.selectOnCheck){
_f0(_10e,_10f,true);
}
var tr=opts.finder.getTr(_10e,_10f).addClass("datagrid-row-checked");
var ck=tr.find("div.datagrid-cell-check input[type=checkbox]");
ck._propAttr("checked",true);
tr=opts.finder.getTr(_10e,"","checked",2);
if(tr.length==_111.data.rows.length){
var dc=_111.dc;
var _112=dc.header1.add(dc.header2);
_112.find("input[type=checkbox]")._propAttr("checked",true);
}
var row=opts.finder.getRow(_10e,_10f);
if(opts.idField){
_7(_111.checkedRows,opts.idField,row);
}
opts.onCheck.call(_10e,_10f,row);
};
function _100(_113,_114,_115){
var _116=$.data(_113,"datagrid");
var opts=_116.options;
if(!_115&&opts.selectOnCheck){
_f9(_113,_114,true);
}
var tr=opts.finder.getTr(_113,_114).removeClass("datagrid-row-checked");
var ck=tr.find("div.datagrid-cell-check input[type=checkbox]");
ck._propAttr("checked",false);
var dc=_116.dc;
var _117=dc.header1.add(dc.header2);
_117.find("input[type=checkbox]")._propAttr("checked",false);
var row=opts.finder.getRow(_113,_114);
if(opts.idField){
_4(_116.checkedRows,opts.idField,row[opts.idField]);
}
opts.onUncheck.call(_113,_114,row);
};
function _106(_118,_119){
var _11a=$.data(_118,"datagrid");
var opts=_11a.options;
var rows=_11a.data.rows;
if(!_119&&opts.selectOnCheck){
_101(_118,true);
}
var dc=_11a.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_118,"","allbody").addClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",true);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_7(_11a.checkedRows,opts.idField,rows[i]);
}
}
opts.onCheckAll.call(_118,rows);
};
function _10c(_11b,_11c){
var _11d=$.data(_11b,"datagrid");
var opts=_11d.options;
var rows=_11d.data.rows;
if(!_11c&&opts.selectOnCheck){
_f7(_11b,true);
}
var dc=_11d.dc;
var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
var bck=opts.finder.getTr(_11b,"","checked").removeClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
hck.add(bck)._propAttr("checked",false);
if(opts.idField){
for(var i=0;i<rows.length;i++){
_4(_11d.checkedRows,opts.idField,rows[i][opts.idField]);
}
}
opts.onUncheckAll.call(_11b,rows);
};
function _11e(_11f,_120){
var opts=$.data(_11f,"datagrid").options;
var tr=opts.finder.getTr(_11f,_120);
var row=opts.finder.getRow(_11f,_120);
if(tr.hasClass("datagrid-row-editing")){
return;
}
if(opts.onBeforeEdit.call(_11f,_120,row)==false){
return;
}
tr.addClass("datagrid-row-editing");
_121(_11f,_120);
_b5(_11f);
tr.find("div.datagrid-editable").each(function(){
var _122=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
ed.actions.setValue(ed.target,row[_122]);
});
_123(_11f,_120);
};
function _124(_125,_126,_127){
var opts=$.data(_125,"datagrid").options;
var _128=$.data(_125,"datagrid").updatedRows;
var _129=$.data(_125,"datagrid").insertedRows;
var tr=opts.finder.getTr(_125,_126);
var row=opts.finder.getRow(_125,_126);
if(!tr.hasClass("datagrid-row-editing")){
return;
}
if(!_127){
if(!_123(_125,_126)){
return;
}
var _12a=false;
var _12b={};
tr.find("div.datagrid-editable").each(function(){
var _12c=$(this).parent().attr("field");
var ed=$.data(this,"datagrid.editor");
var _12d=ed.actions.getValue(ed.target);
if(row[_12c]!=_12d){
row[_12c]=_12d;
_12a=true;
_12b[_12c]=_12d;
}
});
if(_12a){
if(_2(_129,row)==-1){
if(_2(_128,row)==-1){
_128.push(row);
}
}
}
}
tr.removeClass("datagrid-row-editing");
_12e(_125,_126);
$(_125).datagrid("refreshRow",_126);
if(!_127){
opts.onAfterEdit.call(_125,_126,row,_12b);
}else{
opts.onCancelEdit.call(_125,_126,row);
}
};
function _12f(_130,_131){
var opts=$.data(_130,"datagrid").options;
var tr=opts.finder.getTr(_130,_131);
var _132=[];
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
_132.push(ed);
}
});
return _132;
};
function _133(_134,_135){
var _136=_12f(_134,_135.index!=undefined?_135.index:_135.id);
for(var i=0;i<_136.length;i++){
if(_136[i].field==_135.field){
return _136[i];
}
}
return null;
};
function _121(_137,_138){
var opts=$.data(_137,"datagrid").options;
var tr=opts.finder.getTr(_137,_138);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-cell");
var _139=$(this).attr("field");
var col=_6f(_137,_139);
if(col&&col.editor){
var _13a,_13b;
if(typeof col.editor=="string"){
_13a=col.editor;
}else{
_13a=col.editor.type;
_13b=col.editor.options;
}
var _13c=opts.editors[_13a];
if(_13c){
var _13d=cell.html();
var _13e=cell._outerWidth();
cell.addClass("datagrid-editable");
cell._outerWidth(_13e);
cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
cell.children("table").bind("click dblclick contextmenu",function(e){
e.stopPropagation();
});
$.data(cell[0],"datagrid.editor",{actions:_13c,target:_13c.init(cell.find("td"),_13b),field:_139,type:_13a,oldHtml:_13d});
}
}
});
_2e(_137,_138,true);
};
function _12e(_13f,_140){
var opts=$.data(_13f,"datagrid").options;
var tr=opts.finder.getTr(_13f,_140);
tr.children("td").each(function(){
var cell=$(this).find("div.datagrid-editable");
if(cell.length){
var ed=$.data(cell[0],"datagrid.editor");
if(ed.actions.destroy){
ed.actions.destroy(ed.target);
}
cell.html(ed.oldHtml);
$.removeData(cell[0],"datagrid.editor");
cell.removeClass("datagrid-editable");
cell.css("width","");
}
});
};
function _123(_141,_142){
var tr=$.data(_141,"datagrid").options.finder.getTr(_141,_142);
if(!tr.hasClass("datagrid-row-editing")){
return true;
}
var vbox=tr.find(".validatebox-text");
vbox.validatebox("validate");
vbox.trigger("mouseleave");
var _143=tr.find(".validatebox-invalid");
return _143.length==0;
};
function _144(_145,_146){
var _147=$.data(_145,"datagrid").insertedRows;
var _148=$.data(_145,"datagrid").deletedRows;
var _149=$.data(_145,"datagrid").updatedRows;
if(!_146){
var rows=[];
rows=rows.concat(_147);
rows=rows.concat(_148);
rows=rows.concat(_149);
return rows;
}else{
if(_146=="inserted"){
return _147;
}else{
if(_146=="deleted"){
return _148;
}else{
if(_146=="updated"){
return _149;
}
}
}
}
return [];
};
function _14a(_14b,_14c){
var _14d=$.data(_14b,"datagrid");
var opts=_14d.options;
var data=_14d.data;
var _14e=_14d.insertedRows;
var _14f=_14d.deletedRows;
$(_14b).datagrid("cancelEdit",_14c);
var row=data.rows[_14c];
if(_2(_14e,row)>=0){
_4(_14e,row);
}else{
_14f.push(row);
}
_4(_14d.selectedRows,opts.idField,data.rows[_14c][opts.idField]);
_4(_14d.checkedRows,opts.idField,data.rows[_14c][opts.idField]);
opts.view.deleteRow.call(opts.view,_14b,_14c);
if(opts.height=="auto"){
_2e(_14b);
}
$(_14b).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _150(_151,_152){
var data=$.data(_151,"datagrid").data;
var view=$.data(_151,"datagrid").options.view;
var _153=$.data(_151,"datagrid").insertedRows;
view.insertRow.call(view,_151,_152.index,_152.row);
_153.push(_152.row);
$(_151).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _154(_155,row){
var data=$.data(_155,"datagrid").data;
var view=$.data(_155,"datagrid").options.view;
var _156=$.data(_155,"datagrid").insertedRows;
view.insertRow.call(view,_155,null,row);
_156.push(row);
$(_155).datagrid("getPager").pagination("refresh",{total:data.total});
};
function _157(_158){
var _159=$.data(_158,"datagrid");
var data=_159.data;
var rows=data.rows;
var _15a=[];
for(var i=0;i<rows.length;i++){
_15a.push($.extend({},rows[i]));
}
_159.originalRows=_15a;
_159.updatedRows=[];
_159.insertedRows=[];
_159.deletedRows=[];
};
function _15b(_15c){
var data=$.data(_15c,"datagrid").data;
var ok=true;
for(var i=0,len=data.rows.length;i<len;i++){
if(_123(_15c,i)){
_124(_15c,i,false);
}else{
ok=false;
}
}
if(ok){
_157(_15c);
}
};
function _15d(_15e){
var _15f=$.data(_15e,"datagrid");
var opts=_15f.options;
var _160=_15f.originalRows;
var _161=_15f.insertedRows;
var _162=_15f.deletedRows;
var _163=_15f.selectedRows;
var _164=_15f.checkedRows;
var data=_15f.data;
function _165(a){
var ids=[];
for(var i=0;i<a.length;i++){
ids.push(a[i][opts.idField]);
}
return ids;
};
function _166(ids,_167){
for(var i=0;i<ids.length;i++){
var _168=_d2(_15e,ids[i]);
if(_168>=0){
(_167=="s"?_f0:_f8)(_15e,_168,true);
}
}
};
for(var i=0;i<data.rows.length;i++){
_124(_15e,i,true);
}
var _169=_165(_163);
var _16a=_165(_164);
_163.splice(0,_163.length);
_164.splice(0,_164.length);
data.total+=_162.length-_161.length;
data.rows=_160;
_c6(_15e,data);
_166(_169,"s");
_166(_16a,"c");
_157(_15e);
};
function _16b(_16c,_16d){
var opts=$.data(_16c,"datagrid").options;
if(_16d){
opts.queryParams=_16d;
}
var _16e=$.extend({},opts.queryParams);
if(opts.pagination){
$.extend(_16e,{page:opts.pageNumber,rows:opts.pageSize});
}
if(opts.sortName){
$.extend(_16e,{sort:opts.sortName,order:opts.sortOrder});
}
if(opts.onBeforeLoad.call(_16c,_16e)==false){
return;
}
$(_16c).datagrid("loading");
setTimeout(function(){
_16f();
},0);
function _16f(){
var _170=opts.loader.call(_16c,_16e,function(data){
setTimeout(function(){
$(_16c).datagrid("loaded");
},0);
_c6(_16c,data);
setTimeout(function(){
_157(_16c);
},0);
},function(){
setTimeout(function(){
$(_16c).datagrid("loaded");
},0);
opts.onLoadError.apply(_16c,arguments);
});
if(_170==false){
$(_16c).datagrid("loaded");
}
};
};
function _171(_172,_173){
var opts=$.data(_172,"datagrid").options;
_173.rowspan=_173.rowspan||1;
_173.colspan=_173.colspan||1;
if(_173.rowspan==1&&_173.colspan==1){
return;
}
var tr=opts.finder.getTr(_172,(_173.index!=undefined?_173.index:_173.id));
if(!tr.length){
return;
}
var row=opts.finder.getRow(_172,tr);
var _174=row[_173.field];
var td=tr.find("td[field=\""+_173.field+"\"]");
td.attr("rowspan",_173.rowspan).attr("colspan",_173.colspan);
td.addClass("datagrid-td-merged");
for(var i=1;i<_173.colspan;i++){
td=td.next();
td.hide();
row[td.attr("field")]=_174;
}
for(var i=1;i<_173.rowspan;i++){
tr=tr.next();
if(!tr.length){
break;
}
var row=opts.finder.getRow(_172,tr);
var td=tr.find("td[field=\""+_173.field+"\"]").hide();
row[td.attr("field")]=_174;
for(var j=1;j<_173.colspan;j++){
td=td.next();
td.hide();
row[td.attr("field")]=_174;
}
}
_b0(_172);
};
$.fn.datagrid=function(_175,_176){
if(typeof _175=="string"){
return $.fn.datagrid.methods[_175](this,_176);
}
_175=_175||{};
return this.each(function(){
var _177=$.data(this,"datagrid");
var opts;
if(_177){
opts=$.extend(_177.options,_175);
_177.options=opts;
}else{
opts=$.extend({},$.extend({},$.fn.datagrid.defaults,{queryParams:{}}),$.fn.datagrid.parseOptions(this),_175);
$(this).css("width","").css("height","");
var _178=_47(this,opts.rownumbers);
if(!opts.columns){
opts.columns=_178.columns;
}
if(!opts.frozenColumns){
opts.frozenColumns=_178.frozenColumns;
}
opts.columns=$.extend(true,[],opts.columns);
opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
opts.view=$.extend({},opts.view);
$.data(this,"datagrid",{options:opts,panel:_178.panel,dc:_178.dc,ss:_178.ss,selectedRows:[],checkedRows:[],data:{total:0,rows:[]},originalRows:[],updatedRows:[],insertedRows:[],deletedRows:[]});
}
_56(this);
if(opts.data){
_c6(this,opts.data);
_157(this);
}else{
var data=$.fn.datagrid.parseData(this);
if(data.total>0){
_c6(this,data);
_157(this);
}
}
_19(this);
_16b(this);
_70(this);
});
};
var _179={text:{init:function(_17a,_17b){
var _17c=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_17a);
return _17c;
},getValue:function(_17d){
return $(_17d).val();
},setValue:function(_17e,_17f){
$(_17e).val(_17f);
},resize:function(_180,_181){
$(_180)._outerWidth(_181)._outerHeight(22);
}},textarea:{init:function(_182,_183){
var _184=$("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(_182);
return _184;
},getValue:function(_185){
return $(_185).val();
},setValue:function(_186,_187){
$(_186).val(_187);
},resize:function(_188,_189){
$(_188)._outerWidth(_189);
}},checkbox:{init:function(_18a,_18b){
var _18c=$("<input type=\"checkbox\">").appendTo(_18a);
_18c.val(_18b.on);
_18c.attr("offval",_18b.off);
return _18c;
},getValue:function(_18d){
if($(_18d).is(":checked")){
return $(_18d).val();
}else{
return $(_18d).attr("offval");
}
},setValue:function(_18e,_18f){
var _190=false;
if($(_18e).val()==_18f){
_190=true;
}
$(_18e)._propAttr("checked",_190);
}},numberbox:{init:function(_191,_192){
var _193=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_191);
_193.numberbox(_192);
return _193;
},destroy:function(_194){
$(_194).numberbox("destroy");
},getValue:function(_195){
$(_195).blur();
return $(_195).numberbox("getValue");
},setValue:function(_196,_197){
$(_196).numberbox("setValue",_197);
},resize:function(_198,_199){
$(_198)._outerWidth(_199)._outerHeight(22);
}},validatebox:{init:function(_19a,_19b){
var _19c=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(_19a);
_19c.validatebox(_19b);
return _19c;
},destroy:function(_19d){
$(_19d).validatebox("destroy");
},getValue:function(_19e){
return $(_19e).val();
},setValue:function(_19f,_1a0){
$(_19f).val(_1a0);
},resize:function(_1a1,_1a2){
$(_1a1)._outerWidth(_1a2)._outerHeight(22);
}},datebox:{init:function(_1a3,_1a4){
var _1a5=$("<input type=\"text\">").appendTo(_1a3);
_1a5.datebox(_1a4);
return _1a5;
},destroy:function(_1a6){
$(_1a6).datebox("destroy");
},getValue:function(_1a7){
return $(_1a7).datebox("getValue");
},setValue:function(_1a8,_1a9){
$(_1a8).datebox("setValue",_1a9);
},resize:function(_1aa,_1ab){
$(_1aa).datebox("resize",_1ab);
}},combobox:{init:function(_1ac,_1ad){
var _1ae=$("<input type=\"text\">").appendTo(_1ac);
_1ae.combobox(_1ad||{});
return _1ae;
},destroy:function(_1af){
$(_1af).combobox("destroy");
},getValue:function(_1b0){
var opts=$(_1b0).combobox("options");
if(opts.multiple){
return $(_1b0).combobox("getValues").join(opts.separator);
}else{
return $(_1b0).combobox("getValue");
}
},setValue:function(_1b1,_1b2){
var opts=$(_1b1).combobox("options");
if(opts.multiple){
if(_1b2){
$(_1b1).combobox("setValues",_1b2.split(opts.separator));
}else{
$(_1b1).combobox("clear");
}
}else{
$(_1b1).combobox("setValue",_1b2);
}
},resize:function(_1b3,_1b4){
$(_1b3).combobox("resize",_1b4);
}},combotree:{init:function(_1b5,_1b6){
var _1b7=$("<input type=\"text\">").appendTo(_1b5);
_1b7.combotree(_1b6);
return _1b7;
},destroy:function(_1b8){
$(_1b8).combotree("destroy");
},getValue:function(_1b9){
return $(_1b9).combotree("getValue");
},setValue:function(_1ba,_1bb){
$(_1ba).combotree("setValue",_1bb);
},resize:function(_1bc,_1bd){
$(_1bc).combotree("resize",_1bd);
}}};
$.fn.datagrid.methods={options:function(jq){
var _1be=$.data(jq[0],"datagrid").options;
var _1bf=$.data(jq[0],"datagrid").panel.panel("options");
var opts=$.extend(_1be,{width:_1bf.width,height:_1bf.height,closed:_1bf.closed,collapsed:_1bf.collapsed,minimized:_1bf.minimized,maximized:_1bf.maximized});
return opts;
},getPanel:function(jq){
return $.data(jq[0],"datagrid").panel;
},getPager:function(jq){
return $.data(jq[0],"datagrid").panel.children("div.datagrid-pager");
},getColumnFields:function(jq,_1c0){
return _6e(jq[0],_1c0);
},getColumnOption:function(jq,_1c1){
return _6f(jq[0],_1c1);
},resize:function(jq,_1c2){
return jq.each(function(){
_19(this,_1c2);
});
},load:function(jq,_1c3){
return jq.each(function(){
var opts=$(this).datagrid("options");
opts.pageNumber=1;
var _1c4=$(this).datagrid("getPager");
_1c4.pagination("refresh",{pageNumber:1});
_16b(this,_1c3);
});
},reload:function(jq,_1c5){
return jq.each(function(){
_16b(this,_1c5);
});
},reloadFooter:function(jq,_1c6){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
var dc=$.data(this,"datagrid").dc;
if(_1c6){
$.data(this,"datagrid").footer=_1c6;
}
if(opts.showFooter){
opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
if(opts.view.onAfterRender){
opts.view.onAfterRender.call(opts.view,this);
}
$(this).datagrid("fixRowHeight");
}
});
},loading:function(jq){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
$(this).datagrid("getPager").pagination("loading");
if(opts.loadMsg){
var _1c7=$(this).datagrid("getPanel");
if(!_1c7.children("div.datagrid-mask").length){
$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(_1c7);
var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(_1c7);
msg._outerHeight(40);
msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
}
}
});
},loaded:function(jq){
return jq.each(function(){
$(this).datagrid("getPager").pagination("loaded");
var _1c8=$(this).datagrid("getPanel");
_1c8.children("div.datagrid-mask-msg").remove();
_1c8.children("div.datagrid-mask").remove();
});
},fitColumns:function(jq){
return jq.each(function(){
_8d(this);
});
},fixColumnSize:function(jq,_1c9){
return jq.each(function(){
_51(this,_1c9);
});
},fixRowHeight:function(jq,_1ca){
return jq.each(function(){
_2e(this,_1ca);
});
},freezeRow:function(jq,_1cb){
return jq.each(function(){
_3f(this,_1cb);
});
},autoSizeColumn:function(jq,_1cc){
return jq.each(function(){
_9c(this,_1cc);
});
},loadData:function(jq,data){
return jq.each(function(){
_c6(this,data);
_157(this);
});
},getData:function(jq){
return $.data(jq[0],"datagrid").data;
},getRows:function(jq){
return $.data(jq[0],"datagrid").data.rows;
},getFooterRows:function(jq){
return $.data(jq[0],"datagrid").footer;
},getRowIndex:function(jq,id){
return _d2(jq[0],id);
},getChecked:function(jq){
return _de(jq[0]);
},getSelected:function(jq){
var rows=_d7(jq[0]);
return rows.length>0?rows[0]:null;
},getSelections:function(jq){
return _d7(jq[0]);
},clearSelections:function(jq){
return jq.each(function(){
var _1cd=$.data(this,"datagrid").selectedRows;
_1cd.splice(0,_1cd.length);
_f7(this);
});
},clearChecked:function(jq){
return jq.each(function(){
var _1ce=$.data(this,"datagrid").checkedRows;
_1ce.splice(0,_1ce.length);
_10c(this);
});
},scrollTo:function(jq,_1cf){
return jq.each(function(){
_e3(this,_1cf);
});
},highlightRow:function(jq,_1d0){
return jq.each(function(){
_eb(this,_1d0);
_e3(this,_1d0);
});
},selectAll:function(jq){
return jq.each(function(){
_101(this);
});
},unselectAll:function(jq){
return jq.each(function(){
_f7(this);
});
},selectRow:function(jq,_1d1){
return jq.each(function(){
_f0(this,_1d1);
});
},selectRecord:function(jq,id){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
if(opts.idField){
var _1d2=_d2(this,id);
if(_1d2>=0){
$(this).datagrid("selectRow",_1d2);
}
}
});
},unselectRow:function(jq,_1d3){
return jq.each(function(){
_f9(this,_1d3);
});
},checkRow:function(jq,_1d4){
return jq.each(function(){
_f8(this,_1d4);
});
},uncheckRow:function(jq,_1d5){
return jq.each(function(){
_100(this,_1d5);
});
},checkAll:function(jq){
return jq.each(function(){
_106(this);
});
},uncheckAll:function(jq){
return jq.each(function(){
_10c(this);
});
},beginEdit:function(jq,_1d6){
return jq.each(function(){
_11e(this,_1d6);
});
},endEdit:function(jq,_1d7){
return jq.each(function(){
_124(this,_1d7,false);
});
},cancelEdit:function(jq,_1d8){
return jq.each(function(){
_124(this,_1d8,true);
});
},getEditors:function(jq,_1d9){
return _12f(jq[0],_1d9);
},getEditor:function(jq,_1da){
return _133(jq[0],_1da);
},refreshRow:function(jq,_1db){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.refreshRow.call(opts.view,this,_1db);
});
},validateRow:function(jq,_1dc){
return _123(jq[0],_1dc);
},updateRow:function(jq,_1dd){
return jq.each(function(){
var opts=$.data(this,"datagrid").options;
opts.view.updateRow.call(opts.view,this,_1dd.index,_1dd.row);
});
},appendRow:function(jq,row){
return jq.each(function(){
_154(this,row);
});
},insertRow:function(jq,_1de){
return jq.each(function(){
_150(this,_1de);
});
},deleteRow:function(jq,_1df){
return jq.each(function(){
_14a(this,_1df);
});
},getChanges:function(jq,_1e0){
return _144(jq[0],_1e0);
},acceptChanges:function(jq){
return jq.each(function(){
_15b(this);
});
},rejectChanges:function(jq){
return jq.each(function(){
_15d(this);
});
},mergeCells:function(jq,_1e1){
return jq.each(function(){
_171(this,_1e1);
});
},showColumn:function(jq,_1e2){
return jq.each(function(){
var _1e3=$(this).datagrid("getPanel");
_1e3.find("td[field=\""+_1e2+"\"]").show();
$(this).datagrid("getColumnOption",_1e2).hidden=false;
$(this).datagrid("fitColumns");
});
},hideColumn:function(jq,_1e4){
return jq.each(function(){
var _1e5=$(this).datagrid("getPanel");
_1e5.find("td[field=\""+_1e4+"\"]").hide();
$(this).datagrid("getColumnOption",_1e4).hidden=true;
$(this).datagrid("fitColumns");
});
}};
$.fn.datagrid.parseOptions=function(_1e6){
var t=$(_1e6);
return $.extend({},$.fn.panel.parseOptions(_1e6),$.parser.parseOptions(_1e6,["url","toolbar","idField","sortName","sortOrder","pagePosition","resizeHandle",{fitColumns:"boolean",autoRowHeight:"boolean",striped:"boolean",nowrap:"boolean"},{rownumbers:"boolean",singleSelect:"boolean",checkOnSelect:"boolean",selectOnCheck:"boolean"},{pagination:"boolean",pageSize:"number",pageNumber:"number"},{multiSort:"boolean",remoteSort:"boolean",showHeader:"boolean",showFooter:"boolean"},{scrollbarSize:"number"}]),{pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined),loadMsg:(t.attr("loadMsg")!=undefined?t.attr("loadMsg"):undefined),rowStyler:(t.attr("rowStyler")?eval(t.attr("rowStyler")):undefined)});
};
$.fn.datagrid.parseData=function(_1e7){
var t=$(_1e7);
var data={total:0,rows:[]};
var _1e8=t.datagrid("getColumnFields",true).concat(t.datagrid("getColumnFields",false));
t.find("tbody tr").each(function(){
data.total++;
var row={};
$.extend(row,$.parser.parseOptions(this,["iconCls","state"]));
for(var i=0;i<_1e8.length;i++){
row[_1e8[i]]=$(this).find("td:eq("+i+")").html();
}
data.rows.push(row);
});
return data;
};
var _1e9={render:function(_1ea,_1eb,_1ec){
var _1ed=$.data(_1ea,"datagrid");
var opts=_1ed.options;
var rows=_1ed.data.rows;
var _1ee=$(_1ea).datagrid("getColumnFields",_1ec);
if(_1ec){
if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
return;
}
}
var _1ef=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
var css=opts.rowStyler?opts.rowStyler.call(_1ea,i,rows[i]):"";
var _1f0="";
var _1f1="";
if(typeof css=="string"){
_1f1=css;
}else{
if(css){
_1f0=css["class"]||"";
_1f1=css["style"]||"";
}
}
var cls="class=\"datagrid-row "+(i%2&&opts.striped?"datagrid-row-alt ":" ")+_1f0+"\"";
var _1f2=_1f1?"style=\""+_1f1+"\"":"";
var _1f3=_1ed.rowIdPrefix+"-"+(_1ec?1:2)+"-"+i;
_1ef.push("<tr id=\""+_1f3+"\" datagrid-row-index=\""+i+"\" "+cls+" "+_1f2+">");
_1ef.push(this.renderRow.call(this,_1ea,_1ee,_1ec,i,rows[i]));
_1ef.push("</tr>");
}
_1ef.push("</tbody></table>");
$(_1eb).html(_1ef.join(""));
},renderFooter:function(_1f4,_1f5,_1f6){
var opts=$.data(_1f4,"datagrid").options;
var rows=$.data(_1f4,"datagrid").footer||[];
var _1f7=$(_1f4).datagrid("getColumnFields",_1f6);
var _1f8=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
for(var i=0;i<rows.length;i++){
_1f8.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+i+"\">");
_1f8.push(this.renderRow.call(this,_1f4,_1f7,_1f6,i,rows[i]));
_1f8.push("</tr>");
}
_1f8.push("</tbody></table>");
$(_1f5).html(_1f8.join(""));
},renderRow:function(_1f9,_1fa,_1fb,_1fc,_1fd){
var opts=$.data(_1f9,"datagrid").options;
var cc=[];
if(_1fb&&opts.rownumbers){
var _1fe=_1fc+1;
if(opts.pagination){
_1fe+=(opts.pageNumber-1)*opts.pageSize;
}
cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"+_1fe+"</div></td>");
}
for(var i=0;i<_1fa.length;i++){
var _1ff=_1fa[i];
var col=$(_1f9).datagrid("getColumnOption",_1ff);
if(col){
var _200=_1fd[_1ff];
var css=col.styler?(col.styler(_200,_1fd,_1fc)||""):"";
var _201="";
var _202="";
if(typeof css=="string"){
_202=css;
}else{
if(cc){
_201=css["class"]||"";
_202=css["style"]||"";
}
}
var cls=_201?"class=\""+_201+"\"":"";
var _203=col.hidden?"style=\"display:none;"+_202+"\"":(_202?"style=\""+_202+"\"":"");
cc.push("<td field=\""+_1ff+"\" "+cls+" "+_203+">");
if(col.checkbox){
var _203="";
}else{
var _203=_202;
if(col.align){
_203+=";text-align:"+col.align+";";
}
if(!opts.nowrap){
_203+=";white-space:normal;height:auto;";
}else{
if(opts.autoRowHeight){
_203+=";height:auto;";
}
}
}
cc.push("<div style=\""+_203+"\" ");
cc.push(col.checkbox?"class=\"datagrid-cell-check\"":"class=\"datagrid-cell "+col.cellClass+"\"");
cc.push(">");
if(col.checkbox){
cc.push("<input type=\"checkbox\" name=\""+_1ff+"\" value=\""+(_200!=undefined?_200:"")+"\">");
}else{
if(col.formatter){
cc.push(col.formatter(_200,_1fd,_1fc));
}else{
cc.push(_200);
}
}
cc.push("</div>");
cc.push("</td>");
}
}
return cc.join("");
},refreshRow:function(_204,_205){
this.updateRow.call(this,_204,_205,{});
},updateRow:function(_206,_207,row){
var opts=$.data(_206,"datagrid").options;
var rows=$(_206).datagrid("getRows");
$.extend(rows[_207],row);
var css=opts.rowStyler?opts.rowStyler.call(_206,_207,rows[_207]):"";
var _208="";
var _209="";
if(typeof css=="string"){
_209=css;
}else{
if(css){
_208=css["class"]||"";
_209=css["style"]||"";
}
}
var _208="datagrid-row "+(_207%2&&opts.striped?"datagrid-row-alt ":" ")+_208;
function _20a(_20b){
var _20c=$(_206).datagrid("getColumnFields",_20b);
var tr=opts.finder.getTr(_206,_207,"body",(_20b?1:2));
var _20d=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
tr.html(this.renderRow.call(this,_206,_20c,_20b,_207,rows[_207]));
tr.attr("style",_209).attr("class",tr.hasClass("datagrid-row-selected")?_208+" datagrid-row-selected":_208);
if(_20d){
tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
}
};
_20a.call(this,true);
_20a.call(this,false);
$(_206).datagrid("fixRowHeight",_207);
},insertRow:function(_20e,_20f,row){
var _210=$.data(_20e,"datagrid");
var opts=_210.options;
var dc=_210.dc;
var data=_210.data;
if(_20f==undefined||_20f==null){
_20f=data.rows.length;
}
if(_20f>data.rows.length){
_20f=data.rows.length;
}
function _211(_212){
var _213=_212?1:2;
for(var i=data.rows.length-1;i>=_20f;i--){
var tr=opts.finder.getTr(_20e,i,"body",_213);
tr.attr("datagrid-row-index",i+1);
tr.attr("id",_210.rowIdPrefix+"-"+_213+"-"+(i+1));
if(_212&&opts.rownumbers){
var _214=i+2;
if(opts.pagination){
_214+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_214);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i+1)%2?"datagrid-row-alt":"");
}
}
};
function _215(_216){
var _217=_216?1:2;
var _218=$(_20e).datagrid("getColumnFields",_216);
var _219=_210.rowIdPrefix+"-"+_217+"-"+_20f;
var tr="<tr id=\""+_219+"\" class=\"datagrid-row\" datagrid-row-index=\""+_20f+"\"></tr>";
if(_20f>=data.rows.length){
if(data.rows.length){
opts.finder.getTr(_20e,"","last",_217).after(tr);
}else{
var cc=_216?dc.body1:dc.body2;
cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+tr+"</tbody></table>");
}
}else{
opts.finder.getTr(_20e,_20f+1,"body",_217).before(tr);
}
};
_211.call(this,true);
_211.call(this,false);
_215.call(this,true);
_215.call(this,false);
data.total+=1;
data.rows.splice(_20f,0,row);
this.refreshRow.call(this,_20e,_20f);
},deleteRow:function(_21a,_21b){
var _21c=$.data(_21a,"datagrid");
var opts=_21c.options;
var data=_21c.data;
function _21d(_21e){
var _21f=_21e?1:2;
for(var i=_21b+1;i<data.rows.length;i++){
var tr=opts.finder.getTr(_21a,i,"body",_21f);
tr.attr("datagrid-row-index",i-1);
tr.attr("id",_21c.rowIdPrefix+"-"+_21f+"-"+(i-1));
if(_21e&&opts.rownumbers){
var _220=i;
if(opts.pagination){
_220+=(opts.pageNumber-1)*opts.pageSize;
}
tr.find("div.datagrid-cell-rownumber").html(_220);
}
if(opts.striped){
tr.removeClass("datagrid-row-alt").addClass((i-1)%2?"datagrid-row-alt":"");
}
}
};
opts.finder.getTr(_21a,_21b).remove();
_21d.call(this,true);
_21d.call(this,false);
data.total-=1;
data.rows.splice(_21b,1);
},onBeforeRender:function(_221,rows){
},onAfterRender:function(_222){
var opts=$.data(_222,"datagrid").options;
if(opts.showFooter){
var _223=$(_222).datagrid("getPanel").find("div.datagrid-footer");
_223.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
}
}};
$.fn.datagrid.defaults=$.extend({},$.fn.panel.defaults,{frozenColumns:undefined,columns:undefined,fitColumns:false,resizeHandle:"right",autoRowHeight:true,toolbar:null,striped:false,method:"post",nowrap:true,idField:null,url:null,data:null,loadMsg:"Processing, please wait ...",rownumbers:false,singleSelect:false,selectOnCheck:true,checkOnSelect:true,pagination:false,pagePosition:"bottom",pageNumber:1,pageSize:10,pageList:[10,20,30,40,50],queryParams:{},sortName:null,sortOrder:"asc",multiSort:false,remoteSort:true,showHeader:true,showFooter:false,scrollbarSize:18,rowStyler:function(_224,_225){
},loader:function(_226,_227,_228){
var opts=$(this).datagrid("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_226,dataType:"json",success:function(data){
_227(data);
},error:function(){
_228.apply(this,arguments);
}});
},loadFilter:function(data){
if(typeof data.length=="number"&&typeof data.splice=="function"){
return {total:data.length,rows:data};
}else{
return data;
}
},editors:_179,finder:{getTr:function(_229,_22a,type,_22b){
type=type||"body";
_22b=_22b||0;
var _22c=$.data(_229,"datagrid");
var dc=_22c.dc;
var opts=_22c.options;
if(_22b==0){
var tr1=opts.finder.getTr(_229,_22a,type,1);
var tr2=opts.finder.getTr(_229,_22a,type,2);
return tr1.add(tr2);
}else{
if(type=="body"){
var tr=$("#"+_22c.rowIdPrefix+"-"+_22b+"-"+_22a);
if(!tr.length){
tr=(_22b==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index="+_22a+"]");
}
return tr;
}else{
if(type=="footer"){
return (_22b==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index="+_22a+"]");
}else{
if(type=="selected"){
return (_22b==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-selected");
}else{
if(type=="highlight"){
return (_22b==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-over");
}else{
if(type=="checked"){
return (_22b==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-checked");
}else{
if(type=="last"){
return (_22b==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
}else{
if(type=="allbody"){
return (_22b==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]");
}else{
if(type=="allfooter"){
return (_22b==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
}
}
}
}
}
}
}
}
}
},getRow:function(_22d,p){
var _22e=(typeof p=="object")?p.attr("datagrid-row-index"):p;
return $.data(_22d,"datagrid").data.rows[parseInt(_22e)];
}},view:_1e9,onBeforeLoad:function(_22f){
},onLoadSuccess:function(){
},onLoadError:function(){
},onClickRow:function(_230,_231){
},onDblClickRow:function(_232,_233){
},onClickCell:function(_234,_235,_236){
},onDblClickCell:function(_237,_238,_239){
},onSortColumn:function(sort,_23a){
},onResizeColumn:function(_23b,_23c){
},onSelect:function(_23d,_23e){
},onUnselect:function(_23f,_240){
},onSelectAll:function(rows){
},onUnselectAll:function(rows){
},onCheck:function(_241,_242){
},onUncheck:function(_243,_244){
},onCheckAll:function(rows){
},onUncheckAll:function(rows){
},onBeforeEdit:function(_245,_246){
},onAfterEdit:function(_247,_248,_249){
},onCancelEdit:function(_24a,_24b){
},onHeaderContextMenu:function(e,_24c){
},onRowContextMenu:function(e,_24d,_24e){
}});
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_pagination.js
*/
function ITC_LoadCSS(url){
	if(document.createStyleSheet){
		//IE8-10
		document.createStyleSheet(url);	
	}
	else{
		//IE11和chrome
		//移除所有组件库加上的节点
		$("head").find("link").each(function(){
			var _this = $(this);
			if(_this.attr("itc_tbl")){
				_this.remove();
			}
		})
		$('<link />').attr('rel', 'stylesheet').attr('href', url).attr('itc_tbl',true).appendTo("head");
	}
}
(function($){
	$.fn.extend({
		/*
			此翻页器依赖EasyUi的Pagination，仅提供样式
		*/
		ITCUI_Pagination:function(action,arg,opts){
			var _this = $(this);
			var _pagination = $(_this.datagrid('getPager'));
			var options = _pagination.pagination("options")
			var PG_STEP = 2;
			var NO_SEL_TEXT = "";//可以写"请选择xxxx"

			bindMenuPagerEvents = function(){
				var p = $(arg);
				//绑定菜单翻页器的事件
				p.find(".itcui_pagination_menu li").click(function(e){
					var __this = $(this);
					var num = __this.attr("turnto");
					turnTo(__this.parents(".itcui_pagination_container"),num);
					//TODO:ie8下手工消失 bug!
					
				});
				p.find(".itcui_pagination_psize li").click(function(e){
					var pgSize = $(this).children("a").html().replace(/<.*>/,"").replace("每页","").replace("条","");
					var container = $(this).parents(".itcui_pagination_container");
					var targetPager = container.data("targetPager");
					//TODO:多pagination的异常
					if(!targetPager){
						return;
					}
					targetPager.pagination({"pageSize":pgSize}).pagination("select",1);
					_this = container.data('ptrGrid');
					targetDiv = container.data('targetDiv');
					_this.ITCUI_Pagination("create",targetDiv,container.data("opts"));
					container.data("onChangePageSize")(pgSize);
				});
				p.find(".itcui_pagination_style li").click(function(e){
					var __this = $(this);
					var style = __this.attr("tblStyle");
					var container = __this.parents(".itcui_pagination_container");
					__this.parent().find(".dropdown-selected").removeClass("dropdown-selected").addClass("dropdown-unselected");
					__this.find(".dropdown-unselected").removeClass("dropdown-unselected").addClass("dropdown-selected");
					container.data("onChangeStyle")(style);
				});
			}

			turnTo = function(itcPagination,pageNumber){
				var style = "TIMSS";
				var pagination = itcPagination.data("targetPager");
				pagination.pagination("select",pageNumber);
				adjustButtons(itcPagination);
				//刷新当前页数
				var wrap = itcPagination.find(".itcui_pg_selector_wrap");
				wrap.find(".currpage").html(pageNumber);
				//刷新翻页菜单
				var opts = pagination.pagination("options");
				var currPage = parseInt(opts.pageNumber);
				var maxPage = Math.ceil(opts.total/opts.pageSize) || 1;//没有任何数据时也显示1页 2014.3.4
				if(style!="TIMSS"){
					//标准翻页风格 只显示几页加首位链接
					var pStart = -1;
					var pEnd = -1;
					if(maxPage<=1 + 2*PG_STEP){
						pStart = 1;
						pEnd = maxPage;
					}
					else if(currPage-PG_STEP>1&&currPage+PG_STEP<maxPage){
						//两头都不着边界 取p-2 p-1 p p+1 p+2
						pStart = currPage - PG_STEP;
						pEnd = currPage + PG_STEP;
					}
					else if(currPage-PG_STEP<=1){
						//左边不够长
						pStart = 1;
						pEnd = 1 + 2*PG_STEP;
					}
					else if(currPage+PG_STEP>=maxPage){
						//右边不够长
						pEnd = maxPage;
						pStart = maxPage - 1 - 2*PG_STEP;
					}
					var liHtml = "";
					for(var i=pStart;i<=pEnd;i++){
						liHtml += "<li turnto=" + i + "><a class='menuitem'>" + i +"/" + maxPage + "</a></li>";
					}
					liHtml += "<li class='divider'></li>";
					liHtml += "<li turnto=1><a class='menuitem'>首页</a></li>";
					liHtml += "<li turnto=" + maxPage + "><a class='menuitem'>末页</a></li>";
					setTimeout('$("div .itcui_pagination_menu").html(\"' + liHtml + '\");bindMenuPagerEvents();',200);				
				}				
			};



			createPagination = function(){
				$(arg).addClass("itcui_pagination_container");
				var btnHtml = "";
				var pgSizeList = options.pageList;
				//设置菜单
				btnHtml += "<div class='dropdown bbox' style='float:right'><span data-toggle='dropdown' class='itcui_pg_btn itcui_pg_setting'></span>";
				btnHtml += "<ul class='dropdown-menu pull-right' role='menu'>";
				if(opts&&opts.defStyle&&opts.styles){
					//表格样式部分
					btnHtml += "<li class='dropdown-submenu pull-left'><a>显示设置</a><ul class='dropdown-menu itcui_pagination_style'>";
					for(var i=0;i<opts.styles.length;i++){
						var style = opts.styles[i];
						btnHtml += "<li tblStyle='" + style.id + "'><a class='menuitem'>" 
						if(style.id==opts.defStyle){
							btnHtml += "<span class='dropdown-selected'></span>";
						}
						else{
							btnHtml += "<span class='dropdown-unselected'></span>";	
						}
						btnHtml += style.title + "</a></li>";
					}
					$(arg).data("onChangeStyle",opts.onChangeStyle || function(){});
					$(arg).data("onChangePageSize",opts.onChangePageSize || function(){});
					$(arg).data("opts",opts);
					btnHtml += "</ul></li>"	
				}
				btnHtml += "<li class='dropdown-submenu pull-left'><a>分页设置</a><ul class='dropdown-menu itcui_pagination_psize'>";
				for(var i=0;i<pgSizeList.length;i++){
					btnHtml += "<li><a class='menuitem'>" 
					if(pgSizeList[i]==options.pageSize){
						btnHtml += "<span class='dropdown-selected'></span>";
					}
					else{
						btnHtml += "<span class='dropdown-unselected'></span>";	
					}
					btnHtml += "每页" + pgSizeList[i] + "条</a></li>";
				}
				btnHtml += "</ul></li>"
				
				btnHtml += "</ul></div>";
				//前后翻页按钮
				btnHtml += "<span class='itcui_pg_btn itcui_pg_next'></span>"
				btnHtml += "<span class='itcui_pg_btn itcui_pg_prev'></span>";				
				//菜单式翻页器
				var totalPage = Math.ceil(options.total/options.pageSize) || 1;
				btnHtml += "<div class='dropdown bbox' style='float:right'><div class='itcui_pg_selector_wrap' data-toggle='dropdown'><span class='currpage'>";
				btnHtml += options.pageNumber + "</span><span class='itcui_pagination_divider'>/</span><span>" + totalPage;
				btnHtml += "</span><span class='itcui_pg_selector_icon'></span></div>";
				btnHtml += "<ul class='itcui_pagination_menu dropdown-menu' role='menu' style='overflow-y:auto;overflow-x:hidden;max-height:208px'>";
				var pEnd = totalPage>8?8:totalPage;
					for(var i=1;i<=totalPage;i++){
					btnHtml += "<li turnto=" + i + "><a class='menuitem'>" + i +"<span class='itcui_pagination_divider'>/</span>" + totalPage + "</a></li>";
				}
				//btnHtml += "<li class='divider'></li>";
				//btnHtml += "<li turnto=1><a class='menuitem'>首页</a></li>";
				//btnHtml += "<li turnto=" + totalPage + "><a class='menuitem'>末页</a></li>";
				btnHtml += "</ul></div>";
				$(arg).html(btnHtml);
				_pagination.css("display","none");
				bindMenuPagerEvents();				
			}

			adjustButtons = function(tgtITCPager){				
				targetITCPager = tgtITCPager==null?$(arg):tgtITCPager;
				var opt = tgtITCPager==null?options:targetITCPager.data("targetPager").pagination("options");
				if(opt.pageNumber>1){
					targetITCPager.find(".itcui_pg_prev_disable").removeClass("itcui_pg_prev_disable").addClass("itcui_pg_prev");
				}
				else{
					targetITCPager.find(".itcui_pg_prev").addClass("itcui_pg_prev_disable").removeClass("itcui_pg_prev");
				}

				if(opt.pageNumber*opt.pageSize<opt.total){
					targetITCPager.find(".itcui_pg_next_disable").removeClass("itcui_pg_next_disable").addClass("itcui_pg_next");
				}
				else{
					targetITCPager.find(".itcui_pg_next").addClass("itcui_pg_next_disable").removeClass("itcui_pg_next");
				}
			}

			addEvents = function(){				
				var pgBtn = $(arg).find(".itcui_pg_btn");
				$(arg).data("targetPager",_pagination);
				$(arg).data("targetDiv",arg);
				$(arg).data('ptrGrid',_this);
				pgBtn.click(function(e){
					var __this = $(this);
					if(!__this.hasClass("itcui_pg_setting")){						
						var targetPager = __this.parent().data("targetPager");	
						var opt = targetPager.pagination("options");
						if(__this.hasClass("itcui_pg_prev")){
							turnTo($(arg),parseInt(opt.pageNumber) - 1);
						}
						if(__this.hasClass("itcui_pg_next")){
							turnTo($(arg),parseInt(opt.pageNumber) + 1);
						}
					}
				});
			}

			if(action=="create"){
				createPagination();
				adjustButtons();
				addEvents();
			}
		}
	});
})(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\thirdparty\js\icheck.js
*/
/*!
 * iCheck v1.0.1, http://git.io/arlzeA
 * ===================================
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 * (c) 2013 Damir Sultanov, http://fronteed.com
 * MIT Licensed
 */

(function($) {

  // Cached vars
  var _iCheck = 'iCheck',
    _iCheckHelper = _iCheck + '-helper',
    _checkbox = 'checkbox',
    _radio = 'radio',
    _checked = 'checked',
    _unchecked = 'un' + _checked,
    _disabled = 'disabled',
    _determinate = 'determinate',
    _indeterminate = 'in' + _determinate,
    _update = 'update',
    _type = 'type',
    _click = 'click',
    _touch = 'touchbegin.i touchend.i',
    _add = 'addClass',
    _remove = 'removeClass',
    _callback = 'trigger',
    _label = 'label',
    _cursor = 'cursor',
    _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

  // Plugin init
  $.fn[_iCheck] = function(options, fire) {

    // Walker
    var handle = 'input[type="' + _checkbox + '"], input[type="' + _radio + '"]',
      stack = $(),
      walker = function(object) {
        object.each(function() {
          var self = $(this);

          if (self.is(handle)) {
            stack = stack.add(self);
          } else {
            stack = stack.add(self.find(handle));
          };
        });
      };

    // Check if we should operate with some method
    if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

      // Normalize method's name
      options = options.toLowerCase();

      // Find checkboxes and radio buttons
      walker(this);

      return stack.each(function() {
        var self = $(this);

        if (options == 'destroy') {
          tidy(self, 'ifDestroyed');
        } else {
          operate(self, true, options);
        };

        // Fire method's callback
        if ($.isFunction(fire)) {
          fire();
        };
      });

    // Customization
    } else if (typeof options == 'object' || !options) {

      // Check if any options were passed
      var settings = $.extend({
          checkedClass: _checked,
          disabledClass: _disabled,
          indeterminateClass: _indeterminate,
          labelHover: true,
          aria: false
        }, options),

        selector = settings.handle,
        hoverClass = settings.hoverClass || 'hover',
        focusClass = settings.focusClass || 'focus',
        activeClass = settings.activeClass || 'active',
        labelHover = !!settings.labelHover,
        labelHoverClass = settings.labelHoverClass || 'hover',

        // Setup clickable area
        area = ('' + settings.increaseArea).replace('%', '') | 0;

      // Selector limit
      if (selector == _checkbox || selector == _radio) {
        handle = 'input[type="' + selector + '"]';
      };

      // Clickable area limit
      if (area < -50) {
        area = -50;
      };

      // Walk around the selector
      walker(this);

      return stack.each(function() {
        var self = $(this);

        // If already customized
        tidy(self);

        var node = this,
          id = node.id,

          // Layer styles
          offset = -area + '%',
          size = 100 + (area * 2) + '%',
          layer = {
            position: 'absolute',
            top: offset,
            left: offset,
            display: 'block',
            width: size,
            height: size,
            margin: 0,
            padding: 0,
            background: '#fff',
            border: 0,
            opacity: 0
          },

          // Choose how to hide input
          hide = _mobile ? {
            position: 'absolute',
            visibility: 'hidden'
          } : area ? layer : {
            position: 'absolute',
            opacity: 0
          },

          // Get proper class
          className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,

          // Find assigned labels
          label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

          // Check ARIA option
          aria = !!settings.aria,

          // Set ARIA placeholder
          ariaID = _iCheck + '-' + Math.random().toString(36).substr(2,6),

          // Parent & helper
          parent = '<div class="' + className + '" ' + (aria ? 'role="' + node[_type] + '" ' : ''),
          helper;

        // Set ARIA "labelledby"
        if (aria) {
          label.each(function() {
            parent += 'aria-labelledby="';

            if (this.id) {
              parent += this.id;
            } else {
              this.id = ariaID;
              parent += ariaID;
            }

            parent += '"';
          });
        };

        // Wrap input
        parent = self.wrap(parent + '/>')[_callback]('ifCreated').parent().append(settings.insert);

        // Layer addition
        helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

        // Finalize customization
        self.data(_iCheck, {o: settings, s: self.attr('style')}).css(hide);
        !!settings.inheritClass && parent[_add](node.className || '');
        !!settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
        parent.css('position') == 'static' && parent.css('position', 'relative');
        operate(self, true, _update);

        // Label events
        if (label.length) {
          label.on(_click + '.i mouseover.i mouseout.i ' + _touch, function(event) {
            var type = event[_type],
              item = $(this);

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == _click) {
                if ($(event.target).is('a')) {
                  return;
                }
                operate(self, false, true);

              // Hover state
              } else if (labelHover) {

                // mouseout|touchend
                if (/ut|nd/.test(type)) {
                  parent[_remove](hoverClass);
                  item[_remove](labelHoverClass);
                } else {
                  parent[_add](hoverClass);
                  item[_add](labelHoverClass);
                };
              };

              if (_mobile) {
                event.stopPropagation();
              } else {
                return false;
              };
            };
          });
        };

        // Input events
        self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function(event) {
          var type = event[_type],
            key = event.keyCode;

          // Click
          if (type == _click) {
            return false;

          // Keydown
          } else if (type == 'keydown' && key == 32) {
            if (!(node[_type] == _radio && node[_checked])) {
              if (node[_checked]) {
                off(self, _checked);
              } else {
                on(self, _checked);
              };
            };

            return false;

          // Keyup
          } else if (type == 'keyup' && node[_type] == _radio) {
            !node[_checked] && on(self, _checked);

          // Focus/blur
          } else if (/us|ur/.test(type)) {
            parent[type == 'blur' ? _remove : _add](focusClass);
          };
        });

        // Helper events
        helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function(event) {
          var type = event[_type],

            // mousedown|mouseup
            toggle = /wn|up/.test(type) ? activeClass : hoverClass;

          // Do nothing if input is disabled
          if (!node[_disabled]) {

            // Click
            if (type == _click) {
              operate(self, false, true);

            // Active and hover states
            } else {

              // State is on
              if (/wn|er|in/.test(type)) {

                // mousedown|mouseover|touchbegin
                parent[_add](toggle);

              // State is off
              } else {
                parent[_remove](toggle + ' ' + activeClass);
              };

              // Label hover
              if (label.length && labelHover && toggle == hoverClass) {

                // mouseout|touchend
                label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
              };
            };

            if (_mobile) {
              event.stopPropagation();
            } else {
              return false;
            };
          };
        });
      });
    } else {
      return this;
    };
  };

  // Do something with inputs
  function operate(input, direct, method) {
    var node = input[0],
      state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
      active = method == _update ? {
        checked: node[_checked],
        disabled: node[_disabled],
        indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
      } : node[state];

    // Check, disable or indeterminate
    if (/^(ch|di|in)/.test(method) && !active) {
      on(input, state);

    // Uncheck, enable or determinate
    } else if (/^(un|en|de)/.test(method) && active) {
      off(input, state);

    // Update
    } else if (method == _update) {

      // Handle states
      for (var state in active) {
        if (active[state]) {
          on(input, state, true);
        } else {
          off(input, state, true);
        };
      };

    } else if (!direct || method == 'toggle') {

      // Helper or label was clicked
      if (!direct) {
        input[_callback]('ifClicked');
      };

      // Toggle checked state
      if (active) {
        if (node[_type] !== _radio) {
          off(input, state);
        };
      } else {
        on(input, state);
      };
    };
  };

  // Add checked, disabled or indeterminate state
  function on(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== true) {

      // Toggle assigned radio buttons
      if (!keep && state == _checked && node[_type] == _radio && node.name) {
        var form = input.closest('form'),
          inputs = 'input[name="' + node.name + '"]';

        inputs = form.length ? form.find(inputs) : $(inputs);

        inputs.each(function() {
          if (this !== node && $(this).data(_iCheck)) {
            off($(this), state);
          };
        });
      };

      // Indeterminate state
      if (indeterminate) {

        // Add indeterminate state
        node[state] = true;

        // Remove checked state
        if (node[_checked]) {
          off(input, _checked, 'force');
        };

      // Checked or disabled state
      } else {

        // Add checked or disabled state
        if (!keep) {
          node[state] = true;
        };

        // Remove indeterminate state
        if (checked && node[_indeterminate]) {
          off(input, _indeterminate, false);
        };
      };

      // Trigger callbacks
      callbacks(input, checked, state, keep);
    };

    // Add proper cursor
    if (node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'default');
    };

    // Add state class
    parent[_add](specific || option(input, state) || '');

    // Set ARIA attribute
    disabled ? parent.attr('aria-disabled', 'true') : parent.attr('aria-checked', indeterminate ? 'mixed' : 'true');

    // Remove regular state class
    parent[_remove](regular || option(input, callback) || '');
  };

  // Remove checked, disabled or indeterminate state
  function off(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== false) {

      // Toggle state
      if (indeterminate || !keep || keep == 'force') {
        node[state] = false;
      };

      // Trigger callbacks
      callbacks(input, checked, callback, keep);
    };

    // Add proper cursor
    if (!node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
    };

    // Remove state class
    parent[_remove](specific || option(input, state) || '');

    // Set ARIA attribute
    disabled ? parent.attr('aria-disabled', 'false') : parent.attr('aria-checked', 'false');

    // Add regular state class
    parent[_add](regular || option(input, callback) || '');
  };

  // Remove all traces
  function tidy(input, callback) {
    if (input.data(_iCheck)) {

      // Remove everything except input
      input.parent().html(input.attr('style', input.data(_iCheck).s || ''));

      // Callback
      if (callback) {
        input[_callback](callback);
      };

      // Unbind events
      input.off('.i').unwrap();
      $(_label + '[for="' + input[0].id + '"]').add(input.closest(_label)).off('.i');
    };
  };

  // Get some option
  function option(input, state, regular) {
    if (input.data(_iCheck)) {
      return input.data(_iCheck).o[state + (regular ? '' : 'Class')];
    };
  };

  // Capitalize some string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Executable handlers
  function callbacks(input, checked, callback, keep) {
    if (!keep) {
      if (checked) {
        input[_callback]('ifToggled');
      };

      input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
    };
  };
})(window.jQuery || window.Zepto);

/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_combobox.js
*/
var itcui = itcui || {};
itcui.combo_displayed = false;
(function($){
	$.fn.extend({ 
		ITCUI_ComboBox:function(action,opts){
			//_this指针用于函数调用
			//__this用于事件中参数传递
			//这两个都是指向原始select的指针
			var displayItemCount = 6;
			var multiSelect = false;
			var maxStrLength = 12;
			var width = 150;
			var _this = $(this);

			//getVal=true时返回显示值 false返回实际值（option的value）
			getMultiSelected = function(getVal,__this){
				var mul = __this.data("multiSelectedVal");
				var rStr = "";
				var i = 0;				
				__this.children("option").each(function(){
					var sel = false;
					var itemValue = !getVal?$(this).attr("value"):$(this).html();
					var initChecked = $(this).attr("multichecked");
					if(mul == null){
						if(initChecked){
							sel = true;
						}
					}
					else{
						if(mul[i]){
							sel = true;
						}
					}
					if(sel){
						rStr += itemValue + " ";
					}
					i++;
				});
				return rStr;
			};

			initComboBox = function(){				
				width = parseInt(_this.css("width"));
				var maxLen = _this.attr("maxlength") || maxStrLength;
				_this.data("maxLen",maxLen);
				//获取初始化已选择的内容
				var comboLabel = _this.children("option:selected").text();
				if(_this.attr("multiselect")){
					multiSelect = true;
					comboLabel = getMultiSelected(true,_this);
					if(ITC_Len(comboLabel)>maxLen){
						comboLabel = ITC_Substr(comboLabel,0,maxLen) + "...";
					}
				}
				_this.data("multiSelect", multiSelect);
				_this.data("dataMapping", []);
				_this.data("multiSelectedVal", null);
				_this.data("comboWidth",width);
				var fStr = "";
				if(_this.css("float")){
					fStr = "float:" + _this.css("float");
				}
				var comboHtml = "<div class='itcui_combo' style='width:" + width + "px;" + fStr + "'>";
				comboHtml += "<span class='itcui_combo_text'>" + comboLabel + "</span><span class='itcui_combo_arrow_wrap'><b class='itcui_combo_arrow'></b></span>";
				comboHtml += "</div>";
				//删除之前生成的combobox
				if(_this.prev("div").hasClass("itcui_combo")){
					_this.prev("div").remove();
				}
				_this.css("display","none");
				_this.before(comboHtml);
			};

			

			updateComboText = function(__this){
				var mul = __this.data("multiSelect");
				var maxLen = __this.data('maxLen');
				var txt = "";
				if(mul){
					txt = getMultiSelected(true,__this);
					if(ITC_Len(txt)>maxLen){
						txt = ITC_Substr(txt,0,maxLen) + "...";
					}
				}
				else{
					txt = __this.find(":selected").first().html();					
				}
				__this.prev(".itcui_combo").children(".itcui_combo_text").html(txt);
			};

			initMultiSelectMapping = function(){
				var multiSelectedVal = {};
				var multiMapping = {};
				var i = 0;		
				_this.children("option").each(function(){
					var itemValue = $(this).attr("value");
					var initChecked = $(this).attr("multichecked");
					multiMapping[itemValue] = i;
					if(initChecked){
						multiSelectedVal[i] = true;
					}
					else{
						multiSelectedVal[i] = false;	
					}
					i++;
				});
				_this.data("multiSelectedVal",multiSelectedVal);
				_this.data("multiMapping",multiMapping);
			};
			
			display = function(__this){				
				//生成元素项
				var listHtml = "";
				//必须先数出来有多少项才能确定宽度
				var itemCount = 0;
				var cbWidth = parseInt(__this.data("comboWidth"));
				itemWidth = cbWidth<100?100:cbWidth;
				__this.children("option").each(function(){
					itemCount ++;
				});
				if(itemCount>displayItemCount){
					itemWidth -= 18;//留出一个滚动条的宽度
				}				
				var wrapHeight = 25 * (itemCount>displayItemCount?displayItemCount:itemCount) + 16;
				listHtml += "<div id='itc_combo_wrap' class='itcui_dropdown_menu' style='padding-top:6px;padding-bottom:6px;height:" + wrapHeight + "px;min-width:" + cbWidth+ "px;";
				if(itemCount>displayItemCount){
					listHtml += "overflow-y:scroll";
				}					
				listHtml += "'>";
				var multiSelect = __this.data("multiSelect");
				var multiSelectedVal = __this.data("multiSelectedVal");
				var dataMapping = __this.data("dataMapping");				
				var i = 0;
				__this.children("option").each(function(){
					var itemName = $(this).html();
					var itemValue = $(this).attr("value");					
					if(multiSelect==false){
						dataMapping.push([itemValue,itemName]);
						listHtml += "<div id='itcui_combo_item_" + i + "' class='itcui_dropdown_item' style='width:" + itemWidth + "px'>";
						listHtml += "<span class='itcui_dropdown_text'>" + itemName + "</span>";
						listHtml += "</div>";
					}
					else{
						listHtml += "<div id='itcui_combo_item_" + i + "' class='itcui_dropdown_item' style='width:" + itemWidth + "px'>";
						if(!multiSelectedVal[i]){
							listHtml += '<input class="itcui_dropdown_checkbox" type="checkbox" id="itcui_combo_chkbox_' + i + '">';
						}
						else{
							listHtml += '<input class="itcui_dropdown_checkbox" type="checkbox" id="itcui_combo_chkbox_' + i + '" checked>';
						}
						listHtml += '<label for="itcui_combo_chkbox_' + i + '">' + itemName + '</label>';
						listHtml += "</div>";
					}
					i++;
				});
				listHtml += "</div>";
				__this.data("dataMapping",dataMapping);
				__this.after(listHtml);
			};
			

			doSingleSelect = function(__this,sVal){
				__this.val(sVal);
				//这里需要更改原始select的值 否则显示文本和post会出错
				__this.children("[selected]").removeAttr("selected");
				__this.children("[value='" + sVal + "']").attr("selected","selected");
				updateComboText(__this);
			};

			doMultiSelect = function(__this,sVal){
				var multiSelectedVal = __this.data("multiSelectedVal");
				var multiMapping = __this.data("multiMapping");
				for(var k in sVal){
					var n = multiMapping[k];
					if(sVal[k]){
						multiSelectedVal[n] = true;
					}
					else{
						multiSelectedVal[n] = false;
					}
				}
				__this.data("multiSelectedVal",multiSelectedVal);
				updateComboText(__this);
			};

			changeSelect = function(){
				var mul = _this.data("multiSelect");
				if(mul){
					doMultiSelect(_this,opts);
				}
				else{
					doSingleSelect(_this,opts);
				}
			};

			addSingleChoiceEvent = function(){
				$("#itc_combo_wrap .itcui_dropdown_item").click(function(e){
					var __this = $(this).parent("#itc_combo_wrap").prev("select");
					var dataMapping = __this.data("dataMapping");
					var id = this.id;
					var num = parseInt(id.substr(17));
					doSingleSelect(__this,dataMapping[num][0]);
					$("#itc_combo_wrap").remove();	
					itcui.combo_displayed = false;				
				});
			};

			addMultiChoiceEvent = function(){
				$("#itc_combo_wrap input").iCheck({
				    checkboxClass: 'icheckbox_flat-blue',
				    radioClass: 'iradio_flat-blue'
				});
				$("#itc_combo_wrap .itcui_dropdown_item").click(function(e){
					e.stopPropagation();
					//修改选项卡状态
					var id = this.id;
					var num = parseInt(id.substr(17));
					$("#itcui_combo_chkbox_" + num).iCheck('toggle');					
				});
				$('#itc_combo_wrap .itcui_dropdown_checkbox').on('ifChanged', function(event){
					var id = this.id;
					var num = parseInt(id.substr(19));					
					var __this = $(this).parents("#itc_combo_wrap").prev("select");
					var multiSelectedVal = __this.data("multiSelectedVal");
					multiSelectedVal[num] = !multiSelectedVal[num];
					__this.data("multiSelectedVal", multiSelectedVal);
					updateComboText(__this);
				});
			};

			addEvents = function(){
				_this.prev(".itcui_combo").click(function(e){
					e.stopPropagation();
					var inputPtr = $(this).next("select");
					var nofix = inputPtr.attr("nofix");
					if(itcui.combo_displayed==false){
						display(inputPtr);
						if(multiSelect){
							addMultiChoiceEvent(inputPtr);
						}
						else{
							addSingleChoiceEvent(inputPtr);
						}
						//重新调整下拉框的位置
						if(!nofix){
							var pos = ITC_GetAbsPos(this);
							$("#itc_combo_wrap").css({
								"left":pos.left,
								"top":pos.top + parseInt($(this).css("height"))
							});
						}
						itcui.combo_displayed = true;
						
					}
					else{
						$("#itc_combo_wrap").remove();
						itcui.combo_displayed = false;
					}
				});
				$("body").click(function(e){
					if(itcui.combo_displayed==true){
						$("#itc_combo_wrap").remove();
						itcui.combo_displayed = false;
					}
				});
			};

			
			if(!action){
				initComboBox();
				if(multiSelect==true){
					initMultiSelectMapping();
				}
				addEvents();
			}
			else if(action=="getSelected"){
				return getMultiSelected(false,_this);
			}
			else if(action=="select"){
				changeSelect();
			}
		}
	});
})(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.tree.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
function _1(_2){
var _3=$(_2);
_3.addClass("tree");
return _3;
};
function _4(_5){
var _6=$.data(_5,"tree").options;
$(_5).unbind().bind("mouseover",function(e){
var tt=$(e.target);
var _7=tt.closest("div.tree-node");
if(!_7.length){
return;
}
_7.addClass("tree-node-hover");
if(tt.hasClass("tree-hit")){
if(tt.hasClass("tree-expanded")){
tt.addClass("tree-expanded-hover");
}else{
tt.addClass("tree-collapsed-hover");
}
}
e.stopPropagation();
}).bind("mouseout",function(e){
var tt=$(e.target);
var _8=tt.closest("div.tree-node");
if(!_8.length){
return;
}
_8.removeClass("tree-node-hover");
if(tt.hasClass("tree-hit")){
if(tt.hasClass("tree-expanded")){
tt.removeClass("tree-expanded-hover");
}else{
tt.removeClass("tree-collapsed-hover");
}
}
e.stopPropagation();
}).bind("click",function(e){
var tt=$(e.target);
var _9=tt.closest("div.tree-node");
if(!_9.length){
return;
}
if(tt.hasClass("tree-hit")){
_7e(_5,_9[0]);
return false;
}else{
if(tt.hasClass("tree-checkbox")){
_32(_5,_9[0],!tt.hasClass("tree-checkbox1"));
return false;
}else{
_d6(_5,_9[0]);
_6.onClick.call(_5,_c(_5,_9[0]));
}
}
e.stopPropagation();
}).bind("dblclick",function(e){
var _a=$(e.target).closest("div.tree-node");
if(!_a.length){
return;
}
_d6(_5,_a[0]);
_6.onDblClick.call(_5,_c(_5,_a[0]));
e.stopPropagation();
}).bind("contextmenu",function(e){
var _b=$(e.target).closest("div.tree-node");
if(!_b.length){
return;
}
_6.onContextMenu.call(_5,e,_c(_5,_b[0]));
e.stopPropagation();
});
};
function _d(_e){
var _f=$.data(_e,"tree").options;
_f.dnd=false;
var _10=$(_e).find("div.tree-node");
_10.draggable("disable");
_10.css("cursor","pointer");
};
function _11(_12){
var _13=$.data(_12,"tree");
var _14=_13.options;
var _15=_13.tree;
_13.disabledNodes=[];
_14.dnd=true;
_15.find("div.tree-node").draggable({disabled:false,revert:true,cursor:"pointer",proxy:function(_16){
var p=$("<div class=\"tree-node-proxy\"></div>").appendTo("body");
p.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"+$(_16).find(".tree-title").html());
p.hide();
return p;
},deltaX:15,deltaY:15,onBeforeDrag:function(e){
if(_14.onBeforeDrag.call(_12,_c(_12,this))==false){
return false;
}
if($(e.target).hasClass("tree-hit")||$(e.target).hasClass("tree-checkbox")){
return false;
}
if(e.which!=1){
return false;
}
$(this).next("ul").find("div.tree-node").droppable({accept:"no-accept"});
var _17=$(this).find("span.tree-indent");
if(_17.length){
e.data.offsetWidth-=_17.length*_17.width();
}
},onStartDrag:function(){
$(this).draggable("proxy").css({left:-10000,top:-10000});
_14.onStartDrag.call(_12,_c(_12,this));
var _18=_c(_12,this);
if(_18.id==undefined){
_18.id="easyui_tree_node_id_temp";
_54(_12,_18);
}
_13.draggingNodeId=_18.id;
},onDrag:function(e){
var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
var d=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
if(d>3){
$(this).draggable("proxy").show();
}
this.pageY=e.pageY;
},onStopDrag:function(){
$(this).next("ul").find("div.tree-node").droppable({accept:"div.tree-node"});
for(var i=0;i<_13.disabledNodes.length;i++){
$(_13.disabledNodes[i]).droppable("enable");
}
_13.disabledNodes=[];
var _19=_c9(_12,_13.draggingNodeId);
if(_19&&_19.id=="easyui_tree_node_id_temp"){
_19.id="";
_54(_12,_19);
}
_14.onStopDrag.call(_12,_19);
}}).droppable({accept:"div.tree-node",onDragEnter:function(e,_1a){
if(_14.onDragEnter.call(_12,this,_c(_12,_1a))==false){
_1b(_1a,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_13.disabledNodes.push(this);
}
},onDragOver:function(e,_1c){
if($(this).droppable("options").disabled){
return;
}
var _1d=_1c.pageY;
var top=$(this).offset().top;
var _1e=top+$(this).outerHeight();
_1b(_1c,true);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
if(_1d>top+(_1e-top)/2){
if(_1e-_1d<5){
$(this).addClass("tree-node-bottom");
}else{
$(this).addClass("tree-node-append");
}
}else{
if(_1d-top<5){
$(this).addClass("tree-node-top");
}else{
$(this).addClass("tree-node-append");
}
}
if(_14.onDragOver.call(_12,this,_c(_12,_1c))==false){
_1b(_1c,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
$(this).droppable("disable");
_13.disabledNodes.push(this);
}
},onDragLeave:function(e,_1f){
_1b(_1f,false);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
_14.onDragLeave.call(_12,this,_c(_12,_1f));
},onDrop:function(e,_20){
var _21=this;
var _22,_23;
if($(this).hasClass("tree-node-append")){
_22=_24;
_23="append";
}else{
_22=_25;
_23=$(this).hasClass("tree-node-top")?"top":"bottom";
}
if(_14.onBeforeDrop.call(_12,_21,_c2(_12,_20),_23)==false){
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
return;
}
_22(_20,_21,_23);
$(this).removeClass("tree-node-append tree-node-top tree-node-bottom");
}});
function _1b(_26,_27){
var _28=$(_26).draggable("proxy").find("span.tree-dnd-icon");
_28.removeClass("tree-dnd-yes tree-dnd-no").addClass(_27?"tree-dnd-yes":"tree-dnd-no");
};
function _24(_29,_2a){
if(_c(_12,_2a).state=="closed"){
_72(_12,_2a,function(){
_2b();
});
}else{
_2b();
}
function _2b(){
var _2c=$(_12).tree("pop",_29);
$(_12).tree("append",{parent:_2a,data:[_2c]});
_14.onDrop.call(_12,_2a,_2c,"append");
};
};
function _25(_2d,_2e,_2f){
var _30={};
if(_2f=="top"){
_30.before=_2e;
}else{
_30.after=_2e;
}
var _31=$(_12).tree("pop",_2d);
_30.data=_31;
$(_12).tree("insert",_30);
_14.onDrop.call(_12,_2e,_31,_2f);
};
};
function _32(_33,_34,_35){
var _36=$.data(_33,"tree").options;
if(!_36.checkbox){
return;
}
var _37=_c(_33,_34);
if(_36.onBeforeCheck.call(_33,_37,_35)==false){
return;
}
var _38=$(_34);
var ck=_38.find(".tree-checkbox");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
if(_35){
ck.addClass("tree-checkbox1");
}else{
ck.addClass("tree-checkbox0");
}
if(_36.cascadeCheck){
_39(_38);
_3a(_38);
}
_36.onCheck.call(_33,_37,_35);
function _3a(_3b){
var _3c=_3b.next().find(".tree-checkbox");
_3c.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
if(_3b.find(".tree-checkbox").hasClass("tree-checkbox1")){
_3c.addClass("tree-checkbox1");
}else{
_3c.addClass("tree-checkbox0");
}
};
function _39(_3d){
var _3e=_89(_33,_3d[0]);
if(_3e){
var ck=$(_3e.target).find(".tree-checkbox");
ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
if(_3f(_3d)){
ck.addClass("tree-checkbox1");
}else{
if(_40(_3d)){
ck.addClass("tree-checkbox0");
}else{
ck.addClass("tree-checkbox2");
}
}
_39($(_3e.target));
}
function _3f(n){
var ck=n.find(".tree-checkbox");
if(ck.hasClass("tree-checkbox0")||ck.hasClass("tree-checkbox2")){
return false;
}
var b=true;
n.parent().siblings().each(function(){
if(!$(this).children("div.tree-node").children(".tree-checkbox").hasClass("tree-checkbox1")){
b=false;
}
});
return b;
};
function _40(n){
var ck=n.find(".tree-checkbox");
if(ck.hasClass("tree-checkbox1")||ck.hasClass("tree-checkbox2")){
return false;
}
var b=true;
n.parent().siblings().each(function(){
if(!$(this).children("div.tree-node").children(".tree-checkbox").hasClass("tree-checkbox0")){
b=false;
}
});
return b;
};
};
};
function _41(_42,_43){
var _44=$.data(_42,"tree").options;
if(!_44.checkbox){
return;
}
var _45=$(_43);
if(_46(_42,_43)){
var ck=_45.find(".tree-checkbox");
if(ck.length){
if(ck.hasClass("tree-checkbox1")){
_32(_42,_43,true);
}else{
_32(_42,_43,false);
}
}else{
if(_44.onlyLeafCheck){
$("<span class=\"tree-checkbox tree-checkbox0\"></span>").insertBefore(_45.find(".tree-title"));
}
}
}else{
var ck=_45.find(".tree-checkbox");
if(_44.onlyLeafCheck){
ck.remove();
}else{
if(ck.hasClass("tree-checkbox1")){
_32(_42,_43,true);
}else{
if(ck.hasClass("tree-checkbox2")){
var _47=true;
var _48=true;
var _49=_4a(_42,_43);
for(var i=0;i<_49.length;i++){
if(_49[i].checked){
_48=false;
}else{
_47=false;
}
}
if(_47){
_32(_42,_43,true);
}
if(_48){
_32(_42,_43,false);
}
}
}
}
}
};
function _4b(_4c,ul,_4d,_4e){
var _4f=$.data(_4c,"tree");
var _50=_4f.options;
var _51=$(ul).prevAll("div.tree-node:first");
_4d=_50.loadFilter.call(_4c,_4d,_51[0]);
var _52=_53(_4c,"domId",_51.attr("id"));
if(!_4e){
_52?_52.children=_4d:_4f.data=_4d;
$(ul).empty();
}else{
if(_52){
_52.children?_52.children=_52.children.concat(_4d):_52.children=_4d;
}else{
_4f.data=_4f.data.concat(_4d);
}
}
_50.view.render.call(_50.view,_4c,ul,_4d);
if(_50.dnd){
_11(_4c);
}
if(_52){
_54(_4c,_52);
}
var _55=[];
var _56=[];
for(var i=0;i<_4d.length;i++){
var _57=_4d[i];
if(!_57.checked){
_55.push(_57);
}
}
_58(_4d,function(_59){
if(_59.checked){
_56.push(_59);
}
});
if(_55.length){
_32(_4c,$("#"+_55[0].domId)[0],false);
}
for(var i=0;i<_56.length;i++){
_32(_4c,$("#"+_56[i].domId)[0],true);
}
setTimeout(function(){
_5a(_4c,_4c);
},0);
_50.onLoadSuccess.call(_4c,_52,_4d);
};
function _5a(_5b,ul,_5c){
var _5d=$.data(_5b,"tree").options;
if(_5d.lines){
$(_5b).addClass("tree-lines");
}else{
$(_5b).removeClass("tree-lines");
return;
}
if(!_5c){
_5c=true;
$(_5b).find("span.tree-indent").removeClass("tree-line tree-join tree-joinbottom");
$(_5b).find("div.tree-node").removeClass("tree-node-last tree-root-first tree-root-one");
var _5e=$(_5b).tree("getRoots");
if(_5e.length>1){
$(_5e[0].target).addClass("tree-root-first");
}else{
if(_5e.length==1){
$(_5e[0].target).addClass("tree-root-one");
}
}
}
$(ul).children("li").each(function(){
var _5f=$(this).children("div.tree-node");
var ul=_5f.next("ul");
if(ul.length){
if($(this).next().length){
_60(_5f);
}
_5a(_5b,ul,_5c);
}else{
_61(_5f);
}
});
var _62=$(ul).children("li:last").children("div.tree-node").addClass("tree-node-last");
_62.children("span.tree-join").removeClass("tree-join").addClass("tree-joinbottom");
function _61(_63,_64){
var _65=_63.find("span.tree-icon");
_65.prev("span.tree-indent").addClass("tree-join");
};
function _60(_66){
var _67=_66.find("span.tree-indent, span.tree-hit").length;
_66.next().find("div.tree-node").each(function(){
$(this).children("span:eq("+(_67-1)+")").addClass("tree-line");
});
};
};
function _68(_69,ul,_6a,_6b){
var _6c=$.data(_69,"tree").options;
_6a=_6a||{};
var _6d=null;
if(_69!=ul){
var _6e=$(ul).prev();
_6d=_c(_69,_6e[0]);
}
if(_6c.onBeforeLoad.call(_69,_6d,_6a)==false){
return;
}
var _6f=$(ul).prev().children("span.tree-folder");
_6f.addClass("tree-loading");
var _70=_6c.loader.call(_69,_6a,function(_71){
_6f.removeClass("tree-loading");
_4b(_69,ul,_71);
if(_6b){
_6b();
}
},function(){
_6f.removeClass("tree-loading");
_6c.onLoadError.apply(_69,arguments);
if(_6b){
_6b();
}
});
if(_70==false){
_6f.removeClass("tree-loading");
}
};
function _72(_73,_74,_75){
var _76=$.data(_73,"tree").options;
var hit=$(_74).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
return;
}
var _77=_c(_73,_74);
if(_76.onBeforeExpand.call(_73,_77)==false){
return;
}
hit.removeClass("tree-collapsed tree-collapsed-hover").addClass("tree-expanded");
hit.next().addClass("tree-folder-open");
var ul=$(_74).next();
if(ul.length){
if(_76.animate){
ul.slideDown("normal",function(){
_77.state="open";
_76.onExpand.call(_73,_77);
if(_75){
_75();
}
});
}else{
ul.css("display","block");
_77.state="open";
_76.onExpand.call(_73,_77);
if(_75){
_75();
}
}
}else{
var _78=$("<ul style=\"display:none\"></ul>").insertAfter(_74);
_68(_73,_78[0],{id:_77.id},function(){
if(_78.is(":empty")){
_78.remove();
}
if(_76.animate){
_78.slideDown("normal",function(){
_77.state="open";
_76.onExpand.call(_73,_77);
if(_75){
_75();
}
});
}else{
_78.css("display","block");
_77.state="open";
_76.onExpand.call(_73,_77);
if(_75){
_75();
}
}
});
}
};
function _79(_7a,_7b){
var _7c=$.data(_7a,"tree").options;
var hit=$(_7b).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-collapsed")){
return;
}
var _7d=_c(_7a,_7b);
if(_7c.onBeforeCollapse.call(_7a,_7d)==false){
return;
}
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
hit.next().removeClass("tree-folder-open");
var ul=$(_7b).next();
if(_7c.animate){
ul.slideUp("normal",function(){
_7d.state="closed";
_7c.onCollapse.call(_7a,_7d);
});
}else{
ul.css("display","none");
_7d.state="closed";
_7c.onCollapse.call(_7a,_7d);
}
};
function _7e(_7f,_80){
var hit=$(_80).children("span.tree-hit");
if(hit.length==0){
return;
}
if(hit.hasClass("tree-expanded")){
_79(_7f,_80);
}else{
_72(_7f,_80);
}
};
function _81(_82,_83){
var _84=_4a(_82,_83);
if(_83){
_84.unshift(_c(_82,_83));
}
for(var i=0;i<_84.length;i++){
_72(_82,_84[i].target);
}
};
function _85(_86,_87){
var _88=[];
var p=_89(_86,_87);
while(p){
_88.unshift(p);
p=_89(_86,p.target);
}
for(var i=0;i<_88.length;i++){
_72(_86,_88[i].target);
}
};
function _8a(_8b,_8c){
var c=$(_8b).parent();
while(c[0].tagName!="BODY"&&c.css("overflow-y")!="auto"){
c=c.parent();
}
var n=$(_8c);
var _8d=n.offset().top;
if(c[0].tagName!="BODY"){
var _8e=c.offset().top;
if(_8d<_8e){
c.scrollTop(c.scrollTop()+_8d-_8e);
}else{
if(_8d+n.outerHeight()>_8e+c.outerHeight()-18){
c.scrollTop(c.scrollTop()+_8d+n.outerHeight()-_8e-c.outerHeight()+18);
}
}
}else{
c.scrollTop(_8d);
}
};
function _8f(_90,_91){
var _92=_4a(_90,_91);
if(_91){
_92.unshift(_c(_90,_91));
}
for(var i=0;i<_92.length;i++){
_79(_90,_92[i].target);
}
};
function _93(_94,_95){
var _96=$(_95.parent);
var _97=_95.data;
if(!_97){
return;
}
_97=$.isArray(_97)?_97:[_97];
if(!_97.length){
return;
}
var ul;
if(_96.length==0){
ul=$(_94);
}else{
if(_46(_94,_96[0])){
var _98=_96.find("span.tree-icon");
_98.removeClass("tree-file").addClass("tree-folder tree-folder-open");
var hit=$("<span class=\"tree-hit tree-expanded\"></span>").insertBefore(_98);
if(hit.prev().length){
hit.prev().remove();
}
}
ul=_96.next();
if(!ul.length){
ul=$("<ul></ul>").insertAfter(_96);
}
}
_4b(_94,ul[0],_97,true);
_41(_94,ul.prev());
};
function _99(_9a,_9b){
var ref=_9b.before||_9b.after;
var _9c=_89(_9a,ref);
var _9d=_9b.data;
if(!_9d){
return;
}
_9d=$.isArray(_9d)?_9d:[_9d];
if(!_9d.length){
return;
}
_93(_9a,{parent:(_9c?_9c.target:null),data:_9d});
var li=$();
for(var i=0;i<_9d.length;i++){
li=li.add($("#"+_9d[i].domId).parent());
}
if(_9b.before){
li.insertBefore($(ref).parent());
}else{
li.insertAfter($(ref).parent());
}
};
function _9e(_9f,_a0){
var _a1=del(_a0);
$(_a0).parent().remove();
if(_a1){
if(!_a1.children||!_a1.children.length){
var _a2=$(_a1.target);
_a2.find(".tree-icon").removeClass("tree-folder").addClass("tree-file");
_a2.find(".tree-hit").remove();
$("<span class=\"tree-indent\"></span>").prependTo(_a2);
_a2.next().remove();
}
_54(_9f,_a1);
_41(_9f,_a1.target);
}
_5a(_9f,_9f);
function del(_a3){
var id=$(_a3).attr("id");
var _a4=_89(_9f,_a3);
var cc=_a4?_a4.children:$.data(_9f,"tree").data;
for(var i=0;i<cc.length;i++){
if(cc[i].domId==id){
cc.splice(i,1);
break;
}
}
return _a4;
};
};
function _54(_a5,_a6){
var _a7=$.data(_a5,"tree").options;
var _a8=$(_a6.target);
var _a9=_c(_a5,_a6.target);
var _aa=_a9.checked;
if(_a9.iconCls){
_a8.find(".tree-icon").removeClass(_a9.iconCls);
}
$.extend(_a9,_a6);
_a8.find(".tree-title").html(_a7.formatter.call(_a5,_a9));
if(_a9.iconCls){
_a8.find(".tree-icon").addClass(_a9.iconCls);
}
if(_aa!=_a9.checked){
_32(_a5,_a6.target,_a9.checked);
}
};
function _ab(_ac){
var _ad=_ae(_ac);
return _ad.length?_ad[0]:null;
};
function _ae(_af){
var _b0=$.data(_af,"tree").data;
for(var i=0;i<_b0.length;i++){
_b1(_b0[i]);
}
return _b0;
};
function _4a(_b2,_b3){
var _b4=[];
var n=_c(_b2,_b3);
var _b5=n?n.children:$.data(_b2,"tree").data;
_58(_b5,function(_b6){
_b4.push(_b1(_b6));
});
return _b4;
};
function _89(_b7,_b8){
var p=$(_b8).closest("ul").prevAll("div.tree-node:first");
return _c(_b7,p[0]);
};
function _b9(_ba,_bb){
_bb=_bb||"checked";
if(!$.isArray(_bb)){
_bb=[_bb];
}
var _bc=[];
for(var i=0;i<_bb.length;i++){
var s=_bb[i];
if(s=="checked"){
_bc.push("span.tree-checkbox1");
}else{
if(s=="unchecked"){
_bc.push("span.tree-checkbox0");
}else{
if(s=="indeterminate"){
_bc.push("span.tree-checkbox2");
}
}
}
}
var _bd=[];
$(_ba).find(_bc.join(",")).each(function(){
var _be=$(this).parent();
_bd.push(_c(_ba,_be[0]));
});
return _bd;
};
function _bf(_c0){
var _c1=$(_c0).find("div.tree-node-selected");
return _c1.length?_c(_c0,_c1[0]):null;
};
function _c2(_c3,_c4){
var _c5=_c(_c3,_c4);
if(_c5&&_c5.children){
_58(_c5.children,function(_c6){
_b1(_c6);
});
}
return _c5;
};
function _c(_c7,_c8){
return _53(_c7,"domId",$(_c8).attr("id"));
};
function _c9(_ca,id){
return _53(_ca,"id",id);
};
function _53(_cb,_cc,_cd){
var _ce=$.data(_cb,"tree").data;
var _cf=null;
_58(_ce,function(_d0){
if(_d0[_cc]==_cd){
_cf=_b1(_d0);
return false;
}
});
return _cf;
};
function _b1(_d1){
var d=$("#"+_d1.domId);
_d1.target=d[0];
_d1.checked=d.find(".tree-checkbox").hasClass("tree-checkbox1");
return _d1;
};
function _58(_d2,_d3){
var _d4=[];
for(var i=0;i<_d2.length;i++){
_d4.push(_d2[i]);
}
while(_d4.length){
var _d5=_d4.shift();
if(_d3(_d5)==false){
return;
}
if(_d5.children){
for(var i=_d5.children.length-1;i>=0;i--){
_d4.unshift(_d5.children[i]);
}
}
}
};
function _d6(_d7,_d8){
var _d9=$.data(_d7,"tree").options;
var _da=_c(_d7,_d8);
if(_d9.onBeforeSelect.call(_d7,_da)==false){
return;
}
$(_d7).find("div.tree-node-selected").removeClass("tree-node-selected");
$(_d8).addClass("tree-node-selected");
_d9.onSelect.call(_d7,_da);
};
function _46(_db,_dc){
return $(_dc).children("span.tree-hit").length==0;
};
function _dd(_de,_df){
var _e0=$.data(_de,"tree").options;
var _e1=_c(_de,_df);
if(_e0.onBeforeEdit.call(_de,_e1)==false){
return;
}
$(_df).css("position","relative");
var nt=$(_df).find(".tree-title");
var _e2=nt.outerWidth();
nt.empty();
var _e3=$("<input class=\"tree-editor\">").appendTo(nt);
_e3.val(_e1.text).focus();
_e3.width(_e2+20);
_e3.height(document.compatMode=="CSS1Compat"?(18-(_e3.outerHeight()-_e3.height())):18);
_e3.bind("click",function(e){
return false;
}).bind("mousedown",function(e){
e.stopPropagation();
}).bind("mousemove",function(e){
e.stopPropagation();
}).bind("keydown",function(e){
if(e.keyCode==13){
_e4(_de,_df);
return false;
}else{
if(e.keyCode==27){
_ea(_de,_df);
return false;
}
}
}).bind("blur",function(e){
e.stopPropagation();
_e4(_de,_df);
});
};
function _e4(_e5,_e6){
var _e7=$.data(_e5,"tree").options;
$(_e6).css("position","");
var _e8=$(_e6).find("input.tree-editor");
var val=_e8.val();
_e8.remove();
var _e9=_c(_e5,_e6);
_e9.text=val;
_54(_e5,_e9);
_e7.onAfterEdit.call(_e5,_e9);
};
function _ea(_eb,_ec){
var _ed=$.data(_eb,"tree").options;
$(_ec).css("position","");
$(_ec).find("input.tree-editor").remove();
var _ee=_c(_eb,_ec);
_54(_eb,_ee);
_ed.onCancelEdit.call(_eb,_ee);
};
$.fn.tree=function(_ef,_f0){
if(typeof _ef=="string"){
return $.fn.tree.methods[_ef](this,_f0);
}
var _ef=_ef||{};
return this.each(function(){
var _f1=$.data(this,"tree");
var _f2;
if(_f1){
_f2=$.extend(_f1.options,_ef);
_f1.options=_f2;
}else{
_f2=$.extend({},$.fn.tree.defaults,$.fn.tree.parseOptions(this),_ef);
$.data(this,"tree",{options:_f2,tree:_1(this),data:[]});
var _f3=$.fn.tree.parseData(this);
if(_f3.length){
_4b(this,this,_f3);
}
}
_4(this);
if(_f2.data){
_4b(this,this,_f2.data);
}
_68(this,this);
});
};
$.fn.tree.methods={options:function(jq){
return $.data(jq[0],"tree").options;
},loadData:function(jq,_f4){
return jq.each(function(){
_4b(this,this,_f4);
});
},getNode:function(jq,_f5){
return _c(jq[0],_f5);
},getData:function(jq,_f6){
return _c2(jq[0],_f6);
},reload:function(jq,_f7){
return jq.each(function(){
if(_f7){
var _f8=$(_f7);
var hit=_f8.children("span.tree-hit");
hit.removeClass("tree-expanded tree-expanded-hover").addClass("tree-collapsed");
_f8.next().remove();
_72(this,_f7);
}else{
$(this).empty();
_68(this,this);
}
});
},getRoot:function(jq){
return _ab(jq[0]);
},getRoots:function(jq){
return _ae(jq[0]);
},getParent:function(jq,_f9){
return _89(jq[0],_f9);
},getChildren:function(jq,_fa){
return _4a(jq[0],_fa);
},getChecked:function(jq,_fb){
return _b9(jq[0],_fb);
},getSelected:function(jq){
return _bf(jq[0]);
},isLeaf:function(jq,_fc){
return _46(jq[0],_fc);
},find:function(jq,id){
return _c9(jq[0],id);
},select:function(jq,_fd){
return jq.each(function(){
_d6(this,_fd);
});
},check:function(jq,_fe){
return jq.each(function(){
_32(this,_fe,true);
});
},uncheck:function(jq,_ff){
return jq.each(function(){
_32(this,_ff,false);
});
},collapse:function(jq,_100){
return jq.each(function(){
_79(this,_100);
});
},expand:function(jq,_101){
return jq.each(function(){
_72(this,_101);
});
},collapseAll:function(jq,_102){
return jq.each(function(){
_8f(this,_102);
});
},expandAll:function(jq,_103){
return jq.each(function(){
_81(this,_103);
});
},expandTo:function(jq,_104){
return jq.each(function(){
_85(this,_104);
});
},scrollTo:function(jq,_105){
return jq.each(function(){
_8a(this,_105);
});
},toggle:function(jq,_106){
return jq.each(function(){
_7e(this,_106);
});
},append:function(jq,_107){
return jq.each(function(){
_93(this,_107);
});
},insert:function(jq,_108){
return jq.each(function(){
_99(this,_108);
});
},remove:function(jq,_109){
return jq.each(function(){
_9e(this,_109);
});
},pop:function(jq,_10a){
var node=jq.tree("getData",_10a);
jq.tree("remove",_10a);
return node;
},update:function(jq,_10b){
return jq.each(function(){
_54(this,_10b);
});
},enableDnd:function(jq){
return jq.each(function(){
_11(this);
});
},disableDnd:function(jq){
return jq.each(function(){
_d(this);
});
},beginEdit:function(jq,_10c){
return jq.each(function(){
_dd(this,_10c);
});
},endEdit:function(jq,_10d){
return jq.each(function(){
_e4(this,_10d);
});
},cancelEdit:function(jq,_10e){
return jq.each(function(){
_ea(this,_10e);
});
}};
$.fn.tree.parseOptions=function(_10f){
var t=$(_10f);
return $.extend({},$.parser.parseOptions(_10f,["url","method",{checkbox:"boolean",cascadeCheck:"boolean",onlyLeafCheck:"boolean"},{animate:"boolean",lines:"boolean",dnd:"boolean"}]));
};
$.fn.tree.parseData=function(_110){
var data=[];
_111(data,$(_110));
return data;
function _111(aa,tree){
tree.children("li").each(function(){
var node=$(this);
var item=$.extend({},$.parser.parseOptions(this,["id","iconCls","state"]),{checked:(node.attr("checked")?true:undefined)});
item.text=node.children("span").html();
if(!item.text){
item.text=node.html();
}
var _112=node.children("ul");
if(_112.length){
item.children=[];
_111(item.children,_112);
}
aa.push(item);
});
};
};
var _113=1;
var _114={render:function(_115,ul,data){
var opts=$.data(_115,"tree").options;
var _116=$(ul).prev("div.tree-node").find("span.tree-indent, span.tree-hit").length;
var cc=_117(_116,data);
$(ul).append(cc.join(""));
function _117(_118,_119){
var cc=[];
for(var i=0;i<_119.length;i++){
var item=_119[i];
if(item.state!="open"&&item.state!="closed"){
item.state="open";
}
item.domId="_easyui_tree_"+_113++;
cc.push("<li>");
cc.push("<div id=\""+item.domId+"\" class=\"tree-node\">");
for(var j=0;j<_118;j++){
cc.push("<span class=\"tree-indent\"></span>");
}
if(item.state=="closed"){
cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
cc.push("<span class=\"tree-icon tree-folder "+(item.iconCls?item.iconCls:"")+"\"></span>");
}else{
if(item.children&&item.children.length){
cc.push("<span class=\"tree-hit tree-expanded\"></span>");
cc.push("<span class=\"tree-icon tree-folder tree-folder-open "+(item.iconCls?item.iconCls:"")+"\"></span>");
}else{
cc.push("<span class=\"tree-indent\"></span>");
cc.push("<span class=\"tree-icon tree-file "+(item.iconCls?item.iconCls:"")+"\"></span>");
}
}
if(opts.checkbox){
if((!opts.onlyLeafCheck)||(opts.onlyLeafCheck&&(!item.children||!item.children.length))){
cc.push("<span class=\"tree-checkbox tree-checkbox0\"></span>");
}
}
cc.push("<span class=\"tree-title\">"+opts.formatter.call(_115,item)+"</span>");
cc.push("</div>");
if(item.children&&item.children.length){
var tmp=_117(_118+1,item.children);
cc.push("<ul style=\"display:"+(item.state=="closed"?"none":"block")+"\">");
cc=cc.concat(tmp);
cc.push("</ul>");
}
cc.push("</li>");
}
return cc;
};
}};
$.fn.tree.defaults={url:null,method:"post",animate:false,checkbox:false,cascadeCheck:true,onlyLeafCheck:false,lines:false,dnd:false,data:null,formatter:function(node){
return node.text;
},loader:function(_11a,_11b,_11c){
var opts=$(this).tree("options");
if(!opts.url){
return false;
}
$.ajax({type:opts.method,url:opts.url,data:_11a,dataType:"json",success:function(data){
_11b(data);
},error:function(){
_11c.apply(this,arguments);
}});
},loadFilter:function(data,_11d){
return data;
},view:_114,onBeforeLoad:function(node,_11e){
},onLoadSuccess:function(node,data){
},onLoadError:function(){
},onClick:function(node){
},onDblClick:function(node){
},onBeforeExpand:function(node){
},onExpand:function(node){
},onBeforeCollapse:function(node){
},onCollapse:function(node){
},onBeforeCheck:function(node,_11f){
},onCheck:function(node,_120){
},onBeforeSelect:function(node){
},onSelect:function(node){
},onContextMenu:function(e,node){
},onBeforeDrag:function(node){
},onStartDrag:function(node){
},onStopDrag:function(node){
},onDragEnter:function(_121,_122){
},onDragOver:function(_123,_124){
},onDragLeave:function(_125,_126){
},onBeforeDrop:function(_127,_128,_129){
},onDrop:function(_12a,_12b,_12c){
},onBeforeEdit:function(node){
},onAfterEdit:function(node){
},onCancelEdit:function(node){
}};
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.draggable.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
function _1(e){
var _2=$.data(e.data.target,"draggable");
var _3=_2.options;
var _4=_2.proxy;
var _5=e.data;
var _6=_5.startLeft+e.pageX-_5.startX;
var _7=_5.startTop+e.pageY-_5.startY;
if(_4){
if(_4.parent()[0]==document.body){
if(_3.deltaX!=null&&_3.deltaX!=undefined){
_6=e.pageX+_3.deltaX;
}else{
_6=e.pageX-e.data.offsetWidth;
}
if(_3.deltaY!=null&&_3.deltaY!=undefined){
_7=e.pageY+_3.deltaY;
}else{
_7=e.pageY-e.data.offsetHeight;
}
}else{
if(_3.deltaX!=null&&_3.deltaX!=undefined){
_6+=e.data.offsetWidth+_3.deltaX;
}
if(_3.deltaY!=null&&_3.deltaY!=undefined){
_7+=e.data.offsetHeight+_3.deltaY;
}
}
}
if(e.data.parent!=document.body){
_6+=$(e.data.parent).scrollLeft();
_7+=$(e.data.parent).scrollTop();
}
if(_3.axis=="h"){
_5.left=_6;
}else{
if(_3.axis=="v"){
_5.top=_7;
}else{
_5.left=_6;
_5.top=_7;
}
}
};
function _8(e){
var _9=$.data(e.data.target,"draggable");
var _a=_9.options;
var _b=_9.proxy;
if(!_b){
_b=$(e.data.target);
}
_b.css({left:e.data.left,top:e.data.top});
$("body").css("cursor",_a.cursor);
};
function _c(e){
$.fn.draggable.isDragging=true;
var _d=$.data(e.data.target,"draggable");
var _e=_d.options;
var _f=$(".droppable").filter(function(){
return e.data.target!=this;
}).filter(function(){
var _10=$.data(this,"droppable").options.accept;
if(_10){
return $(_10).filter(function(){
return this==e.data.target;
}).length>0;
}else{
return true;
}
});
_d.droppables=_f;
var _11=_d.proxy;
if(!_11){
if(_e.proxy){
if(_e.proxy=="clone"){
_11=$(e.data.target).clone().insertAfter(e.data.target);
}else{
_11=_e.proxy.call(e.data.target,e.data.target);
}
_d.proxy=_11;
}else{
_11=$(e.data.target);
}
}
_11.css("position","absolute");
_1(e);
_8(e);
_e.onStartDrag.call(e.data.target,e);
return false;
};
function _12(e){
var _13=$.data(e.data.target,"draggable");
_1(e);
if(_13.options.onDrag.call(e.data.target,e)!=false){
_8(e);
}
var _14=e.data.target;
_13.droppables.each(function(){
var _15=$(this);
if(_15.droppable("options").disabled){
return;
}
var p2=_15.offset();
if(e.pageX>p2.left&&e.pageX<p2.left+_15.outerWidth()&&e.pageY>p2.top&&e.pageY<p2.top+_15.outerHeight()){
if(!this.entered){
$(this).trigger("_dragenter",[_14]);
this.entered=true;
}
$(this).trigger("_dragover",[_14]);
}else{
if(this.entered){
$(this).trigger("_dragleave",[_14]);
this.entered=false;
}
}
});
return false;
};
function _16(e){
$.fn.draggable.isDragging=false;
_12(e);
var _17=$.data(e.data.target,"draggable");
var _18=_17.proxy;
var _19=_17.options;
if(_19.revert){
if(_1a()==true){
$(e.data.target).css({position:e.data.startPosition,left:e.data.startLeft,top:e.data.startTop});
}else{
if(_18){
var _1b,top;
if(_18.parent()[0]==document.body){
_1b=e.data.startX-e.data.offsetWidth;
top=e.data.startY-e.data.offsetHeight;
}else{
_1b=e.data.startLeft;
top=e.data.startTop;
}
_18.animate({left:_1b,top:top},function(){
_1c();
});
}else{
$(e.data.target).animate({left:e.data.startLeft,top:e.data.startTop},function(){
$(e.data.target).css("position",e.data.startPosition);
});
}
}
}else{
$(e.data.target).css({position:"absolute",left:e.data.left,top:e.data.top});
_1a();
}
_19.onStopDrag.call(e.data.target,e);
$(document).unbind(".draggable");
setTimeout(function(){
$("body").css("cursor","");
},100);
function _1c(){
if(_18){
_18.remove();
}
_17.proxy=null;
};
function _1a(){
var _1d=false;
_17.droppables.each(function(){
var _1e=$(this);
if(_1e.droppable("options").disabled){
return;
}
var p2=_1e.offset();
if(e.pageX>p2.left&&e.pageX<p2.left+_1e.outerWidth()&&e.pageY>p2.top&&e.pageY<p2.top+_1e.outerHeight()){
if(_19.revert){
$(e.data.target).css({position:e.data.startPosition,left:e.data.startLeft,top:e.data.startTop});
}
$(this).trigger("_drop",[e.data.target]);
_1c();
_1d=true;
this.entered=false;
return false;
}
});
if(!_1d&&!_19.revert){
_1c();
}
return _1d;
};
return false;
};
$.fn.draggable=function(_1f,_20){
if(typeof _1f=="string"){
return $.fn.draggable.methods[_1f](this,_20);
}
return this.each(function(){
var _21;
var _22=$.data(this,"draggable");
if(_22){
_22.handle.unbind(".draggable");
_21=$.extend(_22.options,_1f);
}else{
_21=$.extend({},$.fn.draggable.defaults,$.fn.draggable.parseOptions(this),_1f||{});
}
var _23=_21.handle?(typeof _21.handle=="string"?$(_21.handle,this):_21.handle):$(this);
$.data(this,"draggable",{options:_21,handle:_23});
if(_21.disabled){
$(this).css("cursor","");
return;
}
_23.unbind(".draggable").bind("mousemove.draggable",{target:this},function(e){
if($.fn.draggable.isDragging){
return;
}
var _24=$.data(e.data.target,"draggable").options;
if(_25(e)){
$(this).css("cursor",_24.cursor);
}else{
$(this).css("cursor","");
}
}).bind("mouseleave.draggable",{target:this},function(e){
$(this).css("cursor","");
}).bind("mousedown.draggable",{target:this},function(e){
if(_25(e)==false){
return;
}
$(this).css("cursor","");
var _26=$(e.data.target).position();
var _27=$(e.data.target).offset();
var _28={startPosition:$(e.data.target).css("position"),startLeft:_26.left,startTop:_26.top,left:_26.left,top:_26.top,startX:e.pageX,startY:e.pageY,offsetWidth:(e.pageX-_27.left),offsetHeight:(e.pageY-_27.top),target:e.data.target,parent:$(e.data.target).parent()[0]};
$.extend(e.data,_28);
var _29=$.data(e.data.target,"draggable").options;
if(_29.onBeforeDrag.call(e.data.target,e)==false){
return;
}
$(document).bind("mousedown.draggable",e.data,_c);
$(document).bind("mousemove.draggable",e.data,_12);
$(document).bind("mouseup.draggable",e.data,_16);
});
function _25(e){
var _2a=$.data(e.data.target,"draggable");
var _2b=_2a.handle;
var _2c=$(_2b).offset();
var _2d=$(_2b).outerWidth();
var _2e=$(_2b).outerHeight();
var t=e.pageY-_2c.top;
var r=_2c.left+_2d-e.pageX;
var b=_2c.top+_2e-e.pageY;
var l=e.pageX-_2c.left;
return Math.min(t,r,b,l)>_2a.options.edge;
};
});
};
$.fn.draggable.methods={options:function(jq){
return $.data(jq[0],"draggable").options;
},proxy:function(jq){
return $.data(jq[0],"draggable").proxy;
},enable:function(jq){
return jq.each(function(){
$(this).draggable({disabled:false});
});
},disable:function(jq){
return jq.each(function(){
$(this).draggable({disabled:true});
});
}};
$.fn.draggable.parseOptions=function(_2f){
var t=$(_2f);
return $.extend({},$.parser.parseOptions(_2f,["cursor","handle","axis",{"revert":"boolean","deltaX":"number","deltaY":"number","edge":"number"}]),{disabled:(t.attr("disabled")?true:undefined)});
};
$.fn.draggable.defaults={proxy:null,revert:false,cursor:"move",deltaX:null,deltaY:null,handle:null,disabled:false,edge:0,axis:null,onBeforeDrag:function(e){
},onStartDrag:function(e){
},onDrag:function(e){
},onStopDrag:function(e){
}};
$.fn.draggable.isDragging=false;
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.window.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
function _1(_2,_3){
var _4=$.data(_2,"window").options;
if(_3){
$.extend(_4,_3);
}
$(_2).panel("resize",_4);
};
function _5(_6,_7){
var _8=$.data(_6,"window");
if(_7){
if(_7.left!=null){
_8.options.left=_7.left;
}
if(_7.top!=null){
_8.options.top=_7.top;
}
}
$(_6).panel("move",_8.options);
if(_8.shadow){
_8.shadow.css({left:_8.options.left,top:_8.options.top});
}
};
function _9(_a,_b){
var _c=$.data(_a,"window");
var _d=_c.options;
var _e=_d.width;
if(isNaN(_e)){
_e=_c.window._outerWidth();
}
if(_d.inline){
var _f=_c.window.parent();
_d.left=(_f.width()-_e)/2+_f.scrollLeft();
}else{
_d.left=($(window)._outerWidth()-_e)/2+$(document).scrollLeft();
}
if(_b){
_5(_a);
}
};
function _10(_11,_12){
var _13=$.data(_11,"window");
var _14=_13.options;
var _15=_14.height;
if(isNaN(_15)){
_15=_13.window._outerHeight();
}
if(_14.inline){
var _16=_13.window.parent();
_14.top=(_16.height()-_15)/2+_16.scrollTop();
}else{
_14.top=($(window)._outerHeight()-_15)/2+$(document).scrollTop();
}
if(_12){
_5(_11);
}
};
function _17(_18){
var _19=$.data(_18,"window");
var win=$(_18).panel($.extend({},_19.options,{border:false,doSize:true,closed:true,cls:"window",headerCls:"window-header",bodyCls:"window-body "+(_19.options.noheader?"window-body-noheader":""),onBeforeDestroy:function(){
if(_19.options.onBeforeDestroy.call(_18)==false){
return false;
}
if(_19.shadow){
_19.shadow.remove();
}
if(_19.mask){
_19.mask.remove();
}
},onClose:function(){
if(_19.shadow){
_19.shadow.hide();
}
if(_19.mask){
_19.mask.hide();
}
_19.options.onClose.call(_18);
},onOpen:function(){
if(_19.mask){
_19.mask.css({display:"block",zIndex:$.fn.window.defaults.zIndex++});
}
if(_19.shadow){
_19.shadow.css({display:"block",zIndex:$.fn.window.defaults.zIndex++,left:_19.options.left,top:_19.options.top,width:_19.window._outerWidth(),height:_19.window._outerHeight()});
}
_19.window.css("z-index",$.fn.window.defaults.zIndex++);
_19.options.onOpen.call(_18);
},onResize:function(_1a,_1b){
var _1c=$(this).panel("options");
$.extend(_19.options,{width:_1c.width,height:_1c.height,left:_1c.left,top:_1c.top});
if(_19.shadow){
_19.shadow.css({left:_19.options.left,top:_19.options.top,width:_19.window._outerWidth(),height:_19.window._outerHeight()});
}
_19.options.onResize.call(_18,_1a,_1b);
},onMinimize:function(){
if(_19.shadow){
_19.shadow.hide();
}
if(_19.mask){
_19.mask.hide();
}
_19.options.onMinimize.call(_18);
},onBeforeCollapse:function(){
if(_19.options.onBeforeCollapse.call(_18)==false){
return false;
}
if(_19.shadow){
_19.shadow.hide();
}
},onExpand:function(){
if(_19.shadow){
_19.shadow.show();
}
_19.options.onExpand.call(_18);
}}));
_19.window=win.panel("panel");
if(_19.mask){
_19.mask.remove();
}
if(_19.options.modal==true){
_19.mask=$("<div class=\"window-mask\"></div>").insertAfter(_19.window);
_19.mask.css({width:(_19.options.inline?_19.mask.parent().width():_1d().width),height:(_19.options.inline?_19.mask.parent().height():_1d().height),display:"none"});
}
if(_19.shadow){
_19.shadow.remove();
}
if(_19.options.shadow==true){
_19.shadow=$("<div class=\"window-shadow\"></div>").insertAfter(_19.window);
_19.shadow.css({display:"none"});
}
if(_19.options.left==null){
_9(_18);
}
if(_19.options.top==null){
_10(_18);
}
_5(_18);
if(_19.options.closed==false){
win.window("open");
}
};
function _1e(_1f){
var _20=$.data(_1f,"window");
_20.window.draggable({handle:">div.panel-header>div.panel-title",disabled:_20.options.draggable==false,onStartDrag:function(e){
if(_20.mask){
_20.mask.css("z-index",$.fn.window.defaults.zIndex++);
}
if(_20.shadow){
_20.shadow.css("z-index",$.fn.window.defaults.zIndex++);
}
_20.window.css("z-index",$.fn.window.defaults.zIndex++);
if(!_20.proxy){
_20.proxy=$("<div class=\"window-proxy\"></div>").insertAfter(_20.window);
}
_20.proxy.css({display:"none",zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top});
_20.proxy._outerWidth(_20.window._outerWidth());
_20.proxy._outerHeight(_20.window._outerHeight());
setTimeout(function(){
if(_20.proxy){
_20.proxy.show();
}
},500);
},onDrag:function(e){
_20.proxy.css({display:"block",left:e.data.left,top:e.data.top});
return false;
},onStopDrag:function(e){
_20.options.left=e.data.left;
_20.options.top=e.data.top;
$(_1f).window("move");
_20.proxy.remove();
_20.proxy=null;
}});
_20.window.resizable({disabled:_20.options.resizable==false,onStartResize:function(e){
_20.pmask=$("<div class=\"window-proxy-mask\"></div>").insertAfter(_20.window);
_20.pmask.css({zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top,width:_20.window._outerWidth(),height:_20.window._outerHeight()});
if(!_20.proxy){
_20.proxy=$("<div class=\"window-proxy\"></div>").insertAfter(_20.window);
}
_20.proxy.css({zIndex:$.fn.window.defaults.zIndex++,left:e.data.left,top:e.data.top});
_20.proxy._outerWidth(e.data.width);
_20.proxy._outerHeight(e.data.height);
},onResize:function(e){
_20.proxy.css({left:e.data.left,top:e.data.top});
_20.proxy._outerWidth(e.data.width);
_20.proxy._outerHeight(e.data.height);
return false;
},onStopResize:function(e){
$.extend(_20.options,{left:e.data.left,top:e.data.top,width:e.data.width,height:e.data.height});
_1(_1f);
_20.pmask.remove();
_20.pmask=null;
_20.proxy.remove();
_20.proxy=null;
}});
};
function _1d(){
if(document.compatMode=="BackCompat"){
return {width:Math.max(document.body.scrollWidth,document.body.clientWidth),height:Math.max(document.body.scrollHeight,document.body.clientHeight)};
}else{
return {width:Math.max(document.documentElement.scrollWidth,document.documentElement.clientWidth),height:Math.max(document.documentElement.scrollHeight,document.documentElement.clientHeight)};
}
};
$(window).resize(function(){
$("body>div.window-mask").css({width:$(window)._outerWidth(),height:$(window)._outerHeight()});
setTimeout(function(){
$("body>div.window-mask").css({width:_1d().width,height:_1d().height});
},50);
});
$.fn.window=function(_21,_22){
if(typeof _21=="string"){
var _23=$.fn.window.methods[_21];
if(_23){
return _23(this,_22);
}else{
return this.panel(_21,_22);
}
}
_21=_21||{};
return this.each(function(){
var _24=$.data(this,"window");
if(_24){
$.extend(_24.options,_21);
}else{
_24=$.data(this,"window",{options:$.extend({},$.fn.window.defaults,$.fn.window.parseOptions(this),_21)});
if(!_24.options.inline){
document.body.appendChild(this);
}
}
_17(this);
_1e(this);
});
};
$.fn.window.methods={options:function(jq){
var _25=jq.panel("options");
var _26=$.data(jq[0],"window").options;
return $.extend(_26,{closed:_25.closed,collapsed:_25.collapsed,minimized:_25.minimized,maximized:_25.maximized});
},window:function(jq){
return $.data(jq[0],"window").window;
},resize:function(jq,_27){
return jq.each(function(){
_1(this,_27);
});
},move:function(jq,_28){
return jq.each(function(){
_5(this,_28);
});
},hcenter:function(jq){
return jq.each(function(){
_9(this,true);
});
},vcenter:function(jq){
return jq.each(function(){
_10(this,true);
});
},center:function(jq){
return jq.each(function(){
_9(this);
_10(this);
_5(this);
});
}};
$.fn.window.parseOptions=function(_29){
return $.extend({},$.fn.panel.parseOptions(_29),$.parser.parseOptions(_29,[{draggable:"boolean",resizable:"boolean",shadow:"boolean",modal:"boolean",inline:"boolean"}]));
};
$.fn.window.defaults=$.extend({},$.fn.panel.defaults,{zIndex:9000,draggable:true,resizable:true,shadow:true,modal:false,inline:false,title:"New Window",collapsible:true,minimizable:true,maximizable:true,closable:true,closed:false});
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\easyui\js\jquery.dialog.js
*/
﻿/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
function _1(_2){
var cp=document.createElement("div");
while(_2.firstChild){
cp.appendChild(_2.firstChild);
}
_2.appendChild(cp);
var _3=$(cp);
_3.attr("style",$(_2).attr("style"));
$(_2).removeAttr("style").css("overflow","hidden");
_3.panel({border:false,doSize:false,bodyCls:"dialog-content"});
return _3;
};
function _4(_5){
var _6=$.data(_5,"dialog").options;
var _7=$.data(_5,"dialog").contentPanel;
if(_6.toolbar){
if($.isArray(_6.toolbar)){
$(_5).find("div.dialog-toolbar").remove();
var _8=$("<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(_5);
var tr=_8.find("tr");
for(var i=0;i<_6.toolbar.length;i++){
var _9=_6.toolbar[i];
if(_9=="-"){
$("<td><div class=\"dialog-tool-separator\"></div></td>").appendTo(tr);
}else{
var td=$("<td></td>").appendTo(tr);
var _a=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
_a[0].onclick=eval(_9.handler||function(){
});
_a.linkbutton($.extend({},_9,{plain:true}));
}
}
}else{
$(_6.toolbar).addClass("dialog-toolbar").prependTo(_5);
$(_6.toolbar).show();
}
}else{
$(_5).find("div.dialog-toolbar").remove();
}
if(_6.buttons){
if($.isArray(_6.buttons)){
$(_5).find("div.dialog-button").remove();
var _b=$("<div class=\"dialog-button\"></div>").appendTo(_5);
for(var i=0;i<_6.buttons.length;i++){
var p=_6.buttons[i];
var _c=$("<a href=\"javascript:void(0)\"></a>").appendTo(_b);
if(p.handler){
_c[0].onclick=p.handler;
}
_c.linkbutton(p);
}
}else{
$(_6.buttons).addClass("dialog-button").appendTo(_5);
$(_6.buttons).show();
}
}else{
$(_5).find("div.dialog-button").remove();
}
var _d=_6.href;
var _e=_6.content;
_6.href=null;
_6.content=null;
_7.panel({closed:_6.closed,cache:_6.cache,href:_d,content:_e,onLoad:function(){
if(_6.height=="auto"){
$(_5).window("resize");
}
_6.onLoad.apply(_5,arguments);
}});
$(_5).window($.extend({},_6,{onOpen:function(){
if(_7.panel("options").closed){
_7.panel("open");
}
if(_6.onOpen){
_6.onOpen.call(_5);
}
},onResize:function(_f,_10){
var _11=$(_5);
_7.panel("panel").show();
_7.panel("resize",{width:_11.width(),height:(_10=="auto")?"auto":_11.height()-_11.children("div.dialog-toolbar")._outerHeight()-_11.children("div.dialog-button")._outerHeight()});
if(_6.onResize){
_6.onResize.call(_5,_f,_10);
}
}}));
_6.href=_d;
_6.content=_e;
};
function _12(_13,_14){
var _15=$.data(_13,"dialog").contentPanel;
_15.panel("refresh",_14);
};
$.fn.dialog=function(_16,_17){
if(typeof _16=="string"){
var _18=$.fn.dialog.methods[_16];
if(_18){
return _18(this,_17);
}else{
return this.window(_16,_17);
}
}
_16=_16||{};
return this.each(function(){
var _19=$.data(this,"dialog");
if(_19){
$.extend(_19.options,_16);
}else{
$.data(this,"dialog",{options:$.extend({},$.fn.dialog.defaults,$.fn.dialog.parseOptions(this),_16),contentPanel:_1(this)});
}
_4(this);
});
};
$.fn.dialog.methods={options:function(jq){
var _1a=$.data(jq[0],"dialog").options;
var _1b=jq.panel("options");
$.extend(_1a,{closed:_1b.closed,collapsed:_1b.collapsed,minimized:_1b.minimized,maximized:_1b.maximized});
var _1c=$.data(jq[0],"dialog").contentPanel;
return _1a;
},dialog:function(jq){
return jq.window("window");
},refresh:function(jq,_1d){
return jq.each(function(){
_12(this,_1d);
});
}};
$.fn.dialog.parseOptions=function(_1e){
return $.extend({},$.fn.window.parseOptions(_1e),$.parser.parseOptions(_1e,["toolbar","buttons"]));
};
$.fn.dialog.defaults=$.extend({},$.fn.window.defaults,{title:"New Dialog",collapsible:false,minimizable:false,maximizable:false,resizable:false,toolbar:null,buttons:null});
})(jQuery);


/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_foldable.js
*/
(function($){
	$.fn.extend({
		ITCUI_Foldable:function(action,opts){
			var title = "无标题栏目"
			var _this = $(this);

			this.initFoldable = function(){
				opts = opts || {};
				opts.onExpand = opts.onExpand || function(){};
				opts.onFold = opts.onFold || function(){};
				_this.data("opts",opts);
				if(_this.attr("grouptitle")){
					title = _this.attr("grouptitle");
				}
				if(opts){
					if(opts["grouptitle"]){
						title = opts["grouptitle"];
					}
				}
				var prepHtml = '<div class="itcui_frm_grp_title" style="width:100%">';
				prepHtml += '<span class="itcui_frm_grp_title_arrow'
				if(_this.css("display")!="none"){
					prepHtml += '  itcui_frm_grp_title_arrow_expand';
				}
				prepHtml += '"></span>';
				prepHtml += '<span class="itcui_frm_grp_title_txt">' + title + '</span>';
				prepHtml += '</div>';
				$(this).before(prepHtml);
			}

			this.addEvents = function(){
				var grpTitle = _this.prev(".itcui_frm_grp_title");				
				grpTitle.click(function(e){
					var mainPart = $(this).next("div");
					var opts = mainPart.data("opts");
					if(mainPart.css('display')=="none"){
						grpTitle.children(".itcui_frm_grp_title_arrow").addClass("itcui_frm_grp_title_arrow_expand");
						mainPart.slideDown("normal",opts.onExpand);
					}
					else{
						mainPart.slideUp("normal",opts.onFold);	
						grpTitle.children(".itcui_frm_grp_title_arrow").removeClass("itcui_frm_grp_title_arrow_expand");
					}
				});
			}

			if(!action){
				this.initFoldable();
				this.addEvents();
			}
		}
	});
})(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\bootstrap\js\bs_tab.js
*/
/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
/*
File:D:\javalib\apache-tomcat-7.0.47\webapps\itc_uispec\trunk\prototype_ui\package\source\itcui\js\itc_combotree.js
*/
(function($){
	$.fn.extend({
		ITCUI_ComboTree : function(action,opt,args){
			var width = 150;
			var _this = $(this);

			initComboBox = function(){				
				width = parseInt(_this.css("width"));
				var wrapWidth = _this.attr("treewidth");
				var wrapHeight = _this.attr("treeheight");
				_this.data("wrapWidth",wrapWidth);
				_this.data("wrapHeight",wrapHeight);
				_this.data("opt",opt);
				//覆盖onSelect事件
				var onSelect = opt["onSelect"] || function(){};
				var labelMode = opt.labelMode || "tree";//初始化文字是来自树还是来自deftext属性
				delete(opt.onSelect);
				_this.data("_onSelect",onSelect);
				//获取初始化已选择的内容
				var comboLabel = _this.attr("deftext") || "";
				if(opt["checkbox"]){
					multiSelect = true;
				}
				else{
					multiSelect = false;	
				}
				_this.data("multiSelect", multiSelect);
				var fStr = _this.css("float");
				if(fStr){
					fStr = ";float:" + fStr;
				}
				else{
					fStr = "";
				}
				var comboHtml = "<div class='itcui_combo bbox' style='width:" + width + "px" + fStr + "'>";
				comboHtml += "<span class='itcui_combo_text'>" + comboLabel + "</span><span class='itcui_combo_arrow_wrap'><b class='itcui_combo_arrow'></b></span>";
				comboHtml += "</div>";
				_this.css("display","none");
				_this.before(comboHtml);
				_this.prev(".itcui_combo").click(function(e){
					e.stopPropagation();
					__this = $(this).next("select");
					popUp(__this);
				});
				if(labelMode=="tree"){
					setInitText(_this);
				}
			};

			popUp = function(__this){
				var wrap = __this.next("div");
				if(wrap.hasClass("itcui_dropdown_menu")){
					wrap.css("display","block");
				}
				else{
					var wrapWidth = __this.data("wrapWidth");
					var wrapHeight = __this.data("wrapHeight");
					var opt = __this.data("opt");
					var fix = __this.attr("fix");
					var wrapHtml = "<div id='itc_combo_wrap' class='itcui_dropdown_menu' style='padding-top:6px;padding-bottom:6px;height:" + wrapHeight + ";width:" + wrapWidth + "'><div class='itcui_combotree' style='width:100%'></div>";
					wrapHtml += "</div>";
					__this.after(wrapHtml);
					if(fix){
						var pos = ITC_GetAbsPos(__this.prev(".itcui_combo"));
						$("#itc_combo_wrap").css({
							"left":pos.left,
							"top":pos.top + parseInt($(__this).css("height"))
						});
					}
					opt["onSelect"] = function(node){
						var wrap = $(this).parents(".itcui_dropdown_menu");
						var p = wrap.prev("select");
						//单选时点击一项就隐藏树
						var isMultiSelect = p.data("multiSelect");
						var realEvent = p.data("_onSelect");
						if(!isMultiSelect){
							wrap.hide();
						}
						var tree = wrap.find(".itcui_combotree");
						var selectNode = tree.tree("getSelected");
						wrap.prev().prev().find(".itcui_combo_text").html(selectNode.text);
						__this.data("val",selectNode.id)
						realEvent(node);
					};
					opt["onCheck"] = function(e){
						var __this = $(this).parent().prev("select");
					};
					//创建树
					var tree = __this.next('.itcui_dropdown_menu').find('.itcui_combotree').tree(opt);
					bindEvent(__this);					
					//初始选择 仅用于单选树
					var initId = __this.data("initSelected");
					if(initId){
						var targetNode = tree.tree("find",initId);
						tree.tree("select",targetNode.target);
					}
				}

			};

			bindEvent = function(__this){
				var tree = __this.next('.itcui_dropdown_menu').find('.itcui_combotree');
				var multiSelect = __this.data("multiSelect");
				$("body").click(function(e){
					var wrap = $("#itc_combo_wrap");
					wrap.remove();
				});
				//多选时点击树时不消失			
			};

			/*
				遍历树节点，获取满足某条件的节点列表
				parent - 父节点
				resultList - 返回的结果列表
				property - 要获取的属性
				needCondition - 满足true的条件，如checked 				
			*/
			visitNode = function(parent,resultList,property,needCondition){
				if(!parent){
					return;
				}
				for(var i=0;i<parent.length;i++){
					node = parent[i];
					if(node[needCondition]){
						resultList.push(node[property]);
					}
					visitNode(node["children"],resultList,property,needCondition);
				}
				
			};		

			setInitText = function(__this){
				var multiSelect = __this.data("multiSelect");
				var opt = __this.data("opt");
				if(!opt["data"]){
					return;
				}
				var resultList = [];
				if(multiSelect){
					visitNode(opt["data"],resultList,"text","checked");
				}
				else{
					var resultIdList = [];
					visitNode(opt["data"],resultList,"text","selected");	
					visitNode(opt["data"],resultIdList,"id","selected");	
					//如果找到，还要标记一下，因为单选树没有默认选择的功能
					if(resultList.length>0){
						__this.data("initSelected",resultIdList[0]);
					}
				}
				__this.prev(".itcui_combo").find(".itcui_combo_text").html(resultList.join(" "));
			};

			
			getSelectedText = function(__this){
				var multiSelect = __this.data("multiSelect");
				var tree = __this.next('.itcui_dropdown_menu').find('.itcui_combotree');
				if(multiSelect){
					var nodes = tree.tree("getChecked");
					var nodesName = [];
					for(var i=0;i<nodes.length;i++){
						var node = nodes[i];
						nodesName.push(node.text);
					}
					return nodesName.join(" ");
				}
				else{
					var node = tree.tree("getSelected");
					if(node){
						return node.text;
					}
				}
			};

			if(action=="create"){
				initComboBox();
			}
			else if(action=="getValue"){
				return _this.data("val") || _this.attr("defval");
			}
			else{
				_this.next(".itcui_dropdown_menu").children(".itcui_combotree").tree(action,opt);
			}
		}
	});
})(jQuery);

/**
 * jQuery EasyUI 1.3.5
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
(function($){
var _1=false;
function _2(_3){
var _4=$.data(_3,"layout");
var _5=_4.options;
var _6=_4.panels;
var cc=$(_3);
if(_3.tagName=="BODY"){
cc._fit();
}else{
_5.fit?cc.css(cc._fit()):cc._fit(false);
}
var _7={top:0,left:0,width:cc.width(),height:cc.height()};
_8(_9(_6.expandNorth)?_6.expandNorth:_6.north,"n");
_8(_9(_6.expandSouth)?_6.expandSouth:_6.south,"s");
_a(_9(_6.expandEast)?_6.expandEast:_6.east,"e");
_a(_9(_6.expandWest)?_6.expandWest:_6.west,"w");
_6.center.panel("resize",_7);
function _b(pp){
var _c=pp.panel("options");
return Math.min(Math.max(_c.height,_c.minHeight),_c.maxHeight);
};
function _d(pp){
var _e=pp.panel("options");
return Math.min(Math.max(_e.width,_e.minWidth),_e.maxWidth);
};
function _8(pp,_f){
if(!pp.length){
return;
}
var _10=pp.panel("options");
var _11=_b(pp);
pp.panel("resize",{width:cc.width(),height:_11,left:0,top:(_f=="n"?0:cc.height()-_11)});
_7.height-=_11;
if(_f=="n"){
_7.top+=_11;
if(!_10.split&&_10.border){
_7.top--;
}
}
if(!_10.split&&_10.border){
_7.height++;
}
};
function _a(pp,_12){
if(!pp.length){
return;
}
var _13=pp.panel("options");
var _14=_d(pp);
pp.panel("resize",{width:_14,height:_7.height,left:(_12=="e"?cc.width()-_14:0),top:_7.top});
_7.width-=_14;
if(_12=="w"){
_7.left+=_14;
if(!_13.split&&_13.border){
_7.left--;
}
}
if(!_13.split&&_13.border){
_7.width++;
}
};
};
function _15(_16){
var cc=$(_16);
cc.addClass("layout");
function _17(cc){
cc.children("div").each(function(){
var _18=$.fn.layout.parsePanelOptions(this);
if("north,south,east,west,center".indexOf(_18.region)>=0){
_1b(_16,_18,this);
}
});
};
cc.children("form").length?_17(cc.children("form")):_17(cc);
cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
cc.bind("_resize",function(e,_19){
var _1a=$.data(_16,"layout").options;
if(_1a.fit==true||_19){
_2(_16);
}
return false;
});
};
function _1b(_1c,_1d,el){
_1d.region=_1d.region||"center";
var _1e=$.data(_1c,"layout").panels;
var cc=$(_1c);
var dir=_1d.region;
if(_1e[dir].length){
return;
}
var pp=$(el);
if(!pp.length){
pp=$("<div></div>").appendTo(cc);
}
var _1f=$.extend({},$.fn.layout.paneldefaults,{width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),doSize:false,collapsible:true,cls:("layout-panel layout-panel-"+dir),bodyCls:"layout-body",onOpen:function(){
var _20=$(this).panel("header").children("div.panel-tool");
_20.children("a.panel-tool-collapse").hide();
var _21={north:"up",south:"down",east:"right",west:"left"};
if(!_21[dir]){
return;
}
var _22="layout-button-"+_21[dir];
var t=_20.children("a."+_22);
if(!t.length){
t=$("<a href=\"javascript:void(0)\"></a>").addClass(_22).appendTo(_20);
t.bind("click",{dir:dir},function(e){
_2f(_1c,e.data.dir);
return false;
});
}
$(this).panel("options").collapsible?t.show():t.hide();
}},_1d);
pp.panel(_1f);
_1e[dir]=pp;
if(pp.panel("options").split){
var _23=pp.panel("panel");
_23.addClass("layout-split-"+dir);
var _24="";
if(dir=="north"){
_24="s";
}
if(dir=="south"){
_24="n";
}
if(dir=="east"){
_24="w";
}
if(dir=="west"){
_24="e";
}
_23.resizable($.extend({},{handles:_24,onStartResize:function(e){
_1=true;
if(dir=="north"||dir=="south"){
var _25=$(">div.layout-split-proxy-v",_1c);
}else{
var _25=$(">div.layout-split-proxy-h",_1c);
}
var top=0,_26=0,_27=0,_28=0;
var pos={display:"block"};
if(dir=="north"){
pos.top=parseInt(_23.css("top"))+_23.outerHeight()-_25.height();
pos.left=parseInt(_23.css("left"));
pos.width=_23.outerWidth();
pos.height=_25.height();
}else{
if(dir=="south"){
pos.top=parseInt(_23.css("top"));
pos.left=parseInt(_23.css("left"));
pos.width=_23.outerWidth();
pos.height=_25.height();
}else{
if(dir=="east"){
pos.top=parseInt(_23.css("top"))||0;
pos.left=parseInt(_23.css("left"))||0;
pos.width=_25.width();
pos.height=_23.outerHeight();
}else{
if(dir=="west"){
pos.top=parseInt(_23.css("top"))||0;
pos.left=_23.outerWidth()-_25.width();
pos.width=_25.width();
pos.height=_23.outerHeight();
}
}
}
}
_25.css(pos);
$("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
},onResize:function(e){
if(dir=="north"||dir=="south"){
var _29=$(">div.layout-split-proxy-v",_1c);
_29.css("top",e.pageY-$(_1c).offset().top-_29.height()/2);
}else{
var _29=$(">div.layout-split-proxy-h",_1c);
_29.css("left",e.pageX-$(_1c).offset().left-_29.width()/2);
}
return false;
},onStopResize:function(e){
cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
pp.panel("resize",e.data);
_2(_1c);
_1=false;
cc.find(">div.layout-mask").remove();
}},_1d));
}
};
function _2a(_2b,_2c){
var _2d=$.data(_2b,"layout").panels;
if(_2d[_2c].length){
_2d[_2c].panel("destroy");
_2d[_2c]=$();
var _2e="expand"+_2c.substring(0,1).toUpperCase()+_2c.substring(1);
if(_2d[_2e]){
_2d[_2e].panel("destroy");
_2d[_2e]=undefined;
}
}
};
function _2f(_30,_31,_32){
if(_32==undefined){
_32="normal";
}
var _33=$.data(_30,"layout").panels;
var p=_33[_31];
var _34=p.panel("options");
if(_34.onBeforeCollapse.call(p)==false){
return;
}
var _35="expand"+_31.substring(0,1).toUpperCase()+_31.substring(1);
if(!_33[_35]){
_33[_35]=_36(_31);
_33[_35].panel("panel").bind("click",function(){
var _37=_38();
p.panel("expand",false).panel("open").panel("resize",_37.collapse);
p.panel("panel").animate(_37.expand,function(){
$(this).unbind(".layout").bind("mouseleave.layout",{region:_31},function(e){
if(_1==true){
return;
}
_2f(_30,e.data.region);
});
});
return false;
});
}
var _39=_38();
if(!_9(_33[_35])){
_33.center.panel("resize",_39.resizeC);
}
p.panel("panel").animate(_39.collapse,_32,function(){
p.panel("collapse",false).panel("close");
_33[_35].panel("open").panel("resize",_39.expandP);
$(this).unbind(".layout");
});
function _36(dir){
var _3a;
if(dir=="east"){
_3a="layout-button-left";
}else{
if(dir=="west"){
_3a="layout-button-right";
}else{
if(dir=="north"){
_3a="layout-button-down";
}else{
if(dir=="south"){
_3a="layout-button-up";
}
}
}
}
var p=$("<div></div>").appendTo(_30);
p.panel($.extend({},$.fn.layout.paneldefaults,{cls:("layout-expand layout-expand-"+dir),title:"&nbsp;",closed:true,doSize:false,tools:[{iconCls:_3a,handler:function(){
_3c(_30,_31);
return false;
}}]}));
p.panel("panel").hover(function(){
$(this).addClass("layout-expand-over");
},function(){
$(this).removeClass("layout-expand-over");
});
return p;
};
function _38(){
var cc=$(_30);
var _3b=_33.center.panel("options");
if(_31=="east"){
var ww=_3b.width+_34.width-28;
if(_34.split||!_34.border){
ww++;
}
return {resizeC:{width:ww},expand:{left:cc.width()-_34.width},expandP:{top:_3b.top,left:cc.width()-28,width:28,height:_3b.height},collapse:{left:cc.width(),top:_3b.top,height:_3b.height}};
}else{
if(_31=="west"){
var ww=_3b.width+_34.width-28;
if(_34.split||!_34.border){
ww++;
}
return {resizeC:{width:ww,left:28-1},expand:{left:0},expandP:{left:0,top:_3b.top,width:28,height:_3b.height},collapse:{left:-_34.width,top:_3b.top,height:_3b.height}};
}else{
if(_31=="north"){
var hh=_3b.height;
if(!_9(_33.expandNorth)){
hh+=_34.height-28+((_34.split||!_34.border)?1:0);
}
_33.east.add(_33.west).add(_33.expandEast).add(_33.expandWest).panel("resize",{top:28-1,height:hh});
return {resizeC:{top:28-1,height:hh},expand:{top:0},expandP:{top:0,left:0,width:cc.width(),height:28},collapse:{top:-_34.height,width:cc.width()}};
}else{
if(_31=="south"){
var hh=_3b.height;
if(!_9(_33.expandSouth)){
hh+=_34.height-28+((_34.split||!_34.border)?1:0);
}
_33.east.add(_33.west).add(_33.expandEast).add(_33.expandWest).panel("resize",{height:hh});
return {resizeC:{height:hh},expand:{top:cc.height()-_34.height},expandP:{top:cc.height()-28,left:0,width:cc.width(),height:28},collapse:{top:cc.height(),width:cc.width()}};
}
}
}
}
};
};
function _3c(_3d,_3e){
var _3f=$.data(_3d,"layout").panels;
var p=_3f[_3e];
var _40=p.panel("options");
if(_40.onBeforeExpand.call(p)==false){
return;
}
var _41=_42();
var _43="expand"+_3e.substring(0,1).toUpperCase()+_3e.substring(1);
if(_3f[_43]){
_3f[_43].panel("close");
p.panel("panel").stop(true,true);
p.panel("expand",false).panel("open").panel("resize",_41.collapse);
p.panel("panel").animate(_41.expand,function(){
_2(_3d);
});
}
function _42(){
var cc=$(_3d);
var _44=_3f.center.panel("options");
if(_3e=="east"&&_3f.expandEast){
return {collapse:{left:cc.width(),top:_44.top,height:_44.height},expand:{left:cc.width()-_3f["east"].panel("options").width}};
}else{
if(_3e=="west"&&_3f.expandWest){
return {collapse:{left:-_3f["west"].panel("options").width,top:_44.top,height:_44.height},expand:{left:0}};
}else{
if(_3e=="north"&&_3f.expandNorth){
return {collapse:{top:-_3f["north"].panel("options").height,width:cc.width()},expand:{top:0}};
}else{
if(_3e=="south"&&_3f.expandSouth){
return {collapse:{top:cc.height(),width:cc.width()},expand:{top:cc.height()-_3f["south"].panel("options").height}};
}
}
}
}
};
};
function _9(pp){
if(!pp){
return false;
}
if(pp.length){
return pp.panel("panel").is(":visible");
}else{
return false;
}
};
function _45(_46){
var _47=$.data(_46,"layout").panels;
if(_47.east.length&&_47.east.panel("options").collapsed){
_2f(_46,"east",0);
}
if(_47.west.length&&_47.west.panel("options").collapsed){
_2f(_46,"west",0);
}
if(_47.north.length&&_47.north.panel("options").collapsed){
_2f(_46,"north",0);
}
if(_47.south.length&&_47.south.panel("options").collapsed){
_2f(_46,"south",0);
}
};
$.fn.layout=function(_48,_49){
if(typeof _48=="string"){
return $.fn.layout.methods[_48](this,_49);
}
_48=_48||{};
return this.each(function(){
var _4a=$.data(this,"layout");
if(_4a){
$.extend(_4a.options,_48);
}else{
var _4b=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),_48);
$.data(this,"layout",{options:_4b,panels:{center:$(),north:$(),south:$(),east:$(),west:$()}});
_15(this);
}
_2(this);
_45(this);
});
};
$.fn.layout.methods={resize:function(jq){
return jq.each(function(){
_2(this);
});
},panel:function(jq,_4c){
return $.data(jq[0],"layout").panels[_4c];
},collapse:function(jq,_4d){
return jq.each(function(){
_2f(this,_4d);
});
},expand:function(jq,_4e){
return jq.each(function(){
_3c(this,_4e);
});
},add:function(jq,_4f){
return jq.each(function(){
_1b(this,_4f);
_2(this);
if($(this).layout("panel",_4f.region).panel("options").collapsed){
_2f(this,_4f.region,0);
}
});
},remove:function(jq,_50){
return jq.each(function(){
_2a(this,_50);
_2(this);
});
}};
$.fn.layout.parseOptions=function(_51){
return $.extend({},$.parser.parseOptions(_51,[{fit:"boolean"}]));
};
$.fn.layout.defaults={fit:false};
$.fn.layout.parsePanelOptions=function(_52){
var t=$(_52);
return $.extend({},$.fn.panel.parseOptions(_52),$.parser.parseOptions(_52,["region",{split:"boolean",minWidth:"number",minHeight:"number",maxWidth:"number",maxHeight:"number"}]));
};
$.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{region:null,split:false,minWidth:10,minHeight:10,maxWidth:10000,maxHeight:10000});
})(jQuery);

