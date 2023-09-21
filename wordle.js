const LOADING_CLASS = "loading";

let currentLine = [];
let currentLineIndex = 0;
const rowsEl = document.querySelectorAll(".word-row");
const loaderEl = document.querySelector(".loader");
let wordOfDay = new Map();

/**
 * Fetches word of a day and returns it
 * @async
 * @returns {Map<string, number>} Map char to index
 */
const getWordOfDay = async () => {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    console.log("Error while parsing response", e);
  }

  const charByIndex = new Map();
  for (let i = 0; i < data.word.length; i++) {
    charByIndex.set(data.word[i], i);
  }
  return charByIndex;
};

/**
 * @async
 * @param {string} word
 * @returns {boolean} is answer correct
 */
const checkWord = async (word) => {
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: `{
      "word": "${word}"
    }`,
  });
  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    console.log("Error while parsing response", e);
  }

  return data.validWord || false;
};

/**
 * Updates row view based on current line array
 * @param {string[]} currentLine
 * @param {HTMLElement[]} rows
 * @param {number} currentLineIndex
 * @returns {void}
 */
const updateView = (currentLine, rows, currentLineIndex) => {
  const letterBoxEls = rows[currentLineIndex].querySelectorAll(".letter-box");
  currentLine.forEach((letter, i) => {
    letterBoxEls[i].innerText = letter;
  });
};

/**
 * change color of color
 *
 * @param {string[]} currentLine - current entered word
 * @param {Map<string, number>} wordOfDay
 * @param {HTMLElement[]} rows - rows of boxes
 * @param {number} currentLineIndex - current line
 */
const colorBoxes = (currentLine, wordOfDay, rows, currentLineIndex) => {
  const letterBoxEls = rows[currentLineIndex].querySelectorAll(".letter-box");
  currentLine.forEach((char, i) => {
    const charInWordOfDay = wordOfDay.get(char);
    if (charInWordOfDay !== undefined) {
      if (charInWordOfDay === i) {
        letterBoxEls[i].classList.add("correct");
      } else {
        letterBoxEls[i].classList.add("inword");
      }
    }
  });
};

/**
 * Check if input is letter
 * @param {string} letter
 * @returns {boolean}
 */
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter); // проверка является ли  стринга словом или нет
}

window.addEventListener("load", async () => {
  loaderEl.classList.add(LOADING_CLASS);
  wordOfDay = await getWordOfDay();
  loaderEl.classList.remove(LOADING_CLASS);
});

document.addEventListener("keypress", async (e) => {
  const inputString = e.key.toLowerCase();
  if (isLetter(inputString)) {
    if (currentLine.length == 5) {
      currentLine[4] = inputString;
    } else {
      currentLine.push(inputString);
    }
    updateView(currentLine, rowsEl, currentLineIndex);
  } else if (inputString === "enter" && currentLine.length === 5) {
    checkWord(currentLine.join(""));
    colorBoxes(currentLine, wordOfDay, rowsEl, currentLineIndex);
    currentLine = [];
    const maxLineIndex = rowsEl.length;
    currentLineIndex =
      currentLineIndex < maxLineIndex ? currentLineIndex + 1 : maxLineIndex;
  }
});
