Bootstrapper.bindDependencyImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;var w=Bootstrapper.propertyWatcher.create(function(){return HNP.ens3pFlag});w.change=function(oldValue,newValue){if(newValue=="true"){window.ga("hnp.set",cDim.SiteSectionLevel1,"business");window.ga("hnp.set",cDim.SiteSectionLevel2,"business:smallbusiness");window.ga("hnp.set",cDim.SiteSectionLevel3,"business:smallbusiness");window.ga("hnp.set",cDim.SiteSectionLevel4,
"business:smallbusiness");window.ga("hnp.set",cDim.ContentType,"vendor");window.setCommonDimensions();if(HNPutilities.getCookie("region")=="EU");window.ga("hnp.send","pageview",window.gaFieldObject);window.gaFieldObject={}}}},2750336,[2837700],330853,[330852]);
Bootstrapper.bindImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;var w=Bootstrapper.propertyWatcher.create(function(){return HNP.ens3pFlag});w.change=function(oldValue,newValue){if(newValue=="true"){var disableTag=false;if(document.location.hostname.match(/((homeguides|smallbusiness|work|healthyeating|livehealthy)\.(chron|sfgate)\.com)/))if(Bootstrapper.Cookies.get("region")=="EU")disableTag=true;(function(){var lotameId=window.lotame_id;
var lotameMethod="_cc"+lotameId;var lotameScript="//tags.crwdcntrl.net/c/"+lotameId+"/cc.js?ns\x3d_cc"+lotameId;appendScript=function(configObj){if(typeof(configObj!="undefined")){var s=document.createElement("script");s.type="text/javascript";s.async=typeof configObj.async!="undefined"?configObj.async:false;s.src=typeof configObj.scriptSrc!="undefined"?configObj.scriptSrc:"";s.id=typeof configObj.scriptId!="undefined"?configObj.scriptId:"";if(typeof configObj.scriptId!="undefined"&&typeof configObj.scriptId==
"function"){s.onload=configObj.callback;s.onreadystatechange=function(){if(this.readyState=="complete")configObj.callback}}if(s.src!==""){var x=document.getElementsByTagName("script")[0];document.getElementsByTagName("script")[0].parentNode.insertBefore(s,x)}}};scriptCallback=function(){var lotameMethod="_cc"+lotameId;var bcpCall=setInterval(function(){if(typeof window[lotameMethod]!="undefined"){window[lotameMethod].bcp();console.log("Lotame Loaded");clearInterval(bcpCall)}else console.log("Lotame Error: _cc"+
lotameId+".bcp does not exist.")},2E3)};initLotame=function(){if(typeof lotameId!=="undefined")appendScript({async:true,scriptSrc:"//tags.crwdcntrl.net/c/"+lotameId+"/cc.js?ns\x3d_cc"+lotameId,scriptId:"LOTCC_"+lotameId,callback:scriptCallback()})};if(disableTag==false)initLotame()})()}}},2838187,595688);
Bootstrapper.bindDependencyDOMParsed(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;Bootstrapper.bindDOMParsed(function(){s2nCheckCounter=1;s2nCheck=setInterval(function(){if(s2nCheckCounter<=3)if(window.s2n){clearInterval(s2nCheck);stnFrame=document.querySelector("div.s2nPlayerFrame iframe");stnFrameDoc=stnFrame.contentDocument||stnFrame.contentWindow.document;s2nPlayerCheck=setInterval(function(){stn=stnFrameDoc.querySelector("#videoPlayer_html5_api");
if(stn){stnTrack();stnGaTrack("Initialize");clearInterval(s2nPlayerCheck)}},100)}else s2nCheckCounter++;else clearInterval(s2nCheck)},250)});function stnTrack(){stnTitle=stnFrameDoc.querySelector("div.headerNowPlaying span.headerText").innerText;stnAds=stnFrameDoc.querySelector("#videoPlayer_ima-ad-container");stnPauseAt="";stnHasPaused=false;stnFirstPlay=false;stnAdCheckRunning=false;stnPlaylistItem=[];window.stnGaTrack=function(action,videoData){var hitLabel="";var hitValue="";var nonInteractiveMode=
false;var trackTitle=true;if(videoData)stnData=videoData;else stnData=stnData=stnGatherData();stnData.position=stnPlaylistItem.position||"";videoTitle=stnPlaylistItem.title!==""?stnPlaylistItem.title:stnData.title;videoDuration=stnPlaylistItem.duration!==""?stnPlaylistItem.duration:stnData.title;hitLabel=[videoTitle,videoDuration,stnData.displayMode,stnData.playerId,stnPlaylistItem.position,""].join("||");if(action.match(/Initialize/)){nonInteractiveMode=true;hitLabel=stnData.playerId;hitValue=Math.round(performance.now()/
1E3,2);trackTitle=false}else if(action.match(/Ad Break/))nonInteractiveMode=true;else;var stnFieldObject={};stnFieldObject={hitType:"event",eventCategory:"SendtoNews Video",eventAction:action,eventLabel:hitLabel,nonInteraction:nonInteractiveMode,dimension62:HNPutilities.getPageVisibility()};if(hitValue!=="")stnFieldObject.eventValue=hitValue;if(trackTitle==true)stnFieldObject.dimension55=videoTitle;window.ga("hnp.send",stnFieldObject)};function stnUpdateDuration(){if(isNaN(stn.duration)==false){var minutes=
parseInt(stn.duration/60,10);var seconds=Math.floor(stn.duration%60,2);var minDisplay=minutes<10?"0"+minutes:minutes;var secDisplay=seconds<10?"0"+seconds:seconds;stnDuration=minDisplay+":"+secDisplay;return stnDuration}else return"(not set)"}function stnGetTitle(){try{domTitle=stnFrameDoc.querySelector("div.headerNowPlaying span.headerText").innerText;if(domTitle!=="")return domTitle.trim();else return"N/A"}catch(e){return"N/A"}}function stnGetDuration(){return stnFrameDoc.querySelector("div.playVideoText \x3e div.videoLength").innerText}
function stnCheckFloat(){if(stnFrameDoc.querySelector("body").classList.contains("float"))return"anchored";else return"inline"}function stnCheckFullscreen(){if(document.fullscreenElement){if(document.fullscreenElement.id==stnFrame.id)return true}else if(stn.webkitDisplayingFullscreen&&stn.webkitDisplayingFullscreen==true)return true;else return false}function stnCheckDisplayMode(){if(typeof stn.webkitDisplayingFullscreen=="boolean")if(stn.webkitDisplayingFullscreen==true)return"fullscreen";else if(stnFrameDoc.querySelector("body").classList.contains("float"))return"anchored";
else return"inline";else{if(typeof document.fullscreenElement!=="undefined")fs=document.fullscreenElement;else if(typeof document.mozFullScreenElement!=="undefined")fs=document.mozCancelFullScreen;else if(typeof document.webkitFullscreenElement!=="undefined")fs=document.webkitFullscreenElement;else if(typeof document.msFullscreenElement!=="undefined")fs=document.msFullscreenElement;if(fs){if(fs.id==stnFrame.id)return"fullscreen"}else if(stnFrameDoc.querySelector("body").classList.contains("float"))return"anchored";
else return"inline"}}stnPlaylist=stnFrameDoc.querySelectorAll("div.playlistSlider div.item");stnPlayerId=stnFrameDoc.querySelector("div.playlist").id;function stnGetPlaylistItemData(index){activeVideo=stnPlaylist[index];activeVideoData=[];activeVideoData.title=activeVideo.querySelector("div.itemDetails div.itemTitle").innerText;activeVideoData.duration=activeVideo.querySelector("div.itemDetails span.barkerTime").innerText;activeVideoData.position=index+1;return activeVideoData}function stnGatherData(){stnFieldObject=
{};stnFieldObject.title=stnGetTitle();stnFieldObject.duration=stnGetDuration();stnFieldObject.displayMode=stnCheckDisplayMode();stnFieldObject.playerId=stnPlayerId;return stnFieldObject}stn.addEventListener("pause",function(){stnPauseAt=stn.currentTime;stnHasPaused=true;setTimeout(function(){if(stnAds&&stnAds.style.display=="block"){stnData=stnGatherData();stnEventLabel=[stnData.title,stnData.duration,stnData.displayMode,stnData.playerId,stnPlaylistItem.position,""].join("||");if(stnAdCheckRunning==
false){stnGaTrack("Ad Break");stnAdCheckRunning=true}}},2E3)});stn.addEventListener("play",function(){stnAdCheckRunning=false;if(stn.currentTime<1&&stnFirstPlay==false)if(!window.stnProgressCheck)window.stnProgressCheck=setInterval(function(){stnMilestone=2;if(stn.currentTime>=stnMilestone){stnGaTrack("Play");stnFirstPlay=true;clearInterval(window.stnProgressCheck);window.stnProgressCheck=null}},500);if(stnHasPaused==false){stnData=stnGatherData();stnEventLabel=[stnData.title,stnData.duration,stnData.displayMode,
stnData.playerId,""].join("||");try{for(var i=0,j=stnPlaylist.length-1;i<j;i++)if(stnPlaylist[i].classList.contains("active"))stnPlaylistItem=stnGetPlaylistItemData(i)}catch(e){}}else if(stnHasPaused==true)stnHasPaused=false});stn.addEventListener("ended",function(){if(stnAds&&stnAds.style.display!=="block"){stnPauseAt="";stnHasPaused=false;stnFirstPlay=false;stnData=stnGatherData();stnEventLabel=[stnPlaylistItem.title,stnPlaylistItem.duration,stnData.displayMode,stnData.playerId,stnPlaylistItem.position,
""].join("||");stnGaTrack("Complete")}})}},2960352,[2938618],609989,[491296]);
Bootstrapper.bindDependencyImmediate(function(){var Bootstrapper=window["Bootstrapper"];var ensightenOptions=Bootstrapper.ensightenOptions;window.ga_account="UA-1616916-20";window.cross_domains="chron.com,coupons.com,fuelfix.com,landsofamerica.com,lavoztx.com,legacy.com,legalnotice.org,monster.com,newhomesource.com,topworkplaces.com,uclick.com,stats.com,har.com";window.ix_account="c7";window.lotame_id="4486";window.initializeGATracking();Bootstrapper.ensEvent.trigger("HNP Third Party Analytics Ready");
if(typeof window.HNP=="undefined")window.HNP={};window.HNP.ens3pFlag="true"},2837700,[2938618],330852,[491296]);