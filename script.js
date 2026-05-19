'use strict';
import './style.css';
import minerGUI from './scripts/miner-gui'
import game from './scripts/game'
import {
  countMines,
  hideInfo
} from './scripts/helpers'



function disableCustom()  {
  let parametres = document.getElementsByTagName("input");
  for (let parametre of parametres) {
    if (document.getElementById("custom").classList.contains("pressed"))  {
      parametre.disabled = false;
    }
    else {
      parametre.disabled = true;
    }
  }
}

function refreshGame(event)  {
  let newgame = new game();
  let parametres = newgame.difficultyChange();
  let mines = countMines(parametres[0],parametres[1],parametres[2]);
  let GUI = new minerGUI(parametres[0],parametres[1],mines);
  GUI.drawWrap();
  GUI.drawField();
  let minesLeft = document.getElementById("minesLeft");
  minesLeft.textContent = mines;
  let smile = document.getElementById("updateGame");
  if (smile.classList.contains('winGame')) {
    smile.classList.remove('winGame');
    smile.classList.add('newGame');
  }
  else if (smile.classList.contains('faleGame')) {
    smile.classList.remove('faleGame');
    smile.classList.add('newGame');
  }
}

document.addEventListener("DOMContentLoaded",(event) => {
	refreshGame();
	disableCustom();
	let smile = document.getElementById("updateGame");
	smile.onclick = (event) => refreshGame(event);
	let infoButton =  document.getElementById("infoButton");
	infoButton.onclick = function(){
			let infoBlock =  document.getElementById("infoBlock")
			if (infoBlock.style.display === "none") {
				infoBlock.style.display = "block";
				let infoText =  document.getElementById("infoText")
        infoText.addEventListener("click",hideInfo,true);
			}       
		}
});
