// Selectors
const _question = document.getElementById("question");
const _options = document.querySelector(".quiz-options");
const _correctScore = document.querySelector("#correct-score");
const _totalQuestion = document.querySelector("#total-question");
const _checkBtn = document.querySelector("#check-answer");
const _playAgainBtn = document.querySelector("#play-again");
const _result = document.querySelector("#result");

let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

function eventListner() {
  _checkBtn.addEventListener("click", () => {
    checkAnswer();
  });
}

_playAgainBtn.addEventListener("click", restartQuiz);

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListner();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  const apiUrl = "https://opentdb.com/api.php?amount=10";
  const result = await fetch(`${apiUrl}`);
  const data = await result.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
}

function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionList = incorrectAnswer;
  optionList.splice(
    Math.floor(Math.random() * (incorrectAnswer.lenght + 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
  _options.innerHTML = `
     ${optionList
       .map(
         (option, index) => `
       <li>${index + 1}. <span>${option}</span></li>
     `
       )
       .join("")}
  `;

  selectOption();
}

// Selected Option
function selectOption() {
  _options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// Answer Checking
function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer == correctAnswer) {
      correctScore++;
      _result.innerHTML = `<p><i class="fas fa-check"></i>Corect Answer!</p>`;
    } else {
      _result.innerHTML = `<p><i class="fas fa-times"></i> incorrect Answer!</p> <p><small><b>Correct Answer:  </b>${correctAnswer}</small></p>`;
    }
    checkCount();
  } else {
    _result = `<p><i class="fas fa-question"></i>Please Select An Option</p>`;
    _checkBtn.disabled = false;
  }
}

// Counter
function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    _result.innerHTML += `<p>Your Score ${correctScore}</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 2500);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
