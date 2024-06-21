import { IntroForm } from './Scenes/Form.js'; 


const mainContainers = document.querySelectorAll('.mainContainer')
const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)

mainContainers.forEach(container => {
  container.style.width = `${containerWidth}px`
  container.style.height = `${containerWidth}px`  
})

const darkBtn = document.getElementById('lightMode')    //entrando no modo LIGHT
darkBtn.addEventListener('click', () => {
  if(darkBtn.classList.contains('active')){ //
    darkBtn.classList.remove('active')
   
    document.querySelector('body').style.backgroundColor = '#efefef'
    document.querySelector('#gameAccessibleContainer').style.backgroundColor = '#efefef'
    document.querySelector('#gameDisplay').style.backgroundColor = '#efefef'
    document.querySelector('#gameDisplay').style.border = '3px solid rgb(5, 109, 179)'
    document.querySelector('#gameAccessibleContainer').style.border = '3px solid rgb(5, 109, 179)'

    document.querySelector('#gameBoard').style.backgroundColor = '#efefef'
    document.querySelector('#gameAccessibleContainer').style.color = '#3e3e3f'

    document.querySelector('.clock').style.border = '1px solid #3e3e3f'
    document.querySelector('.cardName').style.color = '#3e3e3f'
    document.querySelector('.cardLocation').style.color = '#3e3e3f'
    document.querySelector('.clockNumbers').style.color = '#3e3e3f'
    document.querySelector('.clockSecond').style.color = '#3e3e3f'
    document.querySelector('.fa-clock').style.color = '#3e3e3f'
  }else{
    darkBtn.classList.add('active')     //entrando no modo DARK
    
    document.querySelector('body').style.backgroundColor = '#111111'
    document.querySelector('#gameBoard').style.backgroundColor = '#000'
    document.querySelector('#gameAccessibleContainer').style.backgroundColor = '#ffffff10'
    document.querySelector('#gameDisplay').style.backgroundColor = '#ffffff10'
    document.querySelector('#gameAccessibleContainer').style.color = '#efefef'

    document.querySelector('.clock').style.border = '1px solid bisque'
    document.querySelector('.cardName').style.color = '#efefef'
    document.querySelector('.cardLocation').style.color = '#efefef'
    document.querySelector('.clockNumbers').style.color = '#efefef'
    document.querySelector('.clockSecond').style.color = '#efefef'
    document.querySelector('.fa-clock').style.color = '#efefef'
  }
})

const btns = document.querySelectorAll('.lightMode_btn');
btns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    btn.classList.remove('hovered');
  });
  
  btn.addEventListener('mouseenter', () => {
    btn.classList.add('hovered');
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.classList.remove('hovered');
  });
});

const intro = new IntroForm()