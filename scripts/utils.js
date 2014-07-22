var quality_opt = ['highres', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'];

var sytqQuality = 2;
var sytqPause = false;
var sytqKeepQuality = false;
var sytqPlayer;

var hooked = false;


var smallTimeout = 10;
var mediumTimeout = 100;
var largeTimeout = 400;

function forcePause(){
	//console.log('forcePause: '+ sytqPlayer.getPlayerState());
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
	//console.dir(sytqPlayer);
	if(typeof sytqPlayer.getPlayerState !== 'undefined' && sytqPlayer.getPlayerState() >= 0){
		var levels = sytqPlayer.getAvailableQualityLevels();
		if(levels.length <= 0){		//Sometimes in HTML5 players the api isn't ready, even though it should be.
			setTimeout(function(){changeQuality();},smallTimeout);
			return;
		}
		sytqPlayer.pauseVideo();
		//console.log(levels);
		//console.log(sytqQuality);

		// set first available quality starting from settings down to default
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
	//console.log('ytPlayerChange: ' + event);
	if(typeof sytqPlayer.getPlayerState === 'undefined' || sytqPlayer.getPlayerState() === -1 || sytqPlayer.getPlayerState() === 5){
		setTimeout(function(){ytPlayerChange(event);},mediumTimeout);
		return;
	}
	if(event == -1)
		changeQuality();
}

function ytPlayerSetHooks(){
	//console.log('ytPlayerSetHooks');
	if(typeof sytqPlayer.getPlayerState === 'undefined' || sytqPlayer.getPlayerState() < 0 ){
		setTimeout(function(){ytPlayerSetHooks();},mediumTimeout);
		return;
	}
	sytqPlayer.addEventListener("onStateChange", ytPlayerChange);
	if (sytqKeepQuality)
		sytqPlayer.addEventListener("onPlaybackQualityChange", onPlaybackQualityChange);
	changeQuality();
}

function ytPlayerHook(player, quality, pause, keepquality){
	if(hooked || typeof player !== 'object')
		return;
	hooked = true;
	sytqQuality = quality;
	sytqPause = pause;
	sytqKeepQuality = keepquality || false;
	sytqPlayer = player;
	ytPlayerSetHooks();
}

function onPlaybackQualityChange(suggestedQuality) {
	//console.log('onPlaybackQualityChange(' + suggestedQuality + ')');
	// if automatically set quality is higher than the quality set in the settings
	if (quality_opt.indexOf(suggestedQuality) < sytqQuality) {
		// change it back to the one in the settings
		changeQuality();
	}
}