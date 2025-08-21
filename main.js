//XaeModules leftover
if (!window[CHANNEL.name]) {
    window[CHANNEL.name] = {};
}

//XaeModules leftover
if (![CHANNEL.name].favicon) {
    [CHANNEL.name].favicon = $("<link/>")
        .prop("id", "favicon")
        .attr("rel", "shortcut icon")
        .attr("type", "image/png")
        .attr("sizes", "64x64")
        .attr("href", "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/ogey.png")
        .appendTo("head");
}

const LOCAL_CDN_URL = "https://immergrok.mikobotecdn.win/immergrok-cytube-fork";

//For live jsdelivr usage
const JSDELIVR_CDN_URL = "https://cdn.jsdelivr.net/gh/om3tcw/r@"
const CURRENT_COMMIT = ""
const CURRENT_BRANCH = "immergrok" //Change to om3tcw when live

//CHANGE TO JSDELIVR_CDN_URL WHEN LIVE
const CURRENT_CDN = LOCAL_CDN_URL;

const MODULES_FOLDER = "custom_modules/";
const MODULE_REGISTRY = `${MODULES_FOLDER}module_orchestration/moduleRegistry.js`
const MODULE_LOADER = `${MODULES_FOLDER}module_orchestration/ModuleLoader.js`
const ModulePaths = [
    { CSSInjection: `custom_css_injection/customCssInjection.js`},
    { MahjongMode: `chat_modules/mahjongMode.js` },
    { ChatMessageProcessor: `module_orchestration/chatMessageProcessor.js`},
    { TabsBelowVideo: `ui_modules/tabsBelowVideo.js`}, //I wouldn't disable this one
    { CustomSettings:`ui_modules/customSettingsModal.js` },
    { BetterPlaylist: `ui_modules/betterPlaylist.js` },
    { BetterPms: `ui_modules/betterPms.js` },
    { SoundNotifications: `soundNotifications.js` },
    { MoreLayoutOptions: `ui_modules/moreLayoutOptions.js` },
    { CustomUserList: `ui_modules/customUserlist.js` },
    { HoloPeek: `holopeek/holoPeek.js` },
    { MessageModifications: `chat_modules/messageModifications.js`},
    { EnhancedEmotes: `chat_modules/enhancedEmotes.js` },
    { ImagePreview: `chat_modules/imagePreview.js` },
    { Soundposts: `chat_modules/soundpostModule.js` },
    { NNDChatModule: `chat_modules/nndChatModule.js`, isActive: 0, rank: -1}
]

//candidate to move to util.js
function makeLiveCDNLink(fileName) {
    return  CURRENT_CDN +
            CURRENT_COMMIT +
            "/" +
            fileName
}

//candidate to move to util.js
function fetchLastChatElement() {
    return $('#messagebuffer').children().last().children().last();
}

const ModuleLoaderPromise = (async () => {
    const importedModule = await import(makeLiveCDNLink(MODULE_LOADER));
    return importedModule.default;
})();

let resolveAllModulesReady;
window.allModulesReady = new Promise((resolve, reject) => {
    resolveAllModulesReady = resolve;
});

(async function loadLogic() {

    const ModuleLoaderClass = await ModuleLoaderPromise;
    const ModuleLoaderInstance = new ModuleLoaderClass(ModulePaths);

    await ModuleLoaderInstance.initialize();
    await ModuleLoaderInstance.allModulesLoaded;
    resolveAllModulesReady();

})();

//TODO: move to the other ready function?  
$(document).ready(function () {
    const watermark = 'om3tcw is cuter than usual';
    $('#chatwrap').attr('placeholder', watermark);

    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://holodex.net/home'>HoloDex</a></li>");
    $('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmTUBfSR1bgRjQskGCMhnNpV_wZTIyQ17oMAZA1FoD5LY7LA/viewform?usp=sharing&ouid=112222705232140937762'><img src='https://twemoji.maxcdn.com/v/latest/72x72/1f1ec-1f1e7.png' alt='UK Flag' style='width: 1em; vertical-align: middle; margin-right: 0.25em;'>UK Age Verification Form</a></li>");

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

    //:fuwawaburn:
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

