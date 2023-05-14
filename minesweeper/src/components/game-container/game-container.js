import './game-container-style.scss';

const createGameContainer = () => {
  const gameContainer = document.createElement('div');
  gameContainer.className = 'game-container';
  return gameContainer;
};

export default createGameContainer;
