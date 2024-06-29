import { colors } from "../Consts/Colors.js"
class GameAcessibleDisplay{
    constructor(father){
        this.father = father
        this.element = document.getElementById('gameAccessibleContainer')
        this.librasBtn = document.querySelector('.libras_btn')
        this.lightModeBtn = document.querySelector('.lightMode_btn')
    }
    toggleDisplay(){
        if(this.toggleBtn.classList.contains('active')){
                this.element.style.display = 'block'
                setTimeout(() => {
                  this.element.style.height = '73%'
                  this.element.style.width  = '100%'
                  this.element.style.opacity  = 1
                }, 20)
        }else{
            this.element.style.color = 'transparent'
            this.element.style.height = '0%'
            this.element.style.width  = '0%'
            this.element.style.opacity  = 0
            setTimeout(()=>{
                this.element.style.display = 'none'
            }, 1000)
        }   
    }
    toggleLight(){
        if(this.lightModeBtn.classList.contains('.active')){

        }else{

        }
    }
    updateAccessibleContainer(){

    }
    resetAccessibleContainer(){

    }
}
export {
    GameAcessibleDisplay
}