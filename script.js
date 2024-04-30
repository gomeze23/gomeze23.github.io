// Get IDs of required elements in the HTML file.
const questionLabel = document.querySelector("#question");
const answersBlock = document.querySelector("#answers");
const topLabel = document.querySelector("#top");
const bottomLabel = document.querySelector("#bottom");
const submitButton = document.querySelector("#submit");

let questions = [];          // List of questions.
let currentQuestion = 0;     // Index of current question.
let answers = [];            // List of answers.
let correctAnswers = [];     // List of correct answer indices.
let selectedAnswers = [];    // List of selected answer indices.
let score = 0;               // Number of correctly answered questions.
let passingPercentage = 60;  // Passing score percentage.
let enableUserInput = true;  // Boolean that enables/disables user input.

// Fetch questions from "questions.json".
fetch("./questions.json")
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return res.json();
    })
    .then(data => {
        // Store questions array.
        questions = data.questions;
        console.log(questions);
    })
    .catch(error => console.error("Unable to fetch data:", error));

// Update a label's text and/or style.
// If there are no text or styles given, they will be undefined.
function updateLabel(label, text = undefined, styles = undefined) {
    // If a text argument is given, replace the current label's text with the new one.
    if (text) {
        label.innerText = text;
    }

    // If a styles argument is given, change the label's style.
    if (styles && styles.length % 2 === 0) {
        // Loop through the styles array, going through each property-value pair.
        for (let i = 0; i < styles.length; i += 2) {
            const property = styles[i];     // The style property.
            const value = styles[i + 1];    // The value of the property.
            label.style[property] = value;  // Change the style of the label.
        }
    }
}

// Update the submit button's text and function when clicked.
function updateSubmitButton(text, func) {
    submitButton.innerText = text;        // The text inside the submit button.
    submitButton.onclick = () => func();  // The function called when the submit button is clicked.
}

// Restart the quiz.
function restart() {
    score = 0;             // Reset the score to 0.
    currentQuestion = 0;   // Start at the first question.
    correctAnswers = [];   // Empty the list of correct answers.
    selectedAnswers = [];  // Empty the list of selected answers.

    // Change label styles.
    updateLabel(topLabel, undefined, ["display", "inline"]);
    updateLabel(questionLabel, undefined, ["display", "block"]);
    updateLabel(answersBlock, undefined, ["display", "flex"]);
    updateLabel(bottomLabel, undefined, ["display", "block"]);
    
    displayQuestion(currentQuestion);  // Display the current question.
}

// The code that runs at the start of the program.
function start() {
    enableUserInput = true;  // Allow the user to press the submit button.

    // Change label styles.
    updateLabel(topLabel, undefined, ["display", "none"]);
    updateLabel(questionLabel, "Welcome to the Programming Quiz!", ["display", "block"]);
    updateLabel(answersBlock, undefined, ["display", "none"]);
    updateLabel(bottomLabel, `You must get ${passingPercentage.toFixed(2)}% or higher to pass.`, ["display", "block"]);
    updateSubmitButton("Start", restart);
}

// The code that runs when the quiz is finished.
function end() {
    enableUserInput = true;  // Allow the user to press the submit button.

    // Change label styles.
    updateLabel(topLabel, undefined, ["display", "none"]);
    updateLabel(questionLabel, "You finished the quiz!", ["display", "block"]);
    updateLabel(answersBlock, undefined, ["display", "none"]);
    updateSubmitButton("Go Back", start);

    calculateScore();  // Calculate the score.
}

// Display a question using its index.
function displayQuestion(question) {
    enableUserInput = true;  // Allow user to answer questions.

    // Display the current question number and the user's score.
    updateLabel(topLabel, `${question + 1} of ${questions.length} (${score}/${questions.length} correct)`);
    
    // Display the current question.
    updateLabel(questionLabel, questions[question].question);

    // Change the bottom label's style.
    updateLabel(bottomLabel, undefined, ["color", "black", "fontWeight", "normal"]);

    displayAnswers(question);  // Display the answer choices.

    // Tell the user how many answers are correct.
    if (correctAnswers.length === 1) {
        updateLabel(bottomLabel, "(There is 1 correct answer.)");
    } else {
        updateLabel(bottomLabel, `(There are ${correctAnswers.length} correct answers.)`);
    }

    updateSubmitButton("Submit", submitAnswers);
}

// Display the question's answer choices.
function displayAnswers(question) {
    answers = questions[question].answers;         // Store the answer choices in a list.
    correctAnswers = questions[question].correct;  // Store the indexes of the correct answers in a list.
    selectedAnswers = [];                          // Empty the list of selected answers.

    // Remove the answer choices from the previous question.
    while (answersBlock.hasChildNodes()) {
        answersBlock.removeChild(answersBlock.firstChild);
    }

    // Display each answer.
    for (let answer in answers) {
        // Create an answer button.
        const answerButton = document.createElement("button");
        answerButton.innerText = answers[answer];
        answerButton.id = `answer-${parseInt(answer) + 1}`;
        answerButton.classList.add("answer");
        answerButton.onclick = function() { selectAnswer(this.id) };

        // Determine if the answer is correct.
        if (correctAnswers.includes(parseInt(answer))) {
            answerButton.classList.add("correct");
        }

        // Add the answer button to the answers block.
        answersBlock.appendChild(answerButton);
    }
}

// Toggle answer button selection.
function selectAnswer(answerID) {
    // Check if the user has not submitted their answers.
    if (enableUserInput) {
        // If the answers haven't been submitted, run the following code:

        // Get the selected answer based on its ID.
        const selectedAnswer = document.getElementById(answerID);

        // Check if the answer has already been selected or not.
        if (!selectedAnswer.classList.contains("selected")) {
            // If the answer wasn't selected, run this:

            // Only select when the number of selected answers is less than the number of correct answers.
            if (selectedAnswers.length < correctAnswers.length) {
                selectedAnswer.classList.add("selected");
                selectedAnswers.push(selectedAnswer);
                updateLabel(bottomLabel, undefined, ["color", "black", "fontWeight", "normal"]);
            } else {
                // Warn the player that they cannot select any more answers unless they unselect another one.
                updateLabel(bottomLabel, undefined, ["color", "crimson", "fontWeight", "bold"]);
            }
        } else {
            // Else, if the answer was selected before, run this:

            // Unselect the answer.
            selectedAnswer.classList.remove("selected");
            selectedAnswers.splice(selectedAnswers.indexOf[selectedAnswer], 1);
            updateLabel(bottomLabel, undefined, ["color", "black", "fontWeight", "normal"]);
        }
    }
}

// Submit the user's answer choices.
function submitAnswers() {
    // Check if the number of selected answers is equal to the number of correct answers.
    if (selectedAnswers.length === correctAnswers.length) {
        enableUserInput = false;  // Stop the user from making any more inputs.

        // Change the bottom label's style.
        updateLabel(bottomLabel, undefined, ["color", "black", "fontWeight", "normal"]);
        
        // Store a list of the IDs of all correct answers.
        const correctAnswerIds = document.querySelectorAll(".correct");

        // Store a list of the IDs of all wrong, selected answers.
        const wrongSelects = document.querySelectorAll(".selected:not(.correct)");

        // Show correct answers in green.
        for (let i = 0; i < correctAnswerIds.length; i++) {
            correctAnswerIds[i].style.backgroundImage = "linear-gradient(#90ee90, #32cd32)";
        }

        // Show wrong, selected answers in red.
        for (let i = 0; i < wrongSelects.length; i++) {
            wrongSelects[i].style.backgroundImage = "linear-gradient(#e83f60, #d42828)";
            wrongSelects[i].style.color = "white";
        }

        // Add 1 point if the user has no wrong answers and got all correct answers.
        if (wrongSelects.length === 0) {
            score++;
            topLabel.innerText = `${currentQuestion + 1} of ${questions.length} (${score}/${questions.length} correct)`;
        }

        // Update the submit button so it displays the next question when clicked.
        updateSubmitButton("Next", () => {
            currentQuestion++;  // Next question

            // Check if the current question is past the last question.
            if (currentQuestion === questions.length) {
                end();  // End the quiz when all questions have been answered.
            } else {
                displayQuestion(currentQuestion);  // Else, display the next question.
            }
        });
    } else {
        // Warn the player that they must select the correct number of answers before submitting.
        updateLabel(bottomLabel, undefined, ["color", "crimson", "fontWeight", "bold"]);
    }
}

// Calculate and display the score.
function calculateScore() {
    // Calculate the score percentage.
    scorePercentage = score / questions.length * 100;

    // Display the score.
    updateLabel(bottomLabel, `You got ${score} out of ${questions.length} (${scorePercentage.toFixed(2)}%) correct.`, ["display", "block"]);

    // Tell the user if they passed or failed.
    if (scorePercentage === 100) {
        bottomLabel.innerText += " Great job! You got all of them right!";
    } else if (scorePercentage < passingPercentage) {
        bottomLabel.innerText += " You failed. Better luck next time!";
    } else {
        bottomLabel.innerText += " You passed. Good job!";
    }
}

window.onload = start();  // Start the program when the web page loads.
