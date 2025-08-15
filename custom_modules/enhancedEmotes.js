//Hijack the cs-emotes-export backend element
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

const soundpostButton = document.createElement("button");
soundpostButton.style.backgroundImage = SOUNDPOST_STATE
    ? "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/schizo.gif')"
    : "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/medicated.png')";
soundpostButton.style.backgroundSize = "cover";

$(soundpostButton).on("click", () => {
    SOUNDPOST_STATE = !SOUNDPOST_STATE;
    createCookie("SOUNDPOST_STATE", SOUNDPOST_STATE, 3650);
    soundpostButton.style.backgroundImage = SOUNDPOST_STATE
        ? "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/schizo.gif')"
        : "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/emotes/medicated.png')";
});

$("#chatinputrow").append(soundpostButton)