import './App.css';

import React, { useState, useEffect} from 'react';
import axios from 'axios';

import GuessDisplay from './Components/GuessDisplay';
import KeyboardDisplay from './Components/KeyboardDisplay';
import { LostGameText, WonGameText } from './Components/GameComponents';



function App() {
  axios.defaults.withCredentials = true;

  //const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameState, setGameState] = useState({
    state: 'loading',
    displayWord: 'Loading...',
    remainingGuesses: 7,
  });

  //Query server on load
  useEffect(() => {
    queryGame();
  }, []);

  //Start a new game
  const queryGame = () => {
    //setGuessedLetters([]);
    axios.get(`http://localhost:9191/getGameState`).then((value) => {
      setGameState(value.data);
    });
  };
  
  const sendReset = () => {
    axios.post(`http://localhost:9191/resetGame`).then((value) => {
      setGameState(value.data);
    });
  }

  //Send a guess to the server
  const letterGuessHandler = (toGuess) => {
    axios
      .get(`http://localhost:9191/guess?guess=${toGuess}`)
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
    
    sendReset();
  };

  //Handler for when the onscreen keyboard is pressed
  const buttonClickHandler = (letter) => {
    if (gameState.state === '') {
      letterGuessHandler(letter);
    }
  };


  return (
  <div>
    <p style={{ letterSpacing: '0.2em', fontSize: '2em', marginRight: '-0.2em' }}>{gameState.displayWord}</p>
    <GuessDisplay gstate={gameState} />
    <LostGameText gameState={gameState} resetHandler={resetHandler}/>
    <WonGameText gameState={gameState} resetHandler={resetHandler}/>
    <KeyboardDisplay gameState={gameState} clickHandler={buttonClickHandler}/>
  </div>);
}

export default App;
