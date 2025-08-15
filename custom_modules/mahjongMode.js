
$(document).ready(() => {
  $('#messagebuffer [class|="chat-msg"]').each(() => {
        const $element = $(this); 
        const $messageElement = $element.children().last();
        formatMessage($messageElement);

        if ($messageElement.html().startsWith('MJ:')) {
            formatMJMessage($messageElement)
        }
    })
    toggleMJMessages();

    socket.on("chatMsg", injectSecretMahjongEmotes)
  }
)

function injectSecretMahjongEmotes() {
  if (canReadMJMessages()) {
    if (!['[server]', '[voteskip]'].includes(username.toLowerCase())) {
        Object.keys(secretMJEmotes).forEach(secretEmote => {
            const escapedEmote = secretEmote.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');
            const regex = new RegExp(escapedEmote, 'g'); 
                $messageElement.html($messageElement.html().replace(regex,
                    `<img class="channel-emote" title="${secretEmote}" src="${secretMJEmotes[secretEmote]}">`));
            } 
          )} else {
              $messageElement.html($messageElement.html().replace(regex, ''));
          }
      }
  }

function formatMJMessage($messageElement) {
    let $timestampElement = $messageElement.parent().find('.timestamp')
    $($messageElement).addClass("MahjongMessage")
    $timestampElement.css("backgroundImage", "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/eyes/nyagger.png')")
    $messageElement.text($messageElement.text().replace(/^MJ: /, ''));

    if (!canReadMJMessages()) {
        $messageElement.parent().css('display','none')
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

function canReadMJMessages() {
    let mahjongModeCookie = readCookie("MahjongMode");
    let mahjongLurkCookie = readCookie("MahjongLurk");
    return  mahjongLurkCookie || 
            mahjongModeCookie || 
            $('#holopeek_MahjongMode').is(':checked') ||
            $('#holopeek_MahjongLurk').is(':checked');
}

function toggleMJMessages() {
    document.querySelectorAll('#messagebuffer [class|="MahjongMessage"]').forEach(element => {
        if (canReadMJMessages()) {
            element.parentElement.style.display = 'block';
        } else {
            element.parentElement.style.display = 'none';
        }
    })
}