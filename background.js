var res = localStorage['ytQuality'];

if(isNaN(res) || res > 8 || res < 0)
		res = 4;
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.method == "getStatus"){
				if(res < 8 && res >=0)
						sendResponse({status: res});
				else
						sendResponse({status: 4});
		}
		else
				sendResponse({}); // snub them.
});
