/*
1. Add an option to break down the rests in smaller chunks (give the option between 3-20)
    Logic: user inputs number of breaks =
        Do SetInterval by passing the alarm function, for x, where x is the random break between 0 and 2 mins
*/



chrome.alarms.create("uRest",{
    periodInMinutes:1/60
})



const randFunction = (input) => {
    let min = input*0.1
    let max = input*0.8
    
    const randNumber = Math.round(Math.random() * max)
 
    const startInterval = Math.max(randNumber, Math.round(min))

    const endInterval = startInterval + Math.round(min)
    return {
        restStart: startInterval,
        restStop: endInterval
    }

}

let rand;
let breakSeq;
let breakCounter;
    
//setting up an alarm with the timeInput
chrome.alarms.onAlarm.addListener((alarm)=>{
    if(alarm.name==="uRest"){
        chrome.storage.local.get(["timer", "isRunning", "timeInput", "restTime","numBreaks"],
            (res)=>{
                
            if (res.isRunning){
                let timer = res.timer+1
                let isRunning = true
                let numBreaks = res.numBreaks
                breakSeq=res.timeInput/numBreaks
                

                //create random interval for resting if it doesnt exist yet
                if(!rand){
                    rand = randFunction(breakSeq*1.1*60);
                    chrome.storage.local.set({restTime:rand});
    
                }
                //assign restTime to whatever rest interval exists already
                const restTime = res.restTime || rand;
                console.log(restTime.restStart)
                console.log(restTime.restStop)

                //if the timer is equal to start of alarm, then set off alarm
                if (timer === restTime.restStart) {
                    this.registration.showNotification("uRest", {
                        body: `Take a quick break`
                    });
                }

                //if the timer is equal to stop of alarm, then stop alarm
                if (timer === restTime.restStop) {
                    this.registration.showNotification("uRest", {
                        body: `Back to the grind`
                    });
                }


                if (timer ===60*res.timeInput){
                    this.registration.showNotification("uRest",{
                        body: "Time's Up! You can take a longer break"
                    })
                    timer = 0
                    isRunning = false
                }

                chrome.storage.local.set({
                    timer,
                    isRunning
                    
                })
            }
        });
        
    }
});


//getting and setting the parameters for the timer local storage variables
chrome.storage.local.get(["timer","isRunning","timeInput","restTime"],(res)=>{
    chrome.storage.local.set({
        timer:"timer" in res ? res.timer: 0,
        timeInput:"timeInput" in res? res.timeInput:25,
        isRunning: "isRunning" in res?  res.isRunning : false,
        restTime: null,
        numBreaks:10
    })
})


//todo: let's break down the number to 2 blocks if it's larger than 45