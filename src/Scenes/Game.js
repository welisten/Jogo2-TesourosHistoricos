import  { Card }  from '../Class/Card.js';
import  { User }  from '../Class/User.js';
import { valuesObj } from "../Consts/Values.js";

class MemoryGame {
    constructor(size, user_name) {
        this.size = size;
        this.cards = [];
        this.flippedCards = [];
        this.user = new User(user_name)
        this.song = undefined
        this.clock = undefined
        this.time = 0
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
        const infoNome = document.querySelector('.cardName')
        const infoLocation = document.querySelector('.cardLocation')
        
        if (card.isFlipped || card.isMatched) return;
        
        infoNome.textContent = card.value
        infoLocation.textContent = `${card.location.collumn}${card.location.row}`

        card.flip();
        this.flippedCards.push(card);
        this.updateBoard()
        selectSong.play()

        if (this.flippedCards.length === 2) {
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
            accessibleContainer.innerHTML = `<p>Parabens ${this.user.name}! Voçê completou o Jogo em ${this.time - 1 } segundos</p>`
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

    startClock(){
            const clock = document.querySelector('.clock')
            const clockNumber = document.createElement('div')
            const clockSec = document.createElement('span')
            clockNumber.textContent = '00'
            clockSec.textContent = 's'

            clockNumber.classList.add('clockNumbers')
            clockSec.classList.add('clockSecond')

            clock.appendChild(clockNumber)
            clock.appendChild(clockSec)

            this.clock = setInterval(()=>{
                let clockTime = this.time <= 9 ? `0${this.time}` : this.time
                clockNumber.textContent = clockTime
                this.time++
            }, 1000)
    }

    startGame() {
        this.updateBoard();
        this.startClock();
        this.song = new Audio('./Assets/songs/main.wav')
        this.song.loop = true
        this.song.volume = .5
        setTimeout(() => {
            this.song.play()
        }, 1500)
    }
}


export {
    MemoryGame
}