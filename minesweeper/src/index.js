import './components/common/base.scss';
import createGameContainer from './components/game-container/game-container';
import createMinesweeper from './components/game-content/minesweeper';
import MinesweeperMenu from './components/game-content/menu/menu';
import MinesweeperMineField from './components/game-content/mine-field/mine-field';
import { SoundsRepository, sounds } from './components/sounds-repository/sounds-repository';
import Dog from './components/dog/dog';
import MessageBox from './components/message-box/message-box';
import GameResultsStorage from './components/game-result-storage/game-results-storage';

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
  SoundsRepository.createSound(sounds.cheer).play();
  MessageBox.showMessage(`Hooray! You found all mines in ${menu.secondsCounter.seconds} seconds and ${menu.clicksCounter.count} moves!`);
};

const handleFlagPlacement = (count, remove) => {
  if (remove) {
    menu.flagsCounter.decrease(count);
    if (menu.flagsCounter.count < menu.minesCounter.initialValue) {
      menu.minesCounter.set(menu.minesCounter.initialValue - menu.flagsCounter.count);
    }
  } else {
    menu.flagsCounter.increase(count);
    menu.minesCounter.decrease(count);
  }
};

const clickCell = (event) => {
  const targetCell = event.target.closest('.minesweeper__mine-cell');
  if (targetCell) {
    if (event.button === 0) {
      if (mineField.openCell(targetCell)) {
        menu.clicksCounter.increase();
        const flagsLeft = mineField.cells.filter((cell) => cell.isFlagged).length;
        if (flagsLeft !== menu.flagsCounter.count) {
          handleFlagPlacement(menu.flagsCounter.count - flagsLeft, true);
        }

        if (mineField.isAllMineCellsFound()) {
          handleGameWin();
        }
      }
    } else if (event.button === 2) {
      const flagPlacement = mineField.placeFlag(targetCell);
      if (flagPlacement.isFlagPlaced) {
        menu.clicksCounter.increase();
        handleFlagPlacement(1, flagPlacement.isAway);
      }
    }
  }
};

const fillMineField = (event) => {
  const targetCell = event.target.closest('.minesweeper__mine-cell');
  if (targetCell) {
    menu.secondsCounter.start();
    if (event.button === 0) {
      mineField.placeMines(10, targetCell);
      mineField.htmlElement.removeEventListener('mousedown', fillMineField);
      clickCell(event);
      mineField.htmlElement.addEventListener('mousedown', clickCell);
    } else if (event.button === 2) {
      const flagPlacement = mineField.placeFlag(targetCell);
      if (flagPlacement.isFlagPlaced) {
        menu.clicksCounter.increase();
        handleFlagPlacement(1, flagPlacement.isAway);
      }
    }
  }
};

const startNewGame = () => {
  menu.bushClicked = null;
  menu.resetCounters();
  mineField.disable();
  mineField.reset();
  mineField.htmlElement.removeEventListener('mousedown', clickCell);
  SoundsRepository.createSound(sounds.gameStart).play();
  const dog = new Dog(menu.bush.getBoundingClientRect(), mineField);
  minesweeper.append(dog.htmlElement);
  dog.goForAWalk(3, () => {
    const bushDimensions = menu.bush.getBoundingClientRect();
    Dog.bark();
    dog.goForAWalk(1, () => {
      dog.htmlElement.remove();
      mineField.enable();
      menu.bushClicked = startNewGame;
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

    SoundsRepository.createSound(sounds.laugh).play();
    menu.bush.classList.add('bush_animation_lose');
  });
};

mineField.mineCellClicked = handleGameLose;
