import './menu-style.scss';
import SecondsCounter from '../../counters/seconds-counter/seconds-counter';
import createBush from '../../bush/bush';
import { createClicksCounter, createMinesCounter, createFlagsCounter } from '../../counters/counter/counter';

export default class MinesweeperMenu {
  constructor() {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'minesweeper__menu';

    const leftCountersContainer = document.createElement('div');
    leftCountersContainer.className = 'minesweeper__counters minesweeper__counters_left';
    this.secondsCounter = new SecondsCounter('minesweeper__seconds-counter');
    this.clicksCounter = createClicksCounter('minesweeper__clicks-counter');
    leftCountersContainer.append(this.secondsCounter.htmlElement, this.clicksCounter.htmlElement);

    const onBushClick = () => {
      if (this.bushClicked) {
        this.bush.classList.remove('bush_animation_idle');
        this.bushClicked();
      }
    };

    this.bush = createBush('minesweeper__bush');
    this.bush.addEventListener('click', onBushClick);

    const rightCountersContainer = document.createElement('div');
    rightCountersContainer.className = 'minesweeper__counters minesweeper__counters_right';
    this.minesCounter = createMinesCounter('minesweeper__mines-counter', 10);
    this.flagsCounter = createFlagsCounter('minesweeper__flags-counter');
    rightCountersContainer.append(this.minesCounter.htmlElement, this.flagsCounter.htmlElement);

    this.htmlElement.append(leftCountersContainer, this.bush, rightCountersContainer);
  }

  resetCounters() {
    this.secondsCounter.stop();
    this.secondsCounter.reset();
    this.clicksCounter.reset();
    this.minesCounter.reset();
    this.flagsCounter.reset();
  }
}
