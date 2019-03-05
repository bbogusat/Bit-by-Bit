'use strict';

let buttonToggle = document.getElementById('buttonToggle')

chrome.storage.sync.get('status', function(data) {
  buttonToggle.checked = data.status;
});

addListener(buttonToggle);

function addListener(buttonToggle) {
  buttonToggle.addEventListener('click', function() {
    chrome.storage.sync.set({
      status: buttonToggle.checked
    }, function() {
      console.log("Updated status to " + buttonToggle.checked);

    })
  });
}
