import './menu-style.scss';
import SecondsCounter from '../../seconds-counter/seconds-counter';
import createBush from '../../bush/bush';
import ClicksCounter from '../../clicks-counter/clicks-counter';

export default class MinesweeperMenu {
  constructor() {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'minesweeper__menu';
    this.secondsCounter = new SecondsCounter('minesweeper__seconds-counter');
    this.htmlElement.append(this.secondsCounter.htmlElement);
    this.bush = createBush('minesweeper__bush');
    this.htmlElement.append(this.bush);
    this.clicksCounter = new ClicksCounter('minesweeper__clicks-counter');
    this.htmlElement.append(this.clicksCounter.htmlElement);
  }
}
