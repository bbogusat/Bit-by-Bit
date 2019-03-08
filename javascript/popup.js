'use strict';

let buttonToggle = document.getElementById('buttonToggle');
let dSlider = document.getElementById('dSlider');

chrome.storage.sync.get('status', function(data) {
  buttonToggle.checked = data.status;
});
chrome.storage.sync.get('difficulty', function(data) {
  dSlider.value = data.difficulty;
});

addToggleListener(buttonToggle);
addDifficultyListener(dSlider);


function addToggleListener(buttonToggle) {
  buttonToggle.addEventListener('click', function() {
    chrome.storage.sync.set({
      status: buttonToggle.checked
    }, function() {
      console.log("Updated status to " + buttonToggle.checked);
    })
  });
}

function addDifficultyListener(dSlider) {
  dSlider.addEventListener('change', function() {
    chrome.storage.sync.set({
      difficulty: dSlider.value
    }, function() {
      console.log("Updated difficulty to " + dSlider.value);
    })
  });
}
