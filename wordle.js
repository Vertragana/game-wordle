const letterBox = document.querySelectorAll(".letter-box");
const loading = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;



async function init(){
let currentGuess = '';
let currentRow = 0;


  function addLetter(letter){
   if(currentGuess.length<ANSWER_LENGTH){
    currentGuess += letter; //add letter to the end
   } else {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter; // replace the last letter
   }
   letterBox[ANSWER_LENGTH * currentRow + currentGuess.length -1].innerText = letter;
  }

  async function commit(){
    if(currentGuess.length !== ANSWER_LENGTH){
      //do nothing
      return;
    }

    currentRow++;
    currentGuess ='';

  }

  function backspace(){
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letterBox[ANSWER_LENGTH * currentRow + currentGuess.length ].innerText = "";
  }


  document.addEventListener("keydown", function handleKeyPress(event){
    const action = event.key;
    console.log(action);

    if(action === 'Enter') {
      commit();
    }else if (action === 'Backspace'){
      backspace();
      } else if (isLetter(action)){
        addLetter(action.toUpperCase())
      } else{
        // do nothing
      }
    });
}

init();






function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);  // проверка является ли  стринга словом или нет
  }