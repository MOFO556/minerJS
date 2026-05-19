export default class game {
  
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