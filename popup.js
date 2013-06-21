function click(e) {
		chrome.extension.getBackgroundPage().res = e.target.id;
		localStorage['ytQuality'] = e.target.id;
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById(chrome.extension.getBackgroundPage().res).className = 'current';
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});
