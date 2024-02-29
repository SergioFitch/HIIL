const audio = document.getElementById("audio");
// console.log(`audio: ${audio}`)
//const audio = new Audio("bell-sound.mp3");
function playAudio(){
    audio.play();
}


chrome.runtime.onMessage.addListener((msg) =>{
        if (msg ==="play"){
            playAudio();
        }
})


