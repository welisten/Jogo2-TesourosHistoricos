class LevelScore{
    constructor(father, name, time, level, game ){
        this.father = father
        this.element = ''
        this.userName = name
        this.userTime = time
        this.userLevel = level
        this.game = game

        this.songVictory = new Audio('./Assets/songs/victory.wav')
        this.songApplause = new Audio('./Assets/songs/aplause.wav')
        
        this.songVictory.loop = true
        this.songApplause.loop = true
        this.songVictory.play()
        this.songApplause.play()
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
        const star1 = document.createElement('img')
        const star2 = document.createElement('img')
        const star3 = document.createElement('img')

        this.handleScore(this.userTime, this.userLevel, star1, star2, star3)

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

        const levelImg = document.createElement('img')
        const clockImg = document.createElement('img')

        levelImg.setAttribute('src', './Assets/imgs/level.png')
        clockImg.setAttribute('src', './Assets/imgs/clock.png')
        
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
            this.songVictory.pause()
            this.songApplause.pause()
        
            const transitionSong = new Audio('./Assets/songs/intro.wav') 
            const gameBoard = document.getElementById('gameBoard')
            
            gameBoard.style.display = "grid"
            this.element.style.display = 'none'
            
            this.game.replayGame()
            this.game.setGameDisplay()

            transitionSong.play()
        })
    }
    handleScore(time, level, star1, star2, star3){ //DEFINE AS ESTRELAS NO CORPO DO PAINEL
        const userTime = time
        const factor = Number(level) + 1
        const maxTime = 100
        const minTime = maxTime - (10 * factor)
        
        if(userTime < minTime){
            star1.setAttribute('src', './Assets/imgs/goldStar.png')
            star2.setAttribute('src', './Assets/imgs/goldStar.png')
            star3.setAttribute('src', './Assets/imgs/goldStar.png')
        }else if(userTime < (minTime + 10)){
            star1.setAttribute('src', './Assets/imgs/goldStar.png')
            star2.setAttribute('src', './Assets/imgs/goldStar.png')
            star3.setAttribute('src', './Assets/imgs/stellStar.png')
        } else if(userTime < maxTime){
            star1.setAttribute('src', './Assets/imgs/goldStar.png')
            star2.setAttribute('src', './Assets/imgs/stellStar.png')
            star3.setAttribute('src', './Assets/imgs/stellStar.png')
        }else{
            star1.setAttribute('src', './Assets/imgs/stellStar.png')
            star2.setAttribute('src', './Assets/imgs/stellStar.png')
            star3.setAttribute('src', './Assets/imgs/stellStar.png')
        }
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
}

export{
    LevelScore
}