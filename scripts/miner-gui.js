
import Glossary from './glossary';
import minerModel from './miner-model';

export default class minerGUI  {
	constructor(width, height, mines )	{
		this.width = width;
		this.height = height;
		this.mines = mines;
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
			if (!clickedCell.classList.contains(Glossary.flagFieldName) && !clickedCell.classList.contains(Glossary.questionFieldName) && (eventType==='click')) {
				clickedCell.checked = true;
				clickedCell.classList.remove("closed");       
				clickedCell.classList.add("empty");
				if (Number.isInteger(model.field[i][j]))  {
					if (model.field[i][j]>0)  {
						clickedCell.textContent = model.field[i][j];
					}
					else {
						openCell(i+1, j,   'click', model, false);
						openCell(i+1, j+1, 'click', model, false);
						openCell(i+1, j-1, 'click', model, false);
						openCell(i,   j-1, 'click', model, false);
						openCell(i,   j+1, 'click', model, false);
						openCell(i-1, j+1, 'click', model, false);
						openCell(i-1, j-1, 'click', model, false);
						openCell(i-1, j,   'click', model, false);
						return;
					}
				}
				else if (model.field[i][j] === Glossary.mineFieldName)  {
					clickedCell.classList.add(Glossary.bombFieldName);
          clickedCell.style.color= "black";
          clickedCell.style.background= "#ff4c5b";
          gameOver(model);
					return;
				}
			}
			else if(mines) {
				if (clickedCell.classList.contains(Glossary.flagFieldName)) {
					clickedCell.classList.remove("flag");
					clickedCell.classList.add("question");
          minesLeft.textContent++;          
				}
				else if (clickedCell.classList.contains(Glossary.questionFieldName) && (mines))  {
					clickedCell.classList.remove("question");
				}
				else  { 
          clickedCell.classList.add("flag");
          minesLeft.textContent--;         
        }
			}
      if (minesLeft.textContent === "0")
      {          
        gameOver(false,mines);
        return;   
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
            if ((mines!==false) && (model.field[i][j] === Glossary.mineFieldName)) {
              smile.classList.remove('newGame');
              table.rows[i].cells[j].classList.add(Glossary.bombFieldName);
              table.rows[i].cells[j].classList.add("empty");
              smile.classList.add('faleGame');
            }
           } 
          cellsLeft = ((table.rows[i].cells[j].classList.contains("empty")) ? (cellsLeft-1)  : cellsLeft)
          if ((minesLeft.textContent === "0") &&  (cellsLeft-parseInt(mines) ===  0))  {            
            smile.classList.remove('newGame');
            smile.classList.add('winGame');
            gameOver(true,false)
          }
        }
      }
    }
	}
}