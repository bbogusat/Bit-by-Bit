'use strict';

let supportedLangs;

// On installation, grab the supported languages from the API and initialize
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    status: false,
    difficulty: '1',
    transTo: 'fr'
  });
  getSupportedLangs();

});

// On a value in the storage changing take appropriate action
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ('status' in changes || 'difficulty' in changes || 'transTo' in changes) {
    // If you are enabling you don't need full refresh
    if (changes['status'] === true) {
      chrome.tabs.executeScript({file:"javascript/content_script.js"});
    }
    else {
      chrome.tabs.reload();
    }
  }
});

// Listen for a request to get supportedLangs to populate popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.request == "getSupportedLangs") {
        sendResponse({data: supportedLangs});
    }
});

function getSupportedLangs() {
  // TODO: Rewrite to grab from chrome storage and set in options page
  // TODO: Or put function into seperate file that doesn't get pushed
  // Fill in with API key
  const key = '';
  const uri = 'https://translation.googleapis.com/language/translate/v2/languages?key=';
  getRequest(uri + key)
    .then(data => {
      if (data) {
        supportedLangs = data['data']['languages'];
      }
    })
    .catch(error => console.error(error))
}


function getRequest(url, data) {
  return fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    })
    .then(function(response) {
      // If 200 response then convert response to json
      if (response.ok) {
        return response.json();
      }
    })
}
