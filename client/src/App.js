import './App.css';

import React, { useState, useEffect} from 'react';
import axios from 'axios';

import GuessDisplay from './Components/GuessDisplay';
import KeyboardDisplay from './Components/KeyboardDisplay';
import { LostGameText, WonGameText } from './Components/GameComponents';



function App() {

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameState, setGameState] = useState({
    state: 'loading',
    displayWord: 'Loading...',
    remainingGuesses: 7,
  });

  //Query server on load
  useEffect(() => {
    newGame();
  }, []);

  //Tell server to delete game on window close
  useEffect(() => {
    window.addEventListener('beforeunload', (ev) => {
      if (gameState['gameId']) {
        axios.delete('http://localhost:9191/clearGame?id=' + gameState.gameId);
        delete gameState['gameId'];
      }
    });
  }, [gameState]);

  //Start a new game
  const newGame = () => {
    setGuessedLetters([]);
    axios.post(`http://localhost:9191/startGame`).then((value) => {
      setGameState(value.data);
    });
  };

  //Send a guess to the server
  const letterGuessHandler = (toGuess) => {
    axios
      .get(`http://localhost:9191/guess?id=${gameState.gameId}&guess=${toGuess}`)
      .then((value) => {
        if (value.status === 200) {
          setGameState(value.data);
        }
      });
  };

  //Reset state and start a new game
  const resetHandler = () => {
    setGameState((prevState) => ({
      ...prevState,
      displayWord: 'Loading',
      state: 'loading',
    }));
    axios.delete(`http://localhost:9191/clearGame?id=${gameState.gameId}`).then(() => {
      newGame();
    });
  };

  //Handler for when the onscreen keyboard is pressed
  const buttonClickHandler = (letter) => {
    if (gameState.state === '') {
      setGuessedLetters((prev) => [...prev, letter]);
      letterGuessHandler(letter);
    }
  };


  return (
  <div>
    <p style={{ letterSpacing: '0.2em', fontSize: '2em', marginRight: '-0.2em' }}>{gameState.displayWord}</p>
    <GuessDisplay gstate={gameState} />
    <LostGameText gameState={gameState} resetHandler={resetHandler}/>
    <WonGameText gameState={gameState} resetHandler={resetHandler}/>
    <KeyboardDisplay guessedLetters={guessedLetters} setGuessedLetters={setGuessedLetters} clickHandler={buttonClickHandler}/>
  </div>);
}

export default App;
