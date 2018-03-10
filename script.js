// Global variables
let i;
let num, operands, operator;
let gameInProgress = false;
let enterKeyCode = 13;

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

function app() {
  // reset global vars
  num = "";
  operator = operators[randomNumberBetween(0, operators.length - 1)];
  operands = [];

  // so far this for loop must only run twice
  for (i = 0; i < 2; i++) {
    operands.push(randomNumberBetween(maximumNumber, minimumNumber))
  }

  // reset DOM
  $('#equation').text(operands[0] + ' ' + operator.forHuman + ' ' + operands[1])
  $('#guess').val('')
  $('#right').hide()
  $('#wrong').hide()
  $('#answer').text('')
}

$(document).on('keyup', function(event) {
  if (gameInProgress) {

    // user is typing
    if (!isNaN(event.key) || event.key === "-" || event.key === ".") {
      num += event.key;
      $('#guess').val(num)
    }

    // user is submitting guess
    else if (event.keyCode === enterKeyCode) {
      gameInProgress = false;
      let answer = eval(operands[0] + operator.forComputer + operands[1]);
      if (num == answer) {
        $('#right').show()
        $('#wrong').hide()
      } else {
        $('#right').hide()
        $('#wrong').show()
        $('#answer').text(answer)
      }
    }
  } else {
    // enter key starts the app
    if (event.keyCode === enterKeyCode) {
      gameInProgress = true;
      app()
    }
  }
})
