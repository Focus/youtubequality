var quality = 0;

function injectCode(){
		var inj = document.createElement('script');
		inj.innerHTML =
				["var quality_opt = ['highres', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'];",
				"function changeQuality(player){",
				"		if(player.getPlayerState() >= 0){",
				"				player.pauseVideo();",
				"				var levels = player.getAvailableQualityLevels();",
				"				for(var i = " + quality + "; i < 8; i++){",
				"						if(levels.indexOf(quality_opt[i]) >=0 ){",
				"								player.setPlaybackQuality(quality_opt[i]);",
				"								break;",
				"						}",
				"				}",
				"				player.playVideo();",
				"		}",
				"		else{",
				"				setTimeout(function(){changeQuality(player);},200);",
				"		}",
				"}", 
				"function onYouTubePlayerReady(player){",
				"		changeQuality(player);",
				"}"].join('\n');
		document.body.appendChild(inj);
}


chrome.extension.sendRequest({method: "getStatus"}, function(response) {
		quality = response.status;
		injectCode();
});



