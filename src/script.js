import { Preloader } from './Scenes/Preload.js';

const gameData = {
  isPreloadComplete: false,
  intro: undefined, 
  isMute: false,
  isDarkMode: true,
  isScreenReaderActive: true,
  isLibrasActive: false,
  lastAccText: '',
  isPaused: false,
} 

new Preloader()

const accessibleContainer = document.getElementById('gameAccessibleContainer')
const mainContainers      = document.querySelectorAll('.mainContainer')

let containerWidth        = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)

mainContainers.forEach(container => {
  container.style.width = `${containerWidth}px`
  container.style.height = `${containerWidth}px`  
})

const popupBtn =  document.querySelector('.popup_btn')
popupBtn.addEventListener('click', ()=>{
  popupBtn.parentNode.style.opacity = 0
})

const btns =  document.querySelectorAll('.controlBtn') 
btns.forEach(btn => {         // handle hover buttons state
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

let auxText = ''
const readText = (text) => {
  let elem = document.querySelector('.textToReader')
 
  if(text === auxText) text += '.'
  auxText = text
  elem.textContent = text
}

const btnsAndClss = []                                                          // para cada botão, suas respectivas classes                                                          
btns.forEach((elem, i) => btnsAndClss[i] = [elem, elem.className.split(' ')[1]])// armazena para cada botão de controle, uma arrey contendo o elemento e a 2° classe desse elemento(botão)

btnsAndClss.forEach( elemClassArr => {
  switch(elemClassArr[1]){
    case 'mute_btn':
      elemClassArr[0].addEventListener('click', () => {
        gameData.isMute = !gameData.isMute
        if(gameData.isScreenReaderActive){
          let state = elemClassArr[0].classList.contains('active') ? 'ativado' : 'desativado' // o status de ativo ou desativo é referente ao som e não ao mudo
          readText(`O Som foi ${state} `)
        }
        elemClassArr[0].classList.toggle('active')
        
        const icon = elemClassArr[0].children[0]
        icon.classList.toggle('fa-volume-xmark')
        icon.classList.toggle('fa-volume-high')
      })
      break
      
    case 'libras_btn':
      elemClassArr[0].addEventListener('click', (e) => {
        console.log(gameData)
        if(!gameData.isScreenReaderActive){ 
          elemClassArr[0].classList.toggle('active')
          accessibleContainer.classList.toggle('active')
          
          gameData.isLibrasActive = !gameData.isLibrasActive
          gameData.intro.gameDisplay.toggleDisplay()
          gameData.intro.gameAcessibleDisplay.toggleDisplay()
        } else {
          readText("Infelizmente, não é possivel ativar 2 modos de acessibilidade ao mesmo tempo")
        }
      })
      break

    case 'screenReader_btn':
      const screenReader_btn = document.querySelector('.screenReader_btn')
      let auxEmpty = ''
      elemClassArr[0].addEventListener('click', () => {
        let status = gameData.isScreenReaderActive ? 'ativado' : 'desativado'
        gameData.isScreenReaderActive = !gameData.isScreenReaderActive
        
        readText(`O aprimoramento do leitor de tela foi ${status}.\n Para jogar no modo acessível para pessoas com deficiência visual recomendamos mantê-lo ativo.`)
        screenReader_btn.classList.toggle('active')
        handleOutline(auxEmpty)
        
        if(gameData.isPaused && gameData.isScreenReaderActive){
          document.querySelector('#gameControls').style.display = 'none'
        }
      })
      handleOutline(auxEmpty)
      break

    case 'lightMode_btn':
      elemClassArr[0].addEventListener('click', () => {
        gameData.isDarkMode =  !gameData.isDarkMode
        
        elemClassArr[0].classList.toggle('active')
        elemClassArr[0].children[0].classList.toggle('fa-sun')
        elemClassArr[0].children[0].classList.toggle('fa-moon')

        gameData.intro.toggleLight()
        gameData.intro.gameDisplay.toggleLight()
        gameData.intro.gameAcessibleDisplay.toggleLight()

        if(!elemClassArr[0].classList.contains('active')){
          document.querySelector('body').style.backgroundColor = 'var(--body-color-light)'
          document.querySelector('#gameBoard').style.backgroundColor = '#ffffff'
        }else{    
          document.querySelector('body').style.backgroundColor = 'var(--body-color-dark)'
          document.querySelector('#gameBoard').style.backgroundColor = '#000'
        }
        
        let lightingMode = elemClassArr[0].classList.contains('active') ? 'modo de iluminação escuro' : 'modo de iluminação claro'
        readText(`${lightingMode} ativado`)
      })
      break
      default:
        break
  }
});

function handleOutline(aux){
  const screenReader_btn = document.querySelector('.screenReader_btn')
  if(screenReader_btn.classList.contains('active')){
    console.log('ativo')
    document.addEventListener('focus', handlerFocus, true)
    document.addEventListener('blur', handleBlur, true)
  }else{
    console.log('desativo')
    document.addEventListener('focus', handleBlur, true)

  }

  function handlerFocus(event){
    aux = event.target.style.borderRadius

    event.target.style.outline = '5px solid #FFA500'
    event.target.style.outlineOffset = '5px'
    event.target.style.borderRadius = '0px'
  }

  function handleBlur(event){
    event.target.style.outline = 'none'
    event.target.style.outlineOffset = 'none'
    event.target.style.borderRadius = aux
  }
}
export{
  gameData
}
