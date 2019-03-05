'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    status: false
  });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ('status' in changes) {
    chrome.tabs.reload();
  }
});
