//npm install js-cookie
import Cookies from 'js-cookie';

//Hijack the backend ui.js export function
$('#cs-emotes-export').off('click')
$("#cs-emotes-export").on('click', () => {
    var emoteObject = CHANNEL.emotes.map( (emote) => {
    return {
        name: emote.name,
        image: emote.image,
        ...(emote.meta && { meta: emote.meta }),
        ...(emote.soundpost && { soundpost: emote.soundpost })
    }
});
    $("#cs-emotes-exporttext").val(JSON.stringify(emoteObject));
});

let soundpostState = Cookies.get("soundpostState") === "true";
console.log(soundpostState)

const soundpostButton = document.createElement("button");
soundpostButton.style.backgroundImage = soundpostState
    ? "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/schizo.gif')"
    : "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/medicated.png')";
soundpostButton.style.backgroundSize = "cover";

soundpostButton.on("click", () => {
    soundpostState = !soundpostState;
    setCookie("soundpostState", soundpostState);
    soundpostButton.style.backgroundImage = soundpostState
        ? "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/schizo.gif')"
        : "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/medicated.png')";
});
const chatInputRow = document.getElementById("chatinputrow");
chatInputRow.appendChild(soundpostButton);