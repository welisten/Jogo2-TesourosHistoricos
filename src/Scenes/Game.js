import  { Card }  from '../Class/Card.js';
import  { User }  from '../Class/User.js';
import { valuesObj } from "../Consts/Values.js";

class MemoryGame {
    constructor(size) {
        this.size = size;
        this.cards = [];
        this.flippedCards = [];
        this.user = new User('Wesley')
        this.song = undefined
        this.generateCards();
        this.song.play()
    }


    generateCards() {
        const values = []
        valuesObj.forEach( value => values.push([value.nome, value.URL, value.description]))
        
        const allValues = [...values, ...values];
        allValues.sort(() => Math.random() - 0.5);
        console.log(allValues)

        for(let x = 0; x < 4; x++){
            for(let y = 0; y < 4; y++){
                this.cards = allValues.map(value => new Card(value[0], x, y, value[1], value[2]));
            }
        }
    }

    flipCard(index) {
        const card = this.cards[index];
        const selectSong = new Audio('./Assets/songs/select.wav')

        if (card.isFlipped || card.isMatched) return;

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
            accessibleContainer.innerHTML = `<p>Parabens ${this.user.name}, Você Venceu</p>`
            this.song.pause()
            
            victorySong.play()
            victorySong.loop = true
            
            aplauseSong.play()
            aplauseSong.loop = true
        }
        this.flippedCards = [];
        this.updateBoard();
    }

    updateBoard() {
        const board = document.getElementById('gameBoard');
        // const boardWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)
        const accessibleContainer = document.querySelector('#gameAccessibleContainer')
        
        board.innerHTML = '';
        // board.style.width = `${boardWidth}px`
        // board.style.height = `${boardWidth}px`
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            const cardImage =  document.createElement('img')
            
            cardImage.src = card.URL
            // cardImage.alt = card.description
            cardElement.classList.add('card');
            cardElement.appendChild(cardImage)

            if (card.isFlipped) cardElement.classList.add('flipped');
            if (card.isMatched) cardElement.classList.add('matched');
            if (card.isNotMatched) cardElement.classList.add('isNotMatched');

            cardElement.addEventListener('click', () => this.flipCard(index));
            board.appendChild(cardElement);
            if(this.user.treasure < 8)accessibleContainer.innerHTML = `User: ${this.user.name}\nTreasure: ${this.user.treasure}`
        });
        
    }

    startGame() {
        this.updateBoard();
        this.song = new Audio('./Assets/songs/main.wav')
        this.song.loop = true
        this.song.volume = .5
    }
}


export {
    MemoryGame
}