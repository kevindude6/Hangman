const express = require('express');
const app = express();
const axios = require('axios');
const session = require('express-session');
var cors = require('cors');


//boilerplate
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));

var sessProperties = {
  secret: 'yeehaw',
  cookie: {secure: false},
  resave: true,
  saveUninitialized: true
}
app.use(session(sessProperties));

app.listen(9191);


//utility
const replaceChar = (str, index, char) => {
  let first = str.substr(0, index);
  let second = str.substr(index + 1);
  return first + char + second;
};

const GetRandomWord = async () => {
  const result = await axios('https://random-word-api.herokuapp.com/word?number=1');
  return result.data[0];
};


//logic
const games = {};
const gameWords = {};

const MakeNewGame = async (gameId) => {
  let targetWord = await GetRandomWord();
  let displayWord = '_'.repeat(targetWord.length);
  let remainingGuesses = 7;
  let state = '';
  let guessedLetters = [];

  games[gameId] = { gameId, displayWord, remainingGuesses, state, guessedLetters };
  gameWords[gameId] = targetWord;

  return games[gameId];
};
const DoGuess = (gameId, guess) => {
  //Check game is valid
  if (!games[gameId]) {
    console.log("Game does not exist");
    throw new Error('Game does not exist');
  }
  
  let game = games[gameId];
  if (game.remainingGuesses <= 0 || game.state != '') {
    console.log("Game is over");
    throw new Error('Game is over');
  }

  if(!game.guessedLetters)
  {
    console.log("no guessed letters");
  }

  if(game.guessedLetters.includes(guess))
  {
    console.log("already guessed");
    throw new Error('Already guessed!');
  }

  game.guessedLetters.push(guess);
  
  //Check guess is valid
  let validGuess = false;
  let targetWord = gameWords[gameId];
  if (targetWord.includes(guess)) {
    validGuess = true;
    //fill in guessed letters
    for (let i = 0; i < targetWord.length; i++) {
      if (targetWord[i] == guess) {
        game.displayWord = replaceChar(game.displayWord, i, guess);
      }
    }
    //check for win
    let win = true;
    for (let i = 0; i < targetWord.length; i++) {
      if (game.displayWord[i] != targetWord[i]) {
        win = false;
        break;
      }
    }

    if (win) {
      game.state = 'win';
      game.targetWord = targetWord;
    }

  } else {
    game.remainingGuesses -= 1;
    if (game.remainingGuesses <= 0) {
      game.state = 'lose';
      game.targetWord = targetWord;
    }
  }

  //Send new game state
  return game;
};



//routing
app.get('/getGameState', (req, res) => {
  if (games[req.sessionID]) {
    res.send(games[req.sessionID]);
  } else {
    MakeNewGame(req.sessionID).then((result) => res.send(result));
  }
});
app.post('/resetGame', (req, res) => {
  MakeNewGame(req.sessionID).then((result) => res.send(result));
});
app.get('/guess', (req, res) => {
  try {
    res.send(DoGuess(req.sessionID, req.query.guess));
  } catch (e) {
    res.sendStatus(400); //TODO provide more information
  }
});

