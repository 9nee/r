if (!this[CHANNEL.name]) {
    this[CHANNEL.name] = {};
}

if (!this[CHANNEL.name].favicon) {
    this[CHANNEL.name].favicon = $("<link/>")
        .prop("id", "favicon")
        .attr("rel", "shortcut icon")
        .attr("type", "image/png")
        .attr("sizes", "64x64")
        .attr("href", "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/ogey.png")
        .appendTo("head");
}

//Defining some top level variables
const CURRENT_COMMIT = "9155a4c12952c69d9008ca67195299d03da92d05"
const CURRENT_REPO = "immergrok"

let soundpostState = "false";
let soundpostPlaybackState = {};
const defaultVolume = 0.1;
const defaultAdditionalPlayTime = 3;

const CONFETTI_STYLE = "confetti-styles.js";
const HOLOPEEK_STYLE = "/custom_modules/holopeek/holoPeek-style.js"

const CUSTOM_SETTINGS_MODAL = "/custom_modules/customSettingsModal.js";
const BETTER_PLAYLIST = "/custom_modules/betterPlaylist.js";
const BETTER_PMS = "/custom_modules/betterPms.js";
const SOUND_NOTIFICATIONS = "/custom_modules/soundNotifications.js";
const MORE_LAYOUT_OPTIONS = "/custom_modules/moreLayoutOptions.js";
const USERLIST_ENHANCEMENT = "/custom_modules/customUserlist.js";
const ENHANCED_EMOTES = "/custom_modules/enhancedEmotes.js";
const HOLOPEEK = "/custom_modules/holopeek/holoPeek.js"

//Change to om3tcw on live

function makeLiveCDNLink(customFork, fileName) {
    //customFork should be immergrok, om3tcw or whatever fork is owned
    return "https://cdn.jsdelivr.net/gh/" + 
            customFork +
            "/r@" +
            CURRENT_COMMIT +
            "/" +
            fileName
}

function makeLiveCDNLink(fileName) {
    return "https://cdn.jsdelivr.net/gh/" + 
            CURRENT_REPO +
            "/r@" +
            CURRENT_COMMIT +
            "/" +
            fileName
}

let soundposts;

fetch('https://raw.githubusercontent.com/om3tcw/r/emotes/soundposts/soundposts.json')
    .then(response => response.json())
    .then(data => {
        soundposts = data;
    })
    .catch(error => {
        console.error(error);
    });


$(document).ready(() => {
    soundpostState = readCookie("soundpostState") === "true";

    fetchAndInjectStylesheet(CONFETTI_STYLE, injectConfettiStyles);
    fetchAndInjectStylesheet(HOLOPEEK_STYLE, injectHoloPeekStyle);

    $('#messagebuffer [class|="chat-msg"]').each(function() {
        const $element = $(this); 
        const $messageElement = $element.children().last();
        formatMessage($messageElement);

        if ($messageElement.html().startsWith('MJ:')) {
            formatMJMessage($messageElement)
        }
    })
    toggleMJMessages();
});

function fetchAndInjectStylesheet(cdnUrl, injectionFunction) {
    $.getScript(makeLiveCDNLink(cdnUrl))
        .done(() => {
            injectionFunction();
        })
        .fail((_, textStatus, errorThrown) => {
            console.error(`Failed to load ${cdnUrl}.js:`, textStatus, errorThrown);
        })
}

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

const xaeModule = {
    options: {
        playlist: {
            collapse: false,
            hidePlaylist: true,
            inlineBlame: true,
            moveReporting: false,
            quickQuality: false,
            recentMedia: true,
            simpleLeader: true,
            syncCheck: true,
            thumbnails: true,
            timeEstimates: true,
            userlist: { autoHider: true },
            smartScroll: false,
            maxMessages: 120
        },
        various: { notepad: true, emoteToggle: false }
    },
    modules: {
        customSettings: { active: 1, rank: -1, url: makeLiveCDNLink(CUSTOM_SETTINGS_MODAL), done: true },
        playlistEnhancement: { active: 1, rank: -1, url: makeLiveCDNLink(BETTER_PLAYLIST), done: true },
        pmEnhancement: { active: 1, rank: 1, url: makeLiveCDNLink(BETTER_PMS), done: true },
        soundNotifications: { active: 1, rank: -1, url: makeLiveCDNLink(SOUND_NOTIFICATIONS), done: true },
        moreLayoutOptions: { active: 1, rank: -1, url: makeLiveCDNLink(MORE_LAYOUT_OPTIONS), done: true },
        userlistEnhancement: { active: 1, rank: -1, url: makeLiveCDNLink(USERLIST_ENHANCEMENT), done: true },
        enhancedEmotes: { active: 1, rank: -1, url: makeLiveCDNLink(ENHANCED_EMOTES), done: true },
        holoPeek: { active: 1, rank: -1, url: makeLiveCDNLink(HOLOPEEK), done: true },
        html2canvas: { active: 1, rank: -1, url: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", done: true }
    },
    getScript(url, success, cache = true) {
        return $.ajax({ url, cache, success, type: "GET", dataType: "script" });
    },
    initialize() {
        if (CLIENT.modules) return;
        CLIENT.modules = this;
        window[CHANNEL.name].modulesOptions = this.options;
        console.info("[XaeModule]", "Begin Loading.");
        this.index = Object.keys(this.modules);
        this.sequencerLoader();
        this.cache = false;
    },
    sequencerLoader() {
        if (this.state.prev) {
            setTimeout(this.modules[this.state.prev].done, 0);
            this.state.prev = "";
        }
        if (this.state.pos >= this.index.length) {
            console.info("[XaeModule]", "Loading Complete.");
            return;
        }
        const currKey = this.index[this.state.pos];
        if (this.state.pos < this.index.length) {
            if (this.modules[currKey].active) {
                if (this.modules[currKey].rank <= CLIENT.rank) {
                    console.info("[XaeModule]", "Loading:", currKey);
                    this.state.prev = currKey;
                    this.state.pos++;
                    const cache = typeof this.modules[currKey].cache === "undefined" ? this.cache : this.modules[currKey].cache;
                    this.getScript(this.modules[currKey].url, this.sequencerLoader.bind(this), cache);
                } else {
                    if (this.modules[currKey].rank === 0 && CLIENT.rank === -1) {
                        socket.once("login", data => {
                            if (data.success) {
                                this.getScript(this.modules[currKey].url, false, this.cache);
                            }
                        });
                    }
                    this.state.pos++;
                    this.sequencerLoader();
                }
            } else {
                this.state.pos++;
                this.sequencerLoader();
            }
        }
    },
    state: { prev: "", pos: 0 }
};

xaeModule.initialize();

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
    const inputBox = $("chatline");
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

// Replace Video
(function () {
    $('#plcontrol').append('<input type="button" class="btn btn-sm btn-default" value="🐀" id="replacebutton">');
    $('#plcontrol').append('<input type="button" class="btn btn-sm btn-default" value="🔃" id="refreshbutton">');

    $('#replacebutton').click(function () {
        let newId = window.prompt("Replace the current playing stream\nRefresh to undo\n\nSwitching back to YouTube from Twitch is broken, so reloading the player is necessary in that case\n\nYoutube URL/ID:", "");
        let newSource = "YT";

        if (newId == null) {
            newId = "";
        } else if (newId.includes("https://youtube.com/watch?v=")) {
            newId = newId.replace('https://youtube.com/watch?v=', '').substring(0, 11);
        } else if (newId.includes("https://www.youtube.com/watch?v=")) {
            newId = newId.replace('https://www.youtube.com/watch?v=', '').substring(0, 11);
        } else if (newId.includes("https://youtu.be/")) {
            newId = newId.replace('https://youtu.be/', '').substring(0, 11);
        } else if (newId.includes("https://www.twitch.tv/")) {
            newId = newId.replace('https://www.twitch.tv/', '');
            newSource = "TTV";
        } else if (newId.includes("https://twitch.tv/")) {
            newId = newId.replace('https://twitch.tv/', '');
            newSource = "TTV";
        } else if (newId === "om3tcw") {
            newId = "cJtkxZrUicI";
        } else if (newId === "ogey" || newId === "rrat" || newId === "ogey rrat") {
            newId = "JacN1MzyeKo";
        } else if (newId.length !== 11) {
            alert("Invalid input.\nExample input: https://www.youtube.com/watch?v=X9zw0QF12Kc, https://youtu.be/X9zw0QF12Kc, X9zw0QF12Kc, https://www.twitch.tv/holofightz, https://twitch.tv/holofightz");
            newId = "";
        }

        document.body.classList.add('chatOnly');
        socket.emit("removeVideo");
        CLIENT.videoRemoved = true;

        if (newId !== "") {
            const playerSrc = newSource === "YT"
                ? `https://www.youtube.com/embed/${newId}?autohide=1&autoplay=1&controls=1&iv_load_policy=3&rel=0&wmode=opaque&enablejsapi=1&origin=https%3A%2F%2Fom3tcw.com&widgetid=2`
                : `https://player.twitch.tv?channel=${newId}&parent=om3tcw.com&referrer=location.host`;
            $("ytapiplayer").src = playerSrc;
        }
    });

    $('#refreshbutton').click(function () {
        document.body.classList.remove('chatOnly');
        $("mediarefresh").click();
        socket.emit("restoreVideo");
        CLIENT.videoRemoved = false;
    });
})();

// Image Hover
const ImageHoverEnable = false;

//TODO: broken for like 4 years now
function createHoverImage(jqChatMessage) {
    jqChatMessage.find("a").bind("mouseenter", function () {
        if (ImageHoverEnable) {
            const messageAfter = $(this).parent().next();
            if (!messageAfter.is("img")) {
                const newImg = new Image();
                newImg.style.display = "none";
                newImg.onload = function () {
                    this.classList.add("imageHoverPreview", "imageLoaded");
                };
                newImg.src = $(this).html();
                $(this).parent().after(newImg);
            }
            $("#messagebuffer div:hover .imageHoverPreview").stop(true, false).slideDown(100);
            $("#messagebuffer div:hover").one("mouseout", function () {
                $(this).children(".imageHoverPreview").stop(true, true).slideUp(100).delay(100).removeAttr("style");
            });
        }
    });
}

$("#messagebuffer").bind('DOMNodeInserted', function (event) {
    $(event.target).find("a").parent().parent().each(function () {
        createHoverImage($(this));
    });
});

$("#messagebuffer a").parent().parent().each(function () {
    createHoverImage($(this));
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

// Slav's Enhancements

let html2canvasScript = document.createElement('script');
html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
document.head.appendChild(html2canvasScript);

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

let playedSoundposts = [];

function nicomessage(myplayer, mycontainer, mymsg) {
    mycontainer.appendChild(mymsg);

    mymsg.addEventListener("transitionend", function () {
        mymsg.remove();
    }, { once: true });

    setTimeout(function () {
        mymsg.remove();
    }, 10000);

    let maxLane = Math.floor(myplayer.clientHeight / 32) - 1;
    let lane = Math.floor(Math.random() * (maxLane + 1));
    let playerWidth = myplayer.clientWidth;
    let thisWidth = mymsg.clientWidth;

    mymsg.style.top = (32 * lane) + 'px';
    mymsg.style.right = (0 - thisWidth) + 'px';
    mymsg.classList.add('moving');
    requestAnimationFrame(function () {
        mymsg.style.visibility = 'visible';
        mymsg.style.right = playerWidth + 'px';
    });
}

function nicoprocess(mymsg, myclass) {
    const container = document.getElementsByClassName("videochatContainer")[0];
    const player = $("ytapiplayer");
    if (!container || !player) return;

    if (mymsg.innerHTML.trim()) {
        let txt = document.createElement("div");
        txt.classList.add('videoText');
        if (myclass.trim()) txt.classList.add(myclass);
        txt.style.visibility = "hidden";
        txt.innerHTML = mymsg.innerHTML;

        const imgs = txt.getElementsByTagName("img");
        let loadedImgs = 0;

        [...imgs].forEach(img => {
            img.onload = () => {
                if (++loadedImgs === imgs.length) nicomessage(player, container, txt);
            };
        });

        if (imgs.length === 0) nicomessage(player, container, txt);
    }
}

$('.head-NNDCSS').remove();
$('.videochatContainer').remove();

const NNDCSSRules = `
  .videoText {
    color: white;
    position: absolute;
    z-index: 1;
    cursor: default;
    white-space: nowrap;
    font-family: 'Meiryo', sans-serif;
    letter-spacing: 0.063em;
    user-select: none;
    text-shadow: 0 -0.063em #000, 0.063em 0 #000, 0 0.063em #000, -0.063em 0 #000;
    pointer-events: none;
  }
  .videoText.moving {
    transition: right ${7}s linear, left ${7}s linear;
  }
  .videoText.greentext {
    color: #789922;
  }
  .videoText img, .videochatContainer .channel-emote {
    box-shadow: none!important;
    vertical-align: middle!important;
    display: inline-block!important;
    transition: none!important;
  }
  .videoText.shout {
    color: #f00;
  }
`;

$('<style />', {
    'class': 'head-NNDCSS',
    text: NNDCSSRules
}).appendTo('head');

$('.embed-responsive').prepend($('<div/>', {
    'class': 'videochatContainer'
}));


function initializeSoundpost(emote, soundurl, preload = false) {
    if (!soundpostPlaybackState[emote]) {
        soundpostPlaybackState[emote] = {
            audio: new Audio(soundurl),
            totalPlayTime: 0,
            isPlaying: false,
            timeout: null,
            isPreloaded: false
        };

        soundpostPlaybackState[emote].audio.volume = defaultVolume;
        if (preload) {
            soundpostPlaybackState[emote].audio.addEventListener('canplaythrough', () => {
                soundpostPlaybackState[emote].isPreloaded = true;
            }, { once: true });
        }
    }
}

function playSoundpost(emote, additionalPlayTime = defaultAdditionalPlayTime) {
    const soundpost = soundpostPlaybackState[emote];
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

function cleanupSoundpostPlaybackState() {
    const limit = 40; 
    const keys = Object.keys(soundpostPlaybackState);
    if (keys.length > limit) {
        const toDelete = keys.slice(0, keys.length - limit);
        toDelete.forEach(key => {
            if (soundpostPlaybackState[key].audio) {
                soundpostPlaybackState[key].audio.pause();
                soundpostPlaybackState[key].audio.src = "";
            }
            delete soundpostPlaybackState[key];
        });
    }
}

socket.on("chatMsg", ({ username, msg, meta, time }) => {

    const $messageElement = $('#messagebuffer').children().last().children().last();
    const $messageText = $messageElement.text()

    if ($messageText.startsWith('/')) {
        formatMessage($messageElement);
    }

    if ($messageText.startsWith('MJ:')) {
        formatMJMessage($messageElement)
    }

    if (!['[server]', '[voteskip]'].includes(username.toLowerCase()) && username !== "numbertrees") {

        Object.keys(secretMJEmotes).forEach(secretEmote => {
            const escapedEmote = secretEmote.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');
            const regex = new RegExp(escapedEmote, 'g');
            if (canReadMJMessages()) {
                $messageElement.html($messageElement.html().replace(regex,
                    `<img class="channel-emote" title="${secretEmote}" src="${secretMJEmotes[secretEmote]}">`));
            } else {
                $messageElement.html($messageElement.html().replace(regex, ''));
            }
        });

        if (soundpostState) {
            const $emotes = $messageElement.find('.channel-emote[title]');
            $emotes.each((index, element) => {
                const $emote = $(element)
                const emoteTitle = $emote.attr('title')
                const soundpost = soundposts[emoteTitle];

                if (soundpost) {
                    const preload = (emoteTitle === ":homuhomu:" || emoteTitle === ":rratate:" || emoteTitle === "bakushin");
                    initializeSoundpost(emoteTitle, soundpost.soundurl, preload);

                    if (preload && soundpostPlaybackState[emoteTitle].isPreloaded) {
                        playSoundpost(emoteTitle, 5);
                    } else if (preload) {
                        soundpostPlaybackState[emoteTitle].audio.addEventListener('canplaythrough', () => {
                            playSoundpost(emoteTitle, 3);
                        }, { once: true });
                    } else if (!playedSoundposts.includes(soundpost.soundurl)) {
                        const myaudio = new Audio(soundpost.soundurl);
                        myaudio.volume = defaultVolume;
                        myaudio.play();
                        playedSoundposts.push(soundpost.soundurl);
                    }
                }
            });
        }
        playedSoundposts = [];
    }
cleanupSoundpostPlaybackState();
});

function formatMessage($message) {
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
    if (soundpostState) {
        let myaudio = new Audio("https://www.dl.dropboxusercontent.com/s/z0n3hnw8ky79rwhdokfso/nenesmile.ogg?rlkey=bezzj2pn6c9rj0pqco5kbf7bk&st=ythhncur&dl=0");
        myaudio.volume = defaultVolume;
        myaudio.play();
    }
}

function playBooSound() {
    if (soundpostState) {
        let myaudio = new Audio("https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/soundposts/sounds/boo.ogg");
        myaudio.volume = defaultVolume;
        myaudio.play();
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

