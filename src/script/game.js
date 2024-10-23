// Declare variables
let interval, answer;
let timer = new Date();
let hour = timer.setMinutes(timer.getMinutes() + 1);

// DOM elements
let startBtn = document.getElementsByClassName("start-game").item(0);
let menuContainer = document.getElementsByClassName("menu-container").item(0);
let gameContainer = document.getElementsByClassName("game-container").item(0);
let resultContain = document.getElementsByClassName("result-container").item(0);
let form = document.getElementsByTagName("form").item(0);
let categorySelect = document.getElementById("category-select");
let setTime = document.getElementsByClassName("set-time").item(0);
let selectQuestion = document.getElementsByClassName("question").item(0);
let nextQuestion = document.getElementsByClassName("button-next").item(0);
let quizInput = document.getElementsByClassName("quiz-length-input").item(0);
let numQuestionNow = document.getElementsByClassName("question-number").item(0);
let loadingBar = document.getElementsByClassName("loading-bar").item(0);
let categQuest = document.getElementsByClassName("category-question").item(0);
let diffiText = document.getElementsByClassName("difficulty-text").item(0);
let resulText = document.getElementsByClassName("result-container")[0].children;

// Class Game
class Game {
  constructor() {
    this.init();
    this.isTimeRunning = false;
    this.load = 1.667;
    this.points = 0;
    this.music = new Audio("/src/audio/quiz.mp3");
  }

  // Initialize the game
  init() {
    this.selectCategory();
    this.mainMenu();
  }

  // Start timer intervals
  intervals = () => {
    this.isTimeRunning = true;
    interval = setInterval(() => this.timeToZero(), 1000);
  };

  // Update the timer countdown
  timeToZero = () => {
    if (!this.isTimeRunning) return;
    let now = new Date().getTime();
    let zeroTime = hour - now;
    if (zeroTime <= 0) {
      this.isTimeRunning = false;
      this.showResult();
    } else {
      let sec = Math.floor((zeroTime % 60000) / 1000);
      loadingBar.style.transform = `scaleX(${100 - this.load}%)`;
      setTime.innerHTML = `${sec}s.`;
      this.load += 1.667;
    }
  };

  // Reset the timer
  resetTimer = () => {
    this.load = 1.667;
    clearInterval(interval);
    let timer = new Date();
    hour = timer.getTime() + 61 * 1000;
    this.intervals();
  };

  // Load quiz categories from the API
  selectCategory = async () => {
    let url = `https://opentdb.com/api_category.php`;
    let categories;
    try {
      let response = await fetch(url);
      let result = await response.json();
      categories = result.trivia_categories;
      categorySelect.innerHTML = "";
      categories.forEach((category) => {
        let option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Set up the main menu and event listeners
  mainMenu = () => {
    startBtn.addEventListener("click", () => {
      const selectedDifficulty = document.querySelector(
        'input[name="difficulty"]:checked'
      );
      this.getJson(
        quizInput.value,
        selectedDifficulty.value,
        categorySelect.value
      );
    });
  };

  // Fetch quiz questions from the API
  getJson = async (questionNum, difficulty, category) => {
    let url = `https://opentdb.com/api.php?amount=${questionNum}&difficulty=${difficulty}&type=multiple&category=${category}`;
    try {
      let response = await fetch(url);
      let result = await response.json();
      this.showQA(result.results);
    } catch (error) {
      console.log(error);
    }
  };

  // Display the questions and answers
  showQA = (question) => {
    let num = 1;
    this.resetTimer();
    menuContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    this.music.play();
    this.music.volume = 0.2;
    this.music.loop = true;
    let firstQuest = true;
    if (firstQuest) this.nextQuest(0, question, answer);
    numQuestionNow.innerHTML = `Question <b>${num}</b> of <b>${quizInput.value}</b> `;
    firstQuest = false;
    nextQuestion.addEventListener("click", () => {
      let selectedAnswer = this.getSelectedAnswer();
      if (selectedAnswer) {
        selectedAnswer =
          selectedAnswer == question[num - 1].correct_answer
            ? (this.points += 1)
            : (this.points += 0);

        this.nextQuest(num, question);
        numQuestionNow.innerHTML = `Question <b>${num + 1}</b> of <b>${
          quizInput.value
        }</b>`;
        num += 1;
        this.resetTimer();
      } else {
        return;
      }
    });
  };

  // Get the selected answer from the radio buttons
  getSelectedAnswer = () => {
    let selectedOption = document.querySelector(
      'input[name="question"]:checked'
    );
    return selectedOption ? selectedOption.value : null;
  };

  // Load the next question
  nextQuest = (num, question) => {
    gameContainer.style.animation = "scale 0.3s forwards";
    gameContainer.addEventListener(
      "animationend",
      () => (gameContainer.style.animation = "")
    );

    if (quizInput.value == num) this.showResult();
    else {
      let tab = [
        `${question[num].incorrect_answers[0]}`,
        `${question[num].incorrect_answers[1]}`,
        `${question[num].incorrect_answers[2]}`,
        `${question[num].correct_answer}`,
      ];

      // Shuffle the answers
      let shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      let shuffledAnswers = shuffleArray(tab);
      let up = question[num].difficulty;
      categQuest.innerHTML = `${question[num].category}`;
      diffiText.innerHTML = `Difficulty: ${
        up.charAt(0).toUpperCase() + up.slice(1, up.length)
      }`;
      selectQuestion.innerHTML = `
        <h2>${num + 1 + ". " + question[num].question}</h2>
        <input type="radio" id="answer1" name="question" value="${
          shuffledAnswers[0]
        }" />
        <label for="answer1">${shuffledAnswers[0]}</label><br />
  
        <input type="radio" id="answer2" name="question" value="${
          shuffledAnswers[1]
        }" />
        <label for="answer2">${shuffledAnswers[1]}</label><br />
  
        <input type="radio" id="answer3" name="question" value="${
          shuffledAnswers[2]
        }" />
        <label for="answer3">${shuffledAnswers[2]}</label><br />
  
        <input type="radio" id="answer4" name="question" value="${
          shuffledAnswers[3]
        }" />
        <label for="answer4">${shuffledAnswers[3]}</label><br />
      `;
    }
  };
  // Display the results at the end of the quiz
  showResult = () => {
    this.music.pause();
    resultContain.classList.remove("hidden");
    resultContain.style.animation = "scale 0.3s forwards";
    gameContainer.classList.add("hidden");
    resulText[1].innerHTML = `${this.points}/${quizInput.value}`;

    let totalPoints = parseInt(quizInput.value);
    let earnedPoints = this.points;
    let percentage = (earnedPoints / totalPoints) * 100;

    // Define grading scale
    let grades = [
      { min: 90, rank: "S", color: "yellow" },
      { min: 80, rank: "A", color: "green" },
      { min: 70, rank: "B", color: "green" },
      { min: 60, rank: "C", color: "green" },
      { min: 50, rank: "D", color: "red" },
      { min: 0, rank: "F", color: "red" },
    ];

    // Find the grade based on percentage
    let { rank, color } = grades.find((grade) => percentage >= grade.min);

    resulText[3].innerHTML = rank;
    resulText[3].style.color = color;
  };
}

// Create a new Game instance
let game = new Game();
