let strona = "";
const music = new Audio("quiz.mp3");
let points = 0;
let oneHour = new Date();
let answer;
let isTimeRunning = false;
let timeDiv = document.querySelector(".czas");
let hour = oneHour.setMinutes(oneHour.getMinutes() + 1);
let site = document.querySelector(".nrStrony");
let question = document.getElementsByTagName("div")[3];
let radio = document.getElementsByTagName("input");
let text = document.getElementsByTagName("a");
let nastepnyprzycisk = document.getElementsByTagName("button")[0];
let displayVariants = document.getElementsByClassName("quizLength")[0];
var interval;
let startBtn = document.getElementsByTagName("button")[1];
let usedQuestionIndexes = [];
let rstBtn = document.getElementsByClassName("reset")[0];
let jd = document.querySelector(".jd");
rstBtn.classList.add("hidden");
let pytania = {
  pytania: [
    {
      pytanie: "Jaka jest stolica Francji?",
      odpowiedzi: ["Londyn", "Paryż", "Berlin", "Madryt"],
      poprawna_odpowiedz: "Paryż",
    },
    {
      pytanie: "Który pierwiastek chemiczny ma symbol 'H'?",
      odpowiedzi: ["Tlen", "Hel", "Azot", "Wodór"],
      poprawna_odpowiedz: "Wodór",
    },
    {
      pytanie: "Ile planet znajduje się w naszym Układzie Słonecznym?",
      odpowiedzi: ["9", "7", "8", "10"],
      poprawna_odpowiedz: "8",
    },
    {
      pytanie:
        "Które państwo jest największe pod względem powierzchni na świecie?",
      odpowiedzi: ["Chiny", "Kanada", "Rosja", "Stany Zjednoczone"],
      poprawna_odpowiedz: "Rosja",
    },
    {
      pytanie: "Który malarz namalował 'Mona Lisę'?",
      odpowiedzi: [
        "Michelangelo",
        "Pablo Picasso",
        "Vincent van Gogh",
        "Leonardo da Vinci",
      ],
      poprawna_odpowiedz: "Leonardo da Vinci",
    },
    {
      pytanie: "Która planeta jest znana jako 'Czerwona Planeta'?",
      odpowiedzi: ["Mars", "Wenus", "Jowisz", "Saturn"],
      poprawna_odpowiedz: "Mars",
    },
    {
      pytanie: "Kto napisał dramat 'Romeo i Julia'?",
      odpowiedzi: [
        "William Shakespeare",
        "Jane Austen",
        "Charles Dickens",
        "Fyodor Dostoevsky",
      ],
      poprawna_odpowiedz: "William Shakespeare",
    },
    {
      pytanie: "Który gaz jest najbardziej obecny w atmosferze Ziemi?",
      odpowiedzi: ["Azot", "Tlen", "Argon", "Wodór"],
      poprawna_odpowiedz: "Azot",
    },
    {
      pytanie: "Która rzeka jest najdłuższą na świecie?",
      odpowiedzi: ["Nil", "Amazonka", "Missisipi", "Jangcy"],
      poprawna_odpowiedz: "Nil",
    },
    {
      pytanie: "Który pierwiastek chemiczny ma symbol 'Fe'?",
      odpowiedzi: ["Wapń", "Żelazo", "Fluor", "Magnez"],
      poprawna_odpowiedz: "Żelazo",
    },
    {
      pytanie: "Która planeta jest najbliższa Słońcu?",
      odpowiedzi: ["Merkury", "Wenus", "Mars", "Jowisz"],
      poprawna_odpowiedz: "Merkury",
    },
    {
      pytanie: "Kto był pierwszym człowiekiem na Księżycu?",
      odpowiedzi: [
        "John F. Kennedy",
        "Buzz Aldrin",
        "Neil Armstrong",
        "Yuri Gagarin",
      ],
      poprawna_odpowiedz: "Neil Armstrong",
    },
    {
      pytanie: "Która książka jest pierwszym tomem serii 'Harry Potter'?",
      odpowiedzi: [
        "Harry Potter i Kamień Filozoficzny",
        "Harry Potter i Zakon Feniksa",
        "Harry Potter i Więzień Azkabanu",
        "Harry Potter i Książę Półkrwi",
      ],
      poprawna_odpowiedz: "Harry Potter i Kamień Filozoficzny",
    },
    {
      pytanie: "Które zwierzę jest największe na świecie?",
      odpowiedzi: [
        "Słoń afrykański",
        "Błękitny wieloryb",
        "Gorilla",
        "Słoń indyjski",
      ],
      poprawna_odpowiedz: "Błękitny wieloryb",
    },
    {
      pytanie: "Kto napisał powieść 'Zabić drozda'?",
      odpowiedzi: ["John Grisham", "Mark Twain", "J.K. Rowling", "Harper Lee"],
      poprawna_odpowiedz: "Harper Lee",
    },
    {
      pytanie: "Który pierwiastek chemiczny ma symbol 'O'?",
      odpowiedzi: ["Tlen", "Wodór", "Azot", "Ogólnik"],
      poprawna_odpowiedz: "Tlen",
    },
    {
      pytanie: "Które państwo jest znane jako 'Kraina Wschodzącego Słońca'?",
      odpowiedzi: ["Indie", "Chiny", "Japonia", "Korea Południowa"],
      poprawna_odpowiedz: "Japonia",
    },
    {
      pytanie: "Który ocean jest największy na świecie?",
      odpowiedzi: ["Spokojny", "Atlantycki", "Indyjski", "Arktyczny"],
      poprawna_odpowiedz: "Spokojny",
    },
    {
      pytanie: "Która planeta jest znana jako 'Jutrzenka i Wieczórka'?",
      odpowiedzi: ["Merkury", "Wenus", "Mars", "Jowisz"],
      poprawna_odpowiedz: "Wenus",
    },
    {
      pytanie: "Który prezydent USA był znany z przemówienia 'I Have a Dream'?",
      odpowiedzi: [
        "George Washington",
        "John F. Kennedy",
        "Abraham Lincoln",
        "Martin Luther King Jr.",
      ],
      poprawna_odpowiedz: "Martin Luther King Jr.",
    },
  ],
};

let mainMenu = () => {
  startBtn.innerHTML = "Start";
  document.getElementsByClassName("display")[0].classList.add("hidden");
  question.innerHTML = "QUIZ";
  question.classList.add("quiz");

  document
    .getElementsByClassName("quizLength")[0]
    .setAttribute("max", `${pytania.pytania.length}`);
  nastepnyprzycisk.classList.add("hidden");
};

let intervals = () => {
  isTimeRunning = true;
  interval = setInterval(() => {
    timeToZero();
  }, 1000);
};

function timeToZero() {
  if (!isTimeRunning) {
    return;
  }
  let now = new Date().getTime();
  let zeroTime = hour - now;

  if (zeroTime <= 0) {
    isTimeRunning = false;
    showResult();
  } else {
    let sec = Math.floor((zeroTime % 60000) / 1000);
    timeDiv.innerHTML = `Czas: ${sec} s.`;
  }
}

let showQandA = (clicked) => {
  music.play();
  music.volume = 0.2;
  music.loop = true;
  question.classList.remove("quiz");
  intervals();
  timeDiv.classList.add("czas1");
  timeDiv.innerHTML = "Czas: 59 s.";
  nastepnyprzycisk.classList.remove("hidden");
  document.getElementsByClassName("display")[0].classList.remove("hidden");
  startBtn.classList.add("hidden");
  displayVariants.classList.add("hidden");
  document.getElementsByName("text1")[0].classList.add("hidden");
  nastepnyprzycisk.textContent = "Następne pytanie";
  if (clicked) {
    clicked.checked = false;
  }
  if (usedQuestionIndexes.length === pytania.pytania.length) {
    showResult();
    return;
  }
  let losowo = null;
  do {
    losowo = Math.floor(Math.random() * pytania.pytania.length);
  } while (usedQuestionIndexes.includes(losowo));
  usedQuestionIndexes.push(losowo);

  question.innerHTML = pytania.pytania[losowo].pytanie;
  for (let i = 0; i <= 3; i++) {
    var los = pytania.pytania[losowo].odpowiedzi[i];
    text[i].innerHTML = los;
    radio[i].value = los;
  }
  nextSite(losowo);
};

let nextSite = (losowo) => {
  ++strona;
  site.classList.add("kolejne");
  site.innerHTML = `pytanie ${strona} z ${displayVariants.value}`;
  answer = pytania.pytania[losowo].poprawna_odpowiedz;
  console.log(answer);
  nastepnyprzycisk.addEventListener("click", function () {
    let clicked = document.querySelector("input:checked");

    if (!clicked) {
      return;
    } else if (answer === clicked.value) {
      points++;
      console.log(points);
      showQandA(clicked);
    } else {
      showQandA(clicked);
    }
  });

  oneHour = new Date();
  hour = oneHour.setMinutes(oneHour.getMinutes() + 1);

  if (strona > displayVariants.value) {
    showResult();
  }
};

let showResult = () => {
  music.pause();
  rstBtn.classList.remove("hidden");
  rstBtn.innerHTML = "Reset";
  isTimeRunning = false;
  timeDiv.style.display = "none";
  site.classList.remove("kolejne");
  site.classList.add("end");
  site.innerHTML = "Koniec!";
  document
    .getElementsByTagName("button")[0]
    .removeEventListener("click", showQandA);
  let c = (points / displayVariants.value) * 100;
  let d = Math.floor(c);
  if (points == 4 || points == 3 || points == 2) {
    question.innerHTML = `Odpowiedziałeś dobrze na ${points} pytania z ${displayVariants.value}\n uzyskano ${d}%`;
  } else if (points == 1) {
    question.innerHTML = `Odpowiedziałeś dobrze na ${points} pytanie z ${displayVariants.value}\n uzyskano ${d}%`;
  } else if (points == 0) {
    question.innerHTML = `Nie odpowiedziałeś dobrze na żadne pytanie`;
  } else {
    question.innerHTML = `Odpowiedziałeś dobrze na ${points} pytań z ${displayVariants.value}\n uzyskano ${d}%`;
  }
  if (c < 25) {
    jd.innerHTML = "Ocena : 1";
    jd.style.color = "darkred";
  } else if (c <= 49) {
    jd.innerHTML = "Ocena : 2";
    jd.style.color = "red";
  } else if (c <= 74) {
    jd.innerHTML = "Ocena : 3";
    jd.style.color = "darkorange";
  } else if (c <= 85) {
    jd.innerHTML = "Ocena : 4";
    jd.style.color = "green";
  } else {
    jd.innerHTML = "Ocena : 5";
    jd.style.color = "darkgreen";
  }

  console.log(c);
  for (let i = 3; i >= 0; i--) {
    document.getElementsByTagName("input")[i].remove();
    text[i].remove();
  }
  document.getElementsByTagName("button")[0].remove();
};

rstBtn.addEventListener("click", function () {
  window.location.reload();
});

startBtn.addEventListener("click", showQandA);
mainMenu();
