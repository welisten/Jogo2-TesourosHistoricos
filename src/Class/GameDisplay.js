import { colors } from "../Consts/Colors.js"
class GameDisplay{
    constructor(father,){
        this.father = father
        this.element = document.getElementById('gameDisplay')
        this.user = ''
        this.LibrasBtn =  document.querySelector('.libras_btn')
        this.LightBtn =  document.querySelector('.lightMode_btn')
        this.header = new DisplayHeader(this.element) 
        this.bar = new DisplayBar(this.element, this) 
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
    handleWin(){
        this.header.handleWin()
        this.body.handleWin()
        this.footer.handleWin()
    }
    resetDisplay(){
        this.header.reset()
        this.bar.reset()
        this.body.reset()
        this.footer.reset()
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
            this.header.darkMode()
            this.bar.darkMode()
            this.body.darkMode()
            this.footer.darkMode()

            this.element.style.backgroundColor = '#ffffff10'
            this.element.style.border = '1px solid #3498db'
            document.querySelectorAll('.line').forEach((line) => {
                line.style.borderBottom = '1px solid #ffffff80'
                // line.style.borderBottom = '1px solid #3498dg10'
            })
        }
        else
        {
            this.header.lightMode()
            this.bar.lightMode()
            this.body.lightMode()
            this.footer.lightMode()

            this.element.style.backgroundColor = '#ffffff'
            this.element.style.border = '3px solid #3498db'
            document.querySelectorAll('.line').forEach((line) => {
                line.style.borderBottom = '1px solid #056db3'
            })
        }
    }
    toggleDisplayLines(){
        if(this.LibrasBtn.classList.contains('active')){
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
    update(){
        this.header.updateClockContainer()
        this.header.updateInfoContainer()
    }
}

class DisplayHeader{                // ESSA CLASSE SE DIFERENCIA DAS DEMAIS, REFATORAÇÃO É NECESSARIA
    constructor(father){
        this.father = father
        this.element = ''
        this.timer = 0
        this.clockContainer = ''
        this.counter = ''
        this.cardInfo = [] //card name e card location
        this.generateHeaderDisplay()
    }
    generateHeaderDisplay(){
                                                        // CRIA
        this.element = document.createElement('div')
        this.clockContainer = document.createElement('div')
        const infoContainer = document.createElement('div')
        const cardName = document.createElement('div')
        const cardLocation = document.createElement('div')
                                                        // ID E CLASSES
        this.element.setAttribute('id', 'gameDisplay_header')
        this.element.classList.add('gameDisplay_header')
        this.clockContainer.classList.add('clock')
        infoContainer.classList.add('info')
        cardName.classList.add('cardName')
        cardLocation.classList.add('cardLocation')
                                                        // APPEND
        infoContainer.appendChild(cardName)
        infoContainer.appendChild( cardLocation)
        this.element.appendChild(this.clockContainer)
        this.element.appendChild(infoContainer)
        this.father.appendChild(this.element)
                                                        //ESTILIZA        
        const containerWidth  = Math.floor(window.innerWidth * 0.5) > 760 ? 760 : Math.floor(window.innerWidth * 0.4)

        this.element.style.height = `${containerWidth * 0.25}px`
        this.clockContainer.style.height = `${containerWidth * 0.21}px`
        this.clockContainer.style.width = `${containerWidth * 0.19}px`
        infoContainer.style.height = `${containerWidth * 0.23}px`
                                                        //ATUALIZA  
        infoContainer.style.fontWeight = '200'     
        this.clockContainer.innerHTML = '--<i class = "fa-regular fa-clock"></i>' // ESSA ICONE É ADICIONADO DINAMICAMENTE EM TODO UPDATECLOCK
        this.cardInfo[0] = 'Precione Iniciar para começar.'
        this.cardInfo[1] = '<3'
        this.updateInfoContainer()
    }
    updateClockContainer(){
        this.clockContainer = document.querySelector('.clock')
        if(this.timer == '--'){
            this.clockContainer.innerHTML = '--<i class = "fa-regular fa-clock"></i>'
            return
        }
        this.clockContainer.innerHTML = `<div class="clockNumber">${this.timer <= 9 ? `0${this.timer}` : this.timer}</div><span class= clockSecond>s</span><i class = "fa-regular fa-clock"></i>`
    }
    updateInfoContainer(){
        let cardName = document.querySelector('.cardName')
        let cardLocation = document.querySelector('.cardLocation')

        cardName.textContent = this.cardInfo[0]
        cardLocation.textContent =  this.cardInfo[1]
    }
    startClock(){   
        this.counter = setInterval(() => {
            if((typeof this.timer) !== 'number'){
                this.timer = 0
                this.timer++
            }else {
                this.timer++
            }
            this.updateClockContainer()
        }, 1000)

    }
    stopClock(){
        clearInterval(this.counter)
    }
    setCardsInfo(name, location){
        this.cardInfo[0] = name
        this.cardInfo[1] = location
    }
    getTimer(){
        return this.timer
    }
    handleWin(){
        this.stopClock()
        this.cardInfo[0] = 'Você Conseguiu'
        this.cardInfo[1] = '<3'
        this.timer = '--'
        this.updateInfoContainer()
        this.updateClockContainer()
    }
    reset(){
        this.stopClock()
        this.cardInfo[0] = ''
        this.cardInfo[1] = ''
        this.timer = '--'
        this.updateInfoContainer()
        this.updateClockContainer()
    }

    darkMode(){
        this.element.children[1].style.fontWeight = '200'
        this.element.children[1].style.color = '#efefef'
        this.clockContainer.style.border = '2px solid #ffffff56'
        this.clockContainer.style.backgroundColor = 'var(--body-color-dark)'
    }
    lightMode(){
        this.element.children[1].style.fontWeight = '400'
        this.element.children[1].style.color = '#3e3e3f'

        this.clockContainer.style.border = '2px solid #056db3'
        this.clockContainer.style.backgroundColor = '#3498db'       
    }
}

class DisplayBar{
    constructor(father, game){
        this.father = father
        this.element = ''
        this.game = game
        this.LibrasBtn =  document.querySelector('.libras_btn')
        this.userName = '--'
        this.generateBar()
    }
    generateBar(){  // constroi a barra

        const userName =  document.createElement('div')
        const userTreasures =  document.createElement('div')
        const treasure = this.getImage('treasure')
        const treasureNumber = document.createElement('span')
        const userLevel = document.createElement('div')
        this.element =  document.createElement('div')
        
        this.element.setAttribute('id', 'gameDisplay_bar')
        
        this.element.classList.add('this.element')
        userName.classList.add('userName')
        userTreasures.classList.add('userTreasure')
        userLevel.classList.add('userLevel')
        
        treasure.alt = 'tesouros coletados' 
        treasure.title = 'tesouros coletados' 
        treasureNumber.innerText = this.game.user.treasures ? this.game.user.treasures : 0 
        treasureNumber.classList.add('treasuresNumber')
        treasure.classList.add('treasure')
        

        userTreasures.appendChild(treasureNumber)
        userTreasures.appendChild(treasure)
        this.element.appendChild(userName)
        this.element.appendChild(userTreasures)
        this.element.appendChild(userLevel)
        this.father.appendChild(this.element)

        this.element.style.display = 'flex'
        this.setBarLevel(this.game.user.level ? this.game.user.level : 0 )
        this.setBarName(this.game.user.name ? this.game.user.name : '--' )
    }
    updateBar(){  // atualiza de acordo com os dados do usuario
        document.querySelector('.treasuresNumber').innerHTML = this.game.user.treasures
        document.querySelector('.userLevel').innerHTML = `level ${this.game.user.level}`
    }
    reset(){  // atualiza de acordo com os dados do usuario
        document.querySelector('.userName').innerHTML = '--'
        document.querySelector('.treasuresNumber').innerHTML = '-'
        document.querySelector('.userLevel').innerHTML = `--`
    }
    setBarLevel(value){ //atualiza para um valor expecífico
        document.querySelector('.userLevel').innerHTML = `level ${value}`

    }
    setBarName(value){  //atualiza para um valor expecífico
        document.querySelector('.userName').innerHTML = value.toString()
    }

    toggleDisplayBar(){  // alterna o Display
        if(this.LibrasBtn.classList.contains('active')){
            setTimeout(() => {
                this.element.style.display = 'none'
                // document.querySelector('.treasuresNumber').style.display = 'none'
                // document.querySelector('.treasure').style.display = 'none'
                // document.querySelector('.userLevel').style.display = 'none'
                // document.querySelector('.userName').style.display = 'none'
            }, 10)
        } else {
            setTimeout(() => {
                this.element.style.display = 'flex'
                // document.querySelector('.treasuresNumber').style.display = 'inline'
                // document.querySelector('.treasure').style.display = 'inline-block'
                // document.querySelector('.userLevel').style.display = 'inline-block'
                // document.querySelector('.userName').style.display = 'inline-block'
            }, 1500)
        }
    }
    darkMode(){
        this.element.style.fontWeight = '200'
        this.element.style.color = '#efefef'
    }
    lightMode(){
        this.element.style.fontWeight = '400'
        this.element.style.color = '#3e3e3f'
    }
    getImage(name){                 // RETORNA A IMAGEM DO OBJ GLOBAL, ARMAZENADA NO PRELOAD (BLOB)
        return gameAssets[name]
    }

}

class DisplayBody{
    constructor(father){
        this.father = father
        this.element = ''
        this.LibrasBtn =  document.querySelector('.libras_btn')
        this.img = ''
        this.imgContainer = ''
        this.generateBody()
    }
    generateBody(){   // constroi o Body
        this.element = document.createElement('div')
        this.element.classList.add('gameDisplay_body')
        this.element.setAttribute('id','gameDisplay_body' )  
        this.imgContainer = document.createElement('div')
        this.img =  document.createElement('img')
        this.father.appendChild(this.element)
        
        this.imgContainer.classList.add('bodyImg_Container')
        this.img.classList.add('bodyImg')
        
        this.element.appendChild(this.imgContainer)
        this.imgContainer.appendChild(this.img)
        
        this.element.style.display = 'flex'
    }
    updateDisplayImg(src, alt = '', title = ''){   // atualiza a imagem com a URL passada
        if(this.img.style.display == 'none'){
            this.img.style.display = 'block'
        }
        this.img.setAttribute('src', src)
        this.img.alt = alt
        this.img.title = title

    }
    handleWin(){
        this.updateDisplayImg('./Assets/imgs/trophy.png', 'trofel', 'trofel')
    }
    reset(){
        this.img.style.display = 'none'
    }

    toggleDisplayBody(){
        if(this.LibrasBtn.classList.contains('active')){
            // todos somem
            setTimeout(() => {
                this.element.style.display = 'none'
                // this.imgContainer.style.display = 'none'
                // this.img.style.display = 'none'
            }, 10)
        }else{
            // todos aparecem
            setTimeout(() => {
            this.element.style.display = 'flex'
            this.element.style.display = 'flex'
            // this.imgContainer.style.display = 'block'
            // this.img.style.display = 'block'
            }, 1500)
        }
    }
    darkMode(){
        this.element.style.color = '#efefef'
        this.imgContainer.style.border = '2px solid #ffffff56'
        this.imgContainer.style.backgroundColor = 'var(--body-color-dark)'

    }
    lightMode(){
        this.element.style.color = '#3e3e3f'
        this.imgContainer.style.border = '2px solid #056db3'
        this.imgContainer.style.backgroundColor = '#3498db80'

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
        this.footerText = text.toString()
        this.element.firstChild.innerHTML = this.footerText
        callback('.description')
    }
    handleWin(){
        this.element.firstChild.style.fontSize = '2rem'
        this.updateFooterText(`<p>Obrigado por Jogar !</p><br><p>Desenvolvido por Wesley Welisten</p>`)
    }
    reset(){
        this.footerText = ''
        this.element.firstChild.textContent = this.footerText

    }
    toggleDisplayFooter(){
        if(this.LibrasBtn.classList.contains('active')){
            setTimeout(() => {this.element.style.display = 'none'}, 10)
        }else{
            setTimeout(() => {this.element.style.display = 'block'}, 1500)
        }
    }

    darkMode(){
        this.element.style.fontWeight = '200'
        this.element.style.color = '#efefef'
    }
    lightMode(){
        this.element.style.fontWeight = '400'
        this.element.style.color = '#3e3e3f'
    }

}
export{
    GameDisplay
}