import Glossary from './glossary';
import { validateFieldParams } from './helpers';

export default class MinerModel {
  constructor(width, height, mines) {
    validateFieldParams(width, height, mines);
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.field = null;
    this.openedField = [];
    this.gameFinished = false;
  }

  placeMinesInLinearField(fieldSize, minesCount) {
    const available = Array.from({ length: fieldSize }, (_, index) => index);
    const field = new Array(fieldSize).fill(0);
    for (let placed = 0; placed < minesCount; placed += 1) {
      const pick = Math.floor(Math.random() * available.length);
      const index = available.splice(pick, 1)[0];
      field[index] = Glossary.mineFieldName;
    }
    return field;
  }

  linearToGrid(linearField, width, height) {
    const grid = [];
    for (let row = 0; row < height; row += 1) {
      grid.push(linearField.slice(row * width, row * width + width));
    }
    return grid;
  }

  computeAdjacentCounts(mineGrid, width, height) {
    const result = mineGrid.map((row) => [...row]);
    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += 1) {
        if (result[i][j] === Glossary.mineFieldName) {
          continue;
        }
        let count = 0;
        for (let di = -1; di <= 1; di += 1) {
          for (let dj = -1; dj <= 1; dj += 1) {
            if (di === 0 && dj === 0) {
              continue;
            }
            const ni = i + di;
            const nj = j + dj;
            if (
              ni >= 0 && ni < height
              && nj >= 0 && nj < width
              && mineGrid[ni][nj] === Glossary.mineFieldName
            ) {
              count += 1;
            }
          }
        }
        result[i][j] = count;
      }
    }
    return result;
  }

  buildMineField() {
    const linearField = this.placeMinesInLinearField(this.width * this.height, this.mines);
    const mineGrid = this.linearToGrid(linearField, this.width, this.height);
    return this.computeAdjacentCounts(mineGrid, this.width, this.height);
  }

  convertToModel() {
    this.field = this.buildMineField();
    return this.field;
  }
}
