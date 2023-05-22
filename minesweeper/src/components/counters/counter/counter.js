import './counter-style.scss';

class Counter {
  constructor(className, count = 0) {
    this.initialValue = count;
    this.htmlElement = document.createElement('span');
    this.htmlElement.className = `counter ${className}`;
    this.set(count);
  }

  set(number) {
    this.count = number;
    if (number >= 1000) {
      this.htmlElement.innerText = 999;
    } else if (number <= -1000) {
      this.htmlElement.innerText = -999;
    } else {
      this.htmlElement.innerText = number;
    }
  }

  increase(number = 1) {
    this.set(this.count + number);
  }

  decrease(number = 1) {
    if (this.count !== 0) {
      const newCount = this.count - number;
      if (newCount >= 0) {
        this.set(newCount);
      } else {
        this.set(0);
      }
    }
  }

  reset(newInitialValue) {
    if (newInitialValue) {
      this.initialValue = newInitialValue;
    }

    this.set(this.initialValue);
  }
}

export const createClicksCounter = (className) => new Counter(`clicks-counter ${className}`);
export const createMinesCounter = (className, initialCount) => new Counter(`mines-counter ${className}`, initialCount);
export const createFlagsCounter = (className) => new Counter(`flags-counter ${className}`);
