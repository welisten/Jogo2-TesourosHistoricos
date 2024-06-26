class GameDisplay{
    constructor(father){
        this.father = father
        this.element = document.getElementById('gameDisplay')
        this.LibrasBtn =  document.querySelector('.libras_btn')
        this.LightBtn =  document.querySelector('.lightMode_btn')
        this.header = new DisplayHeader(this.element) 
        this.bar = new DisplayBar(this.element) 
        this.body = new DisplayBody(this.element) 
        this.footer = new DisplayFooter(this.element) 
        this.generateGameDisplay()
    }

    generateGameDisplay(){
        this.father.appendChild(this.element)
        
        const GBLine1 = document.createElement('div')
        const GBLine2 = document.createElement('div')
        const GBLine3 = document.createElement('div')
        
        GBLine1.classList.add('line')
        GBLine2.classList.add('line')
        GBLine3.classList.add('line')
        
        GBLine1.style.display = 'absolute'
        GBLine2.style.display = 'absolute'
        GBLine3.style.display = 'absolute'
        
        this.header.element.appendChild(GBLine1)
        this.bar.element.appendChild(GBLine2)
        this.body.element.appendChild(GBLine3)
        
        this.LibrasBtn.addEventListener('click', (e)=>{
            e.preventDefault()
            this.toggleDisplayLines()
        })
    }
    
    toggleDisplay(){
        if(this.LibrasBtn.classList.contains('active')){
            this.element.style.height = '25%' 
            setTimeout(()=>{this.element.style.margin = '12% 0 0 '},50) 
            this.bar.toggleDisplayBar()
            this.body.toggleDisplayBody()
            this.footer.toggleDisplayFooter()

            
        }else{
            this.header.element.style.transition = 'none'
            setTimeout(()=>{
                this.element.style.height = '100%'
                this.element.style.margin = '0'
            }, 1000)
            this.bar.toggleDisplayBar()
            this.body.toggleDisplayBody()
            this.footer.toggleDisplayFooter()
        }   
    }
    toggleLight(){
        if(this.LightBtn.classList.contains('active')){
            this.header.info.forEach(elem => elem.style.fontWeight = '100')
            this.footer.element.style.fontWeight = '100'
            this.bar.element.style.fontWeight = '200'
            // this.header.element.style.fontWeight = '    00'

            this.element.style.backgroundColor = '#ffffff10'
            this.element.style.border = '1px solid #3498db'
            
            this.header.info[0].style.color = '#efefef'
            this.header.info[1].style.color = '#efefef'
            this.header.clock.style.border = '2px solid #ffffff56'
            this.bar.element.style.color = '#efefef'
            this.body.element.style.color = '#efefef'
            this.body.imgContainer.style.border = '2px solid #ffffff56'
            this.footer.element.style.color = '#efefef'

            document.querySelectorAll('.line').forEach((line) => {
                line.style.borderBottom = '1px solid #ffffff80'
                // line.style.borderBottom = '1px solid #3498dg10'
            })

            this.header.clock.style.backgroundColor = 'var(--body-color-dark)'
            this.body.imgContainer.style.backgroundColor = 'var(--body-color-dark)'
        }
        else
        {
            this.header.info.forEach(elem => elem.style.fontWeight = '300')
            this.footer.element.style.fontWeight = '300'
            this.bar.element.style.fontWeight = '300'
            
            this.element.style.backgroundColor = '#ffffff'
            this.element.style.border = '3px solid #3498db'
            // 
            this.header.info[0].style.color = '#3e3e3f'
            this.header.info[1].style.color = '#3e3e3f'
            this.header.clock.style.border = '2px solid #056db3'
            this.bar.element.style.color = '#3e3e3f'
            this.body.element.style.color = '#3e3e3f'
            this.body.imgContainer.style.border = '2px solid #056db3'
            this.footer.element.style.color = '#3e3e3f'

            document.querySelectorAll('.line').forEach((line) => {
                line.style.borderBottom = '1px solid #056db3'
            })

            this.header.clock.style.backgroundColor = '#3498db'
            this.body.imgContainer.style.backgroundColor = '#3498db80'
        }
    }
    toggleDisplayLines(){
        if(!this.LibrasBtn.classList.contains('active')){
            setTimeout(() => {
                document.querySelectorAll('.line').forEach((line) => {
                    line.style.display = 'none'
                })
            }, 10)
        }else{   
            setTimeout(() => {
                document.querySelectorAll('.line').forEach((line) => {
                    line.style.display = 'block'
                })
            }, 1000)   
        }
    }

    increaseHeaderClock(value){
        this.header.increaseTimer(value)
    }
    
    setHeaderInfo(name, location){
        this.header.cardName = name
        this.header.cardLocation = location
    }

    update(){
        this.header.updateClock()
        this.header.updateInfo()
    }
}

class DisplayHeader{                // ESSA CLASSE SE DIFERENCIA DAS DEMAIS, REFATORAÇÃO É NECESSARIA
    constructor(father){
        this.timer = '00'
        this.cardName = 'Precione Iniciar para começar.'
        this.cardLocation = '<3'
        this.father = father
        this.element = ''
        this.clock = ''
        this.info = []
        this.generateHeaderDisplay()
    }

    generateHeaderDisplay(){

        this.element = document.createElement('div')
        this.clock = document.createElement('div')
        const infoContainer = document.createElement('div')
        const cardName = document.createElement('div')
        const cardLocation = document.createElement('div')
        const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)
        this.info[0] = cardName
        this.info[1] = cardLocation

        
        this.element.setAttribute('id', 'gameDisplay_header')
        this.element.classList.add('gameDisplay_header')
        this.clock.classList.add('clock')
        infoContainer.classList.add('info')
        cardName.classList.add('cardName')
        cardLocation.classList.add('cardLocation')

        this.clock.style.height = `${containerWidth * 0.21}px`
        this.clock.style.width = `${containerWidth * 0.19}px`

        infoContainer.style.height = `${containerWidth * 0.23}px`
        this.element.style.height = `${containerWidth * 0.25}px`

        infoContainer.appendChild(cardName)
        infoContainer.appendChild( cardLocation)
        this.element.appendChild(this.clock)
        this.element.appendChild(infoContainer)
        this.father.appendChild(this.element)
        
        this.updateClock()
        this.clock.innerHTML = '--<i class = "fa-regular fa-clock"></i>'
        cardName.innerHTML = this.cardName
        cardLocation.innerHTML = this.cardLocation
    }

    updateClock(){
        this.clock = document.querySelector('.clock')
        this.clock.innerHTML = `<div class="clockNumber">${this.timer <= 9 ? `0${this.timer}` : this.timer}</div><span class= clockSecond>s</span><i class = "fa-regular fa-clock"></i>`
    }

    updateInfo(){
        let cardName = document.querySelector('.cardName')
        let cardLocation = document.querySelector('.cardLocation')

        cardName.textContent = this.cardName
        cardLocation.textContent =  this.cardLocation
    }
    increaseTimer(value){
        if(typeof this.timer != 'number'){
            this.timer = 0
        }
        this.timer += value
    }
    setTimer(value){ // POR ENQUANTO SENDO USADA EM APENAS UM LOCAL'
        this.timer = value
    }
    setCardsInfo(name, location){
        this.cardName = name
        this.cardLocation = location
    }
}

class DisplayBar{
    constructor(father){
        this.father = father
        this.element = ''
        this.LibrasBtn =  document.querySelector('.libras_btn')
        this.userName = '--'
        this.userTreasures = 0
        this.userLevel = 0
        this.generateBar()
    }

    generateBar(){

        this.element =  document.createElement('div')
        const userName =  document.createElement('div')
        const userTreasures =  document.createElement('div')
        const userLevel = document.createElement('div')
        const treasure = document.createElement('img')
        const treasureNumber = document.createElement('span')
        
        treasure.src = './Assets/imgs/treasure.png'
        treasure.alt = 'tesouros coletados' 
        treasureNumber.innerText = this.userTreasures
        treasureNumber.classList.add('treasuresNumber')
        treasure.classList.add('treasure')
        
        this.element.setAttribute('id', 'gameDisplay_bar')
        this.element.classList.add('this.element')
        userName.classList.add('userName')
        userTreasures.classList.add('userTreasure')
        userLevel.classList.add('userLevel')

        userTreasures.appendChild(treasureNumber)
        userTreasures.appendChild(treasure)
        this.element.appendChild(userName)
        this.element.appendChild(userTreasures)
        this.element.appendChild(userLevel)
        this.father.appendChild(this.element)

        this.element.style.display = 'flex'

        this.updateLevel(this.userLevel)
        this.updateName(this.userName)

    }
    updateTreasures(value){
        document.querySelector('.treasuresNumber').innerHTML = value
    }
    updateLevel(value){
        document.querySelector('.userLevel').innerHTML = `level ${value}`
    }
    updateName(value){
        document.querySelector('.userName').innerHTML = value
    }
    toggleDisplayBar(){
        if(this.LibrasBtn.classList.contains('active')){
            setTimeout(() => {
                this.element.style.display = 'none'
                document.querySelector('.treasuresNumber').style.display = 'none'
                document.querySelector('.treasure').style.display = 'none'
                document.querySelector('.userLevel').style.display = 'none'
                document.querySelector('.userName').style.display = 'none'
            }, 10)
        } else {
            setTimeout(() => {
                this.element.style.display = 'flex'
                document.querySelector('.treasuresNumber').style.display = 'inline'
                document.querySelector('.treasure').style.display = 'inline-block'
                document.querySelector('.userLevel').style.display = 'inline-block'
                document.querySelector('.userName').style.display = 'inline-block'
            }, 1500)
        }
    }
}

class DisplayBody{
    constructor(father){
        this.father = father
        this.element = ''
        this.LibrasBtn =  document.querySelector('.libras_btn')
        this.img = ''
        this.imgContainer = ''
        this.lastImg = ''
        this.generateBody()
    }

    generateBody(){
        this.element = document.createElement('div')
        this.element.classList.add('gameDisplay_body')
        this.element.setAttribute('id','gameDisplay_body' )  
        this.father.appendChild(this.element)

        this.imgContainer = document.createElement('div')
        this.img =  document.createElement('img')

        this.img.classList.add('bodyImg')
        this.imgContainer.classList.add('bodyImg_Container')
        
        this.element.appendChild(this.imgContainer)
        this.imgContainer.appendChild(this.img)
        
        this.element.style.display = 'flex'
    }

    updateImg(url){
        document.querySelector('.bodyImg').setAttribute('src', url)
    }

    toggleDisplayBody(){
        if(this.LibrasBtn.classList.contains('active')){
            // todos somem
            setTimeout(() => {
                this.element.style.display = 'none'
                this.imgContainer.style.display = 'none'
                this.img.style.display = 'none'
            }, 10)
        }else{
            // todos aparecem
            setTimeout(() => {
            this.element.style.display = 'flex'
            this.imgContainer.style.display = 'block'
            this.img.style.display = 'block'
            }, 1500)
        }
    }
}

class DisplayFooter{
    constructor(father){
        this.father = father
        this.element = undefined
        this.LibrasBtn = document.querySelector('.libras_btn')
        this.footerText = 'Desenvolvido por Wesley Welisten'
        this.generateFooter()
    }

    generateFooter(){
        this.element = document.createElement('div')
        const paragraf = document.createElement('p')
        
        this.element.appendChild(paragraf)
        paragraf.classList.add('description')
        paragraf.classList.add('FIT')
        this.element.setAttribute('id', 'gameDisplay_footer')
        this.element.classList.add('gameDisplay_footer')

        this.updateFooterText(this.footerText)
        this.element.style.display = 'block'
        this.father.appendChild(this.element)
    }

    updateFooterText(text, callback = () => {}){
        // console.log(this.element.firstChild)
        this.element.firstChild.textContent = text.toString()
        callback('.description')
    }

    toggleDisplayFooter(){
        if(this.LibrasBtn.classList.contains('active')){
            setTimeout(() => {this.element.style.display = 'none'}, 10)
        }else{
            setTimeout(() => {this.element.style.display = 'block'}, 1500)
        }
    }
}
export{
    GameDisplay
}