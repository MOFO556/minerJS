'use strict';

class minerModel	{
	constructor(width, height, mines)	{
		this.width = width;
		this.height = height;
		this.mines = countMines(width, height, mines);
		this.field = new Array(height*width).fill(0);
		this.openedField = [];
		this.gameFinished = false;
	}

	minesInit(minedField)	{
		let minesNumber = this.mines;
		let fieldSpace = this.height*this.width;
		this.field = new minesSet();

		function minesSet()	{
			for (let i=0; i<minesNumber; i++)	{
				let bombInd = parseInt(getRandomArbitrary(0, fieldSpace));
				if (minedField[bombInd] === 0){
					minedField[bombInd] = 'mine';
					minesNumber -= 1;
				}
			}
			if (minesNumber !== 0) {minesSet();}

			function getRandomArbitrary(min, max) {
				return Math.random() * (max - min) + min;
			}
			
			return minedField;
		}    
	}
  
	fieldTransformation() {
		this.minesInit(this.field);    
		for (let i = 0; i < this.height; i++) {
		  this.field[i] = this.field.slice(i * this.width ,i * this.width + this.width);
		}
		this.field.splice(this.height);
	}
  
  //Модель пересчитываем 0 в мины
  convertToModel()	{
		this.fieldTransformation();
		let mineFlag = JSON.parse(JSON.stringify(this.field));


		for (let i = 0; i < this.height; i++)  {
			mineFlag[i][this.width] = 0;
			for (let j = 0; j < this.width; j++) {  
				if (this.field[i][j] === 'mine') { mineFlag[i][j] = 1;}  
			}
		}
		mineFlag.push(new Array(this.width+1).fill(0));

		for (let i = 0; i < this.height; i++)  {
			for (let j = 0; j < this.width; j++) {
				if (this.field[i][j] !== 'mine')  {
					if (i === 0)  {
						if (j === 0)  {
							this.field[i][j] = mineFlag[i+1][j] + mineFlag[i+1][j+1] + mineFlag[i][j+1]; 
						}
						else {
							this.field[i][j] = mineFlag[i][j-1] + mineFlag[i+1][j-1] + mineFlag[i+1][j] + mineFlag[i+1][j+1] + mineFlag[i][j+1];
						} 
					}
					else if (j === 0) {
						this.field[i][j] = mineFlag[i-1][j] + mineFlag[i+1][j] + mineFlag[i-1][j+1] + mineFlag[i][j+1] + mineFlag[i+1][j+1]; 
					}
					else  {
						this.field[i][j] = mineFlag[i-1][j-1] + mineFlag[i][j-1] + mineFlag[i+1][j-1] + mineFlag[i-1][j] + mineFlag[i+1][j] + mineFlag[i-1][j+1] + mineFlag[i][j+1] + mineFlag[i+1][j+1];
					} 
				}
			}
		}    
	}
  
}

class minerGUI  {
	constructor(width, height, mines )	{
		this.width = width;
		this.height = height;
		this.mines = countMines(width, height, mines);
	};  


	drawWrap()  { 
      document.getElementById("gameWrapper").style.width = (((this.width*21) >= 240) ? (this.width*21+20) : 250) + "px"
	}

	drawField()	{    
      let model = new minerModel(this.width,this.height,this.mines)
      let table = createField(this.width,this.height,this.mines, model);
      if(!document.getElementById("minerField"))  {
        document.getElementById("gameWrapper").append(table);
      }
    else  {
      document.getElementById("minerField").replaceWith(table);
    }

    function createField(width, height, mines, model)  {
      let table = document.createElement('table');    
      let rows, cells;
      table.className = "field";
      table.id = "minerField";
      model.convertToModel();    

      for (let i = 0; i < height; i++)  {      
        rows = table.insertRow(i);
        rows.id = i;
        for (let j = 0; j < width; j++) {        
          cells = rows.insertCell(j);
          cells.className = "closed"
          cells.id = j;

          cells.onclick = (event) => leftClick(event, model, mines);
          cells.oncontextmenu = (event) => rightClick(event, model, mines);
        }
      }
      return table;
    }
    
    function leftClick(event, model, mines){
      let cellId = event.target.getAttribute('id');
      let rowId = event.target.parentNode.getAttribute('id');
      openCell(rowId,cellId,event.type,model, mines);
    };
    
     function rightClick(event, model, mines){          
      let cellId = event.target.getAttribute('id');
      let rowId = event.target.parentNode.getAttribute('id');
      event.preventDefault();
      openCell(rowId,cellId,event.type,model, mines);
    };
    
		function openCell(i, j, eventType, model, mines)  {
      let minesLeft = document.getElementById("minesLeft")
			let table = document.getElementById('minerField');
			i = parseInt(i);
			j = parseInt(j);
			if (i < 0 || j < 0 || i >= table.rows.length || j >= table.rows[0].cells.length)	{
				return;
			}        
			let clickedCell = table.rows[i].cells[j];
			if (clickedCell.checked)	{
				return;
			}
			if (!clickedCell.classList.contains('flag') && !clickedCell.classList.contains('question') && (eventType==='click')) {
				clickedCell.checked = true;
				clickedCell.classList.remove("closed");       
				clickedCell.classList.add("empty");
				if (Number.isInteger(model.field[i][j]))  {
					if (model.field[i][j]>0)  {
						clickedCell.textContent = model.field[i][j];
						return;
					}
					else  {
						openCell(i+1, j,   'click', model);
						openCell(i+1, j+1, 'click', model);
						openCell(i+1, j-1, 'click', model);
						openCell(i,   j-1, 'click', model);
						openCell(i,   j+1, 'click', model);
						openCell(i-1, j+1, 'click', model);
						openCell(i-1, j-1, 'click', model);
						openCell(i-1, j,   'click', model);
						return;
					}
				}
				else if (model.field[i][j] === 'mine')  {
					clickedCell.classList.add("bomb");
          clickedCell.style.color= "black";
          clickedCell.style.background= "#ff4c5b";
          gameOver(model);
					return;
				}
			}
			else {
				if (clickedCell.classList.contains('flag')) {
					clickedCell.classList.remove("flag");
					clickedCell.classList.add("question");
          minesLeft.textContent++;          
				}
				else if (clickedCell.classList.contains('question'))  {
					clickedCell.classList.remove("question");
				}
				else  { 
          clickedCell.classList.add("flag");
          minesLeft.textContent--;
          if (minesLeft.textContent === "0")
          {          
            gameOver(false,mines);
            return;   
          }          
        }
			}
		}
    
    function gameOver(model,mines) {
      let smile = document.getElementById('updateGame');
      let table = document.getElementById('minerField');
      let minesLeft = document.getElementById("minesLeft");
      let cellsLeft = table.rows.length * table.rows[0].cells.length; 
      for (let i = 0; i < table.rows.length; i++)  { 
        for (let j = 0; j < table.rows[0].cells.length; j++) {
          if (model  !== false)  {
            table.rows[i].cells[j].onclick = null;
            table.rows[i].cells[j].oncontextmenu = (event) => event.preventDefault(); 
            if ((mines!==false) && (model.field[i][j] === 'mine')) {
              smile.classList.remove('newGame');
              table.rows[i].cells[j].classList.add("bomb");
              table.rows[i].cells[j].classList.add("empty");
              smile.classList.add('faleGame');
            }
           } 
          cellsLeft = ((table.rows[i].cells[j].classList.contains("empty")) ? (cellsLeft-1)  : cellsLeft)
          if ((minesLeft.textContent === "0") &&  ((cellsLeft-parseInt(mines)) ===  parseInt(mines)))  {            
            smile.classList.remove('newGame');
            smile.classList.add('winGame');
            gameOver(true,false)
          }
        }
      }
    }
	}
}



function countMines	(width, height, mines)	{
	return	((width * height > mines) ? mines : width * height - 1);
}

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


class game  {
  
  difficultyChange()  {
    let buttons = document.getElementsByTagName('button');
    let type,width,height,mines;
    for (let button of buttons) { 
      button.addEventListener("click",(event) => {
        if(button.className !== "pressed")  {
          const unactives = Array.from(buttons)
          .filter(unactive => (unactive.id!==button.id))
          button.classList.add("pressed");          
          for (let uncative of unactives) {
            uncative.classList.remove("pressed");
          }        
          disableCustom();
        }
      });
    }
    let parametres = this.difficultySet();
    return parametres;
  }
  difficultySet() {
    let buttons = document.getElementsByTagName('button');
    let type,width,height,mines;
    for (let button of buttons) { 
      if (button.className === "pressed") {
        type=button.id
      } 
    }
      switch(type){
      case "easy":
        width = 9;
        height = 9;
        mines = 10;
        break;
      case "normal":
        width = 16;
        height = 16;
        mines = 40;
        break;
      case "hard":
        width = 30;
        height = 16;
        mines = 99;
        break;
      case "custom":        
        width = document.getElementById("widthInput").value;
        height = document.getElementById("heightInput").value;
        mines = document.getElementById("minesInput").value;
        break;
    }
    return [width, height, mines];
  }
}

function refreshGame()  {
  let newgame = new game();
  let parametres = newgame.difficultyChange();
  let GUI = new minerGUI(parametres[0],parametres[1],parametres[2]);
  GUI.drawWrap();
  GUI.drawField();  
  let minesLeft = document.getElementById("minesLeft")
  minesLeft.textContent = parametres[2]
  let smile = document.getElementById("updateGame")
  if (smile.classList.contains('winGame')) {
    smile.classList.remove('winGame');
    smile.classList.add('newGame');
  }
  else if (smile.classList.contains('faleGame')) {
    smile.classList.remove('faleGame');
    smile.classList.add('newGame');
  }
} 


function hideInfo()  {
  let infoWindow = document.getElementById("infoBlock");
  if (infoWindow.style.display === "block") {infoWindow.style.display = "none";}
}


document.addEventListener("DOMContentLoaded",(event) => {      
	refreshGame();
	disableCustom();        
	let smile = document.getElementById("updateGame")
	smile.onclick = (event) => refreshGame();
	let infoButton =  document.getElementById("infoButton")
	infoButton.onclick = function(){
			let infoBlock =  document.getElementById("infoBlock")
			if (infoBlock.style.display === "none") {
				infoBlock.style.display = "block";
				let infoText =  document.getElementById("infoText")
        infoText.addEventListener("click",hideInfo,true);
			}       
		}
});
