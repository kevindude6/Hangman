import React from 'react';
const KeyboardDisplay = (props) => {
  const makeButton = (letter) => {
    if (props.guessedLetters.includes(letter)) {
      return (
        <button key={letter} disabled onClick={() => props.clickHandler(letter)}>
          {letter}
        </button>
      );
    } else {
      return (
        <button key={letter} onClick={() => props.clickHandler(letter)}>
          {letter}
        </button>
      );
    }
  };

  const lettersTop = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const lettersMiddle = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const lettersBottom = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  const topButtons = lettersTop.map((letter) => makeButton(letter));
  const middleButtons = lettersMiddle.map((letter) => makeButton(letter));
  const bottomButtons = lettersBottom.map((letter) => makeButton(letter));
  return (
    <ul>
      <li key="top">{topButtons}</li>
      <li key="middle">{middleButtons}</li>
      <li key="bottom">{bottomButtons}</li>
    </ul>
  );
};
export default KeyboardDisplay;
