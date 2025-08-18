socket.on("chatMsg", async () => {
  let $message = fetchLastChatElement()
  if ($message.text().startsWith('MJ:')) {
    await formatMJMessage($message)
  }
  injectSecretMahjongEmotes(fetchLastChatElement());
})

async function formatMJMessage($messageElement) {
    const canRead = await canReadMJMessages();
    let $timestampElement = $messageElement.parent().find('.timestamp')
    $($messageElement).addClass("MahjongMessage")
    $timestampElement.css("background-image", "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/eyes/nyagger.png')")
    $messageElement.text($messageElement.text().replace(/^MJ: /, ''));

    if (!canRead) {
        $messageElement.parent().css('display','none')
    }
} 

async function injectSecretMahjongEmotes(username, $messageElement) {
  const canRead = await canReadMJMessages();
  if (canRead) {
    Object.keys(secretMJEmotes)
      .map(secretEmote => {
        return secretEmote.replace(/[-/\\^$.*+?()[\]{}|]/g, '\\$&');
    }).forEach(secretEmote => {
        const escapedEmote = secretEmote.replace(/[-/\\^$.*+?()[\]{}|]/g, '\\$&');
        const regex = new RegExp(escapedEmote, 'g'); 
        $messageElement.html($messageElement.html().replace(regex,
          `<img class="channel-emote" title="${secretEmote}" src="${secretMJEmotes[secretEmote]}">`));
      });
    }
  }


const secretMJEmotes = {
    ":nyaggernap:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/nyaggernap.jpg",
    ":yakuless:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/yakuless.gif",
    ":nightynightnyagger:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/nightynightnyagger.png",
    ":chinpo:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/chinpo.png",
    ":sharingiscaring:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/sharingiscaring.png",
    ":pardner:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/pardner.png",
    ":nyaggerfed:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/nyaggerfed.png",
    ":nyaggerfish:": "https://raw.githubusercontent.com/puchigire/r/emotes/emotes/nyaggerfish.png"
};

function prependMessagesWithMJ() {
    const chatInput = $('#chatline');
    if (chatInput.val() && !chatInput.val().startsWith('MJ: ')) {
        chatInput.val('MJ: ' + chatInput.val());
    }
}

async function canReadMJMessages() {
    let mahjongModeCookie = readCookie("MahjongMode");
    let mahjongLurkCookie = readCookie("MahjongLurk");
  
    await window.moduleRegistry.waitForReady("mahjongMode.js")
  
    return mahjongLurkCookie || 
          mahjongModeCookie || 
          $('#holopeek_MahjongMode').is(':checked') ||
          $('#holopeek_MahjongLurk').is(':checked');
}

async function toggleMJMessages() {
    const canRead = await canReadMJMessages();
    document.querySelectorAll('#messagebuffer [class|="MahjongMessage"]').forEach(element => {
        if (canRead) {
            element.parentElement.style.display = 'block';
        } else {
            element.parentElement.style.display = 'none';
        }
    })
}
