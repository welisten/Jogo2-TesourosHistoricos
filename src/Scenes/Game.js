import  { Card }  from '../Class/Card.js';
import  { User }  from '../Class/User.js';
import { valuesObj } from "../Consts/Values.js";
import  {LevelScore} from './LevelScore.js'


class MemoryGame {
    constructor(size, user_name, gameDisplay) {
        this.container = document.querySelector('#gameContainer')
        
        this.size = size;
        this.cards = [];
        this.flippedCards = [];
        this.user = new User(user_name)
        this.gameDisplay = gameDisplay
        this.song = undefined
        this.clock = undefined
        this.generateCards();
        this.setGameDisplay()
        
        this.gameDisplay.bar.setBarName(this.user.name.split(' ')[0])
        this.user.updateUser()
        this.gameDisplay.user = this.user
        this.gameDisplay.bar.updateBar()

        const board = document.createElement('div');
        board.classList.add('gameBoard');
        board.setAttribute('id', 'gameBoard')
        this.container.appendChild(board)
    }
    setGameDisplay(){
        const board = document.getElementById('gameBoard');
        const rulers = document.querySelectorAll('.ruler')
        const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)

        // gameDisplay_header.style.height = '100%'
        
        rulers.forEach(ruler => ruler.style.display = 'flex')
        board.style.display = 'grid'
        board.style.height = `${containerWidth}px` 
        board.style.width = `${containerWidth}px` 
    }
    generateCards() {

        const values = []
        valuesObj.forEach( value => values.push([value.nome, value.URL, value.description]))
        
        const allValues = [...values, ...values];
        allValues.sort(() => Math.random() - 0.5);
        
        let aux = 0
        for(let x = 0; x < 4; x++){
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
                    default:
                    break

                }
                
            }
        }
    }
    flipCard(index) {
        const card = this.cards[index];
        const selectSong = new Audio('./Assets/songs/select.wav')
        
        if (card.isFlipped || card.isMatched) return;
        
        
        this.gameDisplay.header.setCardsInfo(card.value, `${card.location.collumn}${card.location.row}`)
        this.gameDisplay.header.updateInfoContainer()
        this.gameDisplay.body.updateDisplayImg(card.URL) 
        
        this.gameDisplay.footer.updateFooterText(card.description, this.fitTextContect)
        
        card.flip();
        this.flippedCards.push(card);
        this.updateBoard()
        selectSong.play()

        if (this.flippedCards.length === 2) {
            // this.gameDisplay.footer.updateFooterText(card.description, this.fitTextContect)
            this.checkForMatch();
        }
    }
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const successSong = new Audio('./Assets/songs/success.mp3')
        const failSong = new Audio('./Assets/songs/fail.mp3')

        const accessibleContainer = document.querySelector('#gameAccessibleContainer')

        if (card1.value === card2.value) {
            card1.match();
            card2.match();
            setTimeout(() => successSong.play(), 500)
            this.user.treasures++
            this.gameDisplay.bar.updateBar()
        } else {
            card1.fail()
            card2.fail()
            setTimeout(() => failSong.play(), 500)

            setTimeout(() => {
                card1.fail()
                card2.fail()
                card1.flip();
                card2.flip();
                this.updateBoard();
            }, 1500);
        }
        if(this.user.treasures == 8){
            this.song.pause()
            clearInterval(this.clock)
            const father = document.querySelector('#gameContainer')
            const gameBoard = document.getElementById('gameBoard')
            gameBoard.style.display = "none"
            new LevelScore(father, this.user.name.split(' ')[0], this.gameDisplay.header.getTimer(), this.user.level, this)
            this.gameDisplay.handleWin()
        }
        this.flippedCards = [];
        this.updateBoard();
    }
    updateBoard() {
        const accessibleContainer = document.querySelector('#gameAccessibleContainer')
        const board = document.getElementById('gameBoard');

        board.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            const cardImage =  document.createElement('img')
            
            cardImage.src = card.URL
            // cardImage.alt = card.description
            cardElement.classList.add('card');
            cardElement.appendChild(cardImage)

            if (card.isFlipped) cardElement.classList.add('flipped');
            if (card.isMatched) cardElement.classList.add('matched');
            if (card.incorrectMatch) cardElement.classList.add('isNotMatched');

            cardElement.addEventListener('click', () => {
                this.flipCard(index)
            });
            board.appendChild(cardElement);
            if(this.user.treasures < 8)accessibleContainer.innerHTML = `User: ${this.user.name}\nTreasure: ${this.user.treasures}`
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
    startGame() {
        this.updateBoard();
        this.gameDisplay.header.setCardsInfo('', '')
        this.gameDisplay.header.startClock();
        this.gameDisplay.bar.updateBar()
        this.gameDisplay.update()

        this.song = new Audio('./Assets/songs/main.wav')
        this.song.loop = true
        this.song.volume = 0.5 // .5
        setTimeout(() => {
            this.song.play()
        }, 1500)
    }
    resetGame(){
        const board = document.getElementById('gameBoard');
        board.remove()
        // this.cards.forEach(card => card.restore())
        // document.querySelectorAll('.card').forEach((card => {
        //     card.classList.remove('matched')
        // }))
        this.cards = []
        this.flippedCards = [];
        this.user.resetUserGame()
        this.generateCards()
        this.startGame()
    }
}


export {
    MemoryGame
}