async function waitForHoloPeek() {
  if (!window.moduleRegistry.isReady('holoPeek')) {
    await window.moduleRegistry.waitForReady("holopeek/holoPeek.js")
  }
}

socket.on("chatMsg", async () => {
  let $messageElement = fetchLastChatElement();
  const canRead = await canReadMJMessages()
  if ($messageElement.text().startsWith('MJ:')) {
    formatMJMessage($messageElement);
    injectSecretMahjongEmotes($messageElement, canRead)
    toggleSingleMJMessage($messageElement)
  } 
})

function formatMJMessage($messageElement) {
  let $timestampElement = $messageElement.parent().find('.timestamp')
  $($messageElement).addClass("MahjongMessage")
  $timestampElement.css("background-image", "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/eyes/nyagger.png')")
  $messageElement.text($messageElement.text().replace(/^MJ: /, ''));
} 

function injectSecretMahjongEmotes($messageElement, canRead) {
  if (canRead) {
    let messageHtml = $messageElement.html();
    Object.keys(secretMJEmotes)
          .map(secretEmote => {
      return {
        original: secretEmote,
        escaped: secretEmote.replace(/[-/\\^$.*+?()[\]{}|]/g, '\\$&')
      }}
    ).forEach(({ original, escaped }) => {
        const regex = new RegExp(escaped, 'g');
        messageHtml = messageHtml.replace(regex,
          `<img class="channel-emote" title="${original}" src="${secretMJEmotes[original]}">`);
      });
    $messageElement.html(messageHtml);
    }
  }

function prependMessagesWithMJ() {
  const chatInput = $('#chatline');
  if (chatInput.val() && !chatInput.val().startsWith('MJ: ')) {
      chatInput.val('MJ: ' + chatInput.val());
  }
}

async function canReadMJMessages() {
  await isHoloPeekReady();
  return $('#holopeek_MahjongMode').is(':checked') ||
    $('#holopeek_MahjongLurk').is(':checked');
}

function toggleSingleMJMessage(canRead) {
  if (canRead) {
    element.parentElement.style.display = 'block';
  } else {
    element.parentElement.style.display = 'none';
  }
}


function toggleMJMessages(canRead) {
  document.querySelectorAll('#messagebuffer [class|="MahjongMessage"]').forEach(element => {
      if (canRead) {
          element.parentElement.style.display = 'block';
      } else {
          element.parentElement.style.display = 'none';
      }
  })
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