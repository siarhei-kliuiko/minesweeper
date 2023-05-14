import './clicks-counter-style.scss';

export default class ClicksCounter {
  constructor(className) {
    this.htmlElement = document.createElement('span');
    this.htmlElement.className = `clicks-counter ${className}`;
    this.setClicks(0);
  }

  setClicks(number) {
    this.numberOfClicks = number;
    this.htmlElement.innerText = number;
  }

  addClick() {
    this.setClicks(this.numberOfClicks + 1);
  }

  reset() {
    this.setClicks(0);
  }
}
