var res = localStorage['ytQuality'];
var pause = false;
var keepquality = false;

if(localStorage['ytPause'] === "true")
		pause = true;
if(localStorage['ytKeepQuality'])
		keepquality = true;
if(isNaN(res) || res > 8 || res < 0)
		res = 4;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.method === "getStatus"){
				if(res < 8 && res >=0)
						sendResponse({status: res});
				else
						sendResponse({status: 4});
		}
		else if (request.method === "getPause")
				sendResponse({status: pause});
		else if (request.method === "getKeepQuality")
				sendResponse({status: keepquality});
		else
				sendResponse({});
});
