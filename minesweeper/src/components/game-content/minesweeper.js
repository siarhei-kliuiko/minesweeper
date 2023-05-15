import './minesweeper-style.scss';
import MinesweeperMenu from './menu/menu';
import MinesweeperMineField from './mine-field/mine-field';

const minesweeper = document.createElement('div');
minesweeper.className = 'minesweeper';
const menu = new MinesweeperMenu();
minesweeper.append(menu.htmlElement);
const mineField = new MinesweeperMineField(10);
minesweeper.append(mineField.htmlElement);

export default minesweeper;
