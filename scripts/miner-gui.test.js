import MinerGUI from './miner-gui.js';
import Glossary from './glossary.js';
import { loadIndexHtmlBody } from './test-fixtures.js';

const TEST_WIDTH = 5;
const TEST_HEIGHT = 5;
const TEST_MINES = 5;

function createZeroField(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

describe('MinerGUI', () => {
  let gui;

  beforeEach(() => {
    loadIndexHtmlBody();
    document.getElementById(Glossary.minesLeftId).textContent = TEST_MINES.toString();
    gui = new MinerGUI(TEST_WIDTH, TEST_HEIGHT, TEST_MINES);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Constructor', () => {
    test('should initialize with provided dimensions and mine count', () => {
      expect(gui.width).toBe(TEST_WIDTH);
      expect(gui.height).toBe(TEST_HEIGHT);
      expect(gui.mines).toBe(TEST_MINES);
    });

    test('should reject mines number greater than field area', () => {
      expect(() => new MinerGUI(3, 3, 10)).toThrow(
        'Number of mines cannot be greater than field area'
      );
    });

    test('should require at least 1 mine', () => {
      expect(() => new MinerGUI(3, 3, 0)).toThrow('At least 1 mine is required');
    });

    test('should require minimal field size of 2x2', () => {
      expect(() => new MinerGUI(1, 4, 1)).toThrow('Field size must be at least 2x2');
      expect(() => new MinerGUI(4, 1, 1)).toThrow('Field size must be at least 2x2');
      expect(() => new MinerGUI(1, 1, 1)).toThrow('Field size must be at least 2x2');
    });
  });

  describe('drawWrap', () => {
    test('should set wrapper width based on field width', () => {
      const gameWrapper = document.getElementById(Glossary.gameWrapperId);
      const wideGui = new MinerGUI(12, 12, 20);
      wideGui.drawWrap();
      const expectedWidth = 12 * Glossary.cellWidthPx + Glossary.wrapperPaddingPx;
      expect(gameWrapper.style.width).toBe(`${expectedWidth}px`);
    });

    test('should use minimum width of 250px for small fields', () => {
      const gameWrapper = document.getElementById(Glossary.gameWrapperId);
      const smallGui = new MinerGUI(5, 5, 3);
      smallGui.drawWrap();
      expect(gameWrapper.style.width).toBe(`${Glossary.minWrapperWidthPx}px`);
    });

    test('should calculate width correctly for larger fields', () => {
      const gameWrapper = document.getElementById(Glossary.gameWrapperId);
      const largeGui = new MinerGUI(15, 15, 30);
      largeGui.drawWrap();
      const expectedWidth = 15 * Glossary.cellWidthPx + Glossary.wrapperPaddingPx;
      expect(gameWrapper.style.width).toBe(`${expectedWidth}px`);
    });
  });

  describe('drawField', () => {
    test('should create and append table to gameWrapper', () => {
      const gameWrapper = document.getElementById(Glossary.gameWrapperId);
      gui.drawField();
      const table = document.getElementById(Glossary.minerFieldId);
      expect(table).toBeTruthy();
      expect(table.tagName).toBe('TABLE');
      expect(gameWrapper.contains(table)).toBe(true);
    });

    test('should replace existing table if it exists', () => {
      gui.drawField();
      const firstTable = document.getElementById(Glossary.minerFieldId);
      gui.drawField();
      const secondTable = document.getElementById(Glossary.minerFieldId);
      expect(firstTable).not.toBe(secondTable);
    });

    test('should create correct number of rows and cells', () => {
      gui.drawField();
      const table = document.getElementById(Glossary.minerFieldId);
      expect(table.rows.length).toBe(TEST_HEIGHT);
      expect(table.rows[0].cells.length).toBe(TEST_WIDTH);
    });

    test('should set correct class and id on table', () => {
      gui.drawField();
      const table = document.getElementById(Glossary.minerFieldId);
      expect(table.className).toBe(Glossary.fieldClassName);
      expect(table.id).toBe(Glossary.minerFieldId);
    });

    test('should initialize all cells as closed', () => {
      gui.drawField();
      const table = document.getElementById(Glossary.minerFieldId);
      for (let i = 0; i < table.rows.length; i += 1) {
        for (let j = 0; j < table.rows[0].cells.length; j += 1) {
          expect(table.rows[i].cells[j].classList.contains(Glossary.closedCellClassName)).toBe(true);
        }
      }
    });

    test('should attach click handlers to cells', () => {
      gui.drawField();
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      expect(cell.onclick).toBeTruthy();
      expect(cell.oncontextmenu).toBeTruthy();
    });
  });

  describe('openCell', () => {
    beforeEach(() => {
      gui.drawField();
    });

    test('should not open cells outside the field', () => {
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      gui.openCell(-1, 0, 'click', false);
      expect(cell.classList.contains(Glossary.closedCellClassName)).toBe(true);
    });

    test('should not reopen already checked cells', () => {
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.model.field[0][0] = 1;
      gui.openCell(0, 0, 'click', false);
      cell.textContent = 'stale';
      gui.openCell(0, 0, 'click', false);
      expect(cell.textContent).toBe('stale');
    });

    test('should open a numbered cell on left click', () => {
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.model.field[0][0] = 2;
      gui.openCell(0, 0, 'click', false);
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      expect(cell.textContent).toBe('2');
      expect(cell.classList.contains(Glossary.emptyCellClassName)).toBe(true);
    });

    test('should reveal a bomb and trigger loss on mine click', () => {
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.model.field[0][0] = Glossary.mineFieldName;
      gui.openCell(0, 0, 'click', false);
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      const smile = document.getElementById(Glossary.updateGameId);
      expect(cell.classList.contains(Glossary.bombFieldName)).toBe(true);
      expect(smile.classList.contains(Glossary.failGameClassName)).toBe(true);
    });

    test('should cycle flag, question, and empty on right click', () => {
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      gui.openCell(0, 0, 'contextmenu', true);
      expect(cell.classList.contains(Glossary.flagFieldName)).toBe(true);
      gui.openCell(0, 0, 'contextmenu', true);
      expect(cell.classList.contains(Glossary.questionFieldName)).toBe(true);
      gui.openCell(0, 0, 'contextmenu', true);
      expect(cell.classList.contains(Glossary.flagFieldName)).toBe(false);
      expect(cell.classList.contains(Glossary.questionFieldName)).toBe(false);
    });

    test('should decrease minesLeft when placing a flag', () => {
      const minesLeft = document.getElementById(Glossary.minesLeftId);
      gui.openCell(0, 0, 'contextmenu', true);
      expect(minesLeft.textContent).toBe(String(TEST_MINES - 1));
    });

    test('should flood open adjacent cells when zero is clicked', () => {
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.openCell(0, 0, 'click', false);
      const table = document.getElementById(Glossary.minerFieldId);
      for (let i = 0; i < table.rows.length; i += 1) {
        for (let j = 0; j < table.rows[0].cells.length; j += 1) {
          expect(table.rows[i].cells[j].classList.contains(Glossary.emptyCellClassName)).toBe(true);
        }
      }
    });
  });

  describe('gameOver', () => {
    beforeEach(() => {
      gui.drawField();
    });

    test('should remove click handlers when game ends', () => {
      gui.gameOver(gui.model);
      const cell = document.getElementById(Glossary.minerFieldId).rows[0].cells[0];
      expect(cell.onclick).toBeNull();
      expect(cell.oncontextmenu).toBeTruthy();
    });

    test('should reveal all mines on loss', () => {
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.model.field[0][0] = Glossary.mineFieldName;
      gui.model.field[2][2] = Glossary.mineFieldName;
      gui.gameOver(gui.model, gui.mines);
      const table = document.getElementById(Glossary.minerFieldId);
      expect(table.rows[0].cells[0].classList.contains(Glossary.bombFieldName)).toBe(true);
      expect(table.rows[2].cells[2].classList.contains(Glossary.bombFieldName)).toBe(true);
    });

    test('should switch smile to fail state on loss', () => {
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.model.field[0][0] = Glossary.mineFieldName;
      gui.gameOver(gui.model, gui.mines);
      const smile = document.getElementById(Glossary.updateGameId);
      expect(smile.classList.contains(Glossary.failGameClassName)).toBe(true);
      expect(smile.classList.contains(Glossary.newGameClassName)).toBe(false);
    });

    test('should switch smile to win state when board is solved', () => {
      const smallGui = new MinerGUI(2, 2, 1);
      smallGui.drawField();
      smallGui.model.field = [
        [Glossary.mineFieldName, 1],
        [1, 0],
      ];
      const table = document.getElementById(Glossary.minerFieldId);
      table.rows[0].cells[0].classList.add(Glossary.flagFieldName);
      table.rows[0].cells[1].classList.add(Glossary.emptyCellClassName);
      table.rows[1].cells[0].classList.add(Glossary.emptyCellClassName);
      table.rows[1].cells[1].classList.add(Glossary.emptyCellClassName);
      document.getElementById(Glossary.minesLeftId).textContent = '0';
      smallGui.gameOver(false, 1);
      const smile = document.getElementById(Glossary.updateGameId);
      expect(smile.classList.contains(Glossary.winGameClassName)).toBe(true);
    });
  });

  describe('Integration tests', () => {
    test('should handle left click through cell handler', () => {
      gui.drawField();
      gui.model.field = createZeroField(TEST_WIDTH);
      gui.model.field[1][1] = 1;
      const cell = document.getElementById(Glossary.minerFieldId).rows[1].cells[1];
      cell.onclick({ target: cell, type: 'click' });
      expect(cell.textContent).toBe('1');
    });

    test('should handle right click through cell handler', () => {
      gui.drawField();
      const cell = document.getElementById(Glossary.minerFieldId).rows[1].cells[1];
      const event = { target: cell, type: 'contextmenu', preventDefault: jest.fn() };
      cell.oncontextmenu(event);
      expect(cell.classList.contains(Glossary.flagFieldName)).toBe(true);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
