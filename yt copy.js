		
var YP = new Object();

// Quality options available from Youtube API
YP.quality_options = ['highres', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'default'];


// Number of times to check for player before giving up
YP.max_attempts = 500;

// Initialize player, and make sure API is ready
YP.init = function() {
		// Get player
		if (document.getElementById('movie_player')) {
				// Normal video player
				this.player = document.getElementById('movie_player');
		}
		else if (document.getElementById('movie_player-flash')) {
				// Channel video player
				this.player = document.getElementById('movie_player-flash');
		}
		else {
				return false;
		}

		// Check for HTML5 player
		this.html5 = this.player.getElementsByTagName('video').length ? true : false;

		// Make sure player API is ready
		if (typeof this.player.pauseVideo === 'undefined') {
				return false;
		}
		// Pause to avoid flicker caused be loading a different quality
		this.player.pauseVideo();

		// In Chrome Flash player, player.setQualityLevel() doesn't seem to work unless video has started playing (or is paused)
		// In Firefox HTML5 player, player.getPlayerState() returns -1 even if player is paused
		if (!this.html5 && this.player.getPlayerState() < 1) {
				return false;
		}

		// Everything is good to go
		return true;
};

// Set video quality to YP.quality or highest available
YP.setQuality = function() {
		// Get available quality levels
		var levels = this.player.getAvailableQualityLevels();
		// Set playback quality
		if (levels.indexOf(this.quality) >= 0) {
				this.player.setPlaybackQuality(this.quality);
		}
		else {
				this.player.setPlaybackQuality(levels[0]);
		}
		// Play video
		this.player.playVideo();
}

// Start execution
YP.start = function(attempts) {
		// Initialize self (look for player)
		var temp = this.init();
		if (temp) {
				this.setQuality();
				return true;
		}
		// Give up (page has no player)
		if (attempts > this.max_attempts) {
				return false;
		}
		// Try again until initialize sucessful (maybe page still loading)
		setTimeout(function() {
				YP.start(++attempts);
		}, 200);
}

// Main


chrome.extension.sendRequest({method: "getStatus"}, function(response) {
		YP.quality = YP.quality_options[response.status];
		YP.start(0);
});



var inj = document.createElement('script');
inj.innerHTML = 
["function onYouTubePlayerReady(player){",
"		player.addEventListener('onStateChange',console.log(player.getPlayerState()));",
"}"].join('\n');
document.body.appendChild(inj);
