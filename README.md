# Programming Quiz
*Made by Ethan Gomez*

## Introduction
This program is my submission for AS 92004 (Create a computer program). For my assessment, I made a quiz program that tests the user’s programming (and Python) knowledge. I programmed the quiz using HTML for the website structure, CSS for the website styles, a JSON file to store my questions and answers, and most importantly, I used JavaScript to add functionality to the quiz website.

My program follows the requirements needed to pass the assessment:
- The program uses JavaScript, which can support the assessment requirements.
- The program stores more than two types of data: integers, floats, strings, booleans, arrays and objects.
- The program handles user input via the answer buttons and the submit button.
- The program displays output by showing the user the correct answer(s) and their score for each question.
- The program uses sequence, selection and iteration control structures.
- The program uses data stored in a collection by storing the questions and answers in a JSON file, which is then converted to a JavaScript object to access it.
- The quiz has more than 5 questions.
- The program keeps track of the user’s score and displays it.
- The program tells the user if they have passed the quiz after they have finished it.

## The Program
When the user first enters the website, they are greeted with a starting page that tells them the passing score percentage (60% score or higher to pass), as well as a button to start the quiz.

Once the user starts the quiz, the questions from the JSON file will be fetched and displayed in order. The top label shows the user the current question they are on, as well as their score. The question is then displayed below in bold letters, and each answer is displayed separately in buttons. The bottom label shows how many correct answers there are. Lastly, there is a submit button for the user to submit their answer(s).

The user is able to give input to the program by clicking the answer and submit buttons. The computer displays output by showing the user the correct answer(s), and if they guessed correctly or not.

Once the user has finished the quiz, the end screen is displayed. The computer tells the user their final score, and if they passed or not. The user is given the option to restart the quiz.
