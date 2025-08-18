async function waitForHoloPeek() {
  if (!window.moduleRegistry.isReady("holopeek/holoPeek.js")) {
    await window.moduleRegistry.waitForReady("holopeek/holoPeek.js")
  }
}

function formatMJMessage($messageElement, canRead) {
  if (!$messageElement.text().startsWith('MJ:')) {
    return
  }
  let $timestampElement = $messageElement.parent().find('.timestamp')
  $($messageElement).addClass("MahjongMessage")
  $timestampElement.css("background-image", "url('https://raw.githubusercontent.com/om3tcw/r/refs/heads/emotes/eyes/nyagger.png')")
  $messageElement.text($messageElement.text().replace(/^MJ: /, ''));
  toggleSingleMJMessage($messageElement, canRead)
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
  await waitForHoloPeek();
  return $('#holopeek_MahjongMode').is(':checked') ||
    $('#holopeek_MahjongLurk').is(':checked');
}

function toggleSingleMJMessage($messageElement, canRead) {
  if (canRead) {
    $messageElement.parent().css('display', 'block');
  } else {
    $messageElement.parent().css('display', 'none');
  }
}

function toggleMJMessages(canRead) {
  $('#messagebuffer [class|="MahjongMessage"]').each((_, element) => {
    let $jqElement = $(element)
    toggleSingleMJMessage($jqElement, canRead);
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

socket.on("chatMsg", async (msgObject) => {
  if (msgObject.msg.startsWith('MJ:')) {
    let $messageElement = fetchLastChatElement();
    const canRead = await canReadMJMessages()
    formatMJMessage($messageElement, canRead);
    injectSecretMahjongEmotes($messageElement, canRead)
  }
})

(async function runOnceAfterLoad() {
  if (allModulesReady) {
    await allModulesReady
  } else {
    console.error("Something has gone horribly wrong and you've either moved allModulesReady out of scope or the way the modules load has changed completely.")
  }

  $('#messagebuffer [class|="chat-msg"]').each(async (index, element) => {
    const $jqElement = $(element); 
    const $messageElement = $jqElement.children().last();  
    formatMJMessage($messageElement)
    toggleMJMessages(await canReadMJMessages());
  })
})()
