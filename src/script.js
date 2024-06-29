import { IntroForm } from './Scenes/Form.js'; 
import  {LevelScore} from './Scenes/LevelScore.js'
// const levelScoreContainer = document.querySelector('#gameContainer')
// const score = new LevelScore(levelScoreContainer, 'Wesley', 76, 1, 8)
const intro = new IntroForm()
const accessibleContainer = document.getElementById('gameAccessibleContainer')
const gameDisplay = document.getElementById('gameDisplay')
const gameDisplay_header = document.getElementById('gameDisplay_header')
const gameDisplay_bar = document.getElementById('gameDisplay_bar')
const gameDisplay_body = document.getElementById('gameDisplay_body')
const gameDisplay_footer = document.getElementById('gameDisplay_footer')
const darkBtn = document.getElementById('lightMode_btn')
const lines = document.querySelectorAll('.line')
const treasure = document.querySelector('.treasure')
const treasureNumber = document.querySelector('.treasuresNumber')
const [GDLine1, GDLine2, GDLine3] = lines

const mainContainers = document.querySelectorAll('.mainContainer')
const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)

// gameDisplay_header.style.height = '100%'
mainContainers.forEach(container => {
  container.style.width = `${containerWidth}px`
  container.style.height = `${containerWidth}px`  
})

const btns =  document.querySelectorAll('.btn') 
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
        // console.log('mute')
        break
      
      case 'libras_btn':
        const libras_btn = document.querySelector('.libras_btn')
        libras_btn.addEventListener('click', (e) => {
          if(!accessibleContainer.classList.contains('active')){ // NÃO ESTÁ EM TELA
            libras_btn.classList.toggle('active')
            accessibleContainer.classList.toggle('active')
            
            intro.gameDisplay.toggleDisplay()
            intro.gameAcessibleDisplay.toggleDisplay()
          }else{                                                // ESTÁ EM TELA
            libras_btn.classList.toggle('active')
            accessibleContainer.classList.toggle('active')

            intro.gameDisplay.toggleDisplay()
            intro.gameAcessibleDisplay.toggleDisplay()
          }
        })
        break

      case 'screenReader_btn':
        // console.log('leitor')
        break

      case 'lightMode_btn':
        elemClassArr[0].addEventListener('click', () => {
          if(elemClassArr[0].classList.contains('active')){ //              entrando no modo LIGHT
            elemClassArr[0].classList.toggle('active')
           //definir apenas dos elementos pais
            intro.gameDisplay.toggleLight()
            intro.toggleLight()
            document.querySelector('body').style.backgroundColor = 'var(--body-color-light)'
            document.querySelector('#gameBoard').style.backgroundColor = '#ffffff'
            
            // document.querySelector('#gameAccessibleContainer').style.backgroundColor = '#efefef'
            // document.querySelector('#gameAccessibleContainer').style.border = '3px solid rgb(5, 109, 179)'
            // document.querySelector('#gameAccessibleContainer').style.color = '#3e3e3f'
          }else{
            elemClassArr[0].classList.toggle('active')     //entrando no modo DARK
            intro.gameDisplay.toggleLight()
            intro.toggleLight()

            
            document.querySelector('body').style.backgroundColor = 'var(--body-color-dark)'
            document.querySelector('#gameBoard').style.backgroundColor = '#000'
            
            // document.querySelector('#gameAccessibleContainer').style.backgroundColor = '#ffffff10'
            // document.querySelector('#gameAccessibleContainer').style.color = '#efefef'

          }
        })
        break
      default:
        break
  }
});

// const displayBar_userName_El = document.querySelector('.user_name')
// const displayBar_userLevel_El = document.querySelector('.user_name')
