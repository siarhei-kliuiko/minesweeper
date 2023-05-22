import './components/common/base.scss';
import createGameContainer from './components/game-container/game-container';
import createMinesweeper from './components/game-content/minesweeper';
import MinesweeperMenu from './components/game-content/menu/menu';
import MinesweeperMineField from './components/game-content/mine-field/mine-field';
import { SoundsRepository, sounds } from './components/sounds-repository/sounds-repository';
import Dog from './components/dog/dog';
import MessageBox from './components/message-box/message-box';
import { GameSettings } from './components/game-settings/game-settings';
import GameResultsStorage from './components/game-result-storage/game-results-storage';
import GameState from './components/game-state/game-state';

GameState.load();

const gameContainer = createGameContainer();
document.body.append(gameContainer);

const minesweeper = createMinesweeper();
gameContainer.append(minesweeper);

const menu = new MinesweeperMenu();
minesweeper.append(menu.htmlElement);

let mineField = new MinesweeperMineField(GameSettings.get().difficulty.value);
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
  menu.secondsCounter.stop();
  GameResultsStorage.addGameResult(
    true,
    menu.secondsCounter.seconds,
    menu.clicksCounter.count,
    GameSettings.get().minesCount,
    GameSettings.get().difficulty.name,
  );
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

if (GameState.current && GameState.current.secondCounterState.isEnabled) {
  menu.secondsCounter.setSeconds(GameState.current.secondCounterState.seconds);
  menu.clicksCounter.set(GameState.current.clicksCount);
  menu.minesCounter.set(GameState.current.minesCount);
  menu.flagsCounter.set(GameState.current.flagsCount);
  for (let i = 0; i < mineField.cells.length; i += 1) {
    mineField.cells[i].type = GameState.current.cellsInfo[i].type;
    if (GameState.current.cellsInfo[i].isOpened) {
      mineField.cells[i].htmlElement.classList.add(mineField.cells[i].type);
      mineField.cells[i].setOpenedState();
    } else if (GameState.current.cellsInfo[i].isFlagged) {
      mineField.cells[i].toggleFlagged(true);
    }
  }

  GameState.current = null;
  menu.bush.classList.remove('bush_animation_idle');
  mineField.enable();
  mineField.htmlElement.addEventListener('mousedown', clickCell);
  menu.secondsCounter.start();
}

const fillMineField = (event) => {
  const targetCell = event.target.closest('.minesweeper__mine-cell');
  if (targetCell) {
    menu.secondsCounter.start();
    if (event.button === 0) {
      mineField.placeMines(GameSettings.get().minesCount, targetCell);
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
  menu.secondsCounter.stop();
  GameResultsStorage.addGameResult(
    false,
    menu.secondsCounter.seconds,
    menu.clicksCounter.count,
    GameSettings.get().minesCount,
    GameSettings.get().difficulty.name,
  );
  mineField.disable();
  menu.bushClicked = null;
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

const resetGame = () => {
  menu.resetCounters();
  mineField.htmlElement.remove();
  mineField = new MinesweeperMineField(GameSettings.get().difficulty.value);
  mineField.mineCellClicked = handleGameLose;
  minesweeper.append(mineField.htmlElement);
  fitMineFieldToScreen();
  mineField.adjustFontSize();
};

GameSettings.mineFieldChanged = resetGame;

window.addEventListener('beforeunload', () => GameState.save(
  mineField,
  menu.secondsCounter,
  menu.clicksCounter,
  menu.minesCounter,
  menu.flagsCounter,
));
