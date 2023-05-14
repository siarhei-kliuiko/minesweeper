import './minesweeper-style.scss';
import MinesweeperMenu from './menu/menu';

const minesweeper = document.createElement('div');
minesweeper.className = 'minesweeper';
const menu = new MinesweeperMenu();
minesweeper.append(menu.htmlElement);

export default minesweeper;
