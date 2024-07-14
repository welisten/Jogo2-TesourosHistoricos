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
        this.errorSong = gameAssets['incorrect']
        this.currentAudio = null
        this.gainNode = this.audioContext.createGain()
        this.lightModeBtn =  document.querySelector('.lightMode_btn')
        this.generateScene()
    }

    generateScene(){
        document.getElementById('gameBoard').style.display = 'none'

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
        const formTitle = document.createElement('p')
        const formBody = document.createElement('div')
        const nameLabel = document.createElement('label')
        const nameInput = document.createElement('input')
        const startBtn  = document.createElement('button')

        formTitle.setAttribute('tabindex', '2')
        formTitle.setAttribute('aria-label', "Olá, vamos começar digitando o seu nome")

        nameInput.setAttribute('tabindex', '2')
        nameInput.setAttribute('aria-label', 'Digite seu nome')
        nameInput.setAttribute('aria-required', 'true')

        startBtn.setAttribute('tabindex', '2')
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
                    if(gameData.isScreenReaderActive){
                        document.querySelector('.formTitle').focus()
                    }
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
                introForm.style.opacity = 0
                let delay = 6500
                if(gameData.isScreenReaderActive){
                    delay = 4000
                    let aux = 3
                    // this.popUpMessage('O jogo começa em', null, 1000, false)
                    this.readText('O jogo começa em', false)
                    setTimeout(() => {
                        let countdown = setInterval(() => {
                            if(aux <= 0 ) {
                                clearInterval(countdown)
                                
                                return
                            }else if(aux === 1){
                                this.stopCurrentAudio()
                                this.playAudio(this.transitionSong)
                            }
                            // popupText.textContent += ` ${aux}`
                            this.readText(aux, false)
                            console.log(aux)
                            aux--
                        }, 1000)
                    }, 500)

                }else{
                    this.playAudio(this.transitionSong)
                }
                setTimeout(() => {
                    const game = new MemoryGame(16, nameInput.value, this.gameDisplay, this.gainNode, this.audioContext)
                    this.element.style.display = "none"

                    game.startGame()
                }, delay)

            }else{
                let delay = 2500
                this.playAudio(this.errorSong)
                this.popUpMessage('Digite um nome válido', '.nameInput', delay)
            }
        })
    }
    popUpMessage(message, nxtElem, delay = 2500, isVisible = true, chaining = false){
        const popUp = document.getElementById('popUp')
        const popupText = document.querySelector('.popupText')
        const nextFocusElement = document.querySelector(nxtElem)
        
        if(isVisible){ 
            popUp.style.opacity = 1
        }
        
        if(!chaining) popupText.textContent = ''
        popupText.setAttribute('tabindex', 1)
        popupText.textContent = message
        popupText.focus() 
        
        if(isVisible){
            setTimeout(() => {
                popUp.style.opacity = 0
            }, delay);
        }
        if(nxtElem && gameData.isScreenReaderActive){
            console.log(delay);
            setTimeout(() => nextFocusElement.focus(), delay + 100)
        }
        
    }
    readText(text, textChaining = false){
        const textToReaderEl = document.querySelector('.textToReader')

        textToReaderEl.textContent = textChaining ? `${popupText.textContent} ${text}` : `${text}`
    }

    playAudio(audioBuffer, volume = 1.0, loop = false){
        const src = this.audioContext.createBufferSource()
        let aux = volume
        src.buffer = audioBuffer
        src.loop = loop

        volume = gameData.isMute === true ? 0 : aux
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