var quality_opt = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'];

var sytqQuality = 2;
var sytqHighPref = false;
var sytqPause = false;
var sytqPlayer;
var sytqSmartSave = true;
var sytqSpeed = 1;

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
	//console.log(sytqPlayer);
	if(typeof sytqPlayer.getPlayerState !== 'undefined' && sytqPlayer.getPlayerState() >= 0){
		var levels = sytqPlayer.getAvailableQualityLevels();
		if(levels.length <= 0){		//Sometimes in HTML5 players the api isn't ready, even though it should be.
			setTimeout(function(){changeQuality();},smallTimeout);
			return;
		}
		sytqPlayer.pauseVideo();
		//console.log(levels);
		//console.log(sytqQuality);
		var i = sytqQuality;
		var found = false;
		if(sytqHighPref) // high quality is preferable
		{
			for(i = sytqQuality; i >= 0; i--){
				if(levels.indexOf(quality_opt[i]) >=0 ){
					found = true;
					break;
				}
			}
			if(!found){
				for(i = sytqQuality + 1; i < 8; i++){
					if(levels.indexOf(quality_opt[i]) >=0 ){
						found = true;
						break;
					}
				}
			}
		}
		else // low quality is preferable
		{
			for(i = sytqQuality; i < 8; i++){
				if(levels.indexOf(quality_opt[i]) >=0 ){
					found = true;
					break;
				}
			}
			if(!found){
				for(i = sytqQuality - 1; i >= 0; i--){
					if(levels.indexOf(quality_opt[i]) >=0 ){
						found = true;
						break;
					}
				}
			}
		}
		if(found)
			sytqPlayer.setPlaybackQuality(quality_opt[i]);
			sytqPlayer.setPlaybackRate(sytqSpeed);
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
	autotoggle();
	changeQuality();
}

function ytPlayerHook(player, speed, quality, highpref, pause, smart_save){
	if(hooked || typeof player !== 'object')
		return;
	console.log('ytPlayerHook');
	hooked = true;
	sytqSpeed = speed;
	sytqQuality = quality;
	sytqHighPref = highpref;
	sytqPause = pause;
	sytqSmartSave = smart_save;
	sytqPlayer = player;
	ytPlayerSetHooks();
}

var min;
var current;
var count;

function autotoggle(){
  if(typeof sytqPlayer.getPlayerState === 'undefined' || sytqPlayer.getPlayerState() < 0 ){
    setTimeout( autotoggle ,200);
    return;
  }

  current = sytqPlayer.getPlaybackQuality();
  count = sytqPlayer.getAvailableQualityLevels();
  min = count[count.length - 2];

  window.addEventListener('focus', function() {
		console.log('focus');
		if( sytqSmartSave === true ) {
    	sytqPlayer.setPlaybackQuality(current);
    	console.log(current);
		}
  });

  window.addEventListener('blur', function() {
		console.log('blur');
		if( sytqSmartSave === true ) {
    	current = sytqPlayer.getPlaybackQuality();
    	sytqPlayer.setPlaybackQuality(min);
    	console.log(min);
		}
	});
}
