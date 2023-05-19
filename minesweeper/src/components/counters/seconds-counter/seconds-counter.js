import './seconds-counter-style.scss';

export default class SecondsCounter {
  constructor(className) {
    this.htmlElement = document.createElement('span');
    this.htmlElement.className = `counter seconds-counter ${className}`;
    this.intervalId = null;
    this.setSeconds(0);
  }

  setSeconds(seconds) {
    this.seconds = seconds;
    this.htmlElement.innerText = seconds;
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(this.tick.bind(this), 1000);
    }
  }

  tick() {
    this.setSeconds(this.seconds + 1);
  }

  reset() {
    this.stop();
    this.setSeconds(0);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
