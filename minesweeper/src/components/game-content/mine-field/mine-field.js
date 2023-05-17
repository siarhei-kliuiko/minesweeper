import './mine-field-style.scss';
import { MineCell, cellTypes } from '../mine-cell/mine-cell';

const MIN_WINDOW_WIDTH = 500;
const MINE_AREA_SIZE = 3;

export default class MinesweeperMineField {
  constructor(numberOfCells) {
    this.cellsPerRow = numberOfCells;
    this.htmlElement = document.createElement('div');
    this.htmlElement.className = 'minesweeper__mine-field minesweeper__mine-field_disabled';
    this.cells = [];
    const firstRow = this.createMineFieldFirstRow(this.cellsPerRow);
    this.htmlElement.append(firstRow);
    for (let i = 1; i < this.cellsPerRow; i += 1) {
      const mineFieldRow = firstRow.cloneNode(true);
      this.htmlElement.append(mineFieldRow);
      for (let j = 0; j < mineFieldRow.children.length; j += 1) {
        this.cells.push(new MineCell(mineFieldRow.children[j]));
      }
    }

    window.addEventListener('resize', this.adjustFontSize.bind(this));
  }

  adjustFontSize() {
    let resultFontSize = parseInt(getComputedStyle(this.cells[0].htmlElement).fontSize, 10);
    while (this.cells[0].htmlElement.scrollHeight
      <= this.cells[0].htmlElement.clientHeight) {
      resultFontSize += 1;
      this.cells[0].htmlElement.style.fontSize = `${resultFontSize}px`;
    }

    while (this.cells[0].htmlElement.scrollHeight
      > this.cells[0].htmlElement.clientHeight) {
      resultFontSize -= 1;
      this.cells[0].htmlElement.style.fontSize = `${resultFontSize}px`;
    }

    for (let i = 1; i < this.cells.length; i += 1) {
      this.cells[i].htmlElement.style.fontSize = `${resultFontSize}px`;
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

  getCellByIndexes(row, column) {
    return this.cells[row * this.cellsPerRow + column];
  }

  getIndexesOfCell(index) {
    const row = Math.floor(index / this.cellsPerRow);
    const col = index - this.cellsPerRow * row;
    return { row, col };
  }

  placeMines(minesCount, mustBeNotMineCell) {
    let minesPlaced = 0;
    const increaseCellNumber = (row, col) => {
      if (row >= 0 && row < this.cellsPerRow && col >= 0 && col < this.cellsPerRow) {
        const targetCell = this.getCellByIndexes(row, col);
        if (targetCell.type !== cellTypes.mine) {
          targetCell.type += 1;
        }
      }
    };

    const placeNumbersAroundMine = (index) => {
      const { row: mineRow, col: mineColumn } = this.getIndexesOfCell(index);
      for (let row = 0; row < MINE_AREA_SIZE; row += 1) {
        for (let col = 0; col < MINE_AREA_SIZE; col += 1) {
          increaseCellNumber(mineRow - 1 + row, mineColumn - 1 + col);
        }
      }
    };

    for (let i = 0; i < this.cells.length; i += 1) {
      if (this.cells[i].htmlElement !== mustBeNotMineCell
        && (minesCount - minesPlaced) / (this.cells.length - i) >= Math.random()) {
        this.cells[i].type = cellTypes.mine;
        placeNumbersAroundMine(i);
        minesPlaced += 1;
      }
    }

    if (minesCount - minesPlaced === 1) {
      const nonMinedCells = this.cells
        .filter((cell) => cell.type !== cellTypes.mine && cell.htmlElement !== mustBeNotMineCell);
      const indexToPlaceMine = Math.floor(Math.random() * nonMinedCells.length);
      this.cells[indexToPlaceMine].type = cellTypes.mine;
      placeNumbersAroundMine(indexToPlaceMine);
    }

    const cellTypesValues = Object.values(cellTypes);
    for (let i = 0; i < this.cells.length; i += 1) {
      if (this.cells[i].type !== cellTypes.mine) {
        this.cells[i].type = cellTypesValues[this.cells[i].type];
      }
    }
  }
}
