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
  flag: 'minesweeper__mine-cell_type_flag',
  mine: 'minesweeper__mine-cell_type_mine',
};

export class MineCell {
  constructor(htmlElement) {
    const className = `minesweeper__mine-cell ${cellTypes.closed}`;
    this.type = 0;
    if (htmlElement) {
      this.htmlElement = htmlElement;
    } else {
      this.htmlElement = document.createElement('div');
      this.htmlElement.className = className;
    }

    this.isOpened = false;
  }

  open() {
    const openAnimationEnded = (event) => {
      if (event.animationName === 'cell-opening') {
        this.htmlElement.classList.remove('minesweeper__mine-cell_animation_open');
        this.htmlElement.removeEventListener('animationend', openAnimationEnded);
        this.htmlElement.classList.add(this.type);
      }
    };

    this.htmlElement.addEventListener('animationend', openAnimationEnded);
    this.isOpened = true;
    this.htmlElement.classList.remove(cellTypes.closed);
    this.htmlElement.classList.add('minesweeper__mine-cell_animation_open');
  }
}
