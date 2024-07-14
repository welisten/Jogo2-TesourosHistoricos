import { Preloader } from './Scenes/Preload.js';

const gameData = {
  isPreloadComplete: false,
  intro: undefined, 
  isMute: false,
  isDarkMode: true,
  isScreenReaderActive: true,
  isLibrasActive: false
} 
new Preloader()
const accessibleContainer = document.getElementById('gameAccessibleContainer')
const mainContainers = document.querySelectorAll('.mainContainer')
const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)

mainContainers.forEach(container => {
  container.style.width = `${containerWidth}px`
  container.style.height = `${containerWidth}px`  
})

const btns =  document.querySelectorAll('.controlBtn') 
btns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    btn.classList.remove('hovered');
  });

  btn.addEventListener('mouseenter', () => {
    btn.classList.add('hovered');
  });

  btn.addEventListener('mouseleave', () => {
    btn.classList.remove('hovered');
  });
})

const btnsAndClss = []

btns.forEach((elem, i) => btnsAndClss[i] = [elem, elem.className.split(' ')[1]])
btnsAndClss.forEach( elemClassArr => {
  switch(elemClassArr[1]){
    case 'mute_btn':
      elemClassArr[0].addEventListener('click', () => {
        gameData.isMute = !gameData.isMute
        const icon = elemClassArr[0].children[0]

          elemClassArr[0].classList.toggle('active')
          icon.classList.toggle('fa-volume-xmark')
          icon.classList.toggle('fa-volume-high')
        })
        break
      
      case 'libras_btn':
        const libras_btn = document.querySelector('.libras_btn')
        elemClassArr[0].addEventListener('click', (e) => {
          if(!accessibleContainer.classList.contains('active')){ // NÃO ESTÁ EM TELA
            libras_btn.classList.toggle('active')
            accessibleContainer.classList.toggle('active')
            
            gameData.intro.gameDisplay.toggleDisplay()
            gameData.intro.gameAcessibleDisplay.toggleDisplay()
          }else{                                                // ESTÁ EM TELA
            libras_btn.classList.toggle('active')
            accessibleContainer.classList.toggle('active')

            gameData.intro.gameDisplay.toggleDisplay()
            gameData.intro.gameAcessibleDisplay.toggleDisplay()
          }
        })
        break

      case 'screenReader_btn':
        const screenReader_btn = document.querySelector('.screenReader_btn')
        elemClassArr[0].addEventListener('click', () => {
          console.log(gameData)
          gameData.isScreenReaderActive = !gameData.isScreenReaderActive
          screenReader_btn.classList.toggle('active')
        })
        
        break

      case 'lightMode_btn':
        elemClassArr[0].addEventListener('click', () => {
          gameData.isDarkMode =  !gameData.isDarkMode
          if(elemClassArr[0].classList.contains('active')){ //              entrando no modo LIGHT
            
            elemClassArr[0].classList.toggle('active')
            elemClassArr[0].children[0].classList.toggle('fa-sun')
            elemClassArr[0].children[0].classList.toggle('fa-moon')
           //definir apenas dos elementos pais
            gameData.intro.toggleLight()
            gameData.intro.gameDisplay.toggleLight()
            gameData.intro.gameAcessibleDisplay.toggleLight()

            document.querySelector('body').style.backgroundColor = 'var(--body-color-light)'
            document.querySelector('#gameBoard').style.backgroundColor = '#ffffff'
          }else{
            elemClassArr[0].classList.toggle('active')     //entrando no modo DARK
            elemClassArr[0].children[0].classList.toggle('fa-sun')
            elemClassArr[0].children[0].classList.toggle('fa-moon')

            gameData.intro.toggleLight()
            gameData.intro.gameDisplay.toggleLight()
            gameData.intro.gameAcessibleDisplay.toggleLight()
            
            document.querySelector('body').style.backgroundColor = 'var(--body-color-dark)'
            document.querySelector('#gameBoard').style.backgroundColor = '#000'
          }
        })
        break
      default:
        break
  }
});

export{
  gameData
}
