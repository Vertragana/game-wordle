const LOADING_CLASS = "loading";

let currentLine = [];
let currentLineIndex = 0;
const rowsEl = document.querySelectorAll(".word-row");
const loaderEl = document.querySelector(".loader");
let wordOfDay = new Map();

/**
 * Fetches word of a day and returns it
 * @async
 * @returns {Promise<Map<string, number>>} Map char to index
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
 * Useless function just to try out POST I guess, solution realy don't need it
 * @async
 * @param {string} word
 * @returns {Promise<boolean>} is answer correct
 */
const checkWord = async (word) => {
  loaderEl.classList.add(LOADING_CLASS);
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

  loaderEl.classList.remove(LOADING_CLASS);
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
  letterBoxEls.forEach((box, i) => {
    box.innerText = currentLine[i] || "";
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

/**
 * Flash boxes red if input is not a word
 *
 * @param {HTMLElement[]} rows
 * @param {number} currentLineIndex
 */
const flashError = (rows, currentLineIndex) => {
  const letterBoxEls = rows[currentLineIndex].querySelectorAll(".letter-box");
  letterBoxEls.forEach((el) => {
    el.classList.add("invalid");
  });
};

/**
 * Remove item and update view
 *
 * @param {string[]} currentLine - current input
 * @param {HTMLElement[]} rowsEl
 * @param {number} currentLineIndex
 */
const removeItem = (currentLine, rowsEl, currentLineIndex) => {
  currentLine.pop();
  console.log(currentLine);
  updateView(currentLine, rowsEl, currentLineIndex);
};

window.addEventListener("load", async () => {
  loaderEl.classList.add(LOADING_CLASS);
  wordOfDay = await getWordOfDay();
  loaderEl.classList.remove(LOADING_CLASS);
});

document.addEventListener("keydown", async (e) => {
  const inputString = e.key.toLowerCase();
  if (isLetter(inputString)) {
    if (currentLine.length == 5) {
      currentLine[4] = inputString;
    } else {
      currentLine.push(inputString);
    }
    updateView(currentLine, rowsEl, currentLineIndex);
  } else if (inputString === "enter" && currentLine.length === 5) {
    const isValidWord = await checkWord(currentLine.join(""));
    if (!isValidWord) {
      flashError(rowsEl, currentLineIndex);
    } else {
      colorBoxes(currentLine, wordOfDay, rowsEl, currentLineIndex);
      currentLine = [];
      const maxLineIndex = rowsEl.length;
      currentLineIndex =
        currentLineIndex < maxLineIndex ? currentLineIndex + 1 : maxLineIndex;
    }
  } else if (inputString === "backspace") {
    removeItem(currentLine, rowsEl, currentLineIndex);
  }
});
