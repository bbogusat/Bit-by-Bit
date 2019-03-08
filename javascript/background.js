'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    status: false
  });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ('status' in changes) {
    if (changes['status'] === true) {
      chrome.tabs.executeScript({file:"javascript/content_script.js"});
    }
    else {
      chrome.tabs.reload();
    }

  }
});
