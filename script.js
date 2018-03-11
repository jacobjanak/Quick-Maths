// Global variables
let i; // for looping
let num, operands, operator; // for keeping track of the equation
let gameInProgress = false; // game won't start until started by user
let score = 0; // score is correct guesses in a row

// App settings
const maximumNumber = 99;
const minimumNumber = 10;
const operators = [{
  forComputer: '+',
  forHuman: '+',
}, {
  forComputer: '-',
  forHuman: '-'
}, {
  forComputer: '*',
  forHuman: 'x'
}];

// Utility functions
const randomNumberBetween = (min, max) => { return Math.round(Math.random() * (max - min) + min) };
const enterKeyCode = 13; // the keycode for the enter key is 13

// Firebase
const config = {
  apiKey: "AIzaSyC_7GuMsw-Kg0JCR_ph_mVXxqDbdja1cmo",
  authDomain: "quick-d0d40.firebaseapp.com",
  databaseURL: "https://quick-d0d40.firebaseio.com",
  projectId: "quick-d0d40",
  storageBucket: "quick-d0d40.appspot.com",
  messagingSenderId: "67403778546"
};
firebase.initializeApp(config);
let database = firebase.database();


// app is ran through the keyboard
$(document).on('keyup', function(event) {
  if (gameInProgress) {

    // user is typing
    if (!isNaN(event.key) || event.key === "-" || event.key === ".") {
      num += event.key;
      $('#guess').val(num)
    }

    //NOTE: add code for delete key

    // user is submitting guess
    else if (event.keyCode === enterKeyCode) {
      gameInProgress = false;
      submit()
    }
  } else {
    // enter key starts the app
    if (event.keyCode === enterKeyCode) {
      gameInProgress = true;
      app()
    }
  }
})

function app() {
  // reset global vars
  num = "";
  operator = operators[randomNumberBetween(0, operators.length - 1)];
  operands = [
    randomNumberBetween(maximumNumber, minimumNumber),
    randomNumberBetween(maximumNumber, minimumNumber)
  ];

  database.ref().set({
    highScores: [1,0]
  })

  // reset DOM
  $('#equation').text(operands[0] + ' ' + operator.forHuman + ' ' + operands[1])
  $('#guess').val('').show()
  $('#right').hide()
  $('#wrong').hide()
  $('#answer').text('')
}

function submit() {
  let answer = eval(operands[0] + operator.forComputer + operands[1]);
  if (answer === parseInt(num)) {
    score++
    $('#right').show()
    $('#wrong').hide()
  } else {
    score = 0;
    $('#right').hide()
    $('#wrong').show()
    $('#answer').text(answer)
  }
}

$(document).on('click', '#trophy', function() {
  $('#highscores').toggle()
})

$(document).on('click', '#cog', function() {
  $('#settings').toggle()
})
