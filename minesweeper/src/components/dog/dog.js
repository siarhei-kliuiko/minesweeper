import './dog.scss';
import dogBarkSound from '../../assets/sounds/bark.mp3';

const DOG_DIRECTION_RIGHT = true;
const DOG_DIRECTION_LEFT = false;

export default class Dog {
  constructor({ left, top }, walkField) {
    this.walkField = walkField;
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'dog';
    this.direction = DOG_DIRECTION_RIGHT;
    this.setPosition(left, top);
  }

  static bark() {
    new Audio(dogBarkSound).play();
  }

  walkTo(x, y, goForAWalk = null, walksLeft = 0, walkEnd = null) {
    setTimeout(() => {
      this.htmlElement.classList.add('dog_animation_walk');
      this.setPosition(x, y);
      const onWalkEnd = (event) => {
        if (event.propertyName === 'top' || event.propertyName === 'left') {
          this.htmlElement.removeEventListener('transitionend', onWalkEnd);
          this.htmlElement.classList.remove('dog_animation_walk');
          if (goForAWalk) {
            goForAWalk(walksLeft - 1, walkEnd);
          }
        }
      };

      this.htmlElement.addEventListener('transitionend', onWalkEnd);
    }, 900);
  }

  goForAWalk(walksLeft, walkEnd, x = null, y = null) {
    const getFieldRandomCoordinates = () => {
      const {
        top,
        bottom,
        left,
        right,
      } = this.walkField.htmlElement.getBoundingClientRect();

      const { width, height } = this.htmlElement.getBoundingClientRect();

      return {
        x: Math.floor(Math.random() * ((right - width) - left + 1) + left),
        y: Math.floor(Math.random() * ((bottom - height) - top + 1) + top),
      };
    };

    if (walksLeft > 0) {
      const walkCoordinates = getFieldRandomCoordinates();
      this.walkTo(
        x || walkCoordinates.x,
        y || walkCoordinates.y,
        this.goForAWalk.bind(this),
        walksLeft,
        walkEnd,
      );
    } else if (walkEnd) {
      walkEnd();
    }
  }

  setPosition(x, y) {
    const { left, right } = this.htmlElement.getBoundingClientRect();
    if (this.direction === DOG_DIRECTION_RIGHT && x < right) {
      this.setDirection(DOG_DIRECTION_LEFT);
    } else if (this.direction === DOG_DIRECTION_LEFT && x > left) {
      this.setDirection(DOG_DIRECTION_RIGHT);
    }

    this.htmlElement.style.left = `${x}px`;
    this.htmlElement.style.top = `${y}px`;
  }

  setDirection(direction) {
    if (direction === DOG_DIRECTION_RIGHT) {
      this.direction = DOG_DIRECTION_RIGHT;
      this.htmlElement.classList.remove('dog_direction_left');
    } else if (direction === DOG_DIRECTION_LEFT) {
      this.direction = DOG_DIRECTION_LEFT;
      this.htmlElement.classList.add('dog_direction_left');
    }
  }
}
