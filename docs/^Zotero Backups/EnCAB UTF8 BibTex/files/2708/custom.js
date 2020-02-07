(function(){var _h=function(selector){var elems=typeof(selector)=="string"?document.querySelectorAll(selector):[selector];function getStyle(elem){return elem.currentStyle||getComputedStyle(elem,null);}
return{elems:elems||[],addEventListener:function(eventName,callback){for(var i=0;i<this.elems.length;i++){this.elems[i].addEventListener(eventName,callback);}
return this;},length:elems.length,first:function(){if(this.length>0){return _h(this.elems[0]);}
return undefined;},last:function(){if(this.length>0){return _h(this.elems[this.length-1]);}
return undefined;},addDynamicEventListener:function(eventName,callback,parent=document){parent.addEventListener(eventName,function(e){if(e.target&&e.target.matches(selector)){callback(e);}});},removeClass:function(className){for(var i=0;i<this.elems.length;i++){this.elems[i].classList.remove(className);}
return this;},addClass:function(className){for(var i=0;i<this.elems.length;i++){this.elems[i].classList.add(className);}
return this;},hasClass:function(className){var res=true;for(var i=0;i<this.elems.length;i++){res&=this.elems[i].classList.contains(className);}
return res;},show:function(display='inline-block'){this.each(function(){this.style.display=display;});return this;},hide:function(){this.each(function(){this.style.display='none';});return this;},isVisible:function(){if(this.length>0){var el=this.elems[0];return!!(el.offsetHeight||el.offsetWidth);}
return undefined;},toggle:function(callback){for(var i=0;i<this.elems.length;i++){var el=this.elems[i];el.style.display=_h(el).isVisible()?'none':'block';}
if(callback)
callback();},slideToggle:function(duration,callback){if(callback)
callback();},html:function(content){if(content){for(var i=0;i<this.elems.length;i++){this.elems[i].innerHTML=content;}
return this;}
if(this.length>0){return this.elems[0].innerHTML;}
return undefined;},text:function(str){if(str){for(var i=0;i<this.elems.length;i++){this.elems[i].innerText=str;}
return this;}
if(this.length>0){return this.elems[0].innerText;}
return'';},empty:function(){this.each(function(){this.innerHTML='';});return this;},offset:function(){if(this.length>0){var el=this.elems[0];var rect=el.getBoundingClientRect();return{top:rect.top+document.body.scrollTop,left:rect.left+document.body.scrollLeft};}
return undefined;},children:function(childSelector){var c=[];for(var i=0;i<this.elems.length;i++){var subs=this.elems[i].children;for(var j=0;j<subs.length;j++){if(childSelector&&!_h(subs[j]).is(childSelector)){continue;}
c.push(subs[j]);}}
var obj=_h(document);obj.elems=c;obj.length=c.length;return obj;},scrollTop:function(val){if(val){if(this.elems.length>0){if(this.elems[0]==document){document.documentElement.scrollTop=val;}else{this.elems[0].scrollTop=val;}}
return this;}
if(this.elems.length>0){if(this.elems[0]==document){return document.documentElement.scrollTop;}
return this.elems[0].scrollTop;}
return undefined;},remove:function(){var r=[];for(var i=0;i<this.elems.length;i++){var el=this.elems[i];var parent=el.parentNode;if(parent){var node=parent.removeChild(el);r.push(node);}}
this.elems=[];return r;},detach:function(){return this.remove();},prepend:function(nodes){for(var i=0;i<this.elems.length;i++){for(var j=0;j<nodes.length;j++){var child=this.elems[i].children.length>0?this.elems[i].children[0]:null;this.elems[i].insertBefore(nodes[j],child);}}
return this;},append:function(nodes){for(var i=0;i<this.elems.length;i++){for(var j=0;j<nodes.length;j++){this.elems[i].appendChild(nodes[j]);}}
return this;},insertAfter:function(target){if(!target){return undefined;}
if(typeof target=='string'){target=document.querySelector(target);}
var elems=this.elems;for(j=elems.length-1;j>=0;j--){target.insertAdjacentElement('afterend',elems[j]);}
return _h(target);},toggleClass:function(className){for(var i=0;i<this.elems.length;i++){this.elems[i].classList.toggle(className);}
return this;},css:function(key,val){if(!val){if(this.elems.length>0){var stylesheet=getStyle(this.elems[0]);return stylesheet.getPropertyValue(key);}else{return undefined;}}
var style=key+': '+val+';';for(var i=0;i<this.elems.length;i++){var el=this.elems[i]
var css=el.style.cssText;css+=style;el.style.cssText=css;}
return this;},width:function(val){if(val){return this.css('width',val);}
if(this.elems.length>0){return this.elems[0].clientWidth;}
return undefined;},height:function(val){if(val){return this.css('height',val);}
if(this.elems.length>0){return this.elems[0].clientHeight;}
return undefined;},each:function(callback){for(var i=0;i<this.elems.length;i++){callback.call(this.elems[i]);}},attr:function(key,val){if(val){for(var i=0;i<this.elems.length;i++){this.elems[i].setAttribute(key,val);}
return this;}
if(this.elems.length>0){return this.elems[0].getAttribute(key);}
return undefined;},find:function(childSelector){var c=[];for(var i=0;i<this.elems.length;i++){var subs=this.elems[i].querySelectorAll(childSelector);for(var j=0;j<subs.length;j++){c.push(subs[j]);}}
var obj=_h(document);obj.elems=c;obj.length=c.length;return obj;},eq:function(idx){if(idx<0||idx>=this.elems.length){return undefined;}
return _h(this.elems[idx]);},fadeTo:function(duration,opacity,complete){console.log("Implement fading here.");if(typeof complete=='function'){complete.call(this);}
return this;},ajax:function(method,url,data,successCallback,errorCallback){var request=new XMLHttpRequest();request.open(method,url,true);request.onload=function(){var resp=request.responseText;if(typeof successCallback=='function'){successCallback(resp);}};request.onerror=function(){if(typeof errorCallback=='function'){errorCallback.call(this);}};data=data||'';request.send(data);},submit:function(handler){if(typeof handler=='function'){this.each(function(){this.addEventListener('submit',function(){handler.call(this);});});return this;}
this.each(function(){this.submit();});return this;},is:function(selector){if(this.length>0){var el=this.elems[0];return(el.matches||el.matchesSelector||el.msMatchesSelector||el.mozMatchesSelector||el.webkitMatchesSelector||el.oMatchesSelector).call(el,selector);};return false;},closest:function(selector){var maxTraversal=10;var parent;if(this.length>0){var el=this.elems[0];while(el&&maxTraversal>0){parent=el.parentElement;if(parent&&_h(parent).is(selector)){return _h(parent);}
el=parent;maxTraversal-=1;}}
return undefined;},next:function(selector){var nodes=[];for(var i=0;i<this.elems.length;i++){var el=this.elems[i];while(el){var sibling=el.nextElementSibling;if(!selector||_h(sibling).is(selector)){nodes.push(sibling);break;}
el=sibling;}}
var obj=_h();obj.elems=nodes;obj.length=nodes.length;return obj},setVideoHeight:function(ratio){this.each(function(){var width=_h(this.parentNode).width();var height=width/ratio;_h(this).height(height);_h(this).find('object').height(height).width('100%');});},lazyImage:function(callback){var imgLen=this.length,count=0;return this.each(function(){if(_h(this).attr('data-src')){var imgTag=this,imgSrc=_h(this).attr('data-src'),del;if(webp_flag){if(imgSrc.match(/DM\-Resize/g)&&imgSrc.match(/webp=1/g)&&(imgSrc.indexOf('.gif')==-1)){imgSrc=imgSrc+'&format=webp&quality=80';}}
i=new Image();i.onload=function(){_h(imgTag).attr('src',imgSrc).fadeTo(400,1,function(){(count+=1)&&(imgLen==count)&&(typeof callback=='function')&&callback.call(this);});};i.src=imgSrc;}});},ready:function(callback){if(document.readyState!='loading'){callback();}else if(document.addEventListener){document.addEventListener('DOMContentLoaded',callback);}else{document.attachEvent('onreadystatechange',function(){if(document.readyState!='loading')
callback();});}}}}
_h.node=function(text){var el=document.createElement('div');el.innerHTML=text;return el.firstChild;};_h.getScript=function(url,callback){var script=document.createElement('script');script.src=url;script.async=true;script.addEventListener('load',function(e){if(typeof callback=='function'){callback(e);}});var parent=null;if(document.currentScript){parent=document.currentScript.parentNode;}else{var tag=document.getElementsByTagName('script')[0];parent=tag.parentNode;}
if(parent!==null){parent.appendChild(script);}};window._h=_h;})();(function(){webp_flag=false;var image=new Image();image.src='data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';image.onload=function(){webp_flag=(image.width==1);}})();function lazyScript(check,url,callback){if(!check()){return;}
_h().ajax('GET',url,'',callback);};_h(document).ready(function(){var adsMoveTo=null,format=dataLayer[0].subpagetype||"Topic View",section_length=_h('[id^="section"]').length,window_width=document.documentElement.clientWidth||document.body.clientWidth;window.screen.width;if(format=="Topic View"||format=="About"||format=="Fact Sheet"||format=="How Does"||format=="Strategy"||format=="Topic View Plus"||format=="Freestyle")
{if(_h('[id^="section"]').length>=4){adsMoveTo=2;}}
if(format=="List"&&section_length>=5){adsMoveTo=2;}
if(format=="How To"&&section_length>=6){adsMoveTo=3;}
if(adsMoveTo&&window_width<=760){_h('#top-300').insertAfter('#section-'+adsMoveTo);}
var container="div[data-type='adTracking']";_h(container+" a, "+container+" div.GoogleFlashAd div.Ad").addEventListener("mouseup",function(e){var parent=_h(this).closest(container);_JT.DM_Click(parent);});_h('.link-toggle-list').each(function(){_h(this).find('span.icon').first().show();_h(this).find('span.icon').last().hide();})
_h('.link-toggle-list').addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var section=_h(this).closest('.section');section.find('.icon').hide();if(section.find('ul').isVisible()){section.find('.icon').first().show();}else{section.find('.icon').last().show();}
section.find('ul').toggle();});_h(".citation-widget button.choose-style").addEventListener("click",function(){_h(".citation-widget button.choose-style").removeClass("active");_h(this).addClass("active");_h(".citation-widget .style").removeClass("active");_h(".citation-widget .style."+_h(this).attr("data-style")).addClass("active");_h(".citation-widget button.copy-citation").removeClass("success").removeClass("error").text("Copy Citation");_h(".citation-widget .popup .copied-flash").hide();});_h(".citation-widget button.copy-citation").addEventListener("click",function(){var currentCitation=_h(".citation-widget .style.active").text();if(copyTextToClipboard(currentCitation)){_h(this).addClass("success").html("&#10003; Copied");if(_h(".citation-widget button.choose-style.active").attr("data-style")!="Chicago"){_h(".citation-widget .popup .copied-flash").show();}}else{_h(this).addClass("error").html("X Unable to Copy.");}});_h(".citation-widget").addEventListener("mouseenter touchstart",function(e){dataLayer.push({'event':'citation open'});});});function copyTextToClipboard(text){dataLayer.push({'event':'citation copy button'});var textArea=document.createElement("textarea");textArea.style.position='fixed';textArea.style.top=0;textArea.style.left=0;textArea.style.width='2em';textArea.style.height='2em';textArea.style.padding=0;textArea.style.border='none';textArea.style.outline='none';textArea.style.boxShadow='none';textArea.style.background='transparent';textArea.value=text;document.body.appendChild(textArea);textArea.select();try{var successful=document.execCommand('copy');}catch(err){console.log("Oops, unable to copy.");}
document.body.removeChild(textArea);return successful;}