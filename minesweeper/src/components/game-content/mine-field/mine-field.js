import './mine-field-style.scss';
import { MineCell } from '../mine-cell/mine-cell';

const MIN_MINE_FIELD_WIDTH = 500;

export default class MinesweeperMineField {
  constructor(numberOfCells) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'minesweeper__mine-field';
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

  createMineFieldFirstRow(numberOfCells) {
    const mineFieldRow = document.createElement('div');
    mineFieldRow.className = 'minesweeper__mine-field-row';
    const cellPaddingsSize = `${((MIN_MINE_FIELD_WIDTH / numberOfCells - 2) / MIN_MINE_FIELD_WIDTH) * 100}%`;
    for (let i = 0; i < numberOfCells; i += 1) {
      const cell = new MineCell();
      cell.htmlElement.style.paddingLeft = cellPaddingsSize;
      cell.htmlElement.style.paddingBottom = cellPaddingsSize;
      mineFieldRow.append(cell.htmlElement);
      this.cells.push(cell);
    }

    return mineFieldRow;
  }
}
