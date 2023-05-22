import SecondsCounter from '../../counters/seconds-counter/seconds-counter';
import createBush from '../../bush/bush';
import { createClicksCounter, createMinesCounter, createFlagsCounter } from '../../counters/counter/counter';
import createButton from '../../button/button';
import MessageBox from '../../message-box/message-box';
import './menu-style.scss';
import { GameSettings } from '../../game-settings/game-settings';

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

    const menuControls = document.createElement('div');
    menuControls.className = 'minesweeper_menu-controls';
    const menuButtons = document.createElement('div');
    menuButtons.className = 'minesweeper__buttons-container';
    const gameResultsButton = createButton('🏆', 'minesweeper__button', () => MessageBox.showGameResults());
    const settingsButton = createButton('⚙️', 'minesweeper__button', () => MessageBox.showSettings());
    menuButtons.append(gameResultsButton, settingsButton);
    this.bush = createBush('minesweeper__bush');
    this.bush.addEventListener('click', onBushClick);
    menuControls.append(menuButtons, this.bush);

    const rightCountersContainer = document.createElement('div');
    rightCountersContainer.className = 'minesweeper__counters minesweeper__counters_right';
    this.minesCounter = createMinesCounter('minesweeper__mines-counter', GameSettings.get().minesCount);
    this.flagsCounter = createFlagsCounter('minesweeper__flags-counter');
    rightCountersContainer.append(this.minesCounter.htmlElement, this.flagsCounter.htmlElement);

    this.htmlElement.append(leftCountersContainer, menuControls, rightCountersContainer);
  }

  resetCounters() {
    this.secondsCounter.stop();
    this.secondsCounter.reset();
    this.clicksCounter.reset();
    this.minesCounter.reset(GameSettings.get().minesCount);
    this.flagsCounter.reset();
  }
}
