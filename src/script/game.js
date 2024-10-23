// Declare variables
let interval, answer;
let timer = new Date();
let hour = timer.setMinutes(timer.getMinutes() + 1);

// DOM elements
const startBtn = document.getElementsByClassName("start-game").item(0);
const menuContainer = document.getElementsByClassName("menu-container").item(0);
const gameContainer = document.getElementsByClassName("game-container").item(0);
const resultContain = document
  .getElementsByClassName("result-container")
  .item(0);
const form = document.getElementsByTagName("form").item(0);
const categorySelect = document.getElementById("category-select");
const setTime = document.getElementsByClassName("set-time").item(0);
const selectQuestion = document.getElementsByClassName("question").item(0);
const nextQuestion = document.getElementsByClassName("button-next").item(0);
const quizInput = document.getElementsByClassName("quiz-length-input").item(0);
const numQuestionNow = document
  .getElementsByClassName("question-number")
  .item(0);
const loadingBar = document.getElementsByClassName("loading-bar").item(0);
const categQuest = document.getElementsByClassName("category-question").item(0);
const diffiText = document.getElementsByClassName("difficulty-text").item(0);

// Class Game
class Game {
  constructor() {
    this.init(); // Initialize game settings
    this.isTimeRunning = false;
    this.load = 1.667;
    this.points = 0;
    this.music = new Audio("/src/audio/quiz.mp3");
  }

  // Initialize the game
  init() {
    this.selectCategory(); // Load quiz categories
    this.mainMenu(); // Set up the main menu
  }

  // Start timer intervals
  intervals = () => {
    this.isTimeRunning = true;
    interval = setInterval(() => this.timeToZero(), 1000);
  };

  // Update the timer countdown
  timeToZero = () => {
    if (!this.isTimeRunning) return;
    const now = new Date().getTime();
    const zeroTime = hour - now;
    if (zeroTime <= 0) {
      this.isTimeRunning = false;
      this.showResult();
    } else {
      const sec = Math.floor((zeroTime % 60000) / 1000);
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
    this.intervals(); // Start a new timer
  };

  // Load quiz categories from the API
  selectCategory = async () => {
    const url = `https://opentdb.com/api_category.php`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      const categories = result.trivia_categories;
      const fragment = document.createDocumentFragment();
      const firstCategory = document.createElement("option");
      categorySelect.innerHTML = "";
      firstCategory.value = "";
      firstCategory.textContent = "Any Category";
      fragment.appendChild(firstCategory);

      categories.forEach(({ id, name }) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        fragment.appendChild(option);
      });
      categorySelect.appendChild(fragment);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Set up the main menu and event listeners
  mainMenu = () => {
    startBtn.addEventListener("click", () => {
      const selectedDifficulty = document.querySelector(
        'input[name="difficulty"]:checked' // Get selected difficulty
      );

      // Validate number of questions
      if (
        !quizInput.value ||
        (quizInput.value < 0 && !quizInput.value) ||
        quizInput.value > 50
      )
        return;

      // Alert if no difficulty selected
      if (selectedDifficulty == null) alert("Select difficulty!");

      // Send values to getJson method
      this.getJson(
        quizInput.value,
        selectedDifficulty.value,
        categorySelect.value
      );
    });
  };

  // Fetch quiz questions from the API
  getJson = async (questionNum, difficulty, category) => {
    const url = `https://opentdb.com/api.php?amount=${questionNum}&difficulty=${difficulty}&type=multiple&category=${category}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      this.showQA(result.results); // Display questions and answers
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
      let selectedAnswer = this.getSelectedAnswer(); // Get user's selected answer
      if (selectedAnswer) {
        selectedAnswer =
          selectedAnswer == question[num - 1].correct_answer
            ? (this.points += 1) // Increment points for correct answer
            : (this.points += 0);

        this.nextQuest(num, question); // Load next question
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

    if (quizInput.value == num)
      this.showResult(); // Show result if all questions answered
    else {
      const tab = [
        `${question[num].incorrect_answers[0]}`,
        `${question[num].incorrect_answers[1]}`,
        `${question[num].incorrect_answers[2]}`,
        `${question[num].correct_answer}`,
      ];

      // Shuffle the answers
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const shuffledAnswers = shuffleArray(tab);
      const up = question[num].difficulty;
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
    const totalPoints = parseInt(quizInput.value);
    const earnedPoints = this.points;
    const percentage = (earnedPoints / totalPoints) * 100;

    // Define grading scale
    const grades = [
      { min: 90, rank: "S", color: "yellow" },
      { min: 80, rank: "A", color: "green" },
      { min: 70, rank: "B", color: "green" },
      { min: 60, rank: "C", color: "green" },
      { min: 50, rank: "D", color: "red" },
      { min: 0, rank: "F", color: "red" },
    ];

    // Find the grade based on percentage
    const { rank, color } = grades.find((grade) => percentage >= grade.min);

    resultContain.innerHTML = `
      <p>Your Score</p>
      <p>${this.points}/${quizInput.value}</p>
      <p>Rank:</p>
      <p>${rank}</p>
    `;

    resultContain.children.item(3).style.color = color;
  };
}

// Create a new Game instance
let game = new Game();
