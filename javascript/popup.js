'use strict';

// Grab all needed elements
let buttonToggle = document.getElementById('buttonToggle');
let dSlider = document.getElementById('dSlider');
let langList = document.getElementById('langs');
let langSelected = document.getElementById('langInput');

// Send a request to get the supported languages to populate datalist
chrome.runtime.sendMessage({request: "getSupportedLangs"}, function(response) {
    const supportedLangs = response.data;
    supportedLangs.forEach(function(lang) {
      var langOption = document.createElement('option');
      langOption.value = lang['language'];
      langList.appendChild(langOption);
    });
});

// Set the pop up values with what we have stored
chrome.storage.sync.get(['status', 'difficulty', 'transTo'], function(data) {
  buttonToggle.checked = data.status;
  dSlider.value = data.difficulty;
  langSelected.value = data.transTo;
});

// Add the listeners for changes... all they really do is change stored values
addToggleListener(buttonToggle);
addDifficultyListener(dSlider);
addLangListener(langSelected);

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

function addLangListener(langSelected) {
  langSelected.addEventListener('change', function() {
    console.log("Language change: " + langSelected.value);
    chrome.storage.sync.set({
      transTo: langSelected.value
    }, function() {
      console.log("Updated translation lanaguage to " + langSelected.value);
    })
  });
}
