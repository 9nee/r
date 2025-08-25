function chatToVideoRatio(self) {
    self.cssData = 
        `#videowrap { width: ${100 - self.value}% !important; }
        #videowrap-header { display: none; }
        #chatwrap { width: ${self.value}% !important; }}` 
}

function chatTransparency(self) {
    const alpha = (100 - self.value) / 100;
    const bgColor = `rgba(0, 0, 0, ${alpha})`;
    self.cssData = 
        `#userlist, #messagebuffer { background-color: ${bgColor} !important; }
        .linewrap { background-color: ${bgColor}; }`
}

let blackBg = `https://raw.githubusercontent.com/${CURRENT_BRANCH}/r/emotes/custom_modules/holopeek/black.png`

export const holoPeekObjects = [
    {
        optionName: "changeBackground", 
        optionDescription: "Custom Background", 
        optionFunc: (self) => self.cssData = `body { background-image: url(${self.inputElement.val()}); }`, 
        type: "text", 
        defaultValue: blackBg
    },
    {
        optionName: "imageHover",
        optionDescription: "Enable image on link Hover",
    },
    {
        optionName: "revealSpoilers",
        optionDescription: "Reveal Spoilers",
        optionFunc: (self) => self.cssData = `.spoiler { color: #ff8; }`,
    },
    {
        optionName: "chatToVideoRatio", 
        optionDescription: "Chat:Video Ratio",
        optionFunc: chatToVideoRatio,
        type: "range",
        defaultValue: 50
    },
    {
        optionName: "chatTransparency",
        optionDescription: "Chat Transparency",
        optionFunc: chatTransparency,
        type: "range",
        defaultValue: 50
    },
    {
        optionName: "invertChatPosition",
        optionDescription: "Invert Chat Position",
        optionFunc: (self) => self.cssData = `#main { flex-direction: row-reverse !important; }`
    },
    {
        optionName: "hidePlaylist",
        optionDescription: "Hide Playlist",
        optionFunc: (self) => self.cssData = `#MainTabContainer { display: none; }`
    },
    {
        optionName: "hideNavBar",
        optionDescription: "Hide Navbar",
        optionFunc: (self) => self.cssData = 
            `#mainpage { padding-top: 0 !important; }
            nav.navbar { display: none !important; }`
    },
    {
        optionName: "hideScrollbars",
        optionDescription: "Hide Scrollbars",
        optionFunc: (self) => self.cssData = 
            `::-webkit-scrollbar { width: 0 !important; }
            * { scrollbar-width: none !important; }`
    }
]