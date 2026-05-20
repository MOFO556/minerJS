import game from './game.js';

// Константы для тестов
const EASY_WIDTH = 9;
const EASY_HEIGHT = 9;
const EASY_MINES = 10;
const NORMAL_WIDTH = 16;
const NORMAL_HEIGHT = 16;
const NORMAL_MINES = 40;
const HARD_WIDTH = 30;
const HARD_HEIGHT = 16;
const HARD_MINES = 99;
const CUSTOM_WIDTH = 20;
const CUSTOM_HEIGHT = 15;
const CUSTOM_MINES = 30;

describe('game', () => {
  let gameInstance;
  let buttonsContainer;

  beforeEach(() => {
    // Настройка DOM элементов для кнопок
    buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttonsContainer';
    document.body.appendChild(buttonsContainer);

    // TODO: Refactor - Удалить после рефакторинга общего скрипта
    // Мок disableCustom функции
    global.disableCustom = jest.fn();

    // Создаём кнопки сложностей
    const easyButton = document.createElement('button');
    easyButton.id = 'easy';
    easyButton.className = 'pressed';
    buttonsContainer.appendChild(easyButton);

    const normalButton = document.createElement('button');
    normalButton.id = 'normal';
    buttonsContainer.appendChild(normalButton);

    const hardButton = document.createElement('button');
    hardButton.id = 'hard';
    buttonsContainer.appendChild(hardButton);

    const customButton = document.createElement('button');
    customButton.id = 'custom';
    buttonsContainer.appendChild(customButton);

    // Создаём инпуты для custom настройки
    const widthInput = document.createElement('input');
    widthInput.id = 'widthInput';
    widthInput.value = CUSTOM_WIDTH.toString();
    document.body.appendChild(widthInput);

    const heightInput = document.createElement('input');
    heightInput.id = 'heightInput';
    heightInput.value = CUSTOM_HEIGHT.toString();
    document.body.appendChild(heightInput);

    const minesInput = document.createElement('input');
    minesInput.id = 'minesInput';
    minesInput.value = CUSTOM_MINES.toString();
    document.body.appendChild(minesInput);

    gameInstance = new game();
  });

  afterEach(() => {
    // Очистка DOM
    if (buttonsContainer && buttonsContainer.parentNode) {
      buttonsContainer.parentNode.removeChild(buttonsContainer);
    }
    const widthInput = document.getElementById('widthInput');
    if (widthInput && widthInput.parentNode) {
      widthInput.parentNode.removeChild(widthInput);
    }
    const heightInput = document.getElementById('heightInput');
    if (heightInput && heightInput.parentNode) {
      heightInput.parentNode.removeChild(heightInput);
    }
    const minesInput = document.getElementById('minesInput');
    if (minesInput && minesInput.parentNode) {
      minesInput.parentNode.removeChild(minesInput);
    }
    
    // TODO: Refactor - Удалить после рефакторинга общего скрипта
    // Очистка мока
    if (global.disableCustom) {
      delete global.disableCustom;
    }
  });

  describe('difficultyChange', () => {
    test('should add click handlers to all buttons', () => {
      const easyButton = document.getElementById('easy');
      const addEventListenerSpy = jest.spyOn(easyButton, 'addEventListener');
      
      gameInstance.difficultyChange();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      addEventListenerSpy.mockRestore();
    });

    test('should toggle pressed class on button click', () => {
      const easyButton = document.getElementById('easy');
      const normalButton = document.getElementById('normal');
      
      gameInstance.difficultyChange();
      
      // Изначально easy нажата
      expect(easyButton.classList.contains('pressed')).toBe(true);
      expect(normalButton.classList.contains('pressed')).toBe(false);
      
      // Кликаем на normal
      normalButton.click();
      
      expect(easyButton.classList.contains('pressed')).toBe(false);
      expect(normalButton.classList.contains('pressed')).toBe(true);
      expect(global.disableCustom).toHaveBeenCalled();
    });

    test('should return difficulty parameters', () => {
      const result = gameInstance.difficultyChange();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

  });

  describe('difficultySet', () => {
    test('should return parameters for easy difficulty', () => {
      const easyButton = document.getElementById('easy');
      easyButton.classList.add('pressed');
      
      const result = gameInstance.difficultySet();
      
      expect(result[0]).toBe(EASY_WIDTH);
      expect(result[1]).toBe(EASY_HEIGHT);
      expect(result[2]).toBe(EASY_MINES);
    });

    test('should return parameters for normal difficulty', () => {
      const easyButton = document.getElementById('easy');
      easyButton.classList.remove('pressed');
      const normalButton = document.getElementById('normal');
      normalButton.classList.add('pressed');
      
      const result = gameInstance.difficultySet();
      
      expect(result[0]).toBe(NORMAL_WIDTH);
      expect(result[1]).toBe(NORMAL_HEIGHT);
      expect(result[2]).toBe(NORMAL_MINES);
    });

    test('should return parameters for hard difficulty', () => {
      const easyButton = document.getElementById('easy');
      easyButton.classList.remove('pressed');
      const hardButton = document.getElementById('hard');
      hardButton.classList.add('pressed');
      
      const result = gameInstance.difficultySet();
      
      expect(result[0]).toBe(HARD_WIDTH);
      expect(result[1]).toBe(HARD_HEIGHT);
      expect(result[2]).toBe(HARD_MINES);
    });

    test('should return parameters from inputs for custom difficulty', () => {
      const easyButton = document.getElementById('easy');
      easyButton.classList.remove('pressed');
      const customButton = document.getElementById('custom');
      customButton.classList.add('pressed');
      
      const result = gameInstance.difficultySet();
      
      expect(result[0]).toBe(CUSTOM_WIDTH.toString());
      expect(result[1]).toBe(CUSTOM_HEIGHT.toString());
      expect(result[2]).toBe(CUSTOM_MINES.toString());
    });

    test('should return undefined if no button is pressed', () => {
      const easyButton = document.getElementById('easy');
      easyButton.classList.remove('pressed');
      
      const result = gameInstance.difficultySet();
      
      expect(result[0]).toBeUndefined();
      expect(result[1]).toBeUndefined();
      expect(result[2]).toBeUndefined();
    });
  });

  describe('Integration tests', () => {
    test('should work correctly for full difficulty selection cycle', () => {
      gameInstance.difficultyChange();
      
      // Проверка начального состояния (easy)
      let result = gameInstance.difficultySet();
      expect(result[0]).toBe(EASY_WIDTH);
      
      // Переключение на normal
      const normalButton = document.getElementById('normal');
      normalButton.click();
      result = gameInstance.difficultySet();
      expect(result[0]).toBe(NORMAL_WIDTH);
      
      // Переключение на hard
      const hardButton = document.getElementById('hard');
      hardButton.click();
      result = gameInstance.difficultySet();
      expect(result[0]).toBe(HARD_WIDTH);
      
      // disableCustom должен был быть вызван 2 раза (normal + hard), так ли это?
      expect(global.disableCustom).toHaveBeenCalledTimes(2);
    });
  });
});
