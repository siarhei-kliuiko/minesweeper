import './minesweeper-style.scss';

const createMinesweeper = () => {
  const minesweeper = document.createElement('div');
  minesweeper.className = 'minesweeper';
  return minesweeper;
};

export default createMinesweeper;
