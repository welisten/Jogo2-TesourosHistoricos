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

const lightBtn = document.getElementById('lightMode')
const acessibleContainer = document.getElementById('gameAccessibleContainer')
const gameBoard = document.getElementById('gameBoard')

lightBtn.addEventListener('click', () => {
  if(lightBtn.classList.contains('active')){
    lightBtn.classList.remove('active')
    document.querySelector('body').style.backgroundColor = '#efefef'
    document.querySelector('#gameAccessibleContainer').style.backgroundColor = '#efefef'
    document.querySelector('#gameAccessibleContainer').style.color = '#3e3e3f'
    document.querySelector('#gameBoard').style.backgroundColor = '#efefef'
    console.log(lightBtn)

  }else{
    lightBtn.classList.add('active')

    document.querySelector('body').style.backgroundColor = '#3e3e3f'
    document.querySelector('#gameBoard').style.backgroundColor = '#000'
    document.querySelector('#gameAccessibleContainer').style.backgroundColor = '#000'
    document.querySelector('#gameAccessibleContainer').style.color = '#efefef'
// 
    console.log(lightBtn)
    
  }
})

const btns = document.querySelectorAll('.lightMode_btn');

btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remover a classe que define o estilo :hover
        btn.classList.remove('hovered');
        
        // Aqui você pode adicionar o código adicional que deseja executar quando o botão for clicado
        console.log('Clicou no botão de modo claro');
    });

    // Adicionar um event listener para adicionar a classe quando o mouse entrar no botão
    btn.addEventListener('mouseenter', () => {
        btn.classList.add('hovered');
    });

    // Adicionar um event listener para remover a classe quando o mouse sair do botão
    btn.addEventListener('mouseleave', () => {
        btn.classList.remove('hovered');
    });
});

console.log(lightBtn)
