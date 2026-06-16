import MinerModel from './miner-model.js';
import Glossary from './glossary.js';

function countMinesInField(field) {
  if (Array.isArray(field[0])) {
    return field.flat().filter((cell) => cell === Glossary.mineFieldName).length;
  }
  return field.filter((cell) => cell === Glossary.mineFieldName).length;
}

describe('MinerModel', () => {
  describe('Constructor', () => {
    test('should initialize with provided dimensions and mine count', () => {
      const model = new MinerModel(5, 5, 5);
      expect(model.width).toBe(5);
      expect(model.height).toBe(5);
      expect(model.mines).toBe(5);
    });

    test('should initialize field as null until convertToModel', () => {
      const model = new MinerModel(3, 3, 2);
      expect(model.field).toBeNull();
    });

    test('should initialize openedField as empty array', () => {
      const model = new MinerModel(3, 3, 2);
      expect(model.openedField).toEqual([]);
    });

    test('should initialize gameFinished as false', () => {
      const model = new MinerModel(3, 3, 2);
      expect(model.gameFinished).toBe(false);
    });

    test('should reject mines number greater than field area', () => {
      expect(() => new MinerModel(3, 3, 10)).toThrow(
        'Number of mines cannot be greater than field area'
      );
    });

    test('should require at least 1 mine', () => {
      expect(() => new MinerModel(3, 3, 0)).toThrow('At least 1 mine is required');
    });

    test('should require minimal field size of 2x2', () => {
      expect(() => new MinerModel(1, 4, 1)).toThrow('Field size must be at least 2x2');
      expect(() => new MinerModel(4, 1, 1)).toThrow('Field size must be at least 2x2');
      expect(() => new MinerModel(1, 1, 1)).toThrow('Field size must be at least 2x2');
    });
  });

  describe('placeMinesInLinearField', () => {
    test('should place the requested number of mines', () => {
      const model = new MinerModel(3, 3, 3);
      const field = model.placeMinesInLinearField(9, 3);
      expect(countMinesInField(field)).toBe(3);
      expect(field).toHaveLength(9);
    });

    test('should place each mine in a separate cell', () => {
      const model = new MinerModel(2, 2, 2);
      const field = model.placeMinesInLinearField(4, 2);
      expect(countMinesInField(field)).toBe(2);
      expect(field.filter((cell) => cell === Glossary.mineFieldName)).toHaveLength(2);
    });

    test('should fill all cells when mine count equals field size', () => {
      const model = new MinerModel(2, 2, 4);
      const field = model.placeMinesInLinearField(4, 4);
      expect(countMinesInField(field)).toBe(4);
    });
  });

  describe('linearToGrid', () => {
    test('should transform flat field into 2D array', () => {
      const model = new MinerModel(3, 3, 2);
      const linear = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      expect(model.linearToGrid(linear, 3, 3)).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
    });

    test('should maintain correct total cell count after transformation', () => {
      const model = new MinerModel(4, 5, 3);
      const linear = new Array(20).fill(0);
      const grid = model.linearToGrid(linear, 4, 5);
      const totalCells = grid.reduce((sum, row) => sum + row.length, 0);
      expect(grid).toHaveLength(5);
      expect(grid[0]).toHaveLength(4);
      expect(totalCells).toBe(20);
    });
  });

  describe('computeAdjacentCounts', () => {
    test('should convert adjacent cells to counts for a centered mine', () => {
      const model = new MinerModel(3, 3, 1);
      const mineGrid = [
        [0, 0, 0],
        [0, Glossary.mineFieldName, 0],
        [0, 0, 0],
      ];
      expect(model.computeAdjacentCounts(mineGrid, 3, 3)).toEqual([
        [1, 1, 1],
        [1, Glossary.mineFieldName, 1],
        [1, 1, 1],
      ]);
    });

    test('should handle corner mines correctly', () => {
      const model = new MinerModel(3, 3, 1);
      const mineGrid = [
        [Glossary.mineFieldName, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      expect(model.computeAdjacentCounts(mineGrid, 3, 3)).toEqual([
        [Glossary.mineFieldName, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]);
    });

    test('should handle multiple adjacent mines', () => {
      const model = new MinerModel(3, 3, 2);
      const mineGrid = [
        [Glossary.mineFieldName, 0, 0],
        [Glossary.mineFieldName, 0, 0],
        [0, 0, 0],
      ];
      const result = model.computeAdjacentCounts(mineGrid, 3, 3);
      expect(result[0][0]).toBe(Glossary.mineFieldName);
      expect(result[1][0]).toBe(Glossary.mineFieldName);
      expect(result[0][1]).toBe(2);
      expect(result[1][1]).toBe(2);
    });

    test('should leave distant cells as zero', () => {
      const model = new MinerModel(4, 4, 1);
      const mineGrid = [
        [Glossary.mineFieldName, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      const result = model.computeAdjacentCounts(mineGrid, 4, 4);
      expect(result[3][3]).toBe(0);
    });

    test('should not mutate the input grid', () => {
      const model = new MinerModel(2, 2, 1);
      const mineGrid = [
        [Glossary.mineFieldName, 0],
        [0, 0],
      ];
      const snapshot = JSON.stringify(mineGrid);
      model.computeAdjacentCounts(mineGrid, 2, 2);
      expect(JSON.stringify(mineGrid)).toBe(snapshot);
    });
  });

  describe('buildMineField', () => {
    test('should return a complete field with mines and numeric hints', () => {
      const model = new MinerModel(5, 5, 5);
      const field = model.buildMineField();
      expect(field).toHaveLength(5);
      expect(field[0]).toHaveLength(5);
      expect(countMinesInField(field)).toBe(5);
      field.forEach((row) => {
        row.forEach((cell) => {
          if (cell !== Glossary.mineFieldName) {
            expect(typeof cell).toBe('number');
            expect(cell).toBeGreaterThanOrEqual(0);
          }
        });
      });
    });
  });

  describe('convertToModel', () => {
    test('should assign built field to the model instance', () => {
      const model = new MinerModel(3, 3, 2);
      const field = model.convertToModel();
      expect(model.field).toBe(field);
      expect(model.field).toHaveLength(3);
      expect(countMinesInField(model.field)).toBe(2);
    });
  });

  describe('Integration tests', () => {
    test('should create complete game model from scratch', () => {
      const model = new MinerModel(5, 5, 5);
      model.convertToModel();
      expect(model.field).toHaveLength(5);
      expect(model.field[0]).toHaveLength(5);
      expect(countMinesInField(model.field)).toBe(5);
      model.field.forEach((row) => {
        row.forEach((cell) => {
          if (cell !== Glossary.mineFieldName) {
            expect(typeof cell).toBe('number');
            expect(cell).toBeGreaterThanOrEqual(0);
          }
        });
      });
    });
  });
});
