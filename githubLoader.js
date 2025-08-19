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

const CURRENT_COMMIT = "3226cb966baf19df4540d421e5d1bba9f10ddfcf"

//Change to om3tcw when live
const CURRENT_BRANCH = "immergrok"

let SOUNDPOSTS = {}
let SOUNDPOST_STATE = "false";
let SOUNDPOST_PLAYBACK_STATE = {};
let PLAYED_SOUNDPOSTS = [];
const defaultVolume = 0.1;
const defaultAdditionalPlayTime = 3;

const MODULES_FOLDER = "custom_modules/";
const MODULE_REGISTRY = `${MODULES_FOLDER}moduleRegistry.js`
const ModulePaths = [
    `custom_css_injection/customCssInjection.js`,
    `customSettingsModal.js`,
    `betterPlaylist.js`,
    `betterPms.js`,
    `soundNotifications.js`,
    `moreLayoutOptions.js`,
    `customUserlist.js`,
    `enhancedEmotes.js`,
    `holopeek/holoPeek.js`,
    `mahjongMode.js`,
    `imagePreview.js`,
    { name: `nndChatModule.js`, isActive: 0, rank: -1}
]

function makeLiveCDNLink(fileName) {
    return "https://cdn.jsdelivr.net/gh/" + 
            "om3tcw" +
            "/r@" +
            CURRENT_COMMIT +
            "/" +
            fileName
}

function fetchLastChatElement() {
    return $('#messagebuffer').children().last().children().last();
}

(async function loadSoundposts() {
    const response = await fetch('https://raw.githubusercontent.com/om3tcw/r/emotes/soundposts/soundposts.json');
    return await response.json();
})().then((data) => {
    SOUNDPOSTS = data;
})

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
    
    //Your motherfucking life ends 5 minutes from now
    SOUNDPOST_STATE = readCookie("SOUNDPOST_STATE");;

    $('#messagebuffer [class|="chat-msg"]').each(async (index, element) => {
        const $jqElement = $(element); 
        const $messageElement = $jqElement.children().last();
        await globalMessageFormatInjection({$message: $messageElement});
    })
})();

//TODO: move to the other ready function?  
$(document).ready(function () {
    const watermark = 'om3tcw is cuter than usual';
    $('#chatwrap').attr('placeholder', watermark);

    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://holodex.net/home'>HoloDex</a></li>");
    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmTUBfSR1bgRjQskGCMhnNpV_wZTIyQ17oMAZA1FoD5LY7LA/viewform?usp=sharing&ouid=112222705232140937762'><img src='https://twemoji.maxcdn.com/v/latest/72x72/1f1ec-1f1e7.png' alt='UK Flag' style='width: 1em; vertical-align: middle; margin-right: 0.25em;'>UK Age Verification Form</a></li>");

});

// Tabs
{
    const tabContainer = $('<div id="MainTabContainer"></div>').appendTo('#videowrap');
    const tabList = $('<ul class="nav nav-tabs" role="tablist"></ul>').appendTo(tabContainer);
    const tabContent = $('<div class="tab-content"></div>').appendTo(tabContainer);

    // Playlist Tab
    $('<div role="tabpanel" class="tab-pane active" id="playlistTab"></div>')
        .appendTo(tabContent)
        .append($('#rightcontrols').detach())
        .append($('#playlistrow').detach().removeClass('row'));
    const playlistButton = $('<li class="active" role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#playlistTab">Playlist</a></li>').appendTo(tabList);

    if (getOrDefault(CHANNEL.name + "chinkspy", false)) {
        $('body').append('<span id="pnl_options" style="position:absolute;display:none;left:0;top:30px;padding-top:10px;width:100%;background:rgba(0,0,0,0.5);z-index:2;"></span>');
        $('<li><a id="btn_playList" class="pointer">Playlist</a></li>').insertAfter('#settingsMenu')
            .click(function () {
                if ($('#pnl_options').css('display') === 'none') {
                    $('#rightcontrols').detach().appendTo('#pnl_options');
                    $('#playlistrow').detach().appendTo('#pnl_options');
                    $('#pnl_options').slideDown();
                } else {
                    $('#pnl_options').slideUp();
                }
            });
        playlistButton.on('mousedown', function () {
            $('#rightcontrols').detach().appendTo('#playlistTab');
            $('#playlistrow').detach().appendTo('#playlistTab');
        });
    }

    // Polls Tab
    $('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#pollsTab">Polls <span id="pollsbadge" class="badge" style="background-color:#FFF;color:#000;"></span></a></li>')
        .appendTo(tabList).click(function () {
            $('#pollsbadge').text('');
        });
    $('<div role="tabpanel" class="tab-pane" id="pollsTab"><div class="col-lg-12 col-md-12" id="pollhistory"></div></div>')
        .appendTo(tabContent).prepend($('#newpollbtn').detach());

    const redoPollwrap = function () {
        $('#pollwrap').detach().insertBefore('#MainTabContainer');
        $('#pollwrap .well span.label.pull-right').detach().insertBefore('#pollwrap .well h3');
        $('#pollwrap button.close').off("click").click(function () {
            $('#pollwrap').detach().insertBefore('#pollhistory');
            if (!$('#pollsTab').hasClass('active')) {
                const badgeTxt = $('#pollsbadge').text();
                $('#pollsbadge').text((badgeTxt ? parseInt(badgeTxt) : 0) + 1);
            }
        });
    };

    const base_newPoll = Callbacks.newPoll;
    Callbacks.newPoll = function (data) {
        base_newPoll(data);
        if (!$('#pollsTab').hasClass('active') && $('#MainTabContainer #pollwrap').length === 0) {
            const badgeTxt = $('#pollsbadge').text();
            const pollCnt = $('#pollwrap .well.muted').length + (badgeTxt ? parseInt(badgeTxt) : 0);
            $('#pollsbadge').text(pollCnt);
        }

        $('#pollwrap .well.muted').detach().prependTo('#pollhistory');
        redoPollwrap();
    };
    redoPollwrap();

    // oshieyes google

    $('<div role="tabpanel" class="tab-pane" id="calendarTab"><iframe width="100%" height="600" frameborder="0" scrolling="auto"></iframe></div>').appendTo(tabContent);
    $('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#calendarTab">Oshi Eyes</a></li>').appendTo(tabList);
    const baseCalendarUrl = 'https://docs.google.com/forms/d/1oqO8DIIyxuKVPvhXSAmxNCy5zCkS8XQAhEKi8a9BK1g/viewform?';

    let calendars = getOrDefault(CHANNEL.name + '_CALENDARS', null);
    if (!Array.isArray(calendars)) {
        setOpt(CHANNEL.name + '_CALENDARS', calendars = [{ src: 'd426h89oqa3krrq8cj00kbasgo%40group.calendar.google.com', color: '2952A3' }]);
    }
    window.AddCalendar = function (src, color) {
        setOpt(CHANNEL.name + '_CALENDARS', getOrDefault(CHANNEL.name + '_CALENDARS', []).concat([{ src, color }]));
    };

    $('#calendarTab iframe').attr('src', baseCalendarUrl + '&');
    $('#leftpane').remove();
}

// Keybinds
let keyHeld = false;
$(window).bind('keyup', function () { keyHeld = false; });
$(window).bind('keydown', function (event) {
    const inputBox = $("#chatline");
    const inputVal = inputBox.value;
    if (event.ctrlKey && !event.shiftKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
            case 'a':
                if (!keyHeld) {
                    if (inputVal.length )
                    keyHeld = true;
                    inputBox.focus();
                    inputBox.setSelectionRange(0, inputVal.length);
                }
                break;
            case 's':
                if (!keyHeld) {
                    keyHeld = true;
                    event.preventDefault();
                    const selSt = inputBox.selectionStart;
                    const selEnd = inputBox.selectionEnd;
                    if (inputBox === document.activeElement) {
                        if (inputBox.selectionStart === inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[sp]" + inputVal.substring(selSt, selEnd) + "[/sp]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selSt + 4, selSt + 4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[sp]" + inputVal.substring(selSt, selEnd) + "[/sp]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selEnd + 9, selEnd + 9);
                        }
                    }
                }
                break;
            case 'r':
                if (!keyHeld) {
                    keyHeld = true;
                    event.preventDefault();
                    event.stopPropagation();
                    const selSt = inputBox.selectionStart;
                    const selEnd = inputBox.selectionEnd;
                    if (inputBox === document.activeElement) {
                        if (inputBox.selectionStart === inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[r] " + inputVal.substring(selSt, selEnd) + " [/r]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selSt + 4, selSt + 4);
                        } else if (inputBox.selectionStart < inputBox.selectionEnd) {
                            inputBox.value = inputVal.substring(0, selSt) + "[r] " + inputVal.substring(selSt, selEnd) + " [/r]" + inputVal.substring(selEnd, inputVal.length);
                            inputBox.setSelectionRange(selEnd + 9, selEnd + 9);
                        }
                    }
                }
                break;
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

$('#messagebuffer').off('click').click(e => {
    let t = e.target, p = t.parentElement;
    if (e.button != 0) return;
    if (t.className == 'channel-emote')
        $('#chatline').val((i, v) => v + e.target.title + " ").focus();
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

function initializeSoundpost(emote, soundurl, preload = false) {
    if (!SOUNDPOST_PLAYBACK_STATE[emote]) {
        SOUNDPOST_PLAYBACK_STATE[emote] = {
            audio: new Audio(soundurl),
            totalPlayTime: 0,
            isPlaying: false,
            timeout: null,
            isPreloaded: false
        };

        SOUNDPOST_PLAYBACK_STATE[emote].audio.volume = defaultVolume;
        if (preload) {
            SOUNDPOST_PLAYBACK_STATE[emote].audio.addEventListener('canplaythrough', () => {
                SOUNDPOST_PLAYBACK_STATE[emote].isPreloaded = true;
            }, { once: true });
        }
    }
}

function playSoundpost(emote, additionalPlayTime = defaultAdditionalPlayTime) {
    const soundpost = SOUNDPOST_PLAYBACK_STATE[emote];
    soundpost.totalPlayTime += additionalPlayTime;

    if (!soundpost.isPlaying && soundpost.isPreloaded) {
        soundpost.isPlaying = true;
        soundpost.audio.play();
    }

    clearTimeout(soundpost.timeout);

    const remainingTime = soundpost.audio.duration - soundpost.audio.currentTime;
    const playDuration = Math.min(soundpost.totalPlayTime, remainingTime);

    soundpost.timeout = setTimeout(() => {
        soundpost.audio.pause();
        soundpost.isPlaying = false;
        soundpost.audio.currentTime = 0;
        soundpost.totalPlayTime = 0;
    }, playDuration * 1000);
}

function cleanupSoundpostPlaybackState() {
    const limit = 40; 
    const keys = Object.keys(SOUNDPOST_PLAYBACK_STATE);
    if (keys.length > limit) {
        const toDelete = keys.slice(0, keys.length - limit);
        toDelete.forEach(key => {
            if (SOUNDPOST_PLAYBACK_STATE[key].audio) {
                SOUNDPOST_PLAYBACK_STATE[key].audio.pause();
                SOUNDPOST_PLAYBACK_STATE[key].audio.src = "";
            }
            delete SOUNDPOST_PLAYBACK_STATE[key];
        });
    }
}

async function globalMessageFormatInjection({ username = "undefined", 
                                        $message = "undefined", 
                                        meta = undefined, 
                                        time = undefined}) {
    const $messageText = $message.text()

    if ($messageText.startsWith('/')) {
        formatCommandMessage($message);
    }

    if (!['[server]', '[voteskip]'].includes(username.toLowerCase()) && username !== "numbertrees") {

        if (SOUNDPOST_STATE) {
            const $emotes = $message.find('.channel-emote[title]');
            $emotes.each((index, element) => {
                const $emote = $(element)
                const emoteTitle = $emote.attr('title')
                const soundpost = SOUNDPOSTS[emoteTitle];

                const longEmotes = [":homuhomu:", ":rratate:", "bakushin", "calliboy"]

                if (soundpost) {
                    const preload = longEmotes.includes(emoteTitle);
                    initializeSoundpost(emoteTitle, soundpost.soundurl, preload);

                    if (preload && SOUNDPOST_PLAYBACK_STATE[emoteTitle].isPreloaded) {
                        playSoundpost(emoteTitle, 5);
                    } else if (preload) {
                        SOUNDPOST_PLAYBACK_STATE[emoteTitle].audio.addEventListener('canplaythrough', () => {
                            playSoundpost(emoteTitle, 3);
                        }, { once: true });
                    } else if (!PLAYED_SOUNDPOSTS.includes(soundpost.soundurl)) {
                        const myaudio = new Audio(soundpost.soundurl);
                        myaudio.volume = defaultVolume;
                        myaudio.play();
                        PLAYED_SOUNDPOSTS.push(soundpost.soundurl);
                    }
                }
            });
        }
        PLAYED_SOUNDPOSTS = [];
    }
cleanupSoundpostPlaybackState();
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

