import { gameData } from "../script.js"

class LevelScore{
    constructor(father, name, time, level, gainNode, audioContext, game ){
        this.father = father
        this.element = ''
        this.userName = name
        this.userTime = time
        this.userLevel = level
        this.game = game
        this.audioContext = audioContext                             // ASIDE GAME ACCESSIBLE CONTAINER

        this.songVictory =  gameAssets['victory']
        this.songApplause = gameAssets['aplause']
        this.transitionSong = gameAssets['transition']
        this.currentAudio = []
        this.gainNode = gainNode

        this.playAudio( this.songVictory, 1.0, true )
        this.playAudio( this.songApplause, 1.0, true )
        this.generatePainel()
    }

    generatePainel(){                   //CRIA OS ELEMENTOS DOM DO PAINEL DO SCORE (INCLUINDO O HEADER)
        const container = document.createElement('div')
        const painelHeader = document.createElement('div')
        const title = document.createElement('span')
        const painelBody = document.createElement('div')
        const painelFooter = document.createElement('div')
        
        this.element = document.createElement('div')
        this.element.setAttribute('id', 'levelScore')
        this.element.classList.add('levelScore')
        
        container.classList.add('scoreContainer')
        painelHeader.classList.add('scoreHeader')
        title.classList.add('scoreTitle')
        title.classList.add('FIT')
        painelBody.classList.add('scoreBody')
        painelFooter.classList.add('scoreFooter')

        painelHeader.appendChild(title)
        container.appendChild(painelHeader)
        container.appendChild(painelBody)
        container.appendChild(painelFooter)
        this.element.appendChild(container)
        this.father.appendChild(this.element)

        title.textContent = `Parabens ${this.userName}`
        this.fitTextContect('.scoreTitle')
        
        this.generateBody(painelBody)
        this.generateFooter(painelFooter)
    }
    generateBody(father){               // PREENCHE OS ELEMENTOS DO CORPO DO PAINEL
        const star1Container = document.createElement('div')
        const star2Container = document.createElement('div')
        const star3Container = document.createElement('div')

        let [star1, star2, star3] = this.handleScore(this.userTime, this.userLevel)

        star1Container.classList.add('star1')
        star2Container.classList.add('star2')
        star3Container.classList.add('star3')

        star1Container.appendChild(star1)
        star2Container.appendChild(star2)
        star3Container.appendChild(star3)

        father.appendChild(star1Container)
        father.appendChild(star2Container)
        father.appendChild(star3Container)

    }
    generateFooter(father){             // PREENCHE OS ELEMENTOS DO RODAPÉ DO PAINEL
        const btnsContainer = document.createElement('div')
        const gameInfo = document.createElement('div')

        gameInfo.classList.add('footerInfo')
        const timeInfo = document.createElement('div')
        const levelInfo = document.createElement('div')

        levelInfo.classList.add('levelInfo')
        timeInfo.classList.add('timeInfo')
        
        levelInfo.innerHTML = `Level <span>${this.userLevel}</span>`
        timeInfo.innerHTML = `<span>${this.userTime}s</span>`

        const levelImg = this.getImage('level')
        const clockImg = this.getImage('clock')

        
        levelInfo.appendChild(levelImg)
        timeInfo.appendChild(clockImg)

        gameInfo.appendChild(levelInfo)
        gameInfo.appendChild(timeInfo)

        btnsContainer.classList.add('btnsContainer')
        const btnReplay = document.createElement('button')
        const btnNext = document.createElement('button')
        
        btnReplay.classList.add('btnReplay')
        btnReplay.classList.add('fa-solid')
        btnReplay.classList.add('fa-repeat')

        btnNext.classList.add('btnNext')
        btnNext.classList.add('fa-solid')
        btnNext.classList.add('fa-forward')

        btnsContainer.appendChild(btnReplay)
        btnsContainer.appendChild(btnNext)
  
        father.appendChild(gameInfo)
        father.appendChild(btnsContainer)
        btnReplay.addEventListener('click', (e) => {
            this.stopCurrentAudio()
        
            const gameBoard = document.getElementById('gameBoard')
            
            gameBoard.style.display = "grid"
            this.element.style.display = 'none'
            
            this.game.gameDisplay.body.reset()
            this.game.presetGameElements()
            this.game.replayGame()
            this.playAudio(this.transitionSong)
        })
    }
    handleScore(time, level){ //DEFINE AS ESTRELAS NO CORPO DO PAINEL
        const userTime = time
        const factor = Number(level) + 1
        const maxTime = 100
        const minTime = maxTime - (10 * factor)

        let star1 = null
        let star2 = null
        let star3 = null
        
        if(userTime < minTime){
            star1 = this.getImage('golden star 1')
            star2 = this.getImage('golden star 2')
            star3 = this.getImage('golden star 3')
        }else if(userTime < (minTime + 10)){
            star1 = this.getImage('golden star 1')
            star2 = this.getImage('golden star 2')
            star3 = this.getImage('steel star 3')
        } else if(userTime < maxTime){
            star1 = this.getImage('golden star 1')
            star2 = this.getImage('steel star 2')
            star3 = this.getImage('steel star 3')
        }else{
            star1 = this.getImage('steel star 1')
            star2 = this.getImage('steel star 2')
            star3 = this.getImage('steel star 3')
        }
        return [star1, star2, star3];
    }
    getImage(name){                 // RETORNA A IMAGEM DO OBJ GLOBAL, ARMAZENADA NO PRELOAD (BLOB)
        return gameAssets[name]
    }
    fitTextContect(identificador){ // IDENTIFICA OVERFLOW DE TEXTO EM RELAÇÃO AO SEU PAI E CORRIGE TAMANHO DA FONTE
        const elem = document.querySelector(identificador)
        const parent = elem.parentNode
        const parentHeight = parent.offsetHeight
        const parentWidth = parent.offsetWidth
        elem.style.transition = 'none'
        elem.style.fontSize = `11rem`
        if((elem.offsetHeight * 1.2) > (parentHeight) || (elem.offsetWidth * 1.2) > parentWidth){
            $(document).ready(function(){
                $(identificador).fitText(1.5)
            })
        }
    }
    destroyScore(){ // ELIMINA ELEMENTO E SEUS FILHOS
        this.element.style.display = 'none'
        this.father.remove(this.element)
    }
    playAudio(audioBuffer, volume = 1.0, loop = false){
        const src = this.audioContext.createBufferSource()
        src.buffer = audioBuffer
        src.loop = loop

        volume = gameData.isMute === true ? 0 : 1
        this.gainNode.gain.value = volume 
        
        src.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.destination)
        src.start()
        if(loop === true )this.currentAudio.push(src)
    }
    stopCurrentAudio(){
        if(this.currentAudio.length > 0) {
            this.currentAudio.forEach(audio => audio.stop())
            this.currentAudio = []
        }
    }
}

export{
    LevelScore
}