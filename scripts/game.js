import { disableCustom, settingsToTuple } from './helpers';
import Glossary, { DIFFICULTY_SETTINGS } from './glossary';

const DIFFICULTY_BUTTON_IDS = Object.values(Glossary.difficultySettingsNames);
const boundDifficultyButtons = new WeakSet();

const DIFFICULTY_RESOLVERS = {
  ...Object.fromEntries(
    Object.entries(DIFFICULTY_SETTINGS).map(([id, settings]) => [
      id,
      () => settingsToTuple(settings),
    ])
  ),
  [Glossary.difficultySettingsNames.custom]: () => settingsToTuple({
    width: parseInt(document.getElementById(Glossary.widthInputId).value, 10),
    height: parseInt(document.getElementById(Glossary.heightInputId).value, 10),
    mines: parseInt(document.getElementById(Glossary.minesInputId).value, 10),
  }),
};

function getDifficultyButtons() {
  return DIFFICULTY_BUTTON_IDS
    .map((id) => document.getElementById(id))
    .filter(Boolean);
}

function handleDifficultyButtonClick(clickedButton) {
  if (clickedButton.classList.contains(Glossary.pressedButtonClassName)) {
    return;
  }
  const buttons = getDifficultyButtons();
  clickedButton.classList.add(Glossary.pressedButtonClassName);
  for (const button of buttons) {
    if (button.id !== clickedButton.id) {
      button.classList.remove(Glossary.pressedButtonClassName);
    }
  }
  if (typeof disableCustom === 'function') {
    disableCustom();
  }
}

export default class MinesweeperDifficultyManager {
  bindDifficultyButtons() {
    for (const button of getDifficultyButtons()) {
      if (boundDifficultyButtons.has(button)) {
        continue;
      }
      boundDifficultyButtons.add(button);
      button.addEventListener('click', () => handleDifficultyButtonClick(button));
    }
  }

  difficultyChange() {
    this.bindDifficultyButtons();
    return this.getDifficultySettings();
  }

  getSelectedDifficultyType() {
    for (const button of getDifficultyButtons()) {
      if (button.classList.contains(Glossary.pressedButtonClassName)) {
        return button.id;
      }
    }
    return undefined;
  }

  getDifficultySettings() {
    const type = this.getSelectedDifficultyType();
    const resolve = DIFFICULTY_RESOLVERS[type];
    return resolve ? resolve() : [undefined, undefined, undefined];
  }
}
