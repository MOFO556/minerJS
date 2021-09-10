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
	constructor(width, height, mines)	{
		this.width = width;
		this.height = height;
		this.mines = countMines(width, height, mines);
	};
  
	drawField()	{
		let model = new minerModel(this.width,this.height,this.mines)
		let table = document.createElement('table');    
		let rows, cells;
		table.className = "field";
		table.id = "minerField";
		model.convertToModel();    

		for (let i = 0; i < this.height; i++)  {      
			rows = table.insertRow(i);
			rows.id = i;
			for (let j = 0; j < this.width; j++) {        
				cells = rows.insertCell(j);
				cells.className = "closed"
				cells.id = j;

				cells.addEventListener('click',
							function(){
							let cellId = event.target.getAttribute('id');
							let rowId = event.target.parentNode.getAttribute('id');
							openCell(rowId,cellId,this,event.type);
							});

				cells.addEventListener('contextmenu',
							function(){
							event.preventDefault();
							openCell(...Array(2),this,event.type);
							})
			}
		}
		document.body.append(table);

		function openCell(i, j, clickedCell, eventType)  {
			
		  if (!clickedCell.classList.contains('flag') && !clickedCell.classList.contains('question') && (eventType==='click')) {        
			  clickedCell.classList.remove("closed");
			  if (Number.isInteger(model.field[i][j]) )  {
			  clickedCell.textContent = model.field[i][j];
			}
			else if (model.field[i][j] === 'mine')  {
			  clickedCell.classList.add("bomb");
			}
		  }
		  else {
			if (clickedCell.classList.contains('flag')) {
			  clickedCell.classList.remove("flag");
			  clickedCell.classList.add("question");
			}
			else if (clickedCell.classList.contains('question'))  {
			  clickedCell.classList.remove("question");
			}
			else  { clickedCell.classList.add("flag");  }
		  }

		}    
	}
}

function countMines	(width, height, mines)	{
	return	((width * height > mines) ? mines : width * height - 1);
}



   