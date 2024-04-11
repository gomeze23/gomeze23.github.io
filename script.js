// Initialise variables from the HTML document
const questionLabel = document.querySelector("#question");
const answersBlock = document.querySelector("#answers");
const topLabel = document.querySelector("#top");
const bottomLabel = document.querySelector("#bottom");
const submitButton = document.querySelector("#submit");
const test = document.querySelector("#test");

let score = 0;             // Number of questions correctly answered
let currentQuestion = 0;   // Index of current question
let answers = [];          // List of answers
let correctAnswers = [];   // List of correct answer indices
let selectedAnswers = [];  // List of selected answer indices
let submitted = false;     // Boolean that determines if the question has been submitted or not
let questions = [];        // List of questions for the quiz

// Fetch questions from a JSON file
function fetchQuestions(url) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            return res.json();
        })
        .then(data => {
            // Store questions array
            questions = data.questions;
            console.log(questions);
        })
        // Catch any errors
        .catch(error => console.error("Unable to fetch data:", error));
}

// Fetch questions from questions.json
fetchQuestions("./questions.json");

// Runs at the start of the quiz
function start() {
    topLabel.style.display = "none";
    questionLabel.style.display = "block";
    answersBlock.style.display = "none";
    bottomLabel.style.display = "none";

    questionLabel.innerText = "Welcome to the Programming Quiz!";

    submitButton.innerText = "Start";
    submitButton.onclick = () => restart();
}

// Restart quiz
function restart() {
    score = 0;             // Reset score to 0 
    currentQuestion = 0;   // Start at first question
    correctAnswers = [];   // Empty list of correct answers
    selectedAnswers = [];  // Empty list of selected answers

    topLabel.style.display = "inline";
    questionLabel.style.display = "block";
    answersBlock.style.display = "flex";
    bottomLabel.style.display = "block";

    displayQuestion(currentQuestion);
}

// Runs when the quiz is finished
function end() {
    submitted = false;

    topLabel.style.display = "none";
    questionLabel.style.display = "block";
    answersBlock.style.display = "none";
    bottomLabel.style.display = "block";

    questionLabel.innerText = "You finished the quiz!";
    bottomLabel.innerText = `You got ${score} out of ${questions.length} correct.`;

    submitButton.innerText = "Go Back";
    submitButton.onclick = () => start();
}

// Display question
function displayQuestion(question) {
    submitted = false;

    topLabel.innerText = `${question + 1} of ${questions.length} (${score}/${questions.length} correct)`;
    questionLabel.innerText = questions[question].question;
    bottomLabel.style.color = "black";
    bottomLabel.style.fontWeight = "normal";

    displayAnswers(question);

    if (correctAnswers.length === 1) {
        bottomLabel.innerText = "(There is 1 correct answer.)";
    } else {
        bottomLabel.innerText = `(There are ${correctAnswers.length} correct answers.)`;
    }

    submitButton.innerText = "Submit";
    submitButton.onclick = () => submitAnswers();
}

// Display answers
function displayAnswers(question) {
    answers = questions[question].answers;
    correctAnswers = questions[question].correct;
    selectedAnswers = [];

    // Remove previous answers
    while (answersBlock.hasChildNodes()) {
        answersBlock.removeChild(answersBlock.firstChild);
    }

    // Display each answer
    for (let answer in answers) {
        // Create an answer button
        const answerButton = document.createElement("button");
        answerButton.innerText = answers[answer];
        answerButton.id = `answer-${parseInt(answer) + 1}`;
        answerButton.classList.add("answer");
        answerButton.onclick = function () { selectAnswer(this.id) };

        // Determine if the answer is correct
        if (correctAnswers.includes(parseInt(answer))) {
            answerButton.classList.add("correct");
        }

        // Add answer button to the answers block
        answersBlock.appendChild(answerButton);
    }
}

// Toggles button select
function selectAnswer(answerId) {
    if (!submitted) {
        const selectedAnswer = document.getElementById(answerId);

        // Check if the answer is selected or not
        if (!selectedAnswer.classList.contains("selected")) {
            // Check if the number of selected numbers is less than the number of correct answers
            if (selectedAnswers.length < correctAnswers.length) {
                // The answer is selected
                selectedAnswer.classList.add("selected");
                selectedAnswers.push(selectedAnswer);

                bottomLabel.style.color = "black";
                bottomLabel.style.fontWeight = "normal";
            } else {
                // Warn the player that they cannot select any more answers
                bottomLabel.style.color = "crimson";
                bottomLabel.style.fontWeight = "bold";
            }
        } else {
            // The answer is unselected
            selectedAnswer.classList.remove("selected");
            selectedAnswers.splice(selectedAnswers.indexOf[selectedAnswer], 1);

            bottomLabel.style.color = "black";
            bottomLabel.style.fontWeight = "normal";
        }
    }
}

// Submit answers
function submitAnswers() {
    if (selectedAnswers.length === correctAnswers.length) {
        submitted = true;

        bottomLabel.style.color = "black";
        bottomLabel.style.fontWeight = "normal";

        const correctAnswerIds = document.querySelectorAll(".correct");
        const wrongSelects = document.querySelectorAll(".selected:not(.correct)");

        // Show correct selected answers
        for (let i = 0; i < correctAnswerIds.length; i++) {
            correctAnswerIds[i].style.backgroundImage = "linear-gradient(#90ee90, #32cd32)";
        }

        // Show wrong selected answers
        for (let i = 0; i < wrongSelects.length; i++) {
            wrongSelects[i].style.backgroundImage = "linear-gradient(#e83f60, #d42828)";
            wrongSelects[i].style.color = "white";
        }

        if (wrongSelects.length === 0) {
            score++;
            topLabel.innerText = `${currentQuestion + 1} of ${questions.length} (${score}/${questions.length} correct)`;
        }
        
        submitButton.innerText = "Next";
        submitButton.onclick = () => {
            currentQuestion++;  // Next question

            // Check if the current question is past the last question
            if (currentQuestion === questions.length) {
                end();
            } else {
                displayQuestion(currentQuestion);
            }
        }
    } else {
        // Warn the player that they must select the correct number of answers
        bottomLabel.style.color = "crimson";
        bottomLabel.style.fontWeight = "bold";
    }
}

window.onload = start();