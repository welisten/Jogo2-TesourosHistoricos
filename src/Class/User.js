class User {
    constructor(nome){
        this.name = nome
        this.time = 0
        this.treasure = 0
        this.clock = null
    }

    getNome(){
        return this.nome
    }

    increaseTreasure(){
        this.treasure++
    }

    startClock(){
        this.clock = setInterval(() => this.tempo++, 1000)
    }

    killClock(){
        clearInterval(this.clock)
    }
}

export {
    User
}