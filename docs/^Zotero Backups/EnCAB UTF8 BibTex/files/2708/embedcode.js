!function()
{
	var thisSource = null;
	var isSinglePlayerKey = null;
	var playerKey = null;
	var cid = null;
	var mk = null;
	var singleFullKey = null;

	thisSource = "\/player3\/embedcode.js?fk=VtBBB6Nk&cid=8187&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right";
	isSinglePlayerKey = false;
	playerKey = "VtBBB6Nk";
	cid = "8187";
	mk = null
	if(mk && mk.toLowerCase() === 'full')
	{
		singleFullKey = playerKey + '-' + mk + '-' + cid;
	}

	// use the script source detected by the server to locate the script tag in the current page.
	var thisScript = Array.prototype.filter.call
	(
		document.getElementsByTagName('script'),
		function(scriptTag)
		{
			return scriptTag.src.indexOf(thisSource) !== -1;
		}
	)[0];

	if(thisScript === undefined)
	{
		// something has gone wrong. the script loaded to the page doesn't exist on the page.
		return;
	}

	thisScript.setAttribute('data-type','s2nScript');

	// setup the new script parameters. Use s2nProcessed flag to mark a script as being already shimmed.
	var newScriptParameters = {s2nProcessed:undefined};

	// SC is uppercased if it is to exist
	if(isSinglePlayerKey)
	{
		newScriptParameters.SC = playerKey;
	}
	else
	{
		if(playerKey)
		{
			newScriptParameters.fk = playerKey;
		}
		newScriptParameters.cid = cid;
	}

	// remove hash
	thisScript.src.replace(/#.*/,'');

	var oldScriptPreQuery = thisScript.src.split('?',1);
	var oldScriptParameters = {};

	// all parameters are lowercased for processing.
	thisScript.src.split('?').slice(1).join('?').split('&').forEach(function(param)
	{
		var parts = param.split('=');
		oldScriptParameters[parts[0].toLowerCase()] = parts.slice(1).join('=');
	});

	// all of the following keys are already represented in the new parameters, so don't copy them from the old ones
	delete oldScriptParameters['pkey'];
	delete oldScriptParameters['fk'];
	delete oldScriptParameters['sc'];
	delete oldScriptParameters['sk'];
	delete oldScriptParameters['mk'];
	delete oldScriptParameters['pk'];
	delete oldScriptParameters['cid'];

	// uppercase the size parameter if it exists
	if(oldScriptParameters['size'])
	{
		oldScriptParameters['SIZE'] = oldScriptParameters['size'];
		delete oldScriptParameters['size'];
	}

	var name;

	// copy old parameters to new
	for(name in oldScriptParameters)
	{
		if(!oldScriptParameters.hasOwnProperty(name))
		{
			continue;
		}
		newScriptParameters[name] = oldScriptParameters[name];
	}

	// generate the new query string
	var newQueryString = '';
	for(name in newScriptParameters)
	{
		if(!newScriptParameters.hasOwnProperty(name))
		{
			continue;
		}

		var nonEmptyValue = false;
		switch(newScriptParameters[name])
		{
			case null:
			case undefined:
			case '':
				break;
			default:
				nonEmptyValue = true;
		}

		newQueryString += '&' + name + (nonEmptyValue?('=' + newScriptParameters[name]):'');
	}
	if(newQueryString.length)
	{
		newQueryString = '?' + newQueryString.slice(1);
	}

	// replace the src tag in the script so that it looks like a version 4 script tag.
	thisScript.src = oldScriptPreQuery+newQueryString;

	var versionNumber;

	if(thisSource.indexOf('/player/') === 0)
	{
		versionNumber = 1;
	}
	else if(thisSource.indexOf('/player2/') === 0)
	{
		versionNumber = 2;
	}
	else if(thisSource.indexOf('/player3/') === 0)
	{
		versionNumber = 3;
	}
	else if(thisSource.indexOf('/player4/') === 0)
	{
		versionNumber = 4;
	}
	else
	{
		// something has gone wrong. no version number detected
		return;
	}

	var divElement;
	var barkerElement;
	var embedElement;
	var keyElement;
	var containerElement;

	if (versionNumber === 1) {
		if (!playerKey) {
			return;
		}
		barkerElement = document.getElementById('s2nBarker-' + playerKey);
		embedElement = document.getElementById('s2nEmbed-' + mk);
		keyElement = document.getElementById(mk);
		containerElement = document.getElementById('__s2nPlayerContainerDiv');

		if (barkerElement) {
			divElement = barkerElement;
		} else if(embedElement){
			divElement = embedElement;
		} else if(containerElement){
			divElement = containerElement;
		} else if(keyElement){
			divElement = keyElement;
		} else {
			return;
		}

		divElement.removeAttribute('id');
		divElement.classList.add('s2nFriendlyFrame');
		divElement.classList.add('k-' + playerKey);

		if(barkerElement){
			divElement.setAttribute('data-type','barker');
		} else if(embedElement || keyElement){
			divElement.setAttribute('data-type','single');
		}

	} else if (versionNumber === 2) {
		if (playerKey) {
			divElement = Array.prototype.filter.call
			(
				document.getElementsByClassName('s2nPlayer-' + (singleFullKey || playerKey)), function (element) {
					return element.childElementCount === 0;
				}
			)[0];
			if (!divElement) {
				return;
			}
			divElement.classList.remove('s2nPlayer-' + (singleFullKey || playerKey));
			divElement.classList.add('s2nFriendlyFrame');
			divElement.classList.add('k-' + playerKey);
			if(singleFullKey)
			{
				if(divElement.getAttribute('data-type').toLowerCase().indexOf('float') !== -1)
				{
					divElement.setAttribute('data-type','FLOAT');
				}
				else
				{
					divElement.setAttribute('data-type','FULL');
				}
			}
		}
		else {
			divElement = Array.prototype.filter.call
			(
				document.getElementsByClassName('s2nPlayer'), function (element) {
					return element.className === 's2nPlayer' && element.childElementCount === 0;
				}
			);
			if (divElement.length === 0) {
				return;
			}

			divElement.forEach(function (element) {
				playerKey = element.getAttribute('data-fk') || element.getAttribute('data-pkey');

				if (!playerKey) {
					return;
				}

				element.classList.remove('s2nPlayer');
				element.classList.add('s2nFriendlyFrame');
				element.classList.add('k-' + playerKey);
			})
		}
	} else if (versionNumber === 3) {
		if (!playerKey) {
			return;
		}
		divElement = Array.prototype.filter.call
		(
			document.getElementsByClassName('s2nPlayer'), function (element) {
				return element.classList.contains('k-' + playerKey) && element.childElementCount === 0;
			}
		)[0];
		if (!divElement) {
			return;
		}

		// remove k-playerKey and readd it just so classNames are in correct order. #pedantic #ocd
		divElement.classList.remove('s2nPlayer');
		divElement.classList.remove('k-' + playerKey);
		divElement.classList.add('s2nFriendlyFrame');
		divElement.classList.add('k-' + playerKey);
	}
}();
!function(){

	var latestAmpIntersectionRatio = null;
	function ampListener(e)
	{
		if( (e.source !== parent && e.source !== self) || e.data.sentinel !== 'amp' || e.data.type !== 'intersection')
		{
			return;
		}
		latestAmpIntersectionRatio = e.data.changes.reduce(function(a,b){return (a.time>b.time)?a:b}).intersectionRatio;
	}
	window.addEventListener('message',ampListener);

	function getIframeOrigin(iframe)
	{
		var l = iframe.contentWindow.location;
		return l.protocol + "//" + l.hostname + (l.port ? ':' + l.port: '');
	}

	var S2nVideoPlayer = function(element,key) {
		this.el = element;
		this.key = key;
	};

	S2nVideoPlayer.prototype = {
		setup: function(){

			var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);
			var isTablet = false;
			var parentDiv = this.el;
			var key = this.key;
			var scriptParams;
			var pageParams;
			var playerReady = false;
			var playerType;
			var srcDir = '/player4/';
			var srcFile = 'friendlyEmbedPlayer.php';
			var srcParams;
			var barkerHeight;
			var playerDiv;
			var playerIframe;
			var playerPosition = 'fixed';
			var offsetX = 0;
			var offsetXInEmbedCode = false;
			var offsetY = 0;
			var offsetYInEmbedCode = false;
			var tabletOffsetX = 0;
			var tabletOffsetY = 0;
			var screenLocation = 'bottom right';
			var floatPositionInEmbedCode = false;
			var aspectRatio = 16 / 9;
			var floatWidth = 400;
			var floatWidthInEmbedCode = false;
			var floatWidthPercent = 0.6;
			var floatHeight = floatWidth / aspectRatio + 25;
			var animation = 'off';
			var scriptTags = document.querySelectorAll('[data-type="s2nScript"]');
			var isSafari = (navigator.userAgent.indexOf('Macintosh') >= 0);
			var minVisRatioToPlay;
			var minVisRatioToFloat;
			var visibleState;
			var iabVisible;
			var floatState;
			var playerStarted = false;
			var userInteracted = false;
			var playOnVisible = false;
			var ST_usrKey = sessionStorage.getItem('ST_usrKey');
			var forceAspect = false;
			var ampResizeRequest = false;
			var ampFrameHeight = null;
			var directLoad = 1;

			if(ST_usrKey === null){
				var keyArray = [];
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for(var i = 0; i < 16; i++){
					keyArray.push(possible.charAt(Math.floor(Math.random() * possible.length)));
				}
				ST_usrKey = keyArray.join('');
				sessionStorage.setItem('ST_usrKey',ST_usrKey);
			}

			if(typeof document.referrer != 'undefined' && document.referrer !== ''){
				directLoad = 0;
			}

			var validateUrlRegExp = /^(https?:)?(\/\/)?((?:(?:[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9])\.)+(?:[a-zA-Z0-9][-a-zA-Z0-9]*[a-zA-Z0-9]))((?:\/(?:[-a-zA-Z0-9._~!$&'()*+,;=:@]|(?:%[a-fA-F0-9]{2}))*)*)\/?(\?[^#]*)?/;
			function validateUrl(url)
			{
				var parts = validateUrlRegExp.exec(url);

				// if no match found, return null
				if(!parts)
				{
					return null;
				}

				// http or https is optional. if it's not included, use the scheme of the current page
				if(!parts[1])
				{
					parts[1] = /^https?:/.exec(window.location.href)[0];
				}

				// make sure the double slash is always there
				parts[2] = '//';

				return parts.slice(1).join('');
			}
			
			var ogUrl;
			var canonicalUrl;
			var metaUrl;
			var ref;
			var refOnly = 0;
			var ogSet = 1;
			
			var ogTag = document.querySelector('meta[property="og:url"]');
			var canonicalTag = document.querySelector('link[rel="canonical"]');
			
			if(ogTag){
				ogUrl = validateUrl(ogTag.getAttribute('content'));
			}
			
			if(canonicalTag){
				canonicalUrl = validateUrl(canonicalTag.getAttribute('href'));
			}
			
			var refUrl = window.location.href;
			
			var ogValid = typeof ogUrl != 'undefined' && ogUrl !== null && ogUrl !== '';
			var canValid = typeof canonicalUrl != 'undefined' && canonicalUrl !== null && canonicalUrl !== '';
			var refValid = typeof refUrl != 'undefined' && refUrl !== null && refUrl !== '';
			
			if((ogValid && canValid && ogUrl == canonicalUrl) || (ogValid && refValid && ogUrl == refUrl)){
				metaUrl = ogUrl;
			} else if(canValid && refValid && canonicalUrl == refUrl){
				metaUrl = canonicalUrl;
			} else if(ogValid){
				metaUrl = ogUrl;
			} else if(canValid){
				metaUrl = canonicalUrl;
			} else if(refValid){
				metaUrl = refUrl;
				refOnly = 1;
			} else {
				metaUrl = '';
				ogSet = 0;
			}
			
			ref = metaUrl;
			
			var playlistAdHeight = 0;
			var floatPercentage = -1;
			var percentInitilized = false;
			var floatOnce = 'NO';
			var userClosed = false;
			var frameTag;

			function Queue()
			{
				this.array = [];
			}
			Queue.prototype.push = function(item)
			{
				if(this.array)
				{
					this.array.push(item);
				}
				else
				{
					item();
				}
			};
			Queue.prototype.trigger = function()
			{
				if(!this.array)
				{
					return;
				}
				this.array.forEach
				(
					function(item)
					{
						item();
					}
				);
				this.array = false;
			};

			var floatQueue = new Queue;
			var scrollQueue = new Queue;

			// OVERRIDE: Todo: FriendlyFrame requires that ref points to the current domain.
			// If og:url is not set right (which is where metaUrl comes from), then cross domain dies.

			scriptParams = this.parseUrl('script');
			pageParams = this.parseUrl('page');

			if (typeof pageParams['s2ncid'] !== 'undefined'){
				scriptParams['recache'] = '1';
				scriptParams['cid'] = pageParams['s2ncid'];
			}

			if (pageParams['s2nkey']){
				scriptParams['recache'] = '1';
				var oldDiv;
				oldDiv = document.getElementsByClassName('k-' + key)[0];
				oldDiv.classList.remove('k-' + key);
				key = pageParams['s2nkey'];
				oldDiv.classList.add('k-' + key);
				if(scriptParams['SC']) scriptParams['SC'] = key;
				if(scriptParams['fk']) scriptParams['fk'] = key;
			}

			if(scriptParams.SC && scriptParams.SC.split('-')[1] === 'FULL')
			{
				scriptParams.fk = scriptParams.SC.split('-')[0];
				scriptParams.cid = scriptParams.SC.split('-')[2];
				delete scriptParams.SC;
			}

			srcParams = [];

			for (var prop in scriptParams){
			
				if(!scriptParams.hasOwnProperty(prop) || (scriptParams[prop]) === undefined)
				{
					continue;
				}

				if(prop === 'SC')
				{
					scriptParams[prop] = key;
				} else if(prop === 'fk')
					scriptParams[prop] = key;
				else if(prop === 'offsetx')
				{
					if(isMobile)
					{
                        offsetX = 10;
					}
					else
					{
                        offsetX = parseInt(scriptParams[prop]);
                        offsetXInEmbedCode = true;
					}
				}
				else if(prop === 'offsety')
				{
                    if(isMobile)
                    {
                        offsetY = 10;
                    }
                    else
                    {
                        offsetY = parseInt(scriptParams[prop]);
                        offsetYInEmbedCode = true;
                    }
				}
				else if(prop === 'floatwidth')
				{
					if(isMobile)
					{
                        floatWidth = Math.round(window.innerWidth*floatWidthPercent);
					}
					else
					{
                        floatWidth = parseInt(scriptParams[prop]);
                        floatWidthInEmbedCode = true;
					}
					floatHeight = ((floatWidth / aspectRatio) + 25);
				}
				else if(prop === 'floatposition')
				{
					if(isMobile)
					{
                        screenLocation = 'bottom right';
					}
					else
					{
                        screenLocation = scriptParams[prop].replace('-', ' ');
                        floatPositionInEmbedCode = true;
					}
				}
				else if(prop === 'animation')
				{
					animation = scriptParams[prop];
				}
				else if(prop === 'amptag')
				{
					switch(scriptParams['amptag'] | 0)
					{
						case 1:
							forceAspect = true;
							break;
						case 2:
							ampResizeRequest = true;
							break;
					}
				}

				srcParams.push(prop + '=' + scriptParams[prop]);
			}

			srcParams = srcParams.join('&');

			var match = scriptTags[0].getAttribute('src').match(/((http:|https:)?\/\/)(www[0-9]?\.)?(.[^\/:]+)/i);
			if (match !== null && match.length > 2 && typeof match[4] === 'string' && match[4].length > 0) {
				var srcDomain = match[1] + match[4];
			}

			playerType = parentDiv.getAttribute('data-type');

			if(playerType==='barker') {
				switch (scriptParams['SIZE']) {
					case '400':
						barkerHeight = '265';
						break;
					case '500':
						barkerHeight = '313';
						break;
					default:
						barkerHeight = '220'
				}
			}

			srcParams += '&type=' + playerType;
			srcParams += '&ogSet=' + ogSet;
			srcParams += '&inIframe=' + inIframe();
			srcParams += '&ref=' + encodeURIComponent(ref);
			srcParams += '&refOnly=' + refOnly;
			
			writeIframe(parentDiv);
		
			playerDiv = parentDiv.firstChild;
			playerIframe = playerDiv.firstChild;
			
			var frameOrigin = getIframeOrigin(playerIframe);

			setSize(playerDiv, parentDiv);
			bindEvents(playerDiv, parentDiv, key);
			
			var visibleOnLoad = isPlayerVisible(parentDiv, 0.5);

			frameTag.contentWindow.ampCheckUrl = window.location.href;
			frameTag.contentWindow.ST_usrKey = ST_usrKey;
			frameTag.contentWindow.floatWidth = floatWidth;
			frameTag.contentWindow.visibleOnLoad = visibleOnLoad;
			frameTag.contentWindow.directLoad = directLoad;

			return playerDiv;

			/*** Begin functions for player creation ***/
			function writeIframe(obj){
				var divTag = document.createElement('div');
				divTag.className = 's2nPlayerFrame';
				frameTag = document.createElement('iframe');
				frameTag.setAttribute('allow','autoplay *; fullscreen *');

				var attr =
				{
					id: key,
					frameborder:'0',
					scrolling:'no',
					allowfullscreen: 'true',
					style: "height:100%; width:1px; min-width:100%; margin:0 auto; padding:0; display:block; border:0 none;"
				};

				for(var name in attr)
				{
					frameTag.setAttribute(name,attr[name]);
				}

				frameTag.src = 'javascript:false';

				obj.innerHTML = '';
				obj.appendChild(divTag);
				divTag.appendChild(frameTag);

				frameTag.contentDocument.open().write
				(
					'<!DOCTYPE html>\n'+
					'<html lang="en">\n'+
					'<head><meta charset="utf-8"><title>s2n Friendly Frame</title></head>\n'+
					'<body onload="window.inDapIF = true;\n'+
					'              var js = document.createElement(\'script\');\n'+
					'              js.src = \''+srcDomain+srcDir+srcFile+'?'+srcParams+'\';\n'+
					'              document.body.appendChild(js);">\n'+
					'</body>\n'+
					'</html>\n'
				);
				frameTag.contentDocument.close();
				frameTag.contentWindow.s2nParams = srcParams;
			}

			// set the size of the playerDiv to the parentDiv if player is fixed, to float parameters if float
			function setSize(playerDiv, parentDiv) {

				var cssString;

				// get the padding of the parentDiv's parent
				var paddingWidth = parseInt(window.getComputedStyle(parentDiv.parentNode).paddingRight) + parseInt(window.getComputedStyle(parentDiv.parentNode).paddingLeft);
				// get the width of the parentDiv's parent
				var playerWidth = parentDiv.parentNode.offsetWidth - paddingWidth;
				// subtract the padding leaving the size of the content + the size of the borders
				playerWidth -= paddingWidth;

				var playerHeight = (Math.floor(playerWidth / aspectRatio) + (forceAspect ? 0 : 25));
				
				if((playerWidth > 650 && barkerHeight == 220) || (playerWidth > 700 && barkerHeight == 265) || (playerWidth > 750 && barkerHeight == 313)){
					playerHeight = barkerHeight;
				}

				if(ampResizeRequest && playerHeight !== ampFrameHeight)
				{
					ampFrameHeight = playerHeight;
					window.parent.postMessage
					(
						{
							sentinel: 'amp',
							type: 'embed-size',
							height: playerHeight
						},
						'*'
					);
				}
				cssString = 'width:' + playerWidth + 'px; height:' + playerHeight + 'px; position:relative;';
				parentDiv.style.cssText += ';' + cssString;	
				
				if(playerPosition === 'float')
				{
					s2nPlayerFloat(playerDiv,parentDiv,playerIframe,true);
				}
				else if(playerPosition == 'fixed')
				{

					cssString = 'width:' + playerWidth + 'px; height:' + playerHeight + 'px; position:absolute; top:0px; left:0px; z-index:1;';
					playerDiv.style.cssText += ';' + cssString;

				}
			}

			function bindEvents(playerDiv, parentDiv, key){

				var playerHasStartedOnce = false;

				function onScrollTimeout(delayStart){

					if(!delayStart)
					{
						scrollQueue.trigger();
					}

					var newVisibleState = isPlayerVisible(parentDiv,minVisRatioToPlay) ? 'YES' : 'NO' ;
					var newFloatState = isPlayerVisible(parentDiv,minVisRatioToFloat) ? 'YES' : 'NO' ;
					var newIabVisible = isPlayerVisible(parentDiv,0.5) ? 'YES' : 'NO' ;
					if( newFloatState !== floatState || newIabVisible !== iabVisible || newVisibleState !== visibleState)
					{
						visibleState = newVisibleState;
						floatState = newFloatState;
						iabVisible = newIabVisible;
						if(delayStart)
						{
							return;
						}
						var messageData = {'message':'checkplayerstatus','povStartState':visibleState,'visibleState':((floatState == 'YES' || playerPosition === 'float')?'YES':'NO'),'iabVisible':(iabVisible == 'YES' || playerPosition === 'float')?'YES':'NO'};
						xPostMessage(playerIframe, messageData, frameOrigin);
					}

					if((playOnVisible || floatPercentage == 1) && visibleState === 'YES')
					{
						s2n.stopPlayonVisible && s2n.stopPlayonVisible();
						s2n.stopPlayonVisible = closePlayer;
						playOnVisible = false;
						percentInitilized = true;
						floatPercentage = -1;
						if(!playerHasStartedOnce)
						{
							xPostMessage(playerIframe, {'message':'startplayer'}, frameOrigin);
						}
					}

					if(!isMobile && window.scrollY/1000 >= floatPercentage && floatPercentage > 0 && floatPercentage < 1){
						  
						 if(!s2n.stopPlayonVisible) {
							playOnVisible = false;
							percentInitilized = true;
							s2n.stopPlayonVisible = closePlayer;
							
							if(floatOnce != 'YES'){
								s2nPlayerFloat(playerDiv, parentDiv, playerIframe);
							}
							
							percentInitilized = true;
							floatPercentage = -1;

							if(!playerHasStartedOnce)
							{
								xPostMessage(playerIframe, {'message': 'startplayer'}, frameOrigin);
							}
						}
					}
				}

				var scrollTimeout;
				function onScroll(){
					if(scrollTimeout)
					{
						clearTimeout(scrollTimeout);
					}
					scrollTimeout = setTimeout(function(){scrollTimeout = null; onScrollTimeout();},0);
				}

				var currentWindow = window;
				while(currentWindow)
				{
					currentWindow.addEventListener('scroll', onScroll);
					currentWindow.addEventListener('resize', onScroll);
					currentWindow = ( typeof currentWindow.frameElement === 'object' && currentWindow.frameElement ) ? currentWindow.parent : null;
				}

				window.addEventListener('resize', function () {
					setSize(playerDiv, parentDiv);
				}, true);

				playerDiv.addEventListener('transitionend',function(){
					var cssString = 'transition-property:all; transition-duration:0s; transition-timing-function:ease;';
					playerDiv.style.cssText += ';' + cssString;
				},false);

				window.addEventListener('message', function (e) {
					var messageData;

					if(e.data.message === 'immediateVisibility')
					{
						e.source.postMessage
						(
							{
								message:'immediateVisibility',
								ratio:(latestAmpIntersectionRatio !== null ? latestAmpIntersectionRatio : getVisibleRatio(parentDiv))
							},
							e.origin
						);
					}

					if( key !== e.data.returnedKey )
					{
						if(e.data.message == 'closeAllFloats'){
							if(playerPosition == 'float'){
								s2nPlayerFix(playerDiv,parentDiv,playerIframe);
							}
							closePlayer();
						}

						return;
					}

					if(e.data.message == 'setPlayOnVisible')
					{
						playOnVisible = true;
					}

					if(e.data.message == 'firstAdStartOrError')
					{
						if(e.data.status === 'started')
						{
							playerHasStartedOnce = true;
						}
						floatQueue.trigger();
					}

					if(e.data.message == 'playerStatus'){
						userInteracted = e.data.userInteracted;
						playerStarted = e.data.playerState === 'playing';
						userClosed = e.data.userClosed;
						
						if(userClosed){
							userClosed = true;
						}

						if(typeof e.data.floatPercentage !== 'undefined' && percentInitilized === false){
							floatPercentage = parseFloat(e.data.floatPercentage);
						}
						
						if(playerStarted && playerPosition === 'fixed' && floatState === 'NO' || playerPosition === 'float' && floatState === 'YES')
						{
							xPostMessage(playerIframe, {'message':'checkplayerstate','playerPosition':playerPosition}, frameOrigin);
						}
					}

					if(e.data.message == 'closeFloat'){
						s2nPlayerFix(playerDiv,parentDiv,playerIframe);
						closePlayer();
					} else if(e.data.message == 'checkPlayerState'){
						
						if(playerPosition == 'float'){

							messageData = {'message':'playerFloating'};
							xPostMessage(playerIframe, messageData, frameOrigin);
							
						}
					} else if(e.data.message == 'fixplayer' && playerPosition != 'fixed'){
						
						if(typeof e.data.source != 'undefined' && e.data.source == 'closeButton'){
							userClosed = true;
						}
						
						s2nPlayerFix(playerDiv,parentDiv,playerIframe); 
						
					} else if(e.data.message == 'floatplayer' && playerPosition != 'float'){

						if(floatOnce != 'YES' && !userClosed){
							
						s2nPlayerFloat(playerDiv,parentDiv,playerIframe);	
						
							if((typeof e != 'undefined') && e.data.hasOwnProperty('floatOnce')){
								floatOnce = e.data.floatOnce;
							}
						}

					} else if(e.data.message == 'isVisible'){
						
						if(latestAmpIntersectionRatio !== null)
						{
							window.addEventListener('message',function(e)
							{
								if(e.source !== parent || e.data.sentinel !== 'amp' || e.data.type !== 'intersection')
								{
									return;
								}
								latestAmpIntersectionRatio = e.data.changes.reduce(function(a,b){return a.time > b.time ? a : b}).intersectionRatio;
								onScrollTimeout();
							});
						}
						// this is the very first event every player will send to the embed controller.
						// embed uses the passed in information to start ONE playOnVisible player if it is visible
						// and to update the visible status of any high viewability players so that they can float.

						if(!floatWidthInEmbedCode && e.data.floatWidthPercent)
						{
							floatWidthPercent = parseFloat(e.data.floatWidthPercent);
						}
						
						if(!floatWidthInEmbedCode && e.data.floatWidth)
						{
							floatWidth = parseInt(e.data.floatWidth);
						}
						if(isMobile && !frameTag.contentWindow.isTablet)
						{
							floatWidth = window.innerWidth*floatWidthPercent;
						}
					
						floatHeight = floatWidth / 16 * 9 + 25;
						if(!floatPositionInEmbedCode && e.data.floatPosition)
						{
							screenLocation = e.data.floatPosition.replace('-', ' ');
						}
						if(!offsetXInEmbedCode && e.data.offsetX)
						{
							offsetX = parseInt(e.data.offsetX);
						}
						if(!offsetYInEmbedCode && e.data.offsetY)
						{
							offsetY = parseInt(e.data.offsetY);
						}
						
						/* **** BEGIN TABLET EMBED CODE OVERRIDES **** */
						// These overrides are to force tablets to behave like the desktop version.
						
						if(frameTag.contentWindow.isTablet && scriptParams['offsetx']){
							offsetX = parseInt(scriptParams['offsetx']);
							offsetXInEmbedCode = true;
						}
						
						if(frameTag.contentWindow.isTablet && scriptParams['offsety']){
							offsetY = parseInt(scriptParams['offsety']);
							offsetYInEmbedCode = true;
						}
					
						if(frameTag.contentWindow.isTablet && scriptParams['floatwidth']){
							floatWidth = parseInt(scriptParams['floatwidth']);
							floatHeight = floatWidth / 16 * 9 + 25;
							floatWidthInEmbedCode = true;
						}
						
						if(frameTag.contentWindow.isTablet && scriptParams['floatposition']){
							screenLocation = scriptParams['floatposition'].replace('-', ' ');
							floatPositionInEmbedCode = true;
						}
						
						/* **** END TABLET EMBED CODE OVERRIDES **** */
						
						minVisRatioToPlay = parseFloat(e.data.ESG_minVisRatio) || 0.5;
						minVisRatioToFloat = 0.6;
						playerReady = true;
						playOnVisible = e.data.ESG_playOnVisible === 'YES';

						onScrollTimeout(e.data.ESG_delayStartOnScroll === 'YES');

						if(e.data.floatBackground)
						{
							parentDiv.style.backgroundColor = e.data.floatBackground;
						}
						if(visibleState === 'YES' && playOnVisible)
						{
							playOnVisible = false;
							s2n.stopPlayonVisible && s2n.stopPlayonVisible();
							s2n.stopPlayonVisible = closePlayer;

							percentInitilized = true;
							floatPercentage = -1;

							scrollQueue.push(function()
							{
								if(!playerHasStartedOnce)
								{
									xPostMessage(playerIframe, {'message': 'startplayer'}, frameOrigin)
								}
							});
						}
						if(floatState === 'NO' && e.data.floatPlayer && latestAmpIntersectionRatio === null)
						{
							if(!s2n.stopPlayonVisible) {
								playOnVisible = false;
								s2n.stopPlayonVisible = closePlayer;

								if(floatOnce != 'YES'){
								s2nPlayerFloat(playerDiv, parentDiv, playerIframe);

									if((typeof e != 'undefined') && e.data.hasOwnProperty('floatOnce')){
										floatOnce = e.data.floatOnce;
									}
								}

								percentInitilized = true;
								floatPercentage = -1;

								scrollQueue.push(function()
								{
									if(!playerHasStartedOnce)
									{
										xPostMessage(playerIframe, {'message': 'startplayer'}, frameOrigin)
									}
								});
							}
						}

						messageData = {'message':'checkplayerstatus','key':key,'visibleState':((floatState == 'YES' || playerPosition === 'float')?'YES':'NO'),'iabVisible':(iabVisible == 'YES' || playerPosition === 'float')?'YES':'NO'};
						xPostMessage(playerIframe, messageData, frameOrigin);

					} else if(e.data.message == 'staticHeight'){
						playlistAdHeight = 270;
						var cssString = 'height:' + e.data.playerHeight + 'px;';
						playerDiv.style.cssText += ';' + cssString;
						parentDiv.style.cssText += ';' + cssString;
					}
					
				}, false);
				
			} // EoF

			function xPostMessage(iframe, messageData, origin){
				/*
				var data = {};
				for(var item in messageData)
				{
					if(!messageData.hasOwnProperty(item))
					{
						continue;
					}
					data[item] = messageData[item];
				}
				delete data.message;
				*/
				// console.log(key, 'embedcode', messageData.message, data);

				// noinspection JSUnresolvedFunction
				iframe.contentWindow && iframe.contentWindow.postMessage(messageData, origin);
			}


			function s2nPlayerFloat(playerDiv,parentDiv,s2nIframe,onSize){
				
				if(typeof(onSize) === 'undefined'){onSize = false;}

				var parentPos = parentDiv.getBoundingClientRect();
				var viewableWidth = playerDiv.ownerDocument.documentElement.clientWidth;
				var viewableHeight = playerDiv.ownerDocument.documentElement.clientHeight;
				var translateY;
				var translateX;

				var floatToX = 0;
				var floatToY = 0;

				if(screenLocation.indexOf('left') !== -1)
				{
					floatToX --;
				}
				if (screenLocation.indexOf('right') !== -1)
				{
					floatToX ++;
				}
				if(screenLocation.indexOf('top') !== -1)
				{
					floatToY --;
				}
				if (screenLocation.indexOf('bottom') !== -1)
				{
					floatToY ++;
				}

				// player fixed position style changes
				cssString = 'position:fixed;';
				if(floatToX < 0)
				{
					cssString += ' left:'+parentPos.left+'px;';
					cssString += ' right: auto;';
					translateX = -parentPos.left + offsetX;
				}
				else
				{
					cssString += ' left: auto;';
					cssString += ' right: '+(viewableWidth-parentPos.right)+'px;';
					if(floatToX === 0)
					{
						translateX = -parentPos.left - parentPos.width + viewableWidth/2 + floatWidth/2 + offsetX;
					}
					else
					{
						translateX = -parentPos.left - parentPos.width + viewableWidth - offsetX;
					}
				}
				if(floatToY < 0)
				{
					cssString += ' top:'+parentPos.top+'px;';
					cssString += ' bottom: auto;';
					translateY = -parentPos.top + offsetY;
				}
				else
				{
					cssString += ' top: auto;';
					cssString += ' bottom: '+(viewableHeight-parentPos.bottom)+'px;';
					if(floatToY === 0)
					{
						translateY = -parentPos.top - parentPos.height + viewableHeight/2 + floatHeight/2 + offsetY;
					}
					else
					{
						translateY = -parentPos.top - parentPos.height + viewableHeight - offsetY;
					}
				}

				cssString += ' width:'+floatWidth+'px; height:'+floatHeight+'px; transform:translate('+translateX+'px,'+translateY+'px); z-index:2147483647;';

				if(onSize)
				{
					playerDiv.style.cssText += ';' + cssString;
					return;
				}

				!function(cssString)
				{
					playerDiv.style.visibility = 'hidden';
					playerDiv.style.cssText += ';' + cssString;
					playerPosition = 'float';
					xPostMessage(s2nIframe, {'message':'float'}, frameOrigin);

					floatQueue.push
					(
						function()
						{
							playerDiv.style.visibility = 'visible';
						}
					);
				}(cssString);
			} // EoF

			function s2nPlayerFix(playerDiv,parentDiv,s2nIframe){

				var parentPos = parentDiv.getBoundingClientRect();
				var parentWidth = parentDiv.offsetWidth;
				var playerHeight = (Math.floor(parentWidth / aspectRatio) + 25);
				var viewableWidth = playerDiv.ownerDocument.documentElement.clientWidth;
				var viewableHeight = playerDiv.ownerDocument.documentElement.clientHeight;
				
				if(playerType === 'barker' && (parentWidth > 650 && barkerHeight == 220) || (parentWidth > 700 && barkerHeight == 265) || (parentWidth > 750 && barkerHeight == 313)){
					playerHeight = barkerHeight;	
				}
				
				var messageData = {'message':'fixed'};
				var translateY;
				var translateX;

				if(screenLocation.indexOf('top') !== -1){
					translateY = parentPos.top >= 0 ? -Math.abs(parentPos.top) + offsetY : Math.abs(parentPos.top) + offsetY;
				} else if (screenLocation.indexOf('bottom') !== -1){
					translateY = (viewableHeight - floatHeight - parentPos.top - offsetY);
				} else if(screenLocation.indexOf('middle') !== -1){
					translateY = (viewableHeight / 2) - (floatHeight / 2) - parentPos.top - offsetY;
				}
				
				if(screenLocation.indexOf('left') !== -1){
					translateX = -Math.abs(parentPos.left) + offsetX;
				} else if(screenLocation.indexOf('right') !== -1){
					translateX = (viewableWidth - floatWidth - parentPos.left - offsetX);
				} else if(screenLocation.indexOf('middle') !== -1){
					translateX = (viewableWidth / 2) - (floatWidth / 2) - parentPos.left - offsetX;
				}

				playerPosition = 'fixed';
				xPostMessage(s2nIframe,messageData, frameOrigin);

				var cssString = 'position:absolute; transform:none; z-index:1; top:0px; left:0px; width:'+parentWidth+'px; height:'+playerHeight+'px;';
				playerDiv.style.cssText += ';' + cssString;

			} // EoF

			function getVisibleRatio(element)
			{
				var elementWindow = element.ownerDocument.defaultView;
				var style = elementWindow.getComputedStyle(element);
				var boundingRect = element.getBoundingClientRect();

				var viewableRect =
					{
						left: boundingRect.left + parseInt(style.borderLeftWidth),
						right: boundingRect.right - parseInt(style.borderRightWidth),
						top: boundingRect.top + parseInt(style.borderTopWidth),
						bottom: boundingRect.bottom - parseInt(style.borderBottomWidth)
					};

				if(viewableRect.right <= viewableRect.left || viewableRect.bottom <= viewableRect.top )
				{
					return 0;
				}

				var originalRect =
					{
						left: viewableRect.left,
						right: viewableRect.right,
						top: viewableRect.top,
						bottom: viewableRect.bottom
					};

				viewableRect.left   = Math.min(Math.max(0,viewableRect.left),elementWindow.innerWidth);
				viewableRect.right  = Math.min(Math.max(0,viewableRect.right),elementWindow.innerWidth);
				viewableRect.top    = Math.min(Math.max(0,viewableRect.top),elementWindow.innerHeight);
				viewableRect.bottom = Math.min(Math.max(0,viewableRect.bottom),elementWindow.innerHeight);

				while(typeof(elementWindow.frameElement) === 'object' && element.frameElement)
				{
					element = elementWindow.frameElement;
					elementWindow = element.ownerDocument.defaultView;
					style = elementWindow.getComputedStyle(element);
					boundingRect = element.getBoundingClientRect();

					viewableRect.left += boundingRect.left + parseInt(style.borderLeftWidth);
					viewableRect.right += boundingRect.left + parseInt(style.borderLeftWidth);
					viewableRect.top += boundingRect.top + parseInt(style.borderTopWidth);
					viewableRect.bottom += boundingRect.top + parseInt(style.borderTopWidth);

					viewableRect.left = Math.min(Math.max(0, viewableRect.left), elementWindow.innerWidth);
					viewableRect.right = Math.min(Math.max(0, viewableRect.right), elementWindow.innerWidth);
					viewableRect.top = Math.min(Math.max(0, viewableRect.top), elementWindow.innerHeight);
					viewableRect.bottom = Math.min(Math.max(0, viewableRect.bottom), elementWindow.innerHeight);
				}

				var originalArea = (originalRect.right-originalRect.left)*(originalRect.bottom-originalRect.top);
				var viewableArea = (viewableRect.right-viewableRect.left)*(viewableRect.bottom-viewableRect.top);

				return viewableArea/originalArea;
			}

			function isPlayerVisible(s2nDivFrame, minVisRatio) {				
				minVisRatio = minVisRatio || 1;
				return (latestAmpIntersectionRatio !== null ? latestAmpIntersectionRatio: getVisibleRatio(s2nDivFrame)) >= minVisRatio;
			}

			function closePlayer(){
				var messageData = {'message':'resetPlayer'};
				xPostMessage(playerIframe, messageData, frameOrigin);
				s2nPlayerFix(playerDiv,parentDiv,playerIframe);
			}

			function inIframe()
			{
				var friendly = false;
				var nonFriendly = false;
				var win = window.self;

				try
				{
					while(win != win.parent)
					{
						win = win.parent;
						friendly = win.location.href;
					}
				}
				catch(e)
				{
					nonFriendly = true;
				}

				if(nonFriendly && friendly)
				{
					return 4;
				}
				if(friendly)
				{
					return 3;
				}
				if(nonFriendly)
				{
					return 1;
				}
				return 0;
			}
		},

		removePlayer: function(){
			this.el.innerHTML = '';
			
			return this.el;
		},

		resetPlayer: function(){

			[].slice.apply(document.querySelectorAll('.s2nFriendlyFrame iframe')).forEach(function(frame)
			{
				// noinspection JSUnresolvedFunction
				frame.contentWindow.postMessage({'message':'resetPlayer'},getIframeOrigin(frame));
			});

			return this.el;
		},
		
		play: function(key){
			
			if(typeof key != 'undefined'){
				frame = document.getElementById(key+'-1');
				frame.contentWindow.postMessage({'message':'startplayer'},getIframeOrigin(frame));
			} else {
				[].slice.apply(document.querySelectorAll('.s2nFriendlyFrame iframe')).forEach(function(frame)
				{
					// noinspection JSUnresolvedFunction
					frame.contentWindow.postMessage({'message':'startplayer'},getIframeOrigin(frame));
				});
			}
			
			
			return this.el;
		},

		parseUrl: function(source){

			var query;
			var split;
			var classKey = '';
			var parts = {};

			if(source == 'script'){

				var scripts = document.getElementsByTagName("script");
				
				for (i = 0; i < scripts.length; ++i) {
				
					var params = {};
					
					var scriptSrcAtt = scripts[i].src;
				
					if(scriptSrcAtt.indexOf('sendtonews.com') >= 0){

						var scriptParams = scriptSrcAtt.split("?")[1].replace(/=/gi,':').split('&');
						
						for(var p=0;p<scriptParams.length;p++){
							var paramsSplit = scriptParams[p].split(':');
							params[paramsSplit[0]] = paramsSplit[1];
						}

						if(typeof params['fk'] !== 'undefined'){
							classKey = params['fk'];
						} else if(typeof params['SC'] !== 'undefined'){
							classKey = params['SC'];
						}
						
						var divCheck = document.getElementsByClassName('s2nFriendlyFrame k-'+classKey);
						
						for( var n = 0; n < divCheck.length; ++n)
						{
							if(divCheck[n].childElementCount === 0)
							{
								return params;
							}
						}
					}
				}
			} else if(source == 'page'){
				query = window.location.href.split("?")[1];
			}

			if(typeof query !== 'undefined')
			{
				split = query.replace(/=/gi,':').split('&');

				for(var i=0;i<split.length;i++){
					split[i] = split[i].split(':');
					parts[split[i][0]] = split[i][1];
				}
			}

			return parts;
		}
	};

	// create global state if it doesn't exist
	window.s2n = window.s2n || {};
	window.s2n.playerDivs = window.s2n.playerDivs || [];
	window.s2n.controllers = window.s2n.controllers || [];
	window.s2n.keyCounts = window.s2n.keyCounts || {};

	// for every playerDiv on the page
	[].slice.apply(document.getElementsByClassName('s2nFriendlyFrame')).forEach(function(playerDiv)
	{
		// if we've already handled and are tracking it, do nothing
		if(window.s2n.playerDivs.indexOf(playerDiv) != -1)
		{
			return;
		}

		var key = null;
		// grab the key from the k-* classname
		[].slice.apply(playerDiv.classList).forEach(function(item)
		{
			var parts = item.split('-');
			if(parts[0] === 'k')
			{
				if(parts[2] === 'FULL')
				{
					key = parts[1];
				}
				else
				{
					key = parts.slice(1).join('-');
				}
			}
		});

		if(!key)
		{
			return;
		}

		window.s2n.keyCounts[key] = window.s2n.keyCounts[key] || 0 ;

		key += '-' + ++window.s2n.keyCounts[key] ;
		// track the new untracked player
		window.s2n.playerDivs.push(playerDiv);

		// create the player
		window.s2nVideo = new S2nVideoPlayer(playerDiv,key);
		window.s2nVideo.setup();

		// track the player controller
		window.s2n.controllers.push(window.s2nVideo);

		window.s2nResetPlayers = window.s2nStopPlayer = window.s2nVideo.resetPlayer;

	});

}();
