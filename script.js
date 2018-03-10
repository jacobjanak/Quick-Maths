// Global variables
let i;
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

// App settings
const maximumNumber = 99;
const minimumNumber = 10;

let operands = []
for (i = 0; i < 2; i++) {
  operands.push(randomNumberBetween(maximumNumber, minimumNumber))
}

let operator = operators[randomNumberBetween(0, operators.length - 1)];

$('#equation').text(operands[0] + ' ' + operator.forHuman + ' ' + operands[1])


let num = "";
$(document).on('keyup', function(event) {
  if (!isNaN(event.key) || event.key === "-" || event.key === ".") {
    num = num + event.key;
    $('#guess').val(num)
  }
  else if (event.key === "enter" || event.keyCode === 13) {
    let answer = eval(operands[0] + operator.forComputer + operands[1]);
    if (num == answer) {
      $('#right').show()
      $('#wrong').hide()
    } else {
      $('#right').hide()
      $('#wrong').show()
      $('#answer').text(answer)
    }
    app()
  }
})

function app() {

}
