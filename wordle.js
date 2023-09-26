const letterBox = document.querySelectorAll(".letter-box");
const loading = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6; 


async function init(){
  let currentGuess = '';
  let currentRow = 0;
  let isLoading = true;
  

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;
  setLoading(false);
  isLoading = false;



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

    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word",{
      method: "POST",
      body: JSON.stringify({ word: currentGuess})
    });

    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    setLoading(false);

    if(!validWord){
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split(""); //divide string to 5 letterd
    const map = makeMap(wordParts);

    for( let i = 0; i<ANSWER_LENGTH; i++){
      //mark as correct
      if (guessParts[i] === wordParts[i] ){
        letterBox[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
        
      }
    }

    for( let i = 0;i<ANSWER_LENGTH;i++)
    if(guessParts[i] === wordParts[i]){
  // do nothing, cuz we already did it
}  else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0){
  letterBox[currentRow * ANSWER_LENGTH + i].classList.add("close");
  map[guessParts[i]]--;
} else{
  letterBox[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
}  

currentRow++;
    

    if (currentGuess === word){
      //win
      alert('you win!');
      done = true;
      return;
    }
    else if(currentRow === ROUNDS){
  alert('you lose, the word was ${word}');
  done = true;
 }
 currentGuess ='';
  }

  function backspace(){
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letterBox[ANSWER_LENGTH * currentRow + currentGuess.length ].innerText = "";
  }

  function markInvalidWord(){
    for( let i = 0; i<ANSWER_LENGTH; i++){
      letterBox[currentRow * ANSWER_LENGTH + i].classList.add("invalid");

      setTimeout(function(){
         letterBox[currentRow * ANSWER_LENGTH + i].classList.remove("invalid")
       },1000)
    }
  }


  document.addEventListener("keydown", function handleKeyPress(event){
    if(done || isLoading){
      //do nothing;
      return;
    }
    const action = event.key;
    

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

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);  // проверка является ли  стринга словом или нет
}

function setLoading(isLoading){
  loading.classList.toggle('hidden', !isLoading);
}

function makeMap(array){
  const obj ={};
  for(let i = 0;i<array.length;i++){
    if(obj[array[i]]){
      obj[array[i]]++
    } else{
      obj[array[i]]=1;
    }

  }
  return obj;
}


init();






