// TODO: Refactor - Название класса 'game' слишком общее, лучше переименовать
export default class game {
  
  difficultyChange()  {
    let buttons = document.getElementsByTagName('button');
    // TODO: Refactor - Неиспользуемые переменные (type, width, height, mines) должны быть удалены
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
          // TODO: BUG - disableCustom лежит в основном скрипте, нужно рефакторить
          if (typeof disableCustom === 'function') {
            disableCustom();
          }
        }
      });
    }
    let parametres = this.difficultySet();
    return parametres;
  }
  // TODO: Refactor - Название функции вводит в заблуждение (возвращает значения, а не устанавливает), лучше переименовать в 'getDifficultySettings'
  difficultySet() {
    let buttons = document.getElementsByTagName('button');
    let type,width,height,mines;
    for (let button of buttons) { 
      if (button.className === "pressed") {
        type=button.id
      } 
    }
      // TODO: Refactor - Switch case можно заменить на полиморфизм и использовать глоссарий
      // TODO: Refactor - Хардкод значений сложностей (easy, normal, hard) лучше вынести в конфиг
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