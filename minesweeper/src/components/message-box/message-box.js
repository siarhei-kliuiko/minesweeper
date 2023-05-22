import Overlay from '../overlay/overlay';
import './message-box.scss';
import createButton from '../button/button';
import GameResultsStorage from '../game-result-storage/game-results-storage';
import { GameSettings, gameDifficulties } from '../game-settings/game-settings';
import './settings-dialog.scss';

export default class MessageBox {
  static show(content, cancelButtonText = 'OK', applyButtonText = null, applyCallback = null) {
    const box = document.createElement('div');
    box.className = 'message-box';
    const buttons = document.createElement('div');
    buttons.className = 'message-box__buttons';
    box.append(content, buttons);
    const overlay = new Overlay(box);
    if (applyButtonText) {
      const applyButton = createButton(applyButtonText, 'message-box__button', () => {
        if (applyCallback) {
          applyCallback();
          overlay.close();
        }
      });

      buttons.append(applyButton);
    }

    const cancelButton = createButton(cancelButtonText, 'message-box__button', () => {
      overlay.close();
    });

    buttons.append(cancelButton);
  }

  static showMessage(text) {
    const message = document.createElement('h2');
    message.className = 'message-box__text';
    message.innerText = text;
    this.show(message);
  }

  static showGameResults() {
    this.show(GameResultsStorage.getResultsBoard());
  }

  static showSettings() {
    const currentGameSettings = GameSettings.get();
    const dialog = document.createElement('div');
    dialog.className = 'settings-dialog';
    const difficultyTitle = document.createElement('h3');
    difficultyTitle.innerText = 'Difficulty:';
    dialog.append(difficultyTitle);
    const currentDifficulty = currentGameSettings.difficulty;
    let newDifficulty = currentGameSettings.difficulty;
    const handleDifficultySwitch = (event) => {
      if (event.target.checked) {
        newDifficulty = gameDifficulties[event.target.id];
      }
    };

    Object.values(gameDifficulties).forEach((difficulty) => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.id = difficulty.name;
      radio.className = 'settings-dialog__radio';
      radio.name = 'difficulty';
      radio.checked = (difficulty.value === currentDifficulty.value);
      radio.addEventListener('change', handleDifficultySwitch);
      const label = document.createElement('label');
      label.className = 'settings-dialog__label';
      label.innerText = difficulty.name;
      label.htmlFor = radio.id;
      dialog.append(radio, label);
    });

    const minesCountTitle = document.createElement('h3');
    minesCountTitle.innerText = 'Number of mines:';

    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'settings-dialog__slider-wrapper';
    const minesSlider = document.createElement('input');
    minesSlider.className = 'settings-dialog__mines-slider';
    minesSlider.type = 'range';
    minesSlider.min = 10;
    minesSlider.max = 99;
    minesSlider.value = currentGameSettings.minesCount;
    const minesCount = document.createElement('span');
    minesCount.innerText = currentGameSettings.minesCount;
    minesCount.className = 'settings-dialog__mines-count-output';
    minesSlider.addEventListener('input', () => { minesCount.innerText = minesSlider.value; });
    sliderWrapper.append(minesSlider, minesCount);
    dialog.append(minesCountTitle, sliderWrapper);

    const soundsTitle = document.createElement('h3');
    soundsTitle.innerText = 'Sounds:';
    const soundsSwitcher = document.createElement('input');
    soundsSwitcher.className = 'settings-dialog__sounds-checkbox';
    soundsSwitcher.type = 'checkbox';
    soundsSwitcher.id = 'sounds';
    soundsSwitcher.checked = currentGameSettings.sounds;
    const soundsLabel = document.createElement('label');
    soundsLabel.className = 'settings-dialog__sounds-switch';
    soundsLabel.htmlFor = soundsSwitcher.id;
    dialog.append(soundsTitle, soundsSwitcher, soundsLabel);

    this.show(dialog, 'Cancel', 'Apply', () => {
      GameSettings.set(newDifficulty, Number(minesSlider.value), soundsSwitcher.checked);
    });
  }
}
