'use strict';
import './style.css';
import MinerGUI from './scripts/miner-gui';
import MinesweeperDifficultyManager from './scripts/game';
import {
  bindCustomInputValidation,
  disableCustom,
  hideInfo,
  resolveDifficultyParameters,
} from './scripts/helpers';
import Glossary from './scripts/glossary';

function refreshGame() {
  const manager = new MinesweeperDifficultyManager();
  manager.difficultyChange();
  const [width, height, mines] = manager.getDifficultySettings();
  const resolution = resolveDifficultyParameters(width, height, mines);

  if (!resolution.ok) {
    console.error(`[Minesweeper] ${resolution.message}`);
    return;
  }

  resolution.warnings.forEach((warning) => {
    console.warn(`[Minesweeper] ${warning}`);
  });

  const GUI = new MinerGUI(resolution.width, resolution.height, resolution.mines);
  GUI.drawWrap();
  GUI.drawField();

  const minesLeft = document.getElementById(Glossary.minesLeftId);
  minesLeft.textContent = resolution.mines;

  const smile = document.getElementById(Glossary.updateGameId);
  if (smile.classList.contains(Glossary.winGameClassName)) {
    smile.classList.remove(Glossary.winGameClassName);
    smile.classList.add(Glossary.newGameClassName);
  } else if (smile.classList.contains(Glossary.failGameClassName)) {
    smile.classList.remove(Glossary.failGameClassName);
    smile.classList.add(Glossary.newGameClassName);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bindCustomInputValidation();
  refreshGame();
  disableCustom();
  const smile = document.getElementById(Glossary.updateGameId);
  smile.onclick = () => refreshGame();
  const infoButton = document.getElementById(Glossary.infoButtonId);
  infoButton.onclick = function () {
    const infoBlock = document.getElementById(Glossary.infoBlockId);
    if (infoBlock.style.display === 'none') {
      infoBlock.style.display = 'block';
      const infoText = document.getElementById(Glossary.infoTextId);
      infoText.addEventListener('click', hideInfo, true);
    }
  };
});
