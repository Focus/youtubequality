function save_options() {
  localStorage['ytPause'] = document.getElementById("pause").checked;
  if(localStorage['ytPause'] === "true")
	chrome.extension.getBackgroundPage().pause = true;
  else
	chrome.extension.getBackgroundPage().pause = false;
  localStorage['ytKeepQuality'] = document.getElementById("keepquality").checked;
  if(localStorage['ytKeepQuality'] === "true")
	chrome.extension.getBackgroundPage().keepquality = true;
  else
	chrome.extension.getBackgroundPage().keepquality = false;
}

function restore_options() {
  var pause = localStorage["ytPause"];
  if(pause === "true")
	document.getElementById("pause").checked = true;
  else
	document.getElementById("pause").checked = false;
  var keepquality = localStorage["ytKeepQuality"];
  if(keepquality === "true")
	document.getElementById("keepquality").checked = true;
  else
	document.getElementById("keepquality").checked = false;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#pause').addEventListener('change', save_options);
document.querySelector('#keepquality').addEventListener('change', save_options);