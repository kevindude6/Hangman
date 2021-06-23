const express = require('express');
const app = express();
const axios = require('axios');
const { v1: uuidv1, v4: uuidv4 } = require('uuid');
var cors = require('cors');


//boilerplate
app.use(express.json());
app.use(cors());

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

const MakeNewGame = async () => {
  let gameId = uuidv1();
  let targetWord = await GetRandomWord();
  let displayWord = '_'.repeat(targetWord.length);
  let remainingGuesses = 7;
  let state = '';

  games[gameId] = { gameId, displayWord, remainingGuesses, state };
  gameWords[gameId] = targetWord;

  return games[gameId];
};
const DoGuess = (gameId, guess) => {
  //Check game is valid
  if (!games[gameId]) {
    throw new Error('Game does not exist');
  }
  
  let game = games[gameId];
  if (game.remainingGuesses <= 0 || game.state != '') {
    throw new Error('Game is over');
  }

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
  if (games[req.query.id]) {
    res.send(games[req.query.id]);
  } else {
    res.sendStatus(404);
  }
});
app.post('/startGame', (req, res) => {
  MakeNewGame().then((result) => res.send(result));
});
app.get('/guess', (req, res) => {
  try {
    res.send(DoGuess(req.query.id, req.query.guess));
  } catch (e) {
    res.sendStatus(400); //TODO provide more information
  }
});
app.delete('/clearGame', (req, res) => {
  console.log('clearing game ' + req.query.id);
  delete games[req.query.id];
  delete gameWords[req.query.id];
  res.sendStatus(200);
});
