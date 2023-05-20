import { SoundsRepository, sounds } from '../../sounds-repository/sounds-repository';
import './mine-cell.scss';

export const cellTypes = {
  empty: 'minesweeper__mine-cell_type_empty',
  one: 'minesweeper__mine-cell_type_one',
  two: 'minesweeper__mine-cell_type_two',
  three: 'minesweeper__mine-cell_type_three',
  four: 'minesweeper__mine-cell_type_four',
  five: 'minesweeper__mine-cell_type_five',
  six: 'minesweeper__mine-cell_type_six',
  seven: 'minesweeper__mine-cell_type_seven',
  eight: 'minesweeper__mine-cell_type_eight',
  closed: 'minesweeper__mine-cell_type_closed',
  mine: 'minesweeper__mine-cell_type_mine',
};

export class MineCell {
  constructor(htmlElement) {
    this.type = 0;
    if (htmlElement) {
      this.htmlElement = htmlElement;
    } else {
      this.htmlElement = document.createElement('div');
      this.htmlElement.className = `minesweeper__mine-cell ${cellTypes.closed}`;
    }

    this.isOpened = false;
    this.isFlagged = false;
  }

  open(handleCellOpening = null) {
    const openAnimationEnded = (event) => {
      if (event.animationName === 'cell-opening') {
        this.htmlElement.classList.remove('minesweeper__mine-cell_animation_open');
        this.htmlElement.removeEventListener('animationend', openAnimationEnded);
        this.htmlElement.classList.add(this.type);
        if (handleCellOpening) {
          handleCellOpening();
        }
      }
    };

    this.htmlElement.addEventListener('animationend', openAnimationEnded);
    this.isOpened = true;
    this.isFlagged = false;
    this.htmlElement.classList.remove('minesweeper__mine-cell_state_flagged');
    this.htmlElement.classList.remove(cellTypes.closed);
    this.htmlElement.classList.add('minesweeper__mine-cell_animation_open');
  }

  revealMine(callback) {
    const mineSound = SoundsRepository.createSound(sounds.mine);

    const animationStartHandler = (event) => {
      if (event.animationName === 'reveal-mine') {
        mineSound.addEventListener('ended', () => {
          this.htmlElement.addEventListener('animationstart', animationStartHandler, { once: true });
          this.htmlElement.classList.remove('minesweeper__mine-cell_animation_mine');
          this.htmlElement.classList.add('minesweeper__mine-cell_animation_explode');
          SoundsRepository.createSound(sounds.explosion).play();
        }, { once: true });

        mineSound.play();
      } else if (event.animationName === 'cell-explode') {
        if (callback) {
          callback();
        }
      }
    };

    this.htmlElement.addEventListener('animationstart', animationStartHandler, { once: true });
    this.htmlElement.classList.add('minesweeper__mine-cell_animation_mine');
  }

  reset() {
    this.type = 0;
    this.isOpened = false;
    this.isFlagged = false;
    this.htmlElement.className = `minesweeper__mine-cell ${cellTypes.closed}`;
  }

  toggleFlagged() {
    this.isFlagged = !this.isFlagged;
    this.htmlElement.classList.toggle('minesweeper__mine-cell_state_flagged');
    SoundsRepository.createSound(sounds.flag).play();
  }
}
