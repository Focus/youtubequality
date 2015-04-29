var quality = 0;
var highpref = false;
var pause = false;

function injectCode(){
		var inj0 = document.createElement('script');
		var inj1 = document.createElement('script');
		var docFrag = document.createDocumentFragment();
		inj0.type = "text/javascript";
		inj0.src = chrome.extension.getURL('scripts/utils.js');
		inj0.onload = function() {
			this.parentNode.removeChild(this);
		};
		
		inj1.innerHTML =
				["function onYouTubePlayerReady(player){",
				 "		setTimeout(function(){ytPlayerHook(player, " + quality + ", " + highpref + ", " + pause + ");},10);",
				 "}"].join('\n');
		docFrag.appendChild(inj0);
		docFrag.appendChild(inj1);
		
		(document.head||document.documentElement).appendChild(docFrag);
		inj1.parentNode.removeChild(inj1);
}

chrome.extension.sendRequest({method: "getStatus"}, function(response) {
		quality = response.status;
		chrome.extension.sendRequest({method: "getHighPref"}, function(response) {
			highpref = response.status;
			chrome.extension.sendRequest({method: "getPause"}, function(response) {
					pause = response.status;
					injectCode();
			});
		});
});
