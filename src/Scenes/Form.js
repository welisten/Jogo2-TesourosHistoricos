import  { MemoryGame } from './Game.js';
import  { GameDisplay } from '../Class/GameDisplay.js'
import  { GameAcessibleDisplay} from '../Class/GameAccessible.js'
import  { colors } from '../Consts/Colors.js';
import  { gameData } from '../script.js';

class IntroForm {
    constructor(){
        this.element = ''                                                       // SCENE (MAIN CONTAINER)
        this.gameDisplay   = 'undefined'                                        // ASIDE GAME DISPLAY
        this.gameAcessibleDisplay   = 'undefined' 
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()                             // ASIDE GAME ACCESSIBLE CONTAINER
        this.ucarineSong    = gameAssets['ucarine']
        this.transitionSong = gameAssets['transition']
        this.currentAudio = null
        this.gainNode = this.audioContext.createGain()
        this.lightModeBtn =  document.querySelector('.lightMode_btn')
        this.generateScene()
    }

    generateScene(){
        this.playAudio(this.ucarineSong, 1, true)
        
        this.generateForm()
        this.generateAside()

        const mute_btn = document.querySelector('.mute_btn')
        mute_btn.addEventListener('click', () => {
            this.gainNode.gain.value == 1 ? this.gainNode.gain.value = 0 : this.gainNode.gain.value = 1
        })
    }
    generateForm(){
        this.element = document.getElementById('introFormContainer')            //CRIA OS ELEMENTOS
        // CRIAR ELEMENTO FORMULARIO EM FUTURA REFATORAÇÃO
        // LEVAR EM CONSIDERAÇÃO O USO OU NÃO USO DE UM BANCO DE DADOS
        const introForm = document.createElement('form')
        const formTitle = document.createElement('div')
        const formBody = document.createElement('div')
        const nameLabel = document.createElement('label')
        const nameInput = document.createElement('input')
        const startBtn  = document.createElement('button')

        formTitle.setAttribute('tabindex', '5')
        formTitle.setAttribute('aria-label',   "Olá, vamos começar digitando o seu nome")

        nameInput.setAttribute('tabindex', '6')
        nameInput.setAttribute('aria-label', 'Digite seu nome')

        startBtn.setAttribute('tabindex', '7')
        startBtn.setAttribute('aria-label', 'Iniciar')

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
        this.typewriter('Olá ! Vamos começar digitando o seu nome.', formTitle)

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
            // console.log('active')
        }
        else
        {
            this.element.style.backgroundColor = colors.white
            form.style.backgroundColor = colors.blue_baby
            form.style.boxShadow ='none'
            // console.log('not active')

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
                this.stopCurrentAudio()
                this.playAudio(this.transitionSong)
                introForm.style.opacity = 0
                
                setTimeout(() => {
                    const game = new MemoryGame(16, nameInput.value, this.gameDisplay, this.gainNode, this.audioContext)
                    this.element.style.display = "none"
                    game.startGame()
                }, 1000)
            }else{
                this.popUpMessage('Digite um nome válido')
            }
        })
    }
    popUpMessage(message){
        const popUp = document.getElementById('popUp')
        const popupText = document.querySelector('.popupText')
        

        popUp.style.display = 'flex'
        popupText.textContent = message
        popUp.setAttribute('tabindex', '1')
        popUp.setAttribute('aria-label', message)
        popUp.focus()

        setTimeout(() => {
            popUp.style.display = 'none'
            popupText.textContent = ''
            document.querySelector('.nameInput').focus()
        }, 2500)
    }
    playAudio(audioBuffer, volume = 1.0, loop = false){
        const src = this.audioContext.createBufferSource()
        src.buffer = audioBuffer
        src.loop = loop

        volume = gameData.isMute === true ? 0 : 1
        this.gainNode.gain.value = volume 
        
        src.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
        src.start()
        if(loop === true) this.currentAudio = src
    }
    stopCurrentAudio(){
        if(this.currentAudio) {
            this.currentAudio.stop()
            this.currentAudio = null
        }
    }
    
}
export{
    IntroForm
}