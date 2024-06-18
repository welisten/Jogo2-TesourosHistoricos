class Card {
    constructor(value, collumn, row) {
        this.value = value;
        this.description = '',
        this.URL = '',
        this.location = {row: row, collumn: collumn}
        this.isFlipped = false;
        this.isMatched = false;
    }

    flip() {
        this.isFlipped = !this.isFlipped;
    }

    match() {
        this.isMatched = true;
    }
}

export {
    Card
}