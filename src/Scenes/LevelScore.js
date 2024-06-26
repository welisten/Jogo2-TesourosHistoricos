class LevelScore{
    constructor(father, name, time,){
        this.father = father
        this.element = ''
        this.userName = name
        this.levelTime = time
        this.generatePainel()
    }

    generatePainel(){
        this.element = document.createElement('div')
        this.element.setAttribute('id', 'levelScore')
        this.element.classList.add('levelScore')
        
        const container = document.createElement('div')
        const painelHeader = document.createElement('div')
        const painelBody = document.createElement('div')
        const painelFooter = document.createElement('div')
        const title = document.createElement('span')

        title.classList.add('scoreTitle')
        title.classList.add('FIT')
        container.classList.add('scoreContainer')
        painelHeader.classList.add('scoreHeader')
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
    }

    generateBody(father){
        const star1Container = document.createElement('div')
        const star2Container = document.createElement('div')
        const star3Container = document.createElement('div')
        const star1 = document.createElement('img')
        const star2 = document.createElement('img')
        const star3 = document.createElement('img')

        star1.setAttribute('src', './Assets/imgs/goldStar.png')
        star2.setAttribute('src', './Assets/imgs/goldStar.png')
        star3.setAttribute('src', './Assets/imgs/goldStar.png')

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
    fitTextContect(identificador){
        const elem = document.querySelector(identificador)
        const parent = elem.parentNode
        const parentHeight = parent.offsetHeight
        const parentWidth = parent.offsetWidth
        elem.style.transition = 'none'
        elem.style.fontSize = `11rem`
        if((elem.offsetHeight * 1.2) > (parentHeight) || (elem.offsetWidth * 1.2) > parentWidth){
            $(document).ready(function(){
                $(identificador).fitText(1.5)
                console.log('confere')
            })
        }else console.log('não confere');
    }
    // createHeader(father){
    //     const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    //     const PATH = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    //     const TEXT = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    //     const TEXTPATH = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')

    //     SVG.setAttribute('width','100%')
    //     SVG.setAttribute('height','100%')
        
    //     PATH.setAttribute('id','curve')
    //     PATH.setAttribute('d',"m10 70 c 52 -30, 104 -30, 110 -30 s 142 -10, 210 30")
    //     PATH.setAttribute('fill','transparent')
    //     PATH.setAttribute('stroke','#fff')

    //     TEXT.setAttribute('class', 'curved-text')

    //     TEXTPATH.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#curve')

    //     TEXT.appendChild(TEXTPATH)
    //     SVG.appendChild(PATH)
    //     SVG.appendChild(TEXT)
    //     father.appendChild(SVG)

    // }
}

export{
    LevelScore
}