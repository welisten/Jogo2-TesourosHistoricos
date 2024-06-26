import  { Card }  from '../Class/Card.js';
import  { User }  from '../Class/User.js';
import { valuesObj } from "../Consts/Values.js";
// import  { DisplayHeader } from '../Class/DisplayHeader.js'

class MemoryGame {
    constructor(size, user_name, gameDisplay) {
        this.container = document.querySelector('#gameContainer')
        this.size = size;
        this.cards = [];
        this.flippedCards = [];
        this.lastFlippedCard = undefined
        this.user = new User(user_name)
        this.gameDisplay = gameDisplay
        this.song = undefined
        this.clock = undefined
        this.level = 0
        this.generateCards();
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
        this.gameDisplay.header.updateInfo()
        this.gameDisplay.body.updateImg(card.URL) 
        
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
        const victorySong = new Audio('./Assets/songs/victory.wav')
        const aplauseSong = new Audio('./Assets/songs/aplause.wav')
        const accessibleContainer = document.querySelector('#gameAccessibleContainer')

        if (card1.value === card2.value) {
            card1.match();
            card2.match();
            setTimeout(() => successSong.play(), 500)
            this.user.treasure++
            this.gameDisplay.bar.updateTreasures(this.user.treasure)
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
        if(this.user.treasure == 8){
            this.song.pause()
            
            victorySong.play()
            victorySong.loop = true
            
            aplauseSong.play()
            aplauseSong.loop = true

            clearInterval(this.clock)
        }
        this.flippedCards = [];
        this.updateBoard();
    }

    updateBoard() {
        const board = document.getElementById('gameBoard');
        const accessibleContainer = document.querySelector('#gameAccessibleContainer')
        
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
            if(this.user.treasure < 8)accessibleContainer.innerHTML = `User: ${this.user.name}\nTreasure: ${this.user.treasure}`
        });
        
    }
    fitTextContect(identificador){
        const elem = document.querySelector(identificador)
        const parent = elem.parentNode
        const parentHeight = parent.clientHeight
        const fontsize = elem.style.fontSize == '2rem' ? '2rem' : elem.style.fontSize
        elem.style.transition = 'none'
        if(elem.scrollHeight > (parentHeight - 20) ){
            $(document).ready(function(){
                console.log(elem.scrollHeight,(parentHeight - 20), elem)
                console.log('confere')
                $(identificador).fitText(2)
            })
        }else{
            elem.style.fontSize = fontsize
            console.log(elem.scrollHeight,(parentHeight - 20), elem)
            console.log('não confere')

        }
    }
    startClock(){
            this.clock = setInterval(()=>{
                this.gameDisplay.header.increaseTimer(1)
                this.gameDisplay.header.updateClock()
            }, 1000)
    }

    startGame() {
        // console.log(JQuery)
        this.level = 1
        this.updateBoard();
        this.gameDisplay.header.setCardsInfo('', '')
        this.gameDisplay.header.setTimer(0)
        this.gameDisplay.update()
        this.gameDisplay.bar.updateLevel(this.level)
        this.gameDisplay.bar.updateName(this.user.name.split(' ')[0])
        this.startClock();

        this.song = new Audio('./Assets/songs/main.wav')
        this.song.loop = true
        this.song.volume = 0.5 // .5
        setTimeout(() => {
            this.song.play()
        }, 1500)
    }
}


export {
    MemoryGame
}