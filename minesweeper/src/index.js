import './components/common/base.scss';
import createGameContainer from './components/game-container/game-container';
import createMinesweeper from './components/game-content/minesweeper';
import MinesweeperMenu from './components/game-content/menu/menu';
import MinesweeperMineField from './components/game-content/mine-field/mine-field';
import gameStartMusic from './assets/sounds/duck-hunt-intro.mp3';
import Dog from './components/dog/dog';
import MessageBox from './components/message-box/message-box';
import dogLaugh from './assets/sounds/laugh.mp3';
import cheerSound from './assets/sounds/cheer.mp3';

const gameContainer = createGameContainer();
document.body.append(gameContainer);

const minesweeper = createMinesweeper();
gameContainer.append(minesweeper);

const menu = new MinesweeperMenu();
minesweeper.append(menu.htmlElement);

const mineField = new MinesweeperMineField(10);
minesweeper.append(mineField.htmlElement);
let currentPixelRatio = window.devicePixelRatio;
const fitMineFieldToScreen = () => {
  const newPixelRatio = window.devicePixelRatio;
  if (currentPixelRatio === newPixelRatio) {
    const currentPadding = parseInt(getComputedStyle(minesweeper).paddingBottom, 10);
    const mineFieldTop = mineField.htmlElement.getBoundingClientRect().top;
    const calcHeight = window.innerHeight - mineFieldTop - currentPadding;
    mineField.setSize(calcHeight, currentPadding);
  } else {
    currentPixelRatio = newPixelRatio;
  }
};

fitMineFieldToScreen();
mineField.adjustFontSize();

window.addEventListener('resize', fitMineFieldToScreen);

const handleGameWin = () => {
  mineField.disable();
  mineField.openAllCells();
  menu.secondsCounter.stop();
  new Audio(cheerSound).play();
  MessageBox.showMessage(`Hooray! You found all mines in ${menu.secondsCounter.seconds} seconds and ${menu.clicksCounter.numberOfClicks} ${menu.clicksCounter.numberOfClicks % 10 === 1 ? 'move' : 'moves'}!`);
};

const clickCell = (event) => {
  const targetCell = event.target.closest('.minesweeper__mine-cell');
  if (targetCell && event.button === 0) {
    if (mineField.openCell(targetCell)) {
      menu.clicksCounter.addClick();
      if (mineField.isAllMineCellsFound()) {
        handleGameWin();
      }
    }
  }
};

const fillMineField = (event) => {
  const targetCell = event.target.closest('.minesweeper__mine-cell');
  if (targetCell && event.button === 0) {
    mineField.placeMines(10, targetCell);
    mineField.htmlElement.removeEventListener('mousedown', fillMineField);
    menu.secondsCounter.start();
    clickCell(event);
    mineField.htmlElement.addEventListener('mousedown', clickCell);
  }
};

const startNewGame = () => {
  menu.resetCounters();
  mineField.disable();
  mineField.reset();
  mineField.htmlElement.removeEventListener('mousedown', clickCell);
  new Audio(gameStartMusic).play();
  const dog = new Dog(menu.bush.getBoundingClientRect(), mineField);
  minesweeper.append(dog.htmlElement);
  dog.goForAWalk(3, () => {
    const bushDimensions = menu.bush.getBoundingClientRect();
    Dog.bark();
    dog.goForAWalk(1, () => {
      dog.htmlElement.remove();
      mineField.enable();
      mineField.htmlElement.addEventListener('mousedown', fillMineField);
    }, bushDimensions.left, bushDimensions.top);
  });
};

menu.bushClicked = startNewGame;

const handleGameLose = (mineCell) => {
  mineField.disable();
  menu.bushClicked = null;
  menu.secondsCounter.stop();
  mineCell.revealMine(() => {
    menu.bush.addEventListener('animationend', (event) => {
      if (event.animationName === 'bush-dog') {
        menu.bush.classList.remove('bush_animation_lose');
        menu.bush.classList.add('bush_animation_idle');
        MessageBox.showMessage('Game over. Try again');
        menu.bushClicked = startNewGame;
      }
    }, { once: true });

    new Audio(dogLaugh).play();
    menu.bush.classList.add('bush_animation_lose');
  });
};

mineField.mineCellClicked = handleGameLose;
