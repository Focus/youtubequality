var quality = 0;
var pause = false;

function injectCode(){
		var inj0 = document.createElement('script');
		var inj1 = document.createElement('script');
		var docFrag = document.createDocumentFragment();
		inj0.type = "text/javascript";
		inj0.src = chrome.extension.getURL('scripts/utils.js');
		
		inj1.innerHTML =
				["function onYouTubePlayerReady(player){",
				 "		setTimeout(function(){ytPlayerHook(player," + quality + "," + pause + ");},10);",
				 "}"].join('\n');
		docFrag.appendChild(inj0);
		docFrag.appendChild(inj1);
		
		document.head.appendChild(docFrag);
}

chrome.extension.sendRequest({method: "getStatus"}, function(response) {
		quality = response.status;
		chrome.extension.sendRequest({method: "getPause"}, function(response) {
				pause = response.status;
				injectCode();
		});
});



