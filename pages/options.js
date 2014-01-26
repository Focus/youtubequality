function save_options() {
  localStorage['ytPause'] = document.getElementById("pause").checked;
  if(localStorage['ytPause'] === "true")
	chrome.extension.getBackgroundPage().pause = true;
  else
	chrome.extension.getBackgroundPage().pause = false;
}

function restore_options() {
  var pause = localStorage["ytPause"];
  if(pause === "true")
	document.getElementById("pause").checked = true;
  else
	document.getElementById("pause").checked = false;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#pause').addEventListener('change', save_options);