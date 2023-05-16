import './mine-field-style.scss';
import { MineCell } from '../mine-cell/mine-cell';

const MIN_WINDOW_WIDTH = 500;

export default class MinesweeperMineField {
  constructor(numberOfCells) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'minesweeper__mine-field minesweeper__mine-field_disabled';
    this.cells = [];
    const firstRow = this.createMineFieldFirstRow(numberOfCells);
    this.htmlElement.append(firstRow);
    for (let i = 1; i < numberOfCells; i += 1) {
      const mineFieldRow = firstRow.cloneNode(true);
      this.htmlElement.append(mineFieldRow);
      for (let j = 0; j < mineFieldRow.children.length; j += 1) {
        this.cells.push(new MineCell(mineFieldRow.children[j]));
      }
    }
  }

  setSize(height, padding) {
    const minHeightSize = MIN_WINDOW_WIDTH - padding * 2;
    let resultSize = height;
    if (height < minHeightSize) {
      resultSize = minHeightSize;
    }

    const minWidthSize = window.innerWidth - padding * 2;
    if (height >= minWidthSize) {
      resultSize = minWidthSize;
    }

    this.htmlElement.style.height = `${resultSize}px`;
    this.htmlElement.style.width = `${resultSize}px`;
  }

  createMineFieldFirstRow(numberOfCells) {
    const mineFieldRow = document.createElement('div');
    mineFieldRow.className = 'minesweeper__mine-field-row';
    const cellPaddingsSize = `${((MIN_WINDOW_WIDTH / numberOfCells - 2) / MIN_WINDOW_WIDTH) * 100}%`;
    for (let i = 0; i < numberOfCells; i += 1) {
      const cell = new MineCell();
      cell.htmlElement.style.paddingLeft = cellPaddingsSize;
      cell.htmlElement.style.paddingBottom = cellPaddingsSize;
      mineFieldRow.append(cell.htmlElement);
      this.cells.push(cell);
    }

    return mineFieldRow;
  }

  enable() {
    this.htmlElement.classList.remove('minesweeper__mine-field_disabled');
  }

  disable() {
    this.htmlElement.classList.add('minesweeper__mine-field_disabled');
  }
}
