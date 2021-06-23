import React, { Fragment } from 'react';
export const LostGameText = (props) => {
  if (props.gameState.state !== 'lose') {
    return null;
  }

  return (
    <Fragment>
      <p>
        Gameover! Word was <b>{props.gameState.targetWord}</b>
      </p>
      <button onClick={props.resetHandler}>Reset</button>
    </Fragment>
  );
};
export const WonGameText = (props) => {
  if (props.gameState.state !== 'win') {
    return null;
  }

  return (
    <Fragment>
      <p>
        Win! Word was <b>{props.gameState.targetWord}</b>
      </p>
      <button onClick={props.resetHandler}>Reset</button>
    </Fragment>
  );
};
