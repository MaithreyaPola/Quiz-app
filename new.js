const startButton = document.querySelector("#startButton");
const selectButton = document.querySelector("#selectButton");
const startButtonDiv = document.querySelector("#startButtonDiv");
const firstDrop = document.querySelector("#firstDrop");
const secondDrop = document.querySelector("#secondDrop");
const drop = document.querySelector(".drop");
const countDown = document.querySelector("#timeCountDown");
const progress = document.querySelector(".progress");
const section = document.querySelector(".section");
const scoreBoard = document.querySelector(".scoreBoard");
const resultBtnDiv = document.querySelector(".resultBtn");
const resultButton = document.querySelector("#resultButton");
const footerDiv = document.querySelector(".footerDiv");

let newLine = document.createElement("br");
let answerDiv = document.createElement("div");
setAttributes(answerDiv, {
  class: "resultMessageContent",
});

let content = [];
let questionIndex = 0;
let firstDropdown = 18;
let secondDropdown = "easy";
let questionNumber = 1;
let totalScores = 0;
let progressValue = progress.value;

function getOption1() {
  firstDropdown = firstDrop.value;
  console.log(firstDropdown);
}

function getOption2() {
  secondDropdown = secondDrop.value;
  console.log(secondDropdown);
}

const generateQuestions = async () => {
  console.log(firstDropdown, secondDropdown);
  const res = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${firstDropdown}&difficulty=${secondDropdown}&type=multiple`
  );
  const data = await res.json();
  console.log(data.results);
  data.results.forEach((ques) => {
    const inc = ques.incorrect_answers;
    const c = ques.correct_answer;
    const options = [...inc, c];

    // Fisher-Yates shuffle algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    ques.options = options;
  });
  content = [...data.results];
};

const createQuestion = (questionObject, questionDiv) => {
  questionDiv.innerHTML = "";
  const paragraph = document.createElement("p");
  // paragraph.textContent = questionNumber;
  paragraph.textContent = `${questionNumber})    ${questionObject.question}`;
  questionDiv.append(paragraph);
  questionDiv.appendChild(newLine);
  questionDiv.appendChild(newLine);

  Object.keys(questionObject.options).forEach((optionKey) => {
    const button = document.createElement("button");
    button.textContent = questionObject.options[optionKey];
    setAttributes(button, {
      type: "button",
      id: optionKey,
      class: "button questionButton is-normal is-three-fifths",
    });
    questionDiv.appendChild(button);
    const br = document.createElement("br");
    questionDiv.appendChild(br);
  });
};

startButton.addEventListener("click", async () => {
  getOption1();
  getOption2();
  await generateQuestions();
  startCountDown();
  countDown.style.display = "table";
  progress.style.display = "block";
  section.style.display = "none";
  // drop.style.display = "none";
  // const form = document.createElement("form");
  const questionDiv = document.createElement("div");
  const buttonDiv = document.createElement("div");
  setAttributes(questionDiv, {
    class: "container",
    id: "questionDiv",
  });
  setAttributes(buttonDiv, {
    class: "container subNexBtn",
  });
  createQuestion(content[questionIndex], questionDiv);
  questionNumber = questionNumber + 1;

  const submitButton = document.createElement("button");
  const nextButton = document.createElement("button");

  submitButton.innerText = "Submit";
  setAttributes(submitButton, {
    class: "button is-danger is-rounded",
    id: "submitButton",
  });
  nextButton.innerText = "Next";
  setAttributes(nextButton, {
    class: "button is-dark is-rounded",
    id: "nextButton",
  });
  buttonDiv.appendChild(nextButton);
  buttonDiv.appendChild(submitButton);
  // form.appendChild(questionDiv);
  document.body.append(questionDiv, buttonDiv);
  // startButtonDiv.style.display = "none";
  submitButton.style.display = "none";

  nextButton.addEventListener("click", () => {
    // questionDiv.style.display = "none";
    const selectedButton1 = document.querySelector(".questionButton.selected");
    if (!selectedButton1) {
      alert("Please select an option");
      return;
    }
    progressValue += 10;
    setAttributes(progress, {
      value: progressValue,
    });
    checkAnswer();
    questionIndex = questionIndex + 1;

    if (questionIndex < content.length) {
      createQuestion(content[questionIndex], questionDiv);
      questionNumber = questionNumber + 1;
      submitButton.style.display = "none";
    } else {
      questionDiv.innerHTML = "";
      const para = document.createElement("p");
      para.classList.add("submitMessage");
      para.textContent =
        "Your test has been successfully completed. Please submit before leaving";
      questionDiv.appendChild(para);
      countDown.style.display = "none";
      submitButton.style.display = "block";
      nextButton.style.display = "none";
    }
    // console.log(questionIndex);
    // checkAnswer();
  });
  submitButton.addEventListener("click", () => {
    submitButton.style.display = "none";
    questionDiv.style.display = "none";
    footerDiv.style.display = "none";
    scoreBoard.textContent = `Total Score is: ${totalScores}`;
    // answerDiv.appendChild(overallScore);
    answerDiv.style.display = "none";
    resultBtnDiv.style.display = "block";
  });
  resultButton.addEventListener("click", () => {
    answerDiv.style.display = "block";
    resultBtnDiv.style.display = "none";
    footerDiv.style.display = "none";
  });
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("questionButton")) {
    const buttons = document.querySelectorAll(".questionButton");
    const selectedButton = e.target;
    buttons.forEach((button) => {
      button.classList.remove("selected", "is-info", "is-light");
    });
    selectedButton.classList.add("selected", "is-info", "is-light");
  }
});

function setAttributes(tag, attributes) {
  for (var key in attributes) {
    tag.setAttribute(key, attributes[key]);
  }
}

function checkAnswer() {
  const selectedButton = document.querySelector(".selected");
  const newLine2 = document.createElement("br");
  if (
    selectedButton &&
    selectedButton.innerText === content[questionIndex].correct_answer
  ) {
    totalScores += 1;
    const questionMessage = document.createElement("p");
    const resultMessage = document.createElement("p");
    resultMessage.textContent = `correct answer is: ${content[questionIndex].correct_answer}`; // correct
    questionMessage.textContent = `${questionIndex + 1})  ${
      content[questionIndex].question
    }`;
    // console.log(content[questionIndex].question);
    // selectedButton.classList.add("is-success", "is-light");
    answerDiv.appendChild(questionMessage);
    answerDiv.appendChild(resultMessage);
    answerDiv.appendChild(newLine2);
    answerDiv.appendChild(newLine2);
    document.body.appendChild(answerDiv);
    answerDiv.style.display = "none";
    return;
  }
  const questionMessage = document.createElement("p");
  const resultMessage = document.createElement("p");
  resultMessage.textContent = `Selected answer = ${selectedButton.innerText} and correct answer = ${content[questionIndex].correct_answer}`; //wrong
  // console.log(content[questionIndex].question);
  // selectedButton.classList.add("is-danger", "is-light");
  questionMessage.textContent = `${questionIndex + 1})  ${
    content[questionIndex].question
  }`;
  answerDiv.appendChild(questionMessage);
  answerDiv.appendChild(resultMessage);
  answerDiv.appendChild(newLine2);
  answerDiv.appendChild(newLine2);
  document.body.appendChild(answerDiv);
  answerDiv.style.display = "none";
  return;
}

let totalQuizTime = 0;
let time = 3;
let timeInMinutes = time * 60 * 60;

totalQuizTime = timeInMinutes / 60;

const startCountDown = () => {
  let quizTimer = setInterval(() => {
    if (totalQuizTime <= 0) {
      clearInterval(quizTimer);
      document.querySelector("#questionDiv").style.display = "none";
      document.querySelector("#nextButton").style.display = "none";
      // answerDiv.style.display = "block";
      countDown.style.display = "none";
      footerDiv.style.display = "none";
      scoreBoard.textContent = `Total Score is: ${totalScores}`;
      resultBtnDiv.style.display = "block";
    } else {
      totalQuizTime--;
      let seconds = Math.floor(totalQuizTime % 60);
      let minutes = Math.floor(totalQuizTime / 60) % 60;
      countDown.innerHTML = `Time Left: ${minutes} : ${seconds}`;
    }
  }, 1000);
};
