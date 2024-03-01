//https://developer.chrome.com/docs/extensions/get-started

const startTimerBtn = document.getElementById("start-btn")
const readMeBtn = document.getElementById("about-btn")
const readMeLbl = document.getElementById("readMe-lbl")

const timeInput = document.getElementById("time-input")
const focusInput = document.getElementById("focus-input")
const restInput = document.getElementById("rest-input")

const totalLabel = document.getElementById("total-label")
const focusLabel = document.getElementById("focus-label")
const restLabel = document.getElementById("rest-label")

/*starting the timer by changing the isRunning variable from false to true*/
startTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.get(["isRunning"],(res)=>{

    chrome.storage.local.set({
        timer: !res.isRunning? 0: res.timer,
        isRunning:!res.isRunning  
    },()=>{
        startTimerBtn.textContent = !res.isRunning? "Reset": "Start"
        disableInput(!res.isRunning);
    }
    )  

})
})

readMeBtn.addEventListener("click", ()=>{
    
    if (readMeLbl.style.display ==="none"){
        readMeLbl.style.display ="grid";
    }else{
        readMeLbl.style.display ="none";
    }
})


//preventing stupid errors
function disableInput(state){
        if (state){
            timeInput.disabled = true
            focusInput.disabled = true
            restInput.disabled = true
        }else{
            timeInput.disabled = false
            focusInput.disabled = false
            restInput.disabled = false
        }   
}

updateTime()
setInterval(updateTime,1000)

//validating input and passing to storage.local

timeInput.addEventListener("change", (event)=>{
    const val = event.target.value
    if (val <5 ||  val>90){
        timeInput.value = 53
        
      //  timeError.textContent = "Try focusing < 90 min at a time"
    }else{
        //timeError.textContent =""
        timeInput.value = event.target.value
        chrome.storage.local.set({
            timer: event.target.value,
            timeInput:event.target.value,
            isRunning: false
        }
     )
    }
})

focusInput.addEventListener("change", (event)=>{
    const val = event.target.value
    let halfTime = timeInput.value/2
    if (val<1 || val>halfTime){
            focusLabel.textContent = `focus 1<>${halfTime}min`
            startTimerBtn.disabled=true
    }else{
        focusLabel.textContent= "Focus Time (min):"
        focusInput.value =event.target.value
        chrome.storage.local.set({
            focusTime: event.target.value    
        })
    }

})

restInput.addEventListener("change", (event)=>{
    const val =event.target.value

    if( val == "F:R"){
        startTimerBtn.disabled=true
    }else{
        chrome.storage.local.set({
            restRatio: event.target.value
        })
    }
})

// 
chrome.storage.local.get(["timeInput", "isRunning", "focusTime", "restRatio","isRunning"], (res)=>{
    timeInput.value = res.timeInput
    focusInput.value = res.focusTime
    restInput.value = res.restRatio
    startTimerBtn.textContent = !res.isRunning? "Start": "Reset"
    
    disableInput(res.isRunning);
}
)

function updateTime(){
    chrome.storage.local.get(["timer", "timeInput"], (res)=>{
        const time =document.getElementById("time")
        const minutes =`${res.timeInput - Math.ceil(res.timer/60)}`.padStart(2,"0")
        let seconds = "00"
  
        if(res.timer % 60 != 0){
            seconds = `${60-res.timer%60}`.padStart(2,"0")
        }

        time.textContent = `${minutes}:${seconds}`
    })
}
       


