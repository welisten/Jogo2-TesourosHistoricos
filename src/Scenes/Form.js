class IntroForm {
    constructor(){
        this.generateScene()
    }
    
    generateForm(){
        const formContainer = document.getElementById('introFormContainer')
        const form = document.createElement('form')
        const formTitle = document.createElement('h2')
        const nameInput = document.createElement('input')
        const nameLabel = document.createElement('label')
        const startBtn  = document.createElement('button')

        form.classList.add('introForm')
        formTitle.classList.add('introForm_title')
        startBtn.classList.add('startBtn')
        
        nameLabel.setAttribute('for', 'user_name') 
        nameLabel.textContent =  'Nome:'
        nameLabel.title = "Digite se nome"
        nameInput.type = 'text'
        nameInput.name = 'user_name'
        nameInput.placeholder = 'Digite seu nome'
        nameInput.id = 'user_name'

        startBtn.textContent = 'iniciar'

        form.appendChild(formTitle)
        form.appendChild(nameLabel)
        form.appendChild(nameInput)
        form.appendChild(startBtn)
        formContainer.appendChild(form)

        let aux = 0
        let title = 'Ola! Vamos começar digitando o seu Nome.'
        let writerDelay = 50
        // formTitle.textContent = title
        setTimeout(() => {
            formTitle.innerText = ''
            function typewriter(){
                if(aux >= title.length){
                    return
                }

                let currentChar = title[aux]
                formTitle.textContent += currentChar 
                aux++
                
                let delay = writerDelay
                if(currentChar == '.' || currentChar == '!' || currentChar == '?' || currentChar == ',')
                    delay = 1000
                setTimeout(typewriter, delay)
            }
        typewriter()
        }, 2000)
    }

    generateScene(){
        const introSong = new Audio('./Assets/songs/ucarine.wav')
        introSong.loop = true
        introSong.volume = 1
        introSong.play()
        this.generateForm()
    }


    start(){
        // this.generateForm()
    }
}

export{
    IntroForm
}