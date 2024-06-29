
class Card {
    constructor(value, collumn, row, URL, description) {
        this.value = value;
        this.description = description,
        this.URL = URL,
        this.location = {row: row, collumn: collumn}
        this.isFlipped = false;
        this.isMatched = false;
        this.incorrectMatch= false
    }
    flip() {
        this.isFlipped = !this.isFlipped;
    }
    match() {
        this.isMatched = true;
    }
    fail() {
        this.incorrectMatch = !this.incorrectMatch
    }
    restore() {  //coloca o user em seu estado inicial
        this.isFlipped = false
        this.isMatched = false
        this.incorrectMatch = false
    }
    // toggleLight -> é mais facil o jogo ficar responsavel por alternar a cor das cartas do que atribuir essa função para cada carta separadamenta
}

export {
    Card
}