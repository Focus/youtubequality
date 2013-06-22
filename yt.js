var quality = 0;

function injectCode(){
		var inj = document.createElement('script');
		inj.innerHTML =
				["var quality_opt = ['highres', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'];",
				"function changeQuality(player){",
				"		if(player.getPlayerState() >= 0){",
				"				player.pauseVideo();",
				"				var levels = player.getAvailableQualityLevels();",
				"				if(levels.length <= 0){", //Sometimes in HTML5 players the api isn't ready, even though it should be.
				"						setTimeout(function(){changeQuality(player);},200);",
				"						return;",
				"				}",
				"				for(var i = " + quality + "; i < 8; i++){",
				"						if(levels.indexOf(quality_opt[i]) >=0 ){",
				"								player.setPlaybackQuality(quality_opt[i]);",
				"								break;",
				"						}",
				"				}",
				"				player.playVideo();",
				"		}",
				"		else{",
				"				changeQuality(player);",
				"		}",
				"}", 
				"function onYouTubePlayerReady(player){",
				"		setTimeout(function(){changeQuality(player);},200);",
				"}"].join('\n');
		document.body.appendChild(inj);
}


chrome.extension.sendRequest({method: "getStatus"}, function(response) {
		quality = response.status;
		injectCode();
});



