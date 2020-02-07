(function(window){var AdblockPlus=new(function(){this.detect=function(px,callback){var detected=false;var checksRemain=2;var error1=false;var error2=false;if(typeof callback!="function")
return;px+="?ch=*&rn=*";function beforeCheck(callback,timeout){if(checksRemain==0||timeout>1000)
callback(checksRemain==0&&detected);else{setTimeout(function(){beforeCheck(callback,timeout*2);},timeout*2);}}
function checkImages(){if(--checksRemain)
return;detected=!error1&&error2;}
var random=Math.random()*11;var img1=new Image();img1.onload=checkImages;img1.onerror=function(){error1=true;checkImages();}
img1.src=px.replace(/\*/,1).replace(/\*/,random);var img2=new Image();img2.onload=checkImages;img2.onerror=function(){error2=true;checkImages();}
img2.src=px.replace(/\*/,2).replace(/\*/,random);beforeCheck(callback,250);}});window.AdblockPlus=AdblockPlus;if(window.AdblockPlus===undefined){}})(window);