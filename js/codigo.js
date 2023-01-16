
const sectionSelectNation=document.getElementById('select-nation') //First Page
const selectionCards=document.getElementById("selection-cards") // Section inside first page
const buttonNationPlayer=document.getElementById('button-nation') //Button for select nation inside first page

const sectionSelectAttack=document.getElementById('select-attack') //Second page
const selectionSkills=document.getElementById("skills") //show the skills buttons - second page

const showMap=document.getElementById("show-map")
const map=document.getElementById("map")

const player=document.getElementById('player') //show the nation choiced - second page/ div stasts/ div stasts player
const pc=document.getElementById('pc') //show the enemy choiced - second page/ div stasts/ div stasts pc

const playerLifes=document.getElementById('player-lifes') //show player lifes - second page/div stasts/div stasts player
const pcLifes=document.getElementById('pc-lifes') //show enemy lifes- second page/ div stasts/ div stasts pc

const playerState=document.getElementById('player-state') //show player attack - second page/div / messages
const pcState=document.getElementById('pc-state') //show enemy atack - second page/div / messages
const battleState=document.getElementById('battle-state') //show the winner /div/ messages

const buttonRestart=document.getElementById('button-restart') // Button inside second page/ div / final message

const historyScreen=document.getElementById('history') //Final results

let nations=[] //collect the options for nations
let userId = null
let enemyId = null

let enemyNations=[]
let inputFire //represent the selection point for fire nation
let inputWater //represent the selection point for water nation
let inputEarth  //represent the selection point for earth nation
let inputQuickBattle //represent the selection point for quick battle mode
let inputMap //represent the selection point for Map mode
let inputOnline //represent the selection point for online mode

let canvas= map.getContext("2d")
let intervalo
let mapBackground = new Image()
mapBackground.src = 'img/backgroundmap.png'

let buttonFire //represent button for fire attack
let buttonWater //represent button for water attack
let buttonEarth //represent button for earth atacck

let playerNation //save the name of the player selection
let playerSelection //save the object of the player selection
let selectNation //save the name of the enemy selection
let playerSkills //save the options of skills for export to html
let selectSkills //create the buttons of skills in html
let buttons=[] //save the habilities that can be used for the player in an array
let playerAttacks=[] //save the habilities used by player
let pcAttacksOptions=[] //save the habilities that can be used for the enemy in an array
let pcAttacks=[] //save the habilities used by enemy

let playerAttack //save the hability used by player
let pcAttack=[] //save the hability used by enemy

let countPlayerLifes=3 //save the number of player lifes
let countPcLifes=3 //save the number of enemy lifes

class Nation{
    constructor(name,idh,picture,live,id){
        this.name=name
        this.idh=idh
        this.id=id
        this.picture=picture
        this.live=live
        this.attacks=[]
        this.w=80
        this.h=80
        this.x = randompick(0, map.width- this.w)
        this.y = randompick(0, map.height -this.h)
        this.mapPhoto= new Image()
        this.mapPhoto.src=picture
        this.velocidadx = 0
        this.velocidady = 0
    }
    paintCharacter(){
        canvas.drawImage(
            this.mapPhoto,
            this.x,
            this.y,
            this.w,
            this.h
        )
    }
}

let fireNation= new Nation('Fire nation','fire-nation','img/fire-removebg-preview.png',3)
let waterNation= new Nation('Water nation','water-nation','img/water-removebg-preview.png',3)
let earthNation= new Nation('Earth nation','earth-nation','img/earth-removebg-preview.png',3)

fireNation.attacks.push(
    {name:'🔥 Katon! Fireball',id:'button-fire'},
    {name:'☠ Poison smoke',id:'button-smoke'},
    {name:'⚡ Thunder attack', id: 'button-electricity' },
    {name:'🔥 Katon! Fireshield',id:'button-shield'}
)
waterNation.attacks.push(
    {name:'💧 Suiton! Waterblast',id:'button-water'},
    {name:'🧊 Freeze Breath',id:'button-ice'},
    {name:'🌪 Tornado', id:'button-air'},
    {name:'💧 Suiton! Watershield',id:'button-shield'}
)
earthNation.attacks.push(
    {name:'🌱 Doton! Earthattack',id:'button-earth'},
    {name:'⚙ Metalattack',id:'button-metal'},
    {name:'⏳ Sandblast', id:'button-sand'},
    {name:'🌱 Doton! Earthshield',id:'button-shield'}
)

nations.push(fireNation,waterNation,earthNation)

function randompick(max,min){
    return Math.floor(Math.random()*(max-min+1)+min)
}

function startGame(){
    
    sectionSelectAttack.style.display='none'
    buttonRestart.style.display='none'
    historyScreen.style.display='none'
    showMap.style.display='none'

    nations.forEach((nation)=>{
        selectNation=`  <input type="radio" name="element" id=${nation.idh} >
        <label class="card-selection" for=${nation.idh}>
            <p>${nation.name}</p>
            <img src=${nation.picture} alt=${nation.name}>
        </label> 
        `
        selectionCards.innerHTML+=selectNation
    })

    inputFire=document.getElementById('fire-nation')
    inputWater=document.getElementById('water-nation')
    inputEarth=document.getElementById('earth-nation')
    inputQuickBattle=document.getElementById('quick-battle')
    inputMap=document.getElementById('map-battle')
    inputOnline=document.getElementById('online-battle')

    buttonNationPlayer.addEventListener('click',selectNationPlayer)
    buttonRestart.addEventListener('click',restartGame)
    jointoGame()
}
function jointoGame(){
    fetch("http://localhost:8080/join").then(function(res){
        if(res.ok){
            res.text().then((result)=>{
                console.log(result)
                userId=result
        })
    }
    })
}

function selectNationPlayer(){
    sectionSelectNation.style.display='none' 

    if (inputFire.checked){
        player.innerHTML=nations[0].name
        playerNation=nations[0].name
        playerSelection = fireNation
    }
    else if (inputWater.checked){
        player.innerHTML=nations[1].name
        playerNation=nations[1].name
        playerSelection = waterNation
    }
    else if (inputEarth.checked){
        player.innerHTML=nations[2].name
        playerNation=nations[2].name
        playerSelection = earthNation
    }else{
        alert("You must have to select one choice")
        location.reload()
    }
    SkillsSelection() 
    selectMode()
    if (inputOnline.checked){
        sendSelection(playerNation)
    }
}

function sendSelection(playerNation){
    fetch(`http://localhost:8080/nation/${userId}`,{
        method:"post",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            nation: playerNation
        })
    })
}
function selectMode(){
    if (inputQuickBattle.checked){
        sectionSelectAttack.style.display='flex'
        PCSelection() 
    }else if (inputMap.checked){
        PCSelection()  
        startMap()
        showMap.style.display='flex'  
    }else if (inputOnline.checked){
        startMap()
        showMap.style.display='flex'  
    }
}

function PCSelection(mode){
    if (inputQuickBattle.checked){
        let random
        do {
            random=randompick(nations.length-1,0)
        pc.innerHTML=nations[random].name
        } while (playerNation===nations[random].name);
        pcAttacksOptions=nations[random].attacks}
    else if (inputMap.checked){
        let index=nations.indexOf(playerSelection)
        nations.splice(index,1)
    }
}

function startMap(){
    map.width=600
    map.height=400
    intervalo=setInterval(paintCanvas,50)
    window.addEventListener('keydown',pushKey)
    window.addEventListener('keyup',stopCharacter)
}

function paintCanvas(){
    playerSelection.x=playerSelection.x+playerSelection.velocidadx
    playerSelection.y=playerSelection.y+playerSelection.velocidady
    canvas.clearRect(0,0,map.width,map.height)
    canvas.drawImage(
    mapBackground,0,0,map.width,map.height)
    playerSelection.paintCharacter()
    if (inputMap.checked){ 
        nations[0].x=250
        nations[0].y=70
        nations[1].x=300
        nations[1].y=200
        nations[0].paintCharacter()
        nations[1].paintCharacter()
        if (playerSelection.velocidadx!==0 || playerSelection.velocidady!==0){
            colision(nations[0])
            colision(nations[1])
        }
    }   else if( inputOnline.checked){
        sendPosition(playerSelection.x,playerSelection.y)
        enemyNations.forEach((nation) => {
            nation.paintCharacter()
            colision(nation)
        })
    }
}

function sendPosition(x,y){
    fetch(`http://localhost:8080/nation/${userId}/position`,{
        method:"post",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({x,y})
    }).then(function (res){
        if (res.ok){
            res.json().then(function ({enemies}){
                console.log(enemies)
                enemyNations=enemies.map(function(enemy){
                    let enemyNation = null
                    const nationName = enemy.nation.name || ""
                    console.log(enemy.nation.name)
                    if (nationName==="Fire nation"){
                        enemyNation = new Nation('Fire nation','fire-nation','img/fire-removebg-preview.png',3,enemy.id)
                    }else if(nationName==="Water nation"){
                        enemyNation = new Nation('Water nation','water-nation','img/water-removebg-preview.png',3,enemy.id)
                    }else if(nationName==="Earth nation"){
                        enemyNation = new Nation('Earth nation','earth-nation','img/earth-removebg-preview.png',3,enemy.id)
                    }
                    console.log(enemyNation)
                    enemyNation.x = enemy.x
                    enemyNation.y = enemy.y

                    return enemyNation
                })
            })
        }
    })
}

function moveCharacter(move){
    if (move==1){
        playerSelection.velocidady=-5
    }else if (move==2){
        playerSelection.velocidady=5
    }else if (move==3){
        playerSelection.velocidadx=5
    }else if (move==4){
        playerSelection.velocidadx=-5
    }
}

function stopCharacter(){
    playerSelection.velocidady=0
    playerSelection.velocidadx=0
}

function pushKey(event){
    switch(event.key){
        case 'ArrowUp':
            moveCharacter(1)
            break
        case 'ArrowDown':
            moveCharacter(2)
            break
        case 'ArrowRight':
            moveCharacter(3)
            break
        case 'ArrowLeft':
            moveCharacter(4)
            break
        default:
            break;
    }
}

function colision(enemy){
    const upEnemy = enemy.y
    const downEnemy = enemy.y + enemy.h
    const rightEnemy = enemy.x + enemy.w
    const leftEnemy = enemy.x

    const upPlayer = playerSelection.y
    const downPlayer= playerSelection.y + playerSelection.h
    const rightPlayer = playerSelection.x + playerSelection.w
    const leftPlayer = playerSelection.x

    if (downPlayer<upEnemy || upPlayer>downEnemy|| rightPlayer<leftEnemy || leftPlayer>rightEnemy ){
        return 
    }
    pc.innerHTML=enemy.name
    clearInterval(intervalo)
    console.log("colision")
    enemyId=enemy.id
    pcAttacksOptions=enemy.attacks
    stopCharacter() 
    sectionSelectAttack.style.display='flex'
    showMap.style.display='none'
    
}

function SkillsSelection(){
    nations.forEach((nation)=>{
        if (playerNation===nation.name){
            playerSkills=nation.attacks
        }
    }
    )
    showSkills(playerSkills)
}

function showSkills(){
    playerSkills.forEach((skill)=>{
        selectSkills=`<button id=${skill.id} class="button-attack">${skill.name}</button>
        `
        selectionSkills.innerHTML+=selectSkills
    }
    )
    buttonFire=document.getElementById('button-fire')
    buttonWater=document.getElementById('button-water')
    buttonEarth=document.getElementById('button-earth')
    buttons=document.querySelectorAll('.button-attack')
    sequenceofattacks()
}

function sequenceofattacks(){
    buttons.forEach((button)=>{
        button.addEventListener("click",(e)=>{
            if (e.target.id === 'button-fire'){
                playerAttack=[e.target.innerText,"Fire"]
                playerAttacks.push("Fire")
            }else if (e.target.id=== 'button-water'){
                playerAttack=[e.target.innerText,"Water"]
                playerAttacks.push("Water")
            }else if (e.target.id === 'button-earth'){
                playerAttack=[e.target.innerText,"Earth"]
                playerAttacks.push("Earth")
            }else if(e.target.id === 'button-smoke'){
                playerAttack=[e.target.innerText,"Poison"]
                playerAttacks.push("Poison")
            }else if(e.target.id === 'button-ice'){
                playerAttack=[e.target.innerText,"Ice"]
                playerAttacks.push("Ice")
            }else if(e.target.id === 'button-metal'){
                playerAttack=[e.target.innerText,"Metal"]
                playerAttacks.push("Metal")
            }else if(e.target.id === 'button-shield'){
                playerAttack=[e.target.innerText,"Shield"]
                playerAttacks.push("Shield")
            }else if(e.target.id === 'button-electricity'){
                playerAttack=[e.target.innerText,"Electricity"]
                playerAttacks.push("Electricity")
            }else if(e.target.id === 'button-air'){
                playerAttack=[e.target.innerText,"Air"]
                playerAttacks.push("Air")
            }else if(e.target.id === 'button-sand'){
                playerAttack=[e.target.innerText,"Sand"]
                playerAttacks.push("Sand")
            }
            if (inputOnline.checked && playerAttacks.length==5){
                sendAttacks()
            } else if (inputQuickBattle.checked || inputMap.checked)
            { pcAttackSelection() }
        })
    })
    
}

function sendAttacks(){
    fetch(`http://localhost:8080/nation/${userId}/attacks`,{
        method:"post",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({attacks:playerAttacks})
    })
    intervalo= setInterval(getAttack,50)
}
function getAttack(){
    fetch(`http://localhost:8080/nation/${enemyId}/attacks`)
        .then(function(res){
            if(res.ok){
                res.json()
                    .then(function ({attacks}){
                        pcAttacks=attacks
                        if (pcAttacks.length === 5){
                            for (let index = 0; index < attacks.length ; index++) {
                                playerAttack[1]=playerAttacks[index]
                                pcAttack[1]=pcAttacks[index]
                                fight()
                            }
                        }
                    })
            }
        })
}


function pcAttackSelection(){
    let random=randompick(pcAttacksOptions.length-1,0)
    if (pcAttacksOptions[random].id=="button-fire"){
        pcAttack=[pcAttacksOptions[random].name,"Fire"]
        pcAttacks.push("Fire")
    }
    else if(pcAttacksOptions[random].id=="button-water"){
        pcAttack=[pcAttacksOptions[random].name,"Water"]
        pcAttacks.push("Water")
    }
    else if (pcAttacksOptions[random].id=="button-earth"){
        pcAttack=[pcAttacksOptions[random].name,"Earth"]
        pcAttacks.push("Earth")
    }else if (pcAttacksOptions[random].id=="button-smoke"){
        pcAttack=[pcAttacksOptions[random].name,"Poison"]
        pcAttacks.push("Poison")
    }else if (pcAttacksOptions[random].id=="button-ice"){
        pcAttack=[pcAttacksOptions[random].name,"Ice"]
        pcAttacks.push("Ice")
    }else if (pcAttacksOptions[random].id=="button-metal"){
        pcAttack=[pcAttacksOptions[random].name,"Metal"]
        pcAttacks.push("Metal")
    }else if (pcAttacksOptions[random].id=="button-shield"){
        pcAttack=[pcAttacksOptions[random].name,"Shield"]
        pcAttacks.push("Shield")
    }else if (pcAttacksOptions[random].id=="button-electricity"){
        pcAttack=[pcAttacksOptions[random].name,"Electricity"]
        pcAttacks.push("Electricity")
    }else if (pcAttacksOptions[random].id=="button-air"){
        pcAttack=[pcAttacksOptions[random].name,"Air"]
        pcAttacks.push("Air")
    }else if (pcAttacksOptions[random].id=="button-sand"){
        pcAttack=[pcAttacksOptions[random].name,"Sand"]
        pcAttacks.push("Sand")
    }            
    fight()
}
function fight(){

    if (playerAttack[1]==pcAttack[1]){
        createMessage("Tie")
    }
    else if (playerAttack[1]=="Fire" && pcAttack[1]=="Ice" || playerAttack[1]=="Water" && pcAttack[1]=="Fire" || playerAttack[1]=="Earth" && pcAttack[1]=="Fire" || playerAttack[1]=="Fire" && pcAttack[1]=="Metal" || playerAttack[1]=="Water" && pcAttack[1]=="Earth" || playerAttack[1]=="Earth" && pcAttack[1]=="Ice") {
        createMessage("Win")
        countPcLifes--
        pcLifes.innerHTML=countPcLifes
    }
    else if (playerAttack[1]=="Ice" && pcAttack[1]=="Poison" || playerAttack[1]=="Earth" && pcAttack[1]=="Air" || playerAttack[1]=="Poison" && pcAttack[1]=="Earth" || playerAttack[1]=="Poison" && pcAttack[1]=="Water" || playerAttack[1]=="Metal" && pcAttack[1]=="Water" || playerAttack[1]=="Metal" && pcAttack[1]=="Poison") {
        createMessage("Win")
        countPcLifes--
        pcLifes.innerHTML=countPcLifes
    }else if (playerAttack[1]=="Fire" && pcAttack[1]=="Electricity" || playerAttack[1]=="Poison" && pcAttack[1]=="Fire" || playerAttack[1]=="Electricity" && pcAttack[1]=="Poison" || playerAttack[1]=="Water" && pcAttack[1]=="Ice" || playerAttack[1]=="Air" && pcAttack[1]=="Water" || playerAttack[1]=="Ice" && pcAttack[1]=="Air" || playerAttack[1]=="Earth" && pcAttack[1]=="Sand" || playerAttack[1]=="Metal" && pcAttack[1]=="Earth" || playerAttack[1]=="Sand" && pcAttack[1]=="Metal"|| playerAttack[1]=="Electricity" && pcAttack[1]=="Water" || playerAttack[1]=="Air" && pcAttack[1]=="Electricity" || playerAttack[1]=="Earth" && pcAttack[1]=="Electricity"|| playerAttack[1]=="Electricity" && pcAttack[1]=="Metal" || playerAttack[1]=="Air" && pcAttack[1]=="Sand" || playerAttack[1]=="Metal" && pcAttack[1]=="Air" || playerAttack[1]=="Air" && pcAttack[1]=="Poison" || playerAttack[1]=="Fire" && pcAttack[1]=="Air" || playerAttack[1]=="Sand" && pcAttack[1]=="Fire"|| playerAttack[1]=="Poison" && pcAttack[1]=="Sand" || playerAttack[1]=="Sand" && pcAttack[1]=="Water" || playerAttack[1]=="Ice" && pcAttack[1]=="Sand") {
        createMessage("Win")
        countPcLifes--
        pcLifes.innerHTML=countPcLifes
    }
    else if (playerAttack[1]=="Shield" || pcAttack[1]=="Shield" || playerAttack[1]=="Electricity" && pcAttack[1]=="Ice" || playerAttack[1]=="Sand" && pcAttack[1]=="Electricity" || playerAttack[1]=="Metal" && pcAttack[1]=="Ice"){
        createMessage("Tie")
    }
    else{
        createMessage("Lose")
        countPlayerLifes--
        playerLifes.innerHTML=countPlayerLifes
    } 
    checkLifes()
    clearInterval(intervalo)
}

function checkLifes(){
    if (countPcLifes==0){
        createFinalMessage("Congratulations! You win the war!")
    }else if (countPlayerLifes==0){ 
        createFinalMessage("Sorry. You lose the war.")
    }
}

function createMessage(result){
    playerState.innerHTML="You used "+playerAttack[0]
    pcState.innerHTML="The enemy used "+pcAttack[0]
    battleState.innerHTML="You "+result+" the battle."

    let playerHistoryScreen=document.getElementById('player-history')
    let pcHistoryScreen=document.getElementById('pc-history')
    let resultScreen=document.getElementById('result-screen')
    playerHistory=document.createElement('p')
    pcHistory=document.createElement('p')
    resultBattle=document.createElement('p')
    
    playerHistory.innerHTML=playerAttack[1]
    playerHistoryScreen.appendChild(playerHistory)
    pcHistory.innerHTML=pcAttack[1]
    pcHistoryScreen.appendChild(pcHistory)
    resultBattle.innerHTML=result
    resultScreen.appendChild(resultBattle)   
}

function createFinalMessage(finalResult){
    battleState.innerHTML=finalResult
    selectionSkills.style.display='none'
    buttonRestart.style.display='block'
    historyScreen.style.display='grid'
}

function restartGame(){
    location.reload()
}


window.addEventListener('load', startGame)