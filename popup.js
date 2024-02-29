//https://developer.chrome.com/docs/extensions/get-started

const startTimerBtn = document.getElementById("start-btn")
const timeInput = document.getElementById("time-input")

//const timeError = document.getElementById("time-error")
//const breakError = document.getElementById("break-error")


function disableInput(state){
    let inputElmnt = document.getElementById("time-input");
    
        if (state){
            inputElmnt.disabled = false
        }else{
            inputElmnt.disabled = true
        }   
}

/*starting the timer by changing the isRunning variable from false to true*/
startTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.get(["isRunning"],(res)=>{

    chrome.storage.local.set({
        timer: !res.isRunning? 0: res.timer,
        isRunning:!res.isRunning  
    },()=>{
        startTimerBtn.textContent = !res.isRunning? "Reset": "Start",
        disableInput(res.isRunning);
    }
       
    )  

})
})

updateTime()
setInterval(updateTime,1000)

//validating input

timeInput.addEventListener("change", (event)=>{
    const val = event.target.value
    if (val <0 ||  val>90){
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

/* 
numBreaks.addEventListener("change", (event)=>{
    let breakVal = event.target.value
    let workInterval = (timeInput.value*60)/breakVal //360 seconds in last run
    let restInterval = timeInput.value*60*0.1 // the restInterval should be equal to this    ->
    
    if( workInterval < restInterval ){ //if it's higher than a number that leaves less than an equal amount of rest between the rest and work intervals
        breakError.textContent = `Try resting less ${breakVal} : ${timeInput.value}` 

    }else{
        breakError.textContent =""
        numBreaks.value =event.target.value
        chrome.storage.local.set({
            numBreaks: event.target.value
        })
    }
})
*/
// 
chrome.storage.local.get(["timeInput", "isRunning"], (res)=>{
    timeInput.value = res.timeInput,
    startTimerBtn.textContent = !res.isRunning? "Start": "Reset"
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
       


