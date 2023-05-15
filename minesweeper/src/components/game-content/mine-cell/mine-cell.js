import './mine-cell.scss';

export const cellTypes = {
  flag: 'minesweeper__mine-cell_type_flag',
  mine: 'minesweeper__mine-cell_type_mine',
  empty: 'minesweeper__mine-cell_type_empty',
  one: 'minesweeper__mine-cell_type_one',
  two: 'minesweeper__mine-cell_type_two',
  three: 'minesweeper__mine-cell_type_three',
  four: 'minesweeper__mine-cell_type_four',
  five: 'minesweeper__mine-cell_type_five',
  six: 'minesweeper__mine-cell_type_six',
  seven: 'minesweeper__mine-cell_type_seven',
  eight: 'minesweeper__mine-cell_type_eight',
};

export class MineCell {
  constructor(htmlElement) {
    const className = 'minesweeper__mine-cell';
    if (htmlElement) {
      this.htmlElement = htmlElement;
    } else {
      this.htmlElement = document.createElement('div');
      this.htmlElement.className = className;
    }

    this.isOpened = false;
  }

  setType(type) {
    this.type = type;
  }

  open() {
    this.isOpened = true;
    this.htmlElement.classList.add(this.type);
  }
}
