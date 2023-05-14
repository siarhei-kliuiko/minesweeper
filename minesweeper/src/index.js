import './components/common/base.scss';
import createGameContainer from './components/game-container/game-container';
import minesweeper from './components/game-content/minesweeper';

const gameContainer = createGameContainer();
gameContainer.append(minesweeper);
document.body.append(gameContainer);
