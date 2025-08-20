//Hijack the cs-emotes-export backend element
$('#cs-emotes-export').off('click')
$("#cs-emotes-export").on('click', () => {
    let emoteObject = CHANNEL.emotes.map( (emote) => {
    return {
        name: emote.name,
        image: emote.image,
        ...(emote.meta && { meta: emote.meta }),
        ...(emote.soundpost && { soundpost: emote.soundpost })
    }
});
    $("#cs-emotes-exporttext").val(JSON.stringify(emoteObject));
});
