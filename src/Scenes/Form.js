import { MemoryGame } from './Game.js';

class IntroForm {
    constructor(){
        this.ucarineSong    = new Audio('./Assets/songs/ucarine.wav')
        this.transitionSong = new Audio('./Assets/songs/intro.wav')
        this.generateScene()
    }
    
    generateForm(){
        const formContainer = document.getElementById('introFormContainer')
        const introForm = document.createElement('form')
        const formTitle = document.createElement('h2')
        const formBody = document.createElement('div')
        const nameInput = document.createElement('input')
        const nameLabel = document.createElement('label')
        const startBtn  = document.createElement('button')

        introForm.classList.add('introForm')
        formTitle.classList.add('formTitle')
        nameInput.classList.add('nameInput')
        nameLabel.classList.add('nameLabel')
        formBody.classList.add('formBody')
        startBtn.classList.add('startBtn')
        
        formTitle.innerText = ''
        nameLabel.setAttribute('for', 'user_name') 
        nameLabel.textContent =  'Nome :'
        nameLabel.title = "Digite se nome"
        nameInput.type = 'text'
        nameInput.name = 'user_name'
        nameInput.placeholder = 'Digite seu nome'
        nameInput.id = 'user_name'
        startBtn.textContent = 'iniciar'

        formBody.appendChild(nameLabel)
        formBody.appendChild(nameInput)
        formBody.appendChild(startBtn)
        introForm.appendChild(formTitle)
        introForm.appendChild(formBody)
        formContainer.appendChild(introForm)
        
        this.handleElements()

        let aux = 0
        let title = 'Ola! Vamos começar digitando o seu Nome.'
        let writerDelay = 50
        
        setTimeout(() => {
            function typewriter(){
                if(aux >= title.length){
                    return
                }

                let currentChar = title[aux]
                formTitle.textContent += currentChar 
                aux++
                
                let delay = writerDelay
                if(currentChar == '.' || currentChar == '!' || currentChar == '?' || currentChar == ',')
                    delay = 500
                setTimeout(typewriter, delay)
            }
        typewriter()
        }, 2000)
    }

    handleElements(){
        const nameInput = document.querySelector('.nameInput')
        const nameLabel = document.querySelector('.nameLabel')
        const startBtn  = document.querySelector('.startBtn')
        const introForm = document.querySelector('.introForm')
        const formContainer = document.querySelector('#introFormContainer')

        nameInput.addEventListener('focus', ()=>{
            nameLabel.style.transform = 'translateY(0)'
            nameLabel.style.color = 'white'
        })

        nameInput.addEventListener('blur', ()=>{
            if(nameInput.value == ''){
                nameLabel.style.transform = 'translateY(4.8vh)'
                nameLabel.style.color = 'black'
            }
        })
        
        startBtn.addEventListener('click', (e) => {
            e.preventDefault()
            if(nameInput.value != ''){
                this.ucarineSong.pause()
                this.transitionSong.play()
                introForm.style.opacity = 0
                setTimeout(() => {
                    const game = new MemoryGame(16, nameInput.value)
                    game.startGame()
                    
                    const gameBoard = document.getElementById('gameBoard')
                    const rulers = document.querySelectorAll('.ruler')
                    
                    gameBoard.style.display     = 'grid'
                    formContainer.style.display = "none"

                    rulers.forEach(ruler => ruler.style.display = 'flex')
                }, 1000)

            }else{
                alert('Digite um nome válido')
            }
        })
    }

    generateScene(){
        this.ucarineSong.loop = true
        this.ucarineSong.volume = 1
        this.ucarineSong.play()
        this.generateForm()
    }
}

export{
    IntroForm
}