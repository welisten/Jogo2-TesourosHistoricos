import { MemoryGame } from './Scenes/Game.js';
import { IntroForm } from './Scenes/Form.js'; 

// const game = new MemoryGame(16);
const intro = new IntroForm()
// game.startGame();
intro.start()

const mainContainers = document.querySelectorAll('.mainContainer')
const boardWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)
mainContainers.forEach(container => {
  container.style.width = `${boardWidth}px`
  container.style.height = `${boardWidth}px`  
})

console.log(mainContainers)
