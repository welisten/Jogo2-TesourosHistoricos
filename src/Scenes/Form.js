import  { MemoryGame } from './Game.js';
import  { GameDisplay } from '../Class/GameDisplay.js'
import  { GameAcessibleDisplay} from '../Class/GameAccessible.js'
import  { colors } from '../Consts/colors.js';

class IntroForm {
    constructor(){
        this.element = ''                                                       // SCENE (MAIN CONTAINER)
        this.gameDisplay   = 'undefined'                                        // ASIDE GAME DISPLAY
        this.gameAcessibleDisplay   = 'undefined'                               // ASIDE GAME ACCESSIBLE CONTAINER
        this.ucarineSong    = new Audio('./Assets/songs/ucarine.wav')
        this.transitionSong = new Audio('./Assets/songs/intro.wav')
        this.lightModeBtn =  document.querySelector('.lightMode_btn')
        this.generateScene()
    }
    generateScene(){
        this.ucarineSong.loop = true
        this.ucarineSong.volume = 1
        this.ucarineSong.play()
        
        this.generateForm()
        this.generateAside()
    }
    generateForm(){
        this.element = document.getElementById('introFormContainer')            //CRIA OS ELEMENTOS
        // CRIAR ELEMENTO FORMULARIO EM FUTURA REFATORAÇÃO
        // LEVAR EM CONSIDERAÇÃO O USO OU NÃO USO DE UM BANCO DE DADOS
        const introForm = document.createElement('form')
        const formTitle = document.createElement('h2')
        const formBody = document.createElement('div')
        const nameLabel = document.createElement('label')
        const nameInput = document.createElement('input')
        const startBtn  = document.createElement('button')

        introForm.classList.add('introForm')                                    // CONFIGURA OS ATRIBUTOS
        formTitle.classList.add('formTitle')
        nameInput.classList.add('nameInput')
        nameLabel.classList.add('nameLabel')
        formBody.classList.add('formBody')
        startBtn.classList.add('startBtn')
        nameLabel.setAttribute('for', 'user_name') 
        
        nameLabel.title = "Digite seu nome"
        nameInput.type = 'text'
        nameInput.name = 'user_name'
        nameInput.placeholder = 'Digite seu nome'
        nameInput.id = 'user_name'
        
        formTitle.textContent = ''
        nameLabel.textContent =  'Nome :'
        startBtn.textContent = 'iniciar'

        formBody.appendChild(nameLabel)                                         //APPEND OS ELEMENTOS
        formBody.appendChild(nameInput)
        formBody.appendChild(startBtn)
        introForm.appendChild(formTitle)
        introForm.appendChild(formBody)
        this.element.appendChild(introForm)
        
        this.handleElements()
        this.typewriter('Ola! Vamos começar digitando o seu Nome.', formTitle)

    }
    generateAside(){
        const gameBoard_aside = document.getElementById('gameBoard_aside')
        
        this.gameDisplay = new GameDisplay(gameBoard_aside)
        this.gameAcessibleDisplay = new GameAcessibleDisplay(gameBoard_aside)
    }
    typewriter(text, container){
        let node = 0
        let titleArr = text
        let writerDelay = 50
        
        setTimeout(() => {
            function tWriter(){//RECURSIVIDADE
                if(node >= titleArr.length){//PONTO DE PARADA
                    return
                }
                                                
                let currentChar = titleArr[node]            // EXECUÇÃO
                container.textContent += currentChar 
                node++                                   //ATUALIZAÇÃO DO NÓ
                
                let delay = writerDelay                 //ATUALIZAÇÃO DO PARAMETRO
                if(currentChar == '.' || currentChar == '!' || currentChar == '?' || currentChar == ',')
                    delay = 500
                setTimeout(tWriter, delay)           //CHAMADA RECURSIVA
            }
        tWriter()
        }, 2000)
    }
    toggleLight(){
        const form = document.querySelector('.introForm')
        if(this.lightModeBtn.classList.contains('active')){
            this.element.style.backgroundColor =  colors.black
            form.style.backgroundColor =  colors.transparent_a23
            form.style.boxShadow = `0 0 .5em ${colors.blue_serius_ac7}`
        }
        else
        {
            this.element.style.backgroundColor = colors.white
            form.style.backgroundColor = colors.blue_baby
            form.style.boxShadow ='none'
        }
    }
    handleElements(){
        const nameInput = document.querySelector('.nameInput')
        const nameLabel = document.querySelector('.nameLabel')
        const startBtn  = document.querySelector('.startBtn')
        const introForm = document.querySelector('.introForm')
        
        nameInput.addEventListener('focus', ()=>{
            nameLabel.style.transform = 'translateY(0)'
            nameLabel.style.color = colors.white
        })
        nameInput.addEventListener('blur', ()=>{
            if(!nameInput.value){
                nameLabel.style.transform = 'translateY(4.8vh)'
                nameLabel.style.color = colors.black
            }
        })
        
        startBtn.addEventListener('click', (e) => {
            e.preventDefault()
            if(nameInput.value){
                this.ucarineSong.pause()
                this.transitionSong.play()
                introForm.style.opacity = 0
                
                setTimeout(() => {
                    const game = new MemoryGame(16, nameInput.value, this.gameDisplay)
                    this.element.style.display = "none"
                    game.startGame()
                    this.element.remove()
                }, 1000)
            }else{
                alert('Digite um nome válido')
            }
        })
    }
}
export{
    IntroForm
}