
const startButton = document.getElementById("start-btn")
const nextButton = document.getElementById("next-btn")
const questionContainerElement = document.getElementById("question-container")
const questionElement = document.getElementById("question")
const answerButtonsElement = document.getElementById("answer-buttons")
const startCardElement = document.getElementById("start-card")
const scoreCard = document.getElementById("score-card")
const leaderboardCard = document.getElementById("leaderboard-card")
const submitButton = document.querySelector("#submit-button")
const inputElement = document.querySelector("#initials")
var timerEl = document.getElementById("time")


let shuffledQuestions, currentQuestionIndex

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++
  setNextQuestion()
})

startButton.addEventListener("click", begin_quiz);

/* Timer */
var secondlimit = 60;
var timeInterval = null;

function begin_quiz() {
  secondlimit = 60;
  timeInterval = setInterval(function() {
  if (secondlimit > 0){
     timerEl.textContent = secondlimit;
      secondlimit--;
}
  else {
      clearInterval(timeInterval);
      timerEl.textContent = '0';
      endQuiz();
}
}, 1000)}

function endQuiz() {
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = timerEl.toString();
}

/* score card */
function hideCards() {
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

function startGame() {
  startButton.classList.add("hide");
  startCardElement.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove("hide");
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement("button")
    button.innerText = answer.text
    button.classList.add("btn")
    if (answer.correct === true) {
      button.dataset.correct = answer.correct
    }
    else if (answer.correct === false) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add("hide")
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  //potential problem
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide")
  } else {
    startButton.innerText = ("Restart")
    startButton.classList.remove("hide")
    endQuiz();
    clearInterval(timeInterval);
  }
}


function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct === "false") {
    element.classList.add("wrong")
    secondlimit = secondlimit - 5;
  } else {
    element.classList.add("correct")
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct")
  element.classList.remove("wrong")
}

const questions = [
  {
    question: "The Boolean object represents a truth value: true or false.",
    answers: [
      { text: "true", correct: true },
      { text: "false", correct: false }
    ]
  },

  {
    question: 'Inside which HTML element do we put the JavaScript?',
    answers: [
      
      { text: "<scripting>", correct: false },
      { text: "<script>", correct: true  },
    ]
  },

  {
    question: "How do you write 'Hello World' in an alert box?",
    answers: [
      
      { text: "alert('Hello World')", correct: true },
      { text: "alertBox('Hello World')", correct: false },
    ]
  },

  {
    question: "How do you create a function in JavaScript?",
    answers: [

      { text: "function = myFunction()", correct: true },
      { text: "function myFunchtion()", correct: false },
    ]
  },

  {
  question: "How to write an IF statement in JavaScript?",
  answers: [
  
    { text: "if (i == 5)", correct: true },
    { text: "if i == 5 then", correct: false },
  ]
},
]


submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //prevent default behaviour of form submission
  event.preventDefault();

  //check for input
  if (!inputElement.value) {
    alert("Please enter your initials before pressing submit!");
    return;
  }

  //store score and initials in an object
  let leaderboardItem = {
    initials: inputElement.value,
    score: secondlimit,
  };

  updateStoredLeaderboard(leaderboardItem);

  //hide the question card, display the leaderboardcard
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}

//updates the leaderboard stored in local storage
function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();
  //append new leaderboard item to leaderboard array
  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

//get "leaderboardArray" from local storage (if it exists) and parse it into a javascript object using JSON.parse
function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}

//display leaderboard on leaderboard card
function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}

//sort leaderboard array from highest to lowest
function sortLeaderboard() {
  let leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighscores);

//clear local storage and display empty leaderboard
function clearHighscores() {
  localStorage.clear();
  renderLeaderboard();
}

const backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

//Hide leaderboard card reload page
function returnToStart() {
  hideCards();
  location.reload();
}

//use link to view highscores from any point on the page
const leaderboardLink = document.querySelector("#leaderboard-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");
  //assign undefined to time and display that, so that time does not appear on page
  secondlimit = undefined;
  displayTime();
  renderLeaderboard();
} 