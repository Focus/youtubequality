var quality_opt = ['highres', 'hdsmallTimeout80', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'];

var sytqQuality = 2;
var sytqPause = false;
var sytqPlayer;

var hooked = false;


var smallTimeout = 10;
var mediumTimeout = 100;
var largeTimeout = 400;

function forcePause(){
	console.log('forcePause: '+ sytqPlayer.getPlayerState());
	if(sytqPlayer.getPlayerState() === -1){
		setTimeout(function(){forcePause();}, largeTimeout);
		return;
	}
	sytqPlayer.pauseVideo();
	if(sytqPlayer.getPlayerState() !== 2){
		setTimeout(function(){forcePause();}, smallTimeout);
		return;
	}
}

function changeQuality(){
	console.log(sytqPlayer);
	if(typeof sytqPlayer.getPlayerState !== 'undefined' && sytqPlayer.getPlayerState() >= 0){
		var levels = sytqPlayer.getAvailableQualityLevels();
		if(levels.length <= 0){		//Sometimes in HTML5 players the api isn't ready, even though it should be.
			setTimeout(function(){changeQuality();},smallTimeout);
			return;
		}
		sytqPlayer.pauseVideo();
		for(var i = sytqQuality; i < 8; i++){
			if(levels.indexOf(quality_opt[i]) >=0 ){
				sytqPlayer.setPlaybackQuality(quality_opt[i]);
				break;
			}
		}
		if(sytqPause)
				forcePause();
		else
			sytqPlayer.playVideo();
	}
	else
		return;
}

function ytPlayerChange(event){
	console.log('ytPlayerChange: ' + event);
	if(typeof sytqPlayer.getPlayerState === 'undefined' || sytqPlayer.getPlayerState() === -1 || sytqPlayer.getPlayerState() === 5){
		setTimeout(function(){ytPlayerChange(event);},mediumTimeout);
		return;
	}
	if(event <= 0)
		changeQuality();
}

function ytPlayerSetHooks(){
	console.log('ytPlayerSetHooks');
	if(typeof sytqPlayer.getPlayerState === 'undefined' || sytqPlayer.getPlayerState() < 0 ){
		setTimeout(function(){ytPlayerSetHooks();},mediumTimeout);
		return;
	}
	sytqPlayer.addEventListener("onStateChange", ytPlayerChange);
	changeQuality();
}

function ytPlayerHook(player, quality, pause){
	if(hooked || typeof player !== 'object')
		return;
	console.log('ytPlayerHook');
	hooked = true;
	sytqQuality = quality;
	sytqPause = pause;
	sytqPlayer = player;
	ytPlayerSetHooks();
}