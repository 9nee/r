if (!window[CHANNEL.name]) {
    window[CHANNEL.name] = {};
}

if (![CHANNEL.name].favicon) {
    [CHANNEL.name].favicon = $("<link/>")
        .prop("id", "favicon")
        .attr("rel", "shortcut icon")
        .attr("type", "image/png")
        .attr("sizes", "64x64")
        .attr("href", "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/ogey.png")
        .appendTo("head");
}

const LOCAL_CDN_URL = "https://monthly-shut-authorized-wa.trycloudflare.com/immergrok-cytube-fork";

//For live jsdelivr usage
const JSDELIVR_CDN_URL = "https://cdn.jsdelivr.net/gh/om3tcw/r@"
const CURRENT_COMMIT = ""
const CURRENT_BRANCH = "immergrok" //Change to om3tcw when live

//CHANGE TO JSDELIVR_CDN_URL WHEN LIVE
const CURRENT_CDN = LOCAL_CDN_URL;

const MODULES_FOLDER = "custom_modules/";
const MODULE_REGISTRY = `${MODULES_FOLDER}moduleRegistry.js`
const ModulePaths = [
    { CSSInjection: `custom_css_injection/customCssInjection.js`},
    { TabsBelowVideo: `ui_modules/tabsBelowVideo.js`}, //I wouldn't disable this one
    { CustomSettings:`ui_modules/customSettingsModal.js` },
    { BetterPlaylist: `ui_modules/betterPlaylist.js` },
    { BetterPms: `ui_modules/betterPms.js` },
    { SoundNotifications: `soundNotifications.js` },
    { MoreLayoutOptions: `ui_modules/moreLayoutOptions.js` },
    { CustomUserList: `ui_modules/customUserlist.js` },
    { HoloPeek: `holopeek/holoPeek.js` },
    { MahjongMode: `chat_modules/mahjongMode.js` },
    { EnhancedEmotes: `chat_modules/enhancedEmotes.js` },
    { ImagePreview: `chat_modules/imagePreview.js` },
    { Soundposts: `chat_modules/soundpostModule.js` },
    { NNDChatModule: `chat_modules/nndChatModule.js`, isActive: 0, rank: -1}
]

function makeLiveCDNLink(fileName) {
    return  CURRENT_CDN +
            CURRENT_COMMIT +
            "/" +
            fileName
}

function fetchLastChatElement() {
    return $('#messagebuffer').children().last().children().last();
}

const ModuleLoaderPromise = (async () => {
    const importedModule = await import(makeLiveCDNLink("ModuleLoader.js"));
    return importedModule.default;
})();

window.allModulesReady = null;

(async function loadLogic() {

    const ModuleLoaderClass = await ModuleLoaderPromise;
    const ModuleLoaderInstance = new ModuleLoaderClass(ModulePaths);

    await ModuleLoaderInstance.initialize();
    window.allModulesReady = ModuleLoaderInstance.allModulesLoaded;
    await window.allModulesReady;
    
    $('#messagebuffer [class|="chat-msg"]').each(async (index, element) => {
        const $jqElement = $(element); 
        const $messageElement = $jqElement.children().last();
        globalMessageFormatInjection({$message: $messageElement});
    })
})();

//TODO: move to the other ready function?  
$(document).ready(function () {
    const watermark = 'om3tcw is cuter than usual';
    $('#chatwrap').attr('placeholder', watermark);

    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://holodex.net/home'>HoloDex</a></li>");
    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmTUBfSR1bgRjQskGCMhnNpV_wZTIyQ17oMAZA1FoD5LY7LA/viewform?usp=sharing&ouid=112222705232140937762'><img src='https://twemoji.maxcdn.com/v/latest/72x72/1f1ec-1f1e7.png' alt='UK Flag' style='width: 1em; vertical-align: middle; margin-right: 0.25em;'>UK Age Verification Form</a></li>");

});


function surroundTextSelection($textField, leftSurroundString, rightSurroundString) {
    let textFieldDOM = $textField[0]
    const caretPositionStart = textFieldDOM.selectionStart;
    const caretPositionEnd = textFieldDOM.selectionEnd;
    const textValue = $textField.val();
    if (textFieldDOM === document.activeElement) {
        if (caretPositionStart === caretPositionEnd) {
            $textField.val(
                textValue.substring(0, caretPositionStart) + 
                leftSurroundString + 
                textValue.substring(caretPositionStart, caretPositionEnd) + 
                rightSurroundString + 
                textValue.substring(caretPositionEnd, textValue.length));
            textFieldDOM.setSelectionRange(
                caretPositionStart + leftSurroundString.length,
                caretPositionStart + leftSurroundString.length);
        } else if (caretPositionStart < caretPositionEnd) {
            $textField.val(
                textValue.substring(0, caretPositionStart) + 
                leftSurroundString + 
                textValue.substring(caretPositionStart, caretPositionEnd) + 
                rightSurroundString + 
                textValue.substring(caretPositionEnd, textValue.length));
            textFieldDOM.setSelectionRange(
                caretPositionEnd + (leftSurroundString.length + rightSurroundString.length), 
                caretPositionEnd + (leftSurroundString.length + rightSurroundString.length));
        }
    }
}

$(window).on('keydown', (event) => {
    const $chatBox = $("#chatline");
    const chatBoxDOM = $chatBox[0]

    if (event.ctrlKey && !event.shiftKey) {
        switch (event.key) {
            case 'a': 
                if ($chatBox.val().length) {
                    chatBoxDOM.focus();
                    chatBoxDOM.setSelectionRange(0, $chatBox.val().length);
                }
                break;
            case 's':   
                event.preventDefault();
                event.stopPropagation(event);
                surroundTextSelection($chatBox, "[sp]", "[/sp]")
                break;
            case 'r': 
            if (document.activeElement === chatBoxDOM) {
                event.preventDefault();
                event.stopPropagation(event);
                event.returnValue = false;
                surroundTextSelection($chatBox, "[r]", "[/r]");
                break;
            }
        }
    }
});



// UI Enhancements
(() => {
    'use strict';

    // Move controls around
    $('#videowrap').append("<span id='vidchatcontrols' style='float:right'>");
    $('#emotelistbtn').detach().insertBefore('#chatwrap>form').wrap('<div id="emotebtndiv"></div>').text('Emotes').attr('title', 'Emote List');
    $('#leftcontrols').remove();

    $('.navbar-brand').attr('href', 'https://files.catbox.moe/om3tcw.webm');

    $("#togglemotd").html("X").click(() => $("#motdwrap").hide());

    // Existing Code for Toggles
    $(".nav.navbar-nav").append('<li><a id="videotoggylogg" href="javascript:void(0)">A/O</a></li>');
    $("#videotoggylogg").click(() => {
        if ($("#videowrap:visible").length) {
            $("#videowrap").hide();
            $("#chatwrap").removeClass("col-lg-5 col-md-5").addClass("col-lg-12 col-md-12");
        } else {
            $("#videowrap").show();
            $("#chatwrap").removeClass("col-lg-12 col-md-12").addClass("col-lg-5 col-md-5");
        }
    });

    $(".nav.navbar-nav").append('<li><a id="togglemotd" href="javascript:void(0)">MOTD</a></li>');
    $("#togglemotd").click(() => {
        if ($("#motdwrap:visible").length) {
            $("#motdwrap").hide();
        } else {
            $("#motdwrap").show();
            $("#motd").show();
        }
    });

    $("#main").addClass("flex").children().first().children().first().after('<div id="chatdisplayrow" class="row"></div>').next().append($("#userlist,#messagebuffer").removeAttr("style")).after('<div id="chatinputrow" class="row"></div>').next().append($("#emotebtndiv,#chatwrap>form"));

    // Mikoboat
    const mikoDing = new Audio('https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/soundposts/sounds/om3tcw.ogg');
    mikoDing.loop = true;
    mikoDing.volume = 0.1;
    $('.navbar-brand').on('mouseenter', () => mikoDing.play());
    $('.navbar-brand').on('mouseleave', () => mikoDing.pause());

    // Emote button
    const randomEmotePool = [
        "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyascone.png",
        "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyascone.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasip.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyachicken.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyatoast.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyachocoshroom.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasourdough.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaminecraft.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaclif.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasalman.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaeggsandwich.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyashitpost.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyacereal.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyatect.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasteak.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyanoodle.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyagogurt.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyawrappedburger.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapolitan.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyagraph.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaoreoshake.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyataco.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyacorndog.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaparfait.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasandwich.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasandwich2.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamage.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapirouette.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyafry.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyadonut.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamelonsoda.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaknife.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaahituna.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapumpkinpie.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyaseesyourhotpocket.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyart.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamouth.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyawithagun.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyan.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyachurro.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyasugarcookie.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyainahair.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyagoslings.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyacube.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamami.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyablink.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyawarp.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/aranya.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyapizza.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyamail.png"
        , "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/anyatoast2.png"
    ];

    const drawRandomEmote = () => randomEmotePool[Math.floor(Math.random() * randomEmotePool.length)];

    $("#emotelistbtn").click(function () {
        $(this).css("background-image", "url(" + drawRandomEmote() + ")");
    }).html("");

})();

let currentChatboxCaret = 0;

$('#chatline').on('click keydown', (event) => {
    setTimeout(function () {
        currentChatboxCaret = event.target.selectionStart;
    }, 0);
})

//Improved emote click
$('#messagebuffer').click(event => {
    let target = event.target;
    if (event.button != 0) { 
        return;
    }
    if (target.className == 'channel-emote') {
        let curChatVal = $('#chatline').val();
        let emoteName = event.target.title;
        let firstHalf = curChatVal.substring(0, currentChatboxCaret);
        let secondHalf = curChatVal.substring(currentChatboxCaret);
        let newChatVal = firstHalf + emoteName + " ";
        currentChatboxCaret = newChatVal.length;
        newChatVal = newChatVal + secondHalf;
        $('#chatline').val(newChatVal).focus()[0].setSelectionRange(currentChatboxCaret, currentChatboxCaret);
    }
});

function runescape($message) {

    const text = $message.text().replace('/runescape', '');
    let html = '';
    let mynumber = 0;

    const parts = text.split(/(<[^>]*>)|\b(\w+)\b/g);

    parts.forEach(part => {
        if (part) {
            if (part.startsWith("<")) {
                const mydelay = mynumber * -50;
                html += `<span style="display: inline-block; position: relative; z-index: -1; animation: wave .66s linear infinite ${mydelay}ms">${part}</span>`;
                mynumber++;
            } else {
                const characters = part.split('');
                characters.forEach(char => {
                    const mydelay = mynumber * -50;
                    html += `<span style="display: inline-block; font-weight: bold; animation: wave .66s linear infinite ${mydelay}ms, glow 3s linear infinite">${char}</span>`;
                    mynumber++;
                });
            }
        }
    });

    $message.html(html);
}

function yayConfetti($message) {
    
    const $text = $message.text().replace('/yay', '');
    $message.text($text);

    const rect = $message[0].getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);

    const colors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00',
        '#ff00ff', '#00ffff', '#ff8800', '#ff0088'
    ];
    const shapes = ['circle', 'triangle', 'square', 'star', 'heart'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = `confetti ${shapes[Math.floor(Math.random() * shapes.length)]}`;

        confetti.style.left = `${centerX}px`;
        confetti.style.top = `${centerY}px`;

        confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);

        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 50 + Math.random() * 100;
        const explodeX = Math.cos(angle) * distance;
        const explodeY = Math.sin(angle) * distance * 0.6;

        confetti.style.setProperty('--explodeX', `${explodeX}px`);
        confetti.style.setProperty('--explodeY', `${explodeY}px`);
        confetti.style.setProperty('--fallX', `${explodeX + (Math.random() - 0.5) * 200}px`);
        confetti.style.setProperty('--rotation', `${Math.random() * 360}deg`);

        const explodeDuration = 0.5;
        const fallDuration = 1.5 + Math.random();
        const delay = Math.random() * 0.2;

        confetti.style.animation = `
        confettiExplode ${explodeDuration}s ease-out ${delay}s forwards,
        confettiFall ${fallDuration}s ease-in ${explodeDuration + delay}s forwards
    `;

        document.body.appendChild(confetti);

        setTimeout(() => {
            document.body.removeChild(confetti);
        }, (explodeDuration + fallDuration + delay) * 1000);
    }
}

function globalMessageFormatInjection({ username = "undefined", 
                                        $message = "undefined", 
                                        meta = undefined, 
                                        time = undefined}) {
    const $messageText = $message.text()

    if ($messageText.startsWith('/')) {
        formatCommandMessage($message);
    }

    if (!['[server]', '[voteskip]'].includes(username.toLowerCase()) && username !== "numbertrees") {
        soundpostInjection($message)
    }
}

socket.on("chatMsg", ({username, msg, meta, time}) =>{
    globalMessageFormatInjection({$message: fetchLastChatElement()});
} )

function formatCommandMessage($message) {
    let $text = $message.text();
    if ($text.startsWith('/runescape')) {
        runescape($message);
    } else if ($text.startsWith('/yay')) {
        yayConfetti($message);
        playNeneYaySound();
    } else if ($text.startsWith('/boo')) {
        playBooSound();
    }
}

function playNeneYaySound() {
    if (SOUNDPOST_STATE) {
        let myaudio = new Audio("https://www.dl.dropboxusercontent.com/s/z0n3hnw8ky79rwhdokfso/nenesmile.ogg?rlkey=bezzj2pn6c9rj0pqco5kbf7bk&st=ythhncur&dl=0");
        myaudio.volume = defaultVolume;
        myaudio.play();
    }
}

function playBooSound() {
    if (SOUNDPOST_STATE) {
        let myaudio = new Audio("https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/soundposts/sounds/boo.ogg");
        myaudio.volume = defaultVolume;
        myaudio.play();
    }
}

