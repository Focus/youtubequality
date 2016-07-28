var res = localStorage['ytQuality'];
var speed = localStorage['ytSpeed'];
if(isNaN(speed))
	speed = 1;
var smart_save = localStorage['ytSmartSave'];
var highpref = false;
var pause = false;


if(localStorage['ytHighPref'] === "true")
		highpref = true;
if(localStorage['ytPause'] === "true")
		pause = true;
if(isNaN(res) || res > 8 || res < 0)
		res = 4;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.method === "getStatus"){
				if(res < 8 && res >=0)
						sendResponse({status: res});
				else
						sendResponse({status: 4});
		}
		else if (request.method === "getHighPref")
				sendResponse({status: highpref});
		else if (request.method === "getPause")
				sendResponse({status: pause});
		else if (request.method === "getSpeed")
				sendResponse({status: speed});
		else if (request.method === "getSmartSave")
		 		sendResponse({status: smart_save});
		else
				sendResponse({});
});
