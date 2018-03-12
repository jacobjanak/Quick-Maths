// Global variables
let i; // for looping
let num, operands, operator; // for keeping track of the equation
let gameInProgress = false; // game won't start until started by user
let name = '';
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

  if (operator.forComputer === '*') {
    timer.start(20) // give more time for multiplication
  } else {
    timer.start(10) // give less time for + and -
  }

  // reset DOM
  $('#equation').text(operands[0] + ' ' + operator.forHuman + ' ' + operands[1])
  $('#guess').val('').show()
  $('#right').hide()
  $('#wrong').hide()
  $('#answer').text('')
}

// when user submits their guess
function submit() {
  timer.stop()

  let answer = eval(operands[0] + operator.forComputer + operands[1]);
  if (answer === parseInt(num)) {
    score++
    save()
    $('#score-container').text(score + ' in a row')
    $('#right').show()
    $('#wrong').hide()
  } else {
    score = 0;
    $('#score-container').text(score + ' in a row')
    $('#right').hide()
    $('#wrong').show()
    $('#answer').text(answer)
  }
}

function save() {
  if (name.length > 0) {
    database.ref().once('value').then(function(snapshot) {
      let highscores = snapshot.val().highScores;
      let nameExists = false;
      for (i = 0; i < highscores.length; i++) {
        if (highscores[i].name === name) {
          nameExists = true;
          if (score > highscores[i].score) {
            highscores[i].score = score;
            database.ref().set({ highScores: highscores })
          }
        }
      }
      if (!nameExists) {
        highscores.push({
          name: name,
          score: score
        })
        database.ref().set({ highScores: highscores })
      }
    })
  }
}

let timer = {
  start: function(time) {
    timer.stop() // just in case
    timer.time = time;

    // update DOM
    $('#timer').show()
    timer.displayCountdown()

    timer.interval = setInterval(function() {
      timer.time--

      if (timer.time === 0) {
        timer.stop()
        gameInProgress = false;
        submit() // submit users answer
      } else {
        timer.displayCountdown()
      }
    }, 1000)
  },
  stop: function() {
    clearInterval(timer.interval)
    $('#timer').empty().hide()
  },
  displayCountdown: function() {
    if (timer.time <= 60) {
      const formattedTime = ('0' + timer.time).slice(-2);
      $('#timer').text(':' + formattedTime)
    }
    //NOTE: more code for longer timers may be needed
  },
  interval: null,
  time: 0,
}

$('#name-input').on('change', function() {
  name = $(this).val().trim();
})

// highscores
$(document).on('click', '#trophy', function() {
  $('#highscores').toggle()
})

// settings
$(document).on('click', '#cog', function() {
  $('#settings').toggle()
})

// update leaderboard
database.ref().on('value', function(snapshot) {
  let highscores = snapshot.val().highScores;
  highscores.sort(compare)
  console.log(highscores)
  $('#highscores').children('tbody').empty()
  for (i = 0; i < highscores.length; i++) {
    $('#highscores').children('tbody').append(`
      <tr>
        <td class="highscore">${highscores[i].score}</td>
        <td class="highscore-name">${highscores[i].name}</td>
      </tr>`
    )
  }
})

// for sorting
function compare(a, b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
}
