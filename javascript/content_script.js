'use strict';
// Global to show debug
var debugMode = true;

// If the extension is enabled then translate the page
chrome.storage.sync.get('status', function(data) {
  if (data.status) {
    findText(data.status);
  }
});

function logMessage(str) {
  if (debugMode) {
    console.log(str);
  }
}

function findText() {
  let wordCount = 0;
  // Get all the DOM elements
  let elements = document.getElementsByTagName("*");

  // Iterate through the elements
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    // Ignore elements that could mess up page functions
    if (["SCRIPT", "NOSCRIPT", "STYLE", "title"].includes(element.tagName)) {
      continue;
    }

    // Iterate through the Nodes of the element
    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j];

      // If it is a text type node then you can translate
      if (node.nodeType === 3) {

        // Split the sentence and iterate
        const words = node.nodeValue.split(" ");
        for (let z = 0; z < words.length; z++) {
          const word = words[z];

          // Don't count words that are one letter words or numbers
          if (word && word.length >= 2 && isNaN(word)) {
            // Only translate every X words
            if (wordCount % 20 == 0) {
              logMessage("Original word " + word);
              translateWord(word, node, z);
            }
            wordCount++;
          }
        }
      }
    }
  }
}

function translateWord(word, node, wordIndex) {
  const key = getApiKey();
  const uri = 'https://translation.googleapis.com/language/translate/v2?key=';
  postRequest(uri + key, {
      q: word,
      target: 'fr',
      format: 'text',
      model: 'base'
    })
    .then(data => {
      if (data) {
        // Get the translated word from the response body
        const translatedWord = data['data']['translations'][0]['translatedText'];
        if (translatedWord) {
          replaceWord(translatedWord, node, wordIndex);
        }
      }
    })
    .catch(error => console.error(error))
}

function getApiKey() {
  // TODO: Rewrite to grab from chrome storage and set in options page
  const key = '';
  return key;
}

function postRequest(url, data) {
  return fetch(url, {
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify(data),
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

function replaceWord(translatedWord, node, wordIndex) {
  // Set up new node structure
  const parentNode = node.parentNode;
  // Sometimes li items don't have parents... look into
  if (!parentNode){
    return
  }

  const middleNode = document.createElement("div");
  middleNode.className = "translation-container";

  const translatedNode = document.createElement("span");
  translatedNode.className = "translated-word";
  translatedNode.textContent = translatedWord;

  const startingText = document.createElement("span");
  startingText.className = "starting-word";

  middleNode.appendChild(translatedNode);
  middleNode.appendChild(startingText);

  // Split the sentence
  let leftSide = node.nodeValue.split(" ");
  // Splice on word index so translated word is first element on right side
  let word = leftSide.splice(wordIndex);
  // Splice the right side to split translated word from rest of text
  const rightSide = word.splice(1);

  startingText.textContent = word;

  // Don't modify translations that are equivalent
  // Might be valid to remove this so everything is highlighted...
  // A case can be made that it is still learning if it is the same
  if (word.join(" ").trim().toLowerCase() === translatedWord.trim().toLowerCase()) {
    logMessage("Translated word is equivalent to original: " + translatedWord);
    return;
  }

  logMessage("Replacing: " + startingText.textContent + " -> " + translatedWord);

  let leftText = leftSide.join(" ");
  let rightText = rightSide.join(" ");
  // If there is a word in either side, buffer translated word with a space
  if (leftSide.length > 0) {
    leftText = leftText + " ";
  }
  if (rightSide.length > 0) {
    rightText = " " + rightText;
  }

  // Create the nodes that are to the right and left of the translated text
  const leftNode = document.createTextNode(leftText);
  const rightNode = document.createTextNode(rightText);

  // Replace current node structure starting left to right
  node.replaceWith(leftNode);
  parentNode.insertBefore(middleNode, leftNode.nextSibling);
  parentNode.insertBefore(rightNode, middleNode.nextSibling);

}
