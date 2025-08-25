# immergrok's Overhaul Changelog

## [UPCOMING, FUTURE, NOT HERE YET]

- Emote overhaul
  - Meta tags and Soundposts inside the emotes themselves.
  - A method to filter and search by meta tags and soundpost status
  - A way to add meta tags and soundposts directly from the bote
  - alt emotes that show up on rotation
- bees?!
- Better ctrl+a
- more cleanup
- re-adding NND mode before christmasTM
  - not legally binding
    - specially if I land this job i'm in wait for

## [XXAug2025 - "Laying out the groundwork"] (WIP)

### Temporary

- [#_] Due to the change in the chat message intercept code, "boo" now only triggers with "/boo", this will be reverted sometime soon. Maybe

### Crackerjack's CDN

FILL THIS PARAGRAPH WHEN WE SETUP A CDN WITH CI/CD!

### Complete refactors and modularization

- No more github417.js, it is now main.js, hopefully will never have a number again. (Name subject to change)
- Standardized most of the plain JavaScript to JQuery. Now we pester tomboysweat to update to JQuery 3
- Seriously, none of the code on the bote followed any rhyme or reason, just parsing it made my brain leak out of my nose. The fact that any of it worked is a miracle that should (NOT) be preserved.

#### Complete Holopeek rewrite

I put my grubby hands all over holopeek. Adding any functionality or touching any line of code made it crumble into dust, so I rewrote it almost in its entirety. Some important changes as follow:

- (Reverted) changed the name internally to holopeek, fuck you luxes.
- NEW: Clicking outside of holopeek will close it. Technology!!!
- NEW: The range sliders will now update their style live, instead of when you refresh the checkbox.
- NEW: Reset button now comes with an alert so you don't reset on accident.
- [#_] Polka leaves if you leave the cursor, it's minor so I'm not going to fix it right now (note: maybe this gets fixed before live?).
- [#_] Clicking on the "Hide Playlist" label will hide the playlist, make no style changes, close holopeek and not check the checkbox. ?????? Literally what the fuck.

#### Offtopic mode rewrite

- Changed the name from "Offtopic mode" to "Mahjong Mode", subject to change.
- It... works now, kinda, mostly, go test it out.

#### Module load logic

> Code jargon explained, you can skip if uninterested, no real functionality added here.

Modules are now tidily kept within their folder, if you want to find for all the code relevant to a specific functionality, you shouldn't spend more time than reading the folder structure and then the file name.

Modules are now orchestrated by two files, `ModuleLoader.js` and `moduleRegistry.js`. The exact inner functionality of these shouldn't really matter if I've done my job correctly.

JavaScript is a bitch, and we handle legacy code and libraries, so I exposed two ways in which we can make sure that a certain module and functionality are loaded.

The first one is the global promise `window.allModulesReady` which is probably, ironically, less reliable than the option to wait for a specific module loaded.

The other global promise `window.waitForModule(name, functionalityWanted)` actually waits and loops for this functionality within the module imported to be globally available, which turns out is not the same as being loaded.

So, when we want a functionality from a module (e.g: Adding an item to holopeek), first export the functionality, then wait for it.

"Name" is exactly the name given to the module in `const ModulePaths`, where functionalityWanted is just the exposed/exported function or variable, which is generally accessible via `window.functionName`

```js
//holoPeek.js
export addToHoloPeek() {};
//mahjongMode.js
await window.waitFormModule("HoloPeek", "addToHoloPeek")
```

This Should All Work TM.

### Standardized CSS Injection Format

> TL;DR: custom_css_injection/customCssInjection.js now contains the CSS objects that we inject into the HTML (e.g: holopeek, confetti)

Many files injected CSS directly into the HTML to then use them, this is "fine" as a workaround for our current purposes and scope, but in turn they filled the "code" files of our repo with 100+ lines long CSS variables that riddled the files with a type code-rot that doesn't even have a common name, because anyone who sees it suffers a brain infart before documenting it.

We will now load these CSS files through a loader module (much like normal modules, but much simpler in scope and complexity), which load single-IIFE files that append the style onto the HTML.

Needless to say, I don't really like how this implementation is done either, but it's at the very least an initial solution to a black-mold problem we had growing.

Updatilia, please document the process...

#### (WIP!) Image on link hover

9nee wanted to fix it and a bunch of people asked for it, so I obliged, it's WIP but maybe I end up pushing this build without finishing it.

### Cookies removed in favor of localStorage

Why were we even using cookies? Who was Kusa selling our information to?

### Miscellaneous

- There's a new file called emotetest.js that has the new format for the next big change, I just wanted to get these things out of my way for now.
- Removed the line that made ctrl+a not work, this was intentionally put there by someone, I'm blaming Luxes
- Renamed github1.css to custom-migobote.css and cleaned it up of a bunch of filth
- Removed a shit ton of JavaScript/CSS backups we had for no reason. For the love of fuck- we use git, we already have those backups by default.

#### Improved emote click and keyboard shortcuts

- Clicking an emote in chat will now write that emote where your cursor last was, instead of at the end of the textbox.
- Ctrl+R and Ctrl+S have better, more consistent code logic when wrapping text (You can select a piece of text, then press Ctrl+R/S, that was undocumented to my knowledge)
- TODO: Ctrl+E?

### I *haven't* touched

Most of the original XaeModules-modules are intact, completely. Even I'm scared of them for now. So: BetterPms, BetterPlaylist, customSettingsModal, customUserlist, ~~moreLayoutOptions~~ and ~~soundNotifications~~.

I'll fix them if they break, but they're each a whole dev cycle on their own to fix and keep up to standard..

---

## [3Aug2025 - "My bandwidth is saved"]

- Fixed a bunch of Layoutoptions.js code
  - Remove video will stop playing the video, even if a new one starts playing, it won't consume bandwidth
  - Chat only is now restorable by pressing on a new button (Restore Header and Video)
  - [#14]: Under rare circumstances, the video won't update and has to be restored by refreshing the page

---

## \[A while ago - ":jorb: \[r]:jorb:[\/r]"]

- Added reverse tag in its first version, you can use it wrapping emotes and text under \[r][/r] or pressing Ctrl+R
  - Due to how /runescape code works, it doesn't work with /runescape.
