import  { Card }  from '../Class/Card.js';
import  { User }  from '../Class/User.js';
import { colors } from '../Consts/Colors.js';
import { gameData } from '../script.js';
import { cardsImagesDataArr } from '../Consts/Values.js';
import { LevelScore } from './LevelScore.js'


class MemoryGame {
    constructor(size, user_name, gameDisplay, gainNode, audioContext) {
        this.mainContainer = document.querySelector('#gameContainer')               // SCENE(GAME CONTAINER)
        this.gameContainerElement =  document.querySelector('#gameBoard')

        this.size = size                                                        // CARD AMOUNT
        this.cards = []                                                         // CARDS STORE
        this.flippedCards = []                                                  // FLIPPED CARDS STORE
        this.user = new User(user_name)
        this.gameDisplay = gameDisplay
        this.audioContext = audioContext                             // ASIDE GAME ACCESSIBLE CONTAINER
        this.mainSong = gameAssets['main']
        this.selectSong = gameAssets['select']
        this.successSong = gameAssets['success']
        this.failSong = gameAssets['fail']
        this.gainNode = gainNode
        this.currentAudio = null
        this.isClickAble = true
        this.unorderedArray = undefined
        this.orderedArray = undefined
        this.generateCards()
        this.presetGameElements()

        this.user.updateUser()
        this.gameDisplay.user = this.user
        this.gameDisplay.bar.setBarName(this.user.name.split(' ')[0])
        this.gameDisplay.bar.updateBar()
    }
    presetGameElements(){       //PRÉ CONFIGURAÇÃO E CRIAÇÃO PARA AS REGUAS(HORIZ. VERTI.) E GAMEBOARD RESPECTIVAMENTE
        document.title = `Seja bem vindo! a fase ${this.user.level + 1} começou`

        const rulers = document.querySelectorAll('.ruler')
        rulers.forEach(ruler => ruler.style.display = 'flex')
       
        const board = document.getElementById('gameBoard');
        const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)
        
        board.style.display = 'grid'
        board.style.gridTemplateColumns = 'repeat(4, 25%)'
        board.style.border = '3px solid var(--blue-baby)'
        board.style.height = `${containerWidth}px` 
        board.style.width = `${containerWidth}px` 
        board.setAttribute('tabindex', '1')
        board.setAttribute('aria-label', 'tabuleiro')

        const lightBtn = document.querySelector('.lightMode_btn')
        lightBtn.addEventListener('click', () => {
            this.toggleLight()
        })

        if(gameData.isScreenReaderActive){
            let controls = document.querySelector('#gameControls')
            controls.style.display = 'none'
        }

        this.orderedArray = createSortedArr(2, 17)
        this.unorderedArray = createUnsortedArr(2, 17)
        function createSortedArr(min, max){
            const outArray = new Array((max - min) + 1)
            const sqrt = Math.sqrt((max - min) + 1)
            
            let idx = 0
            for(let i = 0; i < sqrt; i++){
                for(let j = min; j <= max; j += sqrt, idx++){
                    outArray[idx] = j + i
                }
            }

            return outArray
        }
        function createUnsortedArr(min, max){
            const outArray = new Array((max - min) + 1)
            let idx = 0

            for(let i = min; i <= max; i++, idx++){
                outArray[idx] = i
            }
            return outArray
        }

    }
    generateCards() {              //PREENCHE O ARRAY DE CARDS DE MANEIRA ALEATÓRIA E ARBITRÁRIA COM INSTÂNCIAS DE CARDS
        const allValues = [];
        for(let dataObj of cardsImagesDataArr){ //OBTEM OS ATRIBUTOS
            allValues.push([`${dataObj.name}_1`, this.getImage(`${dataObj.name}_1`), dataObj.description, dataObj.src])
            allValues.push([`${dataObj.name}_2`, this.getImage(`${dataObj.name}_2`), dataObj.description, dataObj.src])
        }
        allValues.sort(() => Math.random() - 0.5);                              //ORDENA ALEATÓRIA E ARBITRARIALMENTE
        
        let aux = 0
        
        for(let x = 0; x < 4; x++){                                             // INSTANCIA AS CARTAS POSICIONANDOAS NA RÉGUA HxV
            for(let y = 0; y < 4; y++, aux++){
                switch (y){
                    case 0:
                        this.cards.push(new Card(allValues[aux][0], 'A', x + 1, allValues[aux][1], allValues[aux][2], allValues[aux][3]/*, auxArr[aux]*/ )) 
                        break
                    case 1:
                        this.cards.push(new Card(allValues[aux][0], 'B', x + 1, allValues[aux][1], allValues[aux][2], allValues[aux][3]/*, auxArr[aux]*/ )) 
                        break
                    case 2:
                        this.cards.push(new Card(allValues[aux][0], 'C', x + 1, allValues[aux][1], allValues[aux][2], allValues[aux][3]/*, auxArr[aux]*/ )) 
                        break
                    case 3:
                        this.cards.push(new Card(allValues[aux][0], 'D', x + 1, allValues[aux][1], allValues[aux][2], allValues[aux][3]/*, auxArr[aux]*/ )) 
                        break
                }
                
            }
        }
    }
    getImage(name){                 // RETORNA A IMAGEM DO OBJ GLOBAL, ARMAZENADA NO PRELOAD (BLOB)
        return gameAssets[name]
    }
    flipCard(index) {               // DISPARADO NO CLICK DOS CARDS
        const card = this.cards[index];
        
        if(card.isFlipped || card.isMatched) return;                           // CONTROLE QUE EVITA CHAMADAS DESNECESSÁRIAS
                                                                                
        card.flip();                                                            // ALTERA O ESTADO DA CARTA
        this.flippedCards.push(card);                                           //ADICIONA NO ARRAY DE CARTAS VIRADAS
        this.playAudio(this.selectSong)
        this.updateBoard(index)

        const cName = card.name.split('_')[0]   
 
        this.gameDisplay.header.setCardsInfo(cName, `${card.location.collumn}${card.location.row}`)
        this.gameDisplay.header.updateInfoContainer()
        this.gameDisplay.body.updateDisplayImg(card.src, cName, card.description) 
        this.gameDisplay.footer.updateFooterText(card.description, this.fitTextContect)

        if (this.flippedCards.length === 2) {                                   // VERIFICA A NECESSIDADE DE CONFERIR MATCH
            this.checkForMatch();
        }else{
            this.readText(`${cName}.`)
        }
    }
    checkForMatch() {              // VERIFICA E LIDA COM CASO DE IGUALDADE ENTRE CARTAS VIRADAS E TODAS CARTAS VIRADAS
        const [card1, card2] = this.flippedCards;
        const c1Name = card1.name.split('_')[0]
        const c2Name = card2.name.split('_')[0]
        if (c1Name === c2Name) {
            card1.match();
            card2.match();
            setTimeout(() => this.playAudio(this.successSong), 100)
            this.user.treasures++
            this.gameDisplay.bar.updateBar()
            if(this.user.treasures <= 7)
                this.readText(`${c2Name}. Parabens ${this.user.name} ! você Já tem ${this.user.treasures} tesouros. ${card1.description}`)

        } else {
            const delay = 1000
            this.breakCursor(delay - 100)
            card1.fail()
            card2.fail()
            setTimeout(() => this.playAudio(this.failSong), 100)
            setTimeout(() => {
                card1.fail()
                card2.fail()
                card1.flip()
                card2.flip()
                
                this.flippedCards = []
                this.updateBoard()
                this.readText(`${c2Name}. Não foi dessa vez`)

            }, delay);
        }
        if(this.user.treasures == ( this.size / 2 / this.user.level)){
            this.stopCurrentAudio()
            document.getElementById('gameBoard').style.display = "none"
            this.readText(`${c2Name}. Parabens ! você coletou todos os ${this.user.treasures} tesouros em ${this.gameDisplay.header.getTimer()} segundos ! por isso você ganhou 3 estrelas na fase ${this.user.level + 1}`)

            new LevelScore(this.mainContainer, this.user.name.split(' ')[0], this.gameDisplay.header.getTimer(), this.user.level, this.gainNode, this.audioContext, this)
            this.gameDisplay.handleWin()
        }

        this.flippedCards = [];                                                 // RESETA O ARRAY DE CARTAS VIRADAS
        this.updateBoard();                                                     // ATUALIZA DO JOGO
    }
    updateBoard(firstElemIdx = 0) {     //CRIA OS ELEMENTOS CARD (IMAGEN E CARTÃO) E OS CONFIGURA (EM TODA A ATUALIZAÇÃO OS CARDS SÃO RECRIADOS)
        const board = document.getElementById('gameBoard')
        this.createPauseBtn()

        const elemArry = []
        let elem = gameData.isScreenReaderActive ? 'p' : 'div'

        board.innerHTML = ''
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement(elem);
            const cardImage =  card.element
            
            cardElement.appendChild(cardImage)
            cardElement.addEventListener('focus', () => {
                if(card.isFlipped){
                    let name = card.name.split("_")[0]
                    cardElement.setAttribute('aria-label', `${card.location.collumn}${card.location.row}. ${name}`)
                }
            })
            cardElement.setAttribute('tabindex', card.tabIndex) 
            cardElement.setAttribute('aria-label', `${card.location.collumn}${card.location.row}`) 
            cardImage.setAttribute('alt', card.description) 
            cardImage.setAttribute('title', card.name) 
            cardElement.classList.add('card');


            if (card.isFlipped) cardElement.classList.add('flipped')
            if (card.isMatched) cardElement.classList.add('matched');
            if (card.incorrectMatch) cardElement.classList.add('isNotMatched');

            cardElement.addEventListener('click', (e) => {
                if(this.isClickAble){   
                    this.flipCard(index, e)
                    document.title = `${card.location.collumn}${card.location.row}`
                }
            });
            elemArry.push(cardElement)
            board.appendChild(cardElement);
        })
        this.mapCardsTabindex(firstElemIdx, elemArry)
    }
    fitTextContect(identificador){  // AQUI NÃO É O MELHOR LUGAR PARA ESSA FUNÇÃO
        const elem = document.querySelector(identificador)
        elem.style.fontSize = '1.5rem'
        const parent = elem.parentNode
        const parentHeight = parent.clientHeight
        
        elem.style.transition = 'none'
        
        if(elem.clientHeight > (parentHeight - 20) ){
            $(document).ready(function(){
                $(identificador).fitText(2)
            })
        }
    }
    startGame() {                                   // ATUALIZA AS CARTAS E O DISPLAY INICIANDO ASSIM O JOGO
        this.updateBoard();                             //ATUALIZA AS CARTAS
        this.gameDisplay.header.setCardsInfo('', '')
        this.gameDisplay.header.startClock();
        this.gameDisplay.bar.updateBar()
        this.gameDisplay.update()

        setTimeout(() => {
            this.playAudio(this.mainSong, .5, true)
        }, 1500)
    }
    createPauseBtn(){
        const mainContainer =  document.querySelector('#gameContainer')
        const pauseBtn = document.createElement('button')
        const btnIcon =  document.createElement('icon')
        let label = gameData.isPaused ? 'Play no jogo' : 'Pausar Jogo'
        let iconClass = gameData.isPaused ? 'fa-play' : 'fa-pause'
        
        pauseBtn.setAttribute('class', 'pause_btn controlBtn')
        pauseBtn.setAttribute('id', 'pause')
        pauseBtn.setAttribute('tabindex', '18')
        pauseBtn.setAttribute('aria-label', 'pausar jogo')
        
        btnIcon.setAttribute('class', `fa-solid ${iconClass}`)
        pauseBtn.appendChild(btnIcon)
        mainContainer.appendChild(pauseBtn)
        
        pauseBtn.addEventListener('click', () => {
            toggleIconClass(btnIcon)
            gameData.isPaused = !gameData.isPaused
            if(gameData.isScreenReaderActive){
              toggleDisplay(document.querySelector('#gameControls'), 'flex')
            }
            let status = gameData.isPaused ? 'pausado' : 'liberado'
            this.readText(`O jogo foi ${status}.`)
        })

        function toggleDisplay(element, display){
            let value = element.style.display
            if(value != 'none'){
                element.style.display = 'none'
            }else{
                element.style.display = display
            }
        }
        function toggleIconClass(icon){
            if(btnIcon.classList.contains('fa-pause')){
              btnIcon.classList.remove('fa-pause')
              btnIcon.classList.add('fa-play')
            } else {
              btnIcon.classList.remove('fa-play')
              btnIcon.classList.add('fa-pause')
            }
        }

    }

    replayGame(){       // LIDA COM O USUARIO QUERER REPETIR A FASE
        this.cards = []
        this.user.replayUserGame()
        this.gameDisplay.footer.updateFooterText('Desenvolvido por Wesley Welisten', this.fitTextContect)
        this.generateCards()
        this.startGame()
    }
    breakCursor(timeInMili){            //ALTERNA A HABILITAÇÃO DO CURSOR EM UM INTERVALO X
        this.isClickAble = !this.isClickAble
        setTimeout(() => {
            this.isClickAble = !this.isClickAble
        },timeInMili)
    }
    mapCardsTabindex( firstEle, elemArray){
        let amount = this.size
        let sqrt = Math.sqrt(amount)
        let col = firstEle % 4
        let row = Math.floor(firstEle / 4) 
        let mtSorted =  []

        let aux = 0
        let auxArr = []
        
        for(let i = 0; i < amount; i += sqrt){
            mtSorted.push(this.orderedArray.slice(i, i + sqrt))
        }

        mtSorted.forEach( (array, ) => {
            for(let i = col; i > 0; i--){
                aux = array.pop()
                array.unshift(aux)
            }
        })

        for(let i = row; i > 0; i--){
            aux = mtSorted[4 - i].pop()
            mtSorted[4 - i].unshift(aux)
        }
        for(let i = row; i > 0; i--){
           auxArr =  mtSorted.pop()
           mtSorted.unshift(auxArr)
        }

        mtSorted = mtSorted.flat()
        elemArray.forEach((elem, i) => {
            elem.setAttribute('tabindex', mtSorted[i])
        })
    }
    readText(text, focusEle = null ,textChaining = false){                                       // LIDA COM TEXTOS DE LEITURA ACESSÍVEL IMEDIATA
        if(gameData.lastAccText === text) text += `.`
        const textToReaderEl = document.querySelector('.textToReader')

        textToReaderEl.textContent = textChaining ? `${popupText.textContent} ${text}` : `${text}`
        if(focusEle) focusEle.focus()
        gameData.lastAccText = text
    }       
    toggleLight(){
        const btn = document.querySelector('.lightMode_btn')
        const gameBoard = document.querySelector('#gameBoard')
        if(gameBoard){
            const cardEls = document.querySelectorAll('.card')

            if(btn.classList.contains('active')){
                if(gameBoard){
                    cardEls.forEach(card => {
                        // card.style.border = `3px solid ${colors.blue_card_border}`
                    })
                }
            }else{
                if(gameBoard){
                    cardEls.forEach(card => {
                        // card.style.border = `3px solid ${colors.blue_baby}`
                    })
                }
            }
        }
            
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

export {
    MemoryGame
}
    