// import  Card  from "../Class/Card";
// import { valuesObj } from "../Consts/Values";
const valuesObj = [
    {
        id: 1,
        nome: 'Parque Nacional da Serra dos Órgãos',
        description: 'Um dos principais parques nacionais do Brasil, conhecido por suas formações rochosas, trilhas e biodiversidade',
        URL: './Assets/imgs/parqueNacionalSerraOrgaos1536x864.jpg'
    },
    {
        id: 2,
        nome: 'Concordia',
        description: 'Um dos lugares mais bonitos da cidade foi “descoberto” recentemente, quando foi criada a primeira agência de turismo do município, em junho de 2015',
        URL: './Assets/imgs/concordia.jpg'
    },
    {
        id: 3,
        nome: 'Capela de Nossa Senhora da Ajuda',
        description: 'Uma Capela histórica localizada no centro de Guapimirim, importante para a comunidade local',
        URL: './Assets/imgs/capela_nossa_senhora_dajuda_guapimirim.jpg'
    },
    {
        id: 4,
        nome: 'Pico Dedo de Deus',
        description: 'Uma formação rochosa icônica e cartão postal da região, muito procurada por alpinistas e amantes da natureza.',
        URL: './Assets/imgs/dedo-de-deus.jpg'
    },
    {
        id: 5,
        nome: 'Capoeira',
        description: 'A prática da capoeira, que é uma expressão cultural importante na região, integrando música, dança e artes marciais.',
        URL: './Assets/imgs/capoeira.jpg'
    },
    {
        id: 6,
        nome: 'Capela de Nossa Senhora da Conceição',
        description: 'A Capela de Nossa Senhora da Conceição, em Guapimirim-RJ, foi construída em 1713, numa pequena ilha fluvial entre dois braços do Rio Soberbo, no Parque da Serra dos Órgãos.',
        URL: './Assets/imgs/capela_nossa_senhora_conceicao.jpg'
    },
    {
        id: 7,
        nome: 'Ferrovia',
        description: ' Inaugurada em 1898, essa linha ferroviária conecta o município de Guapimirim ao Rio de Janeiro, facilitando o transporte de pessoas e mercadorias.',
        URL: './Assets/imgs/Trem_na_estação_Guapimirim.jpg'
    },
    {
        id: 8,
        nome: 'APA',
        description: 'A Área de Proteção Ambiental (APA) de Guapimirim, criada em 1984, é uma importante unidade de conservação localizada no estado do Rio de Janeiro. Abrangendo manguezais, rios, e áreas de restinga, a APA protege uma rica biodiversidade e diversos ecossistemas costeiros e marinhos.',
        URL: './Assets/imgs/apa.jpeg'
    }
]

class Card {
    constructor(value, collumn, row, URL, description) {
        this.value = value;
        this.description = description,
        this.URL = URL,
        this.location = {row: row, collumn: collumn}
        this.isFlipped = false;
        this.isMatched = false;
        this.isSelected = true;
    }

    flip() {
        this.isFlipped = !this.isFlipped;
    }

    match() {
        this.isMatched = true;
    }
}

class MemoryGame {
    constructor(size) {
        this.size = size;
        this.cards = [];
        this.flippedCards = [];
        this.generateCards();
    }

    generateCards() {
        const values = []
        valuesObj.forEach( value => values.push([value.nome, value.URL, value.description]))
        // const values = Array.from({ length: this.size / 2 }, (_, i) => i + 1);
        const allValues = [...values, ...values];
        allValues.sort(() => Math.random() - 0.5);

        let aux = 0
        for(let x = 0; x < 4; x++){
            for(let y = 0; y < 4; y++){
                this.cards = allValues.map(value => new Card(value[0], x, y, value[1], value[2]));
                aux++
            }
        }
        aux = 0
    }

    flipCard(index) {
        const card = this.cards[index];
        if (card.isFlipped || card.isMatched) return;

        card.flip();
        this.flippedCards.push(card);
        this.updateBoard()

        if (this.flippedCards.length === 2) {
            this.checkForMatch();
        }
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.value === card2.value) {
            card1.match();
            card2.match();
        } else {
            setTimeout(() => {
                card1.flip();
                card2.flip();
                this.updateBoard();
            }, 1000);
        }

        this.flippedCards = [];
        this.updateBoard();
    }

    updateBoard() {
        const board = document.getElementById('gameContainer');
        const boardWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.5)
        const boardHeight = 540 

        board.innerHTML = '';
        board.style.width = `${boardWidth}px`
        board.style.height = `${boardWidth}px`
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            const cardImage =  document.createElement('img')
            
            cardImage.src = card.URL
            // cardImage.alt = card.description
            cardElement.classList.add('card');
            cardElement.appendChild(cardImage)

            if (card.isFlipped) cardElement.classList.add('flipped');
            if (card.isMatched) cardElement.classList.add('matched');
            // cardElement.innerText = card.isFlipped || card.isMatched ? card.value : '';
            cardElement.addEventListener('click', () => this.flipCard(index));
            board.appendChild(cardElement);
        });
    }

    startGame() {
        this.updateBoard();
    }
}

const game = new MemoryGame(16);
game.startGame();