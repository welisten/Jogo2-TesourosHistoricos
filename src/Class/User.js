class User {
    constructor(nome){
        this.name = nome
        this.treasures = 0
        this.level = 1
    }
    // os getter e setter foram construidos para o meomento onde atributos serão privados
    getNome(){
        return this.nome
    }
    getTreasures(){
        return this.treasures
    }
    getLevel(){
        return this.nome
    }

    setName(name){
        this.name = name
    }
    setLevel(level){
        this.level = level
    }
    
    updateTreasures(){
        this.treasures++
    }
    updateUser(){
        this.level++
    }

    replayUserGame(){
        this.treasures -= 8
        this.level -= 1
    }
}

export {
    User
}