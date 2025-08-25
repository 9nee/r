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
            fileName + 
            "?ver=1"
}

//candidate to move to util.js
function fetchLastChatElement() {
    return $(messagebuffer).children().last().children().last();
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

// UI Enhancements
//This fucking website has every fucking element as a global scope variable I swear to fukcvkigfn
(() => {

    const $chatwrap = $(chatwrap);
    const watermark = 'om3tcw is cuter than usual';
    $chatwrap.attr('placeholder', watermark);

    // Move controls around
    const $formElementsUnderChatWrap = $chatwrap.children('form')
    const $videowrap = $(videowrap);
    $videowrap.append("<span id='vidchatcontrols' style='float:right'>");

    const $emotelistbtn = $(emotelistbtn)
    $emotelistbtn.detach().insertBefore($formElementsUnderChatWrap)
    
    //Sure
    $(leftcontrols).remove();

    const $navBar = $(".nav.navbar-nav");
    const $audioOnly = $('<li><a id="audio-only" href="javascript:void(0)">A/O</a></li>');
    const $holoDex = $("<li class='dropdown'><a target='_blank' href='https://holodex.net/home'>HoloDex</a></li>");
    const $kusasNewStupidAssBitForAugust = $("<li class='dropdown'><a target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmTUBfSR1bgRjQskGCMhnNpV_wZTIyQ17oMAZA1FoD5LY7LA/viewform?usp=sharing&ouid=112222705232140937762'><img src='https://twemoji.maxcdn.com/v/latest/72x72/1f1ec-1f1e7.png' alt='UK Flag' style='width: 1em; vertical-align: middle; margin-right: 0.25em;'>UK Age Verification Form</a></li>");
    
    $navBar.append($holoDex);
    $navBar.append($kusasNewStupidAssBitForAugust)
    $navBar.append($audioOnly);

    $($audioOnly).click(() => {
        $videowrap.toggle();
    });

    const $togglemotd = $('<li><a id="togglemotd" href="javascript:void(0)">MOTD</a></li>');
    const $motdwrap = $(motdwrap);
    $motdwrap.on('click', () => $motdwrap.hide())
    $togglemotd.appendTo($navBar);
    $togglemotd.on('click', () => { 
        $motdwrap.toggle()
        $(motd).toggle();
    })

    const $userlist = $(userlist);
    const $messagebuffer = $(messagebuffer);
    const $chatheader = $(chatheader);
    const $main = $(main);

    $userlist.removeAttr('style');
    $messagebuffer.removeAttr('style');
    //This rebuilds the DOM and makes it fullscreen. neat.
    
    $main.addClass("flex");
    $chatheader.after('<div id="chatdisplayrow" class="row"></div>')
                .next().append($userlist, $messagebuffer)
                .after('<div id="chatinputrow" class="row"></div>')
                .next().append($emotelistbtn, $formElementsUnderChatWrap);

    // Mikoboat
    const mikoDing = new Audio('https://cdn.jsdelivr.net/gh/om3tcw/r@emotes/soundposts/sounds/om3tcw.ogg');
    mikoDing.loop = true;
    mikoDing.volume = 0.1;

    const $navBarBrand = $('.navbar-brand');
    $navBarBrand.attr('href', 'https://files.catbox.moe/om3tcw.webm');
    $navBarBrand.on('mouseenter', () => mikoDing.play());
    $navBarBrand.on('mouseleave', () => mikoDing.pause());


    const githubEmoteFolder = "https://raw.githubusercontent.com/om3tcw/r/emotes/emotes/";
    // Emote metatag update when?
    const randomEmotePool = [
        "anyascone.png",    "anyasip.png",          "anyachicken.png",      "anyaseesyourhotpocket.png",
        "anyatoast.png",    "anyachocoshroom.png",  "anyasourdough.png",    "anyaminecraft.png", 
        "anyaclif.png",     "anyasalman.png",       "anyaeggsandwich.png",  "anyashitpost.png", 
        "anyacereal.png",   "anyatect.png",         "anyasteak.png",        "anyanoodle.png", 
        "anyagogurt.png",   "anyapolitan.png",      "anyagraph.png",        "anyaoreoshake.png", 
        "anyataco.png",     "anyacorndog.png",      "anyaparfait.png",      "anyasandwich.png", 
        "anyamage.png",     "anyapirouette.png",    "anyafry.png",          "anyadonut.png", 
        "anyaknife.png",    "anyaahituna.png",      "anyapumpkinpie.png",   "anyasandwich2.png", 
        "anyart.png",       "anyamouth.png",        "anyawithagun.png",     "anyan.png", 
        "anyainahair.png",  "anyagoslings.png",     "anyacube.png",         "anyamelonsoda.png", 
        "anyamami.png",     "anyablink.png",        "anyawarp.png",         "aranya.png",  
        "anyamail.png",     "anyatoast2.png",       "anyawrappedburger.png","anyasugarcookie.png", 
        "anyachurro.png",   "anyapizza.png",        "anyateef.png",         "anyabread.png",
        "anyavampire.png",
    ];

    const drawRandomEmote = () => randomEmotePool[Math.floor(Math.random() * randomEmotePool.length)];

    $emotelistbtn.click(function () {
        $(this).css("background-image", `url("${githubEmoteFolder}`+ drawRandomEmote() + ")");
    }).html("");

})();

