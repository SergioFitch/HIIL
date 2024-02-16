const startTimerBtn = document.getElementById("start-btn")
const timeInput = document.getElementById("time-input")
const numBreaks = document.getElementById("n-breaks")
/* */
startTimerBtn.addEventListener("click",()=>{
    chrome.storage.local.get(["isRunning"],(res)=>{

    chrome.storage.local.set({
        timer: !res.isRunning? 0: res.timer,
        isRunning:!res.isRunning
    },()=>{
        startTimerBtn.textContent = !res.isRunning? "Reset": "Start"
    
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
    }else{

        timeInput.value = event.target.value
        chrome.storage.local.set({
            timer: event.target.value,
            timeInput:event.target.value,
            isRunning: false
        }

        )
    }
})

//setting input to local storage so that the bg script can use it 
chrome.storage.local.get(["timeInput", "numBreaks"], (res)=>{
    timeInput.value = res.timeInput,
    numBreaks.value = res.numBreaks
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
       


//var restTime = {
//        type: "basic",
//        title: "Break!",
//        message: "Take a quick break!"
//    };
//await chrome.notifications.create("timer 1", restTime);


