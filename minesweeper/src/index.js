import './components/common/base.scss';
import createGameContainer from './components/game-container/game-container';
import createMinesweeper from './components/game-content/minesweeper';
import MinesweeperMenu from './components/game-content/menu/menu';
import MinesweeperMineField from './components/game-content/mine-field/mine-field';
import gameStartMusic from './assets/sounds/duck-hunt-intro.mp3';
import Dog from './components/dog/dog';

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
window.addEventListener('resize', fitMineFieldToScreen);

const startNewGame = () => {
  mineField.disable();
  new Audio(gameStartMusic).play();
  const dog = new Dog(menu.bush.getBoundingClientRect(), mineField);
  minesweeper.append(dog.htmlElement);
  dog.goForAWalk(3, () => {
    const bushDimensions = menu.bush.getBoundingClientRect();
    Dog.bark();
    dog.goForAWalk(1, () => {
      dog.htmlElement.remove();
      mineField.enable();
    }, bushDimensions.left, bushDimensions.top);
  });
};

menu.bushClicked = startNewGame;
