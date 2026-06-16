import Glossary from './glossary';
import MinerModel from './miner-model';
import { validateFieldParams } from './helpers';

export default class MinerGUI {
  constructor(width, height, mines) {
    validateFieldParams(width, height, mines);
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.model = null;
  }

  drawWrap() {
    const wrapper = document.getElementById(Glossary.gameWrapperId);
    const fieldWidth = this.width * Glossary.cellWidthPx;
    const widthPx = fieldWidth >= Glossary.wrapperWidthThresholdPx
      ? fieldWidth + Glossary.wrapperPaddingPx
      : Glossary.minWrapperWidthPx;
    wrapper.style.width = `${widthPx}px`;
  }

  drawField() {
    this.model = new MinerModel(this.width, this.height, this.mines);
    const table = this.createFieldTable();
    const existingField = document.getElementById(Glossary.minerFieldId);
    const gameWrapper = document.getElementById(Glossary.gameWrapperId);
    if (!existingField) {
      gameWrapper.append(table);
    } else {
      existingField.replaceWith(table);
    }
  }

  createFieldTable() {
    const table = document.createElement('table');
    table.className = Glossary.fieldClassName;
    table.id = Glossary.minerFieldId;
    this.model.convertToModel();
    for (let i = 0; i < this.height; i += 1) {
      const row = table.insertRow(i);
      row.id = String(i);
      for (let j = 0; j < this.width; j += 1) {
        const cell = row.insertCell(j);
        cell.className = Glossary.closedCellClassName;
        cell.id = String(j);
        cell.onclick = (event) => this.handleLeftClick(event);
        cell.oncontextmenu = (event) => this.handleRightClick(event);
      }
    }
    return table;
  }

  handleLeftClick(event) {
    const cellId = event.target.getAttribute('id');
    const rowId = event.target.parentNode.getAttribute('id');
    this.openCell(rowId, cellId, event.type, false);
  }

  handleRightClick(event) {
    const cellId = event.target.getAttribute('id');
    const rowId = event.target.parentNode.getAttribute('id');
    event.preventDefault();
    this.openCell(rowId, cellId, event.type, true);
  }

  openCell(rowIndex, colIndex, eventType, allowFlagging) {
    const minesLeft = document.getElementById(Glossary.minesLeftId);
    const table = document.getElementById(Glossary.minerFieldId);
    const i = parseInt(rowIndex, 10);
    const j = parseInt(colIndex, 10);
    if (i < 0 || j < 0 || i >= table.rows.length || j >= table.rows[0].cells.length) {
      return;
    }
    const clickedCell = table.rows[i].cells[j];
    if (clickedCell.checked) {
      return;
    }
    if (
      !clickedCell.classList.contains(Glossary.flagFieldName)
      && !clickedCell.classList.contains(Glossary.questionFieldName)
      && eventType === 'click'
    ) {
      clickedCell.checked = true;
      clickedCell.classList.remove(Glossary.closedCellClassName);
      clickedCell.classList.add(Glossary.emptyCellClassName);
      const cellValue = this.model.field[i][j];
      if (Number.isInteger(cellValue)) {
        if (cellValue > 0) {
          clickedCell.textContent = cellValue;
        } else {
          this.openAdjacentCells(i, j);
          return;
        }
      } else if (cellValue === Glossary.mineFieldName) {
        clickedCell.classList.add(Glossary.bombFieldName);
        clickedCell.style.color = 'black';
        clickedCell.style.background = '#ff4c5b';
        this.gameOver(this.model);
        return;
      }
    } else if (allowFlagging) {
      this.toggleCellMark(clickedCell, minesLeft);
    }
    if (minesLeft.textContent === '0') {
      this.gameOver(false, this.mines);
    }
  }

  openAdjacentCells(row, col) {
    this.openCell(row + 1, col, 'click', false);
    this.openCell(row + 1, col + 1, 'click', false);
    this.openCell(row + 1, col - 1, 'click', false);
    this.openCell(row, col - 1, 'click', false);
    this.openCell(row, col + 1, 'click', false);
    this.openCell(row - 1, col + 1, 'click', false);
    this.openCell(row - 1, col - 1, 'click', false);
    this.openCell(row - 1, col, 'click', false);
  }

  toggleCellMark(cell, minesLeft) {
    if (cell.classList.contains(Glossary.flagFieldName)) {
      cell.classList.remove(Glossary.flagFieldName);
      cell.classList.add(Glossary.questionFieldName);
      minesLeft.textContent = String(parseInt(minesLeft.textContent, 10) + 1);
    } else if (cell.classList.contains(Glossary.questionFieldName)) {
      cell.classList.remove(Glossary.questionFieldName);
    } else {
      cell.classList.add(Glossary.flagFieldName);
      minesLeft.textContent = String(parseInt(minesLeft.textContent, 10) - 1);
    }
  }

  gameOver(model, mines) {
    const smile = document.getElementById(Glossary.updateGameId);
    const table = document.getElementById(Glossary.minerFieldId);
    const minesLeft = document.getElementById(Glossary.minesLeftId);
    let cellsLeft = table.rows.length * table.rows[0].cells.length;
    for (let i = 0; i < table.rows.length; i += 1) {
      for (let j = 0; j < table.rows[0].cells.length; j += 1) {
        const cell = table.rows[i].cells[j];
        if (model !== false) {
          cell.onclick = null;
          cell.oncontextmenu = (event) => event.preventDefault();
          if (mines !== false && model.field[i][j] === Glossary.mineFieldName) {
            smile.classList.remove(Glossary.newGameClassName);
            cell.classList.add(Glossary.bombFieldName);
            cell.classList.add(Glossary.emptyCellClassName);
            smile.classList.add(Glossary.failGameClassName);
          }
        }
        if (cell.classList.contains(Glossary.emptyCellClassName)) {
          cellsLeft -= 1;
        }
        if (
          minesLeft.textContent === '0'
          && cellsLeft - parseInt(mines, 10) === 0
        ) {
          smile.classList.remove(Glossary.newGameClassName);
          smile.classList.add(Glossary.winGameClassName);
          this.gameOver(true, false);
        }
      }
    }
  }
}
