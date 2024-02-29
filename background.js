/*
1. Add an option to break down the rests in smaller chunks (give the option between 3-20)
    Logic: user inputs number of breaks =
        Do SetInterval by passing the alarm function, for x, where x is the random break between 0 and 2 mins
*/

chrome.alarms.create("HIIL",{
    periodInMinutes:1/60
})

async function createOffscreen(){
    if(await chrome.offscreen.hasDocument()){
        chrome.runtime.sendMessage("play");
    }else{
        chrome.offscreen.createDocument({
            url: "offscreen.html",
            reasons: ["AUDIO_PLAYBACK"],
            justification: "testing"
            },
            () => { chrome.runtime.sendMessage("play");
      });
    }
    
}




const randFunction = (input) => {
    let min = input*0.8
    let max = input*1.2
    
    const randNumber = Math.round(Math.random() * max )
 
    const startInterval = Math.max(randNumber, Math.round(min))

    const endInterval = startInterval + 10

    return {
        restStart: startInterval,
        restStop: endInterval
    }

}

let rand;

let breakCounter;
    
//setting up an alarm with the timeInput
chrome.alarms.onAlarm.addListener((alarm)=>{
    if(alarm.name==="HIIL"){
        chrome.storage.local.get(["timer", "isRunning", "timeInput", "restTime"/*,"numBreaks"*/],
            (res)=>{
                
            if (res.isRunning){
                let timer = res.timer+1
                let isRunning = true
                //numBreaks=(res.timeInput*60)/120 //average time duration of a work bout 
                //send a message with the sound to be initialized in the offscreen script
                                
                //create random interval for resting if it doesnt exist yet
                if(!rand){
                    rand = randFunction(120); 
                    chrome.storage.local.set({restTime:rand}); //here we store that variable in the local storage
                }
                //assign restTime to whatever rest interval exists already
                let restTime = res.restTime || rand;
                
                //console.log(`numBreaks: ${numBreaks}`)
                //console.log(`timer ${timer}`)
                //console.log(``)
                //console.log(`rand: {start: ${rand.restStart} , stop: ${rand.restStop} }`)
               //console.log(`restTime: {start: ${restTime.restStart} , stop: ${restTime.restStop} }`)
            

                //if the timer is equal to start of alarm, then set off alarm
                if (timer === restTime.restStart) {
                    this.registration.showNotification("HIIL", {
                        body: `Take a quick break`
                    });
                    createOffscreen();
                }

                //if the timer is equal to stop of alarm, then stop alarm
                if (timer === restTime.restStop) {
                    this.registration.showNotification("", {
                        body: `Back to the grind`
                    });
                    createOffscreen();

                    rand = randFunction(120);
                    rand.restStart += timer
                    rand.restStop += timer
                  
                 chrome.storage.local.set({restTime:rand});
                    breakCounter++
                }

                if (timer ===60*res.timeInput){
                    this.registration.showNotification("",{
                        body: "Time's Up! You can take a longer break"
                    })
                    timer = 0
                    isRunning = false
                    chrome.storage.local.set({restTime:{restStart:0,restStop:0}});
                    createOffscreen();
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
        restTime: null
        //numBreaks: "numBreaks" in res ? res.numBreaks : 10
    })
})


/*todo: style -> some black and gradient
                add input for rest length
                add input for work length
*/