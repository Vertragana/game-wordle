const letterBox = Array.from(document.querySelectorAll(".letter-box"));
const firstWord = Array.from(document.querySelectorAll(".first-word"));


document.addEventListener("keydown", function(){
  
  console.log(firstWord.length);
})






function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);  // проверка является ли  стринга словом или нет
  }