import MinesweeperDifficultyManager from './game.js';
import Glossary, { DIFFICULTY_SETTINGS } from './glossary.js';
import { disableCustom, settingsToTuple } from './helpers.js';
import { loadIndexHtmlBody } from './test-fixtures.js';

jest.mock('./helpers.js', () => ({
  ...jest.requireActual('./helpers.js'),
  disableCustom: jest.fn(),
}));

const CUSTOM_WIDTH = 20;
const CUSTOM_HEIGHT = 15;
const CUSTOM_MINES = 30;

function settingsTuple(difficulty) {
  return settingsToTuple(DIFFICULTY_SETTINGS[difficulty]);
}

describe('MinesweeperDifficultyManager', () => {
  let gameInstance;

  beforeEach(() => {
    loadIndexHtmlBody();
    gameInstance = new MinesweeperDifficultyManager();
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('difficultyChange', () => {
    test('should return current difficulty parameters after binding handlers', () => {
      const result = gameInstance.difficultyChange();
      expect(result).toEqual(settingsTuple(Glossary.difficultySettingsNames.easy));
    });

    test('should toggle pressed class on button click', () => {
      const easyButton = document.getElementById(Glossary.difficultySettingsNames.easy);
      const normalButton = document.getElementById(Glossary.difficultySettingsNames.normal);
      gameInstance.difficultyChange();
      expect(easyButton.classList.contains(Glossary.pressedButtonClassName)).toBe(true);
      expect(normalButton.classList.contains(Glossary.pressedButtonClassName)).toBe(false);
      normalButton.click();
      expect(easyButton.classList.contains(Glossary.pressedButtonClassName)).toBe(false);
      expect(normalButton.classList.contains(Glossary.pressedButtonClassName)).toBe(true);
      expect(disableCustom).toHaveBeenCalledTimes(1);
    });

    test('should update difficulty settings when a different button is clicked', () => {
      gameInstance.difficultyChange();
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.easy));
      document.getElementById(Glossary.difficultySettingsNames.normal).click();
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.normal));
    });

    test('should not register duplicate click handlers when difficultyChange is called twice', () => {
      gameInstance.difficultyChange();
      gameInstance.difficultyChange();
      document.getElementById(Glossary.difficultySettingsNames.normal).click();
      expect(disableCustom).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDifficultySettings', () => {
    test('should return parameters for easy difficulty', () => {
      document.getElementById(Glossary.difficultySettingsNames.easy).classList.add(Glossary.pressedButtonClassName);
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.easy));
    });

    test('should return parameters for normal difficulty', () => {
      document.getElementById(Glossary.difficultySettingsNames.easy).classList.remove(Glossary.pressedButtonClassName);
      document.getElementById(Glossary.difficultySettingsNames.normal).classList.add(Glossary.pressedButtonClassName);
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.normal));
    });

    test('should return parameters for hard difficulty', () => {
      document.getElementById(Glossary.difficultySettingsNames.easy).classList.remove(Glossary.pressedButtonClassName);
      document.getElementById(Glossary.difficultySettingsNames.hard).classList.add(Glossary.pressedButtonClassName);
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.hard));
    });

    test('should return parsed numbers from inputs for custom difficulty', () => {
      document.getElementById(Glossary.difficultySettingsNames.easy).classList.remove(Glossary.pressedButtonClassName);
      document.getElementById(Glossary.difficultySettingsNames.custom).classList.add(Glossary.pressedButtonClassName);
      document.getElementById(Glossary.widthInputId).value = CUSTOM_WIDTH.toString();
      document.getElementById(Glossary.heightInputId).value = CUSTOM_HEIGHT.toString();
      document.getElementById(Glossary.minesInputId).value = CUSTOM_MINES.toString();
      expect(gameInstance.getDifficultySettings()).toEqual([
        CUSTOM_WIDTH,
        CUSTOM_HEIGHT,
        CUSTOM_MINES,
      ]);
    });

    test('should return undefined if no button is pressed', () => {
      document.getElementById(Glossary.difficultySettingsNames.easy).classList.remove(Glossary.pressedButtonClassName);
      expect(gameInstance.getDifficultySettings()).toEqual([
        undefined,
        undefined,
        undefined,
      ]);
    });
  });

  describe('Integration tests', () => {
    test('should work correctly for full difficulty selection cycle', () => {
      gameInstance.difficultyChange();
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.easy));
      document.getElementById(Glossary.difficultySettingsNames.normal).click();
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.normal));
      document.getElementById(Glossary.difficultySettingsNames.hard).click();
      expect(gameInstance.getDifficultySettings()).toEqual(settingsTuple(Glossary.difficultySettingsNames.hard));
      expect(disableCustom).toHaveBeenCalledTimes(2);
    });
  });
});
