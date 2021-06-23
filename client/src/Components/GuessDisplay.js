import React from 'react';
const GuessDisplay = (props) => {
  return <p style={{ fontSize: '1em' }}>{props.gstate.remainingGuesses} guesses remaining</p>;
};
export default GuessDisplay;
