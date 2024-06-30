import  { Card }  from '../Class/Card.js';
import  { User }  from '../Class/User.js';
import { valuesObj } from "../Consts/Values.js";
import { LevelScore } from './LevelScore.js'

class MemoryGame {
    constructor(size, user_name, gameDisplay) {
        this.mainContainer = document.querySelector('#gameContainer')               // SCENE(GAME CONTAINER)
        this.gameContainerElement =  document.querySelector('gameBoard')

        this.size = size                                                        // CARD AMOUNT
        this.cards = []                                                         // CARDS STORE
        this.flippedCards = []                                                  // FLIPPED CARDS STORE
        this.user = new User(user_name)
        this.gameDisplay = gameDisplay
        this.song = undefined
        this.isClickAble = true
        this.generateCards()
        this.presetGameElements()
        
        this.user.updateUser()
        this.gameDisplay.user = this.user
        this.gameDisplay.bar.setBarName(this.user.name.split(' ')[0])
        this.gameDisplay.bar.updateBar()
    }
    presetGameElements(){ //PRÉ CONFIGURAÇÃO E CRIAÇÃO PARA AS REGUAS(HORIZ. VERTI.) E GAMEBOARD RESPECTIVAMENTE
        const rulers = document.querySelectorAll('.ruler')
        rulers.forEach(ruler => ruler.style.display = 'flex')
       
        const board = document.getElementById('gameBoard');
        const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)
        
        board.style.display = 'grid'
        board.style.height = `${containerWidth}px` 
        board.style.width = `${containerWidth}px` 
    }
    generateCards() {              //PREENCHE O ARRAY DE CARDS DE MANEIRA ALEATÓRIA E ARBITRÁRIA COM INSTÂNCIAS DE CARDS
        const values = []
        valuesObj.forEach( value => values.push([value.nome, value.URL, value.description])) //OBTEM OS ATRIBUTOS
        
        const allValues = [...values, ...values];
        allValues.sort(() => Math.random() - 0.5);                              //ORDENA ALEATÓRIA E ARBITRARIALMENTE
        
        let aux = 0

        for(let x = 0; x < 4; x++){                                             // INSTANCIA AS CARTAS POSICIONANDOAS NA RÉGUA HxV
            for(let y = 0; y < 4; y++, aux++){
                switch (y){
                    case 0:
                        this.cards.push(new Card(allValues[aux][0], 'A', x + 1, allValues[aux][1], allValues[aux][2])) 
                        break
                    case 1:
                        this.cards.push(new Card(allValues[aux][0], 'B', x + 1, allValues[aux][1], allValues[aux][2])) 
                        break
                    case 2:
                        this.cards.push(new Card(allValues[aux][0], 'C', x + 1, allValues[aux][1], allValues[aux][2])) 
                        break
                    case 3:
                        this.cards.push(new Card(allValues[aux][0], 'D', x + 1, allValues[aux][1], allValues[aux][2])) 
                        break
                }
                
            }
        }
        // console.log(this.cards)
    }
    flipCard(index) {                                                           // DISPARADO NO CLICK DOS CARDS
        const card = this.cards[index];
        const selectSong = new Audio('./Assets/songs/select.wav')
        
        if (card.isFlipped || card.isMatched) return;                           // CONTROLE QUE EVITA CHAMADAS DESNECESSÁRIAS
                                                                                
        card.flip();                                                            // ALTERA O ESTADO DA CARTA
        this.flippedCards.push(card);                                           //ADICIONA NO ARRAY DE CARTAS VIRADAS
        selectSong.play()
        this.updateBoard()                                                      //ATUALIZA O DISPLAY
        this.gameDisplay.header.setCardsInfo(card.value, `${card.location.collumn}${card.location.row}`)
        this.gameDisplay.header.updateInfoContainer()
        this.gameDisplay.body.updateDisplayImg(card.URL) 
        this.gameDisplay.footer.updateFooterText(card.description, this.fitTextContect)

        if (this.flippedCards.length === 2) {                                   // VERIFICA A NECESSIDADE DE CONFERIR MATCH
            this.checkForMatch();
        }
    }
    checkForMatch() {              // VERIFICA E LIDA COM CASO DE IGUALDADE ENTRE CARTAS VIRADAS E TODAS CARTAS VIRADAS
        const [card1, card2] = this.flippedCards;
        const successSong = new Audio('./Assets/songs/success.mp3')
        const failSong = new Audio('./Assets/songs/fail.mp3')

        if (card1.value === card2.value) {
            card1.match();
            card2.match();
            setTimeout(() => successSong.play(), 100)
            this.user.treasures++
            this.gameDisplay.bar.updateBar()
        } else {
            const delay = 1500
            this.breakCursor(delay)
            card1.fail()
            card2.fail()
            setTimeout(() => failSong.play(), 100)
            setTimeout(() => {
                card1.fail()
                card2.fail()
                card1.flip();
                card2.flip();
                this.updateBoard();
            }, delay);
        }

        if(this.user.treasures == (this.user.treasures / this.user.level)){
            const father = document.querySelector('#gameContainer')
            const gameBoard = document.getElementById('gameBoard')

            this.song.pause()
            gameBoard.style.display = "none"

            new LevelScore(father, this.user.name.split(' ')[0], this.gameDisplay.header.getTimer(), this.user.level, this)
            this.gameDisplay.handleWin()
        }

        this.flippedCards = [];                                                 // RESETA O ARRAY DE CARTAS VIRADAS
        this.updateBoard();                                                     // ATUALIZA DO JOGO
    }
    updateBoard() {//CRIA OS ELEMENTOS CARD (IMAGEN E CARTÃO) E OS CONFIGURA (EM TODA A ATUALIZAÇÃO OS CARDS SÃO RECRIADOS)
        const board = document.getElementById('gameBoard');

        board.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            const cardImage =  document.createElement('img')
            
            cardImage.setAttribute('src', card.URL) 
            cardImage.setAttribute('alt', card.description) 
            cardElement.classList.add('card');
            cardElement.appendChild(cardImage)

            if (card.isFlipped) cardElement.classList.add('flipped');
            if (card.isMatched) cardElement.classList.add('matched');
            if (card.incorrectMatch) cardElement.classList.add('isNotMatched');

            cardElement.addEventListener('click', () => {
                if(this.isClickAble){   
                    this.flipCard(index)
                }
            });
            board.appendChild(cardElement);
        });
        
    }
    fitTextContect(identificador){  // AQUI NÃO É O MELHOR LUGAR PARA ESSA FUNÇÃO
        const elem = document.querySelector(identificador)
        const parent = elem.parentNode
        const parentHeight = parent.clientHeight
        const fontsize = elem.style.fontSize == '2rem' ? '2rem' : elem.style.fontSize
        
        elem.style.transition = 'none'
        
        if(elem.scrollHeight > (parentHeight - 20) ){
            $(document).ready(function(){
                $(identificador).fitText(2)
            })
        }else{
            elem.style.fontSize = fontsize
        }
    }
    startGame() {                                   // ATUALIZA AS CARTAS E O DISPLAY INICIANDO ASSIM O JOGO
        this.updateBoard();                             //ATUALIZA AS CARTAS
        this.gameDisplay.header.setCardsInfo('', '')
        this.gameDisplay.header.startClock();
        this.gameDisplay.bar.updateBar()
        this.gameDisplay.update()

        this.song = new Audio('./Assets/songs/main.wav')
        this.song.loop = true
        this.song.volume = 0.5
        setTimeout(() => {
            this.song.play()
        }, 1500)
    }

    replayGame(){       // LIDA COM O USUARIO QUERER REPETIR A FASE
        this.cards = []
        this.user.replayUserGame()
        this.generateCards()
        this.startGame()
    }
    breakCursor(timeInMili){            //ALTERNA A HABILITAÇÃO DO CURSOR EM UM INTERVALO X
        this.isClickAble = !this.isClickAble
        setTimeout(() => {
            this.isClickAble = !this.isClickAble
        },timeInMili)
    }
}

export {
    MemoryGame
}