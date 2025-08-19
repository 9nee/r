# immergrok's Overhaul Changelog

## [UPCOMING, FUTURE, NOT HERE YET]

- Emote overhaul
  - Meta tags and Soundposts inside the emotes themselves.
  - A method to filter and search by meta tags and soundpost status
  - A way to add meta tags and soundposts directly from the bote
  - alt emotes that show up on rotation
- Holopeek v2
- bees?!
- Better ctrl+a
- more cleanup
- re-adding NND mode before christmasTM
  - not legally binding
    - specially if I land this job i'm in wait for

## [1XAug2025 - "Laying out the groundwork"] (WIP)

### Temporary

- [#_] Due to the change in the chat message intercept code, "boo" now only triggers with "/boo", this will be reverted sometime soon.

### Cookies rewritten

- Did you know we've always had methods exposed in the backend to manage cookies? We did. Now we even use them!
- As a matter of fact, we really don't need cookies, we should be using localStorage, I'll see if I get around to it.

### Complete refactors

- No more github417.js, it is now githubLoader.js, hopefully will never have a number again. (Name subject to change)
- Standardized most of the plain JavaScript to JQuery. Now we pester tomboysweat to update to JQuery 3

#### Custom Modules folder

Since I'm moving all single responsibilities to modules, this opens up the posibility of having a menu to pick and choose which modules you want loaded. Just the possibility though, it's not implemented.

- NEW: NeoXaeModules.js (Mostly rewritten!)
- NEW: Holopeek folder with holoPeek.js
- NEW: enhancedEmotes.js (WIP)
- NEW: Custom CSS Injection folder! (read below)
- NEW: rratButton.js
- NEW: nndChatModule.js (Disabled, just leftover code moved)
- NEW: soundpostModule.js (WIP!)
- NEW: mahjongMode.js (Largely rewritten)

#### Polkapeek rewrite

- (reverted) changed the name internally to holopeek, fuck you luxes.
- NEW: The range sliders will now update live, instead of when you refresh the checkbox.
- NEW: Reset button now comes with an alert so you don't reset on accident.
- Holopeek was very tightly tied to (the now rewritten) cookies and riddled with bad code. It still is, but a bit less now.
- [#15] Enable image on link hover hasn't worked for 17 years, just writing it down.
- [#_] Polka leaves if you leave the cursor, it's minor so I'm not going to fix it right now (note: maybe this gets fixed before live?).

#### Offtopic mode rewrite

- Changed the name from "Offtopic mode" to "Mahjong Mode", subject to change.
- It... works now, kinda, mostly, go test it out.

### Large XaeModules rewrite

- The code was pretty cool, and it forms the base of how we load modules, so I rewrote it to better standards.
- Large shoutouts to whoever this Xae is, lots of work were put into the modules.
- Created a function makeLiveCDNLink that should create a working CDN link as long as the following parameters are filled:

```js
/*
Example of local config
Note that this doesn't have to be changed for every update to the commit, just has to be changed when there's relevant changes to be pulled to the JS files. So not when you make a new emote. 
*/
const CURRENT_COMMIT = "37889849fb28717747828d795c9e5af24fa01f34"

```

Similarly, whenever you want to update the js file in the bote, just change the @\<hash> using the last commit hash.

### Standardized CSS Injection Format

> TL;DR: custom_css_injection/customCssInjection.js now contains the CSS objects that we inject into the HTML (e.g: holopeek, confetti)

Many files injected CSS directly into the HTML to then use them, this is "fine" as a workaround for our current purposes and scope, but in turn they filled the "code" files of our repo with 100+ lines long CSS variables that riddled the files with a type code-rot that doesn't even have a common name, because anyone who sees it suffers a brain infart before documenting it.

We will now load these CSS files through a loader module (much like XaeModules, but much simpler in scope and complexity), which load single-IIFE files that append the style onto the HTML.

Needless to say, I don't really like how this implementation is done either, but it's at the very least an initial solution to a black-mold problem we had growing.

Updatilia, please document this...

### Promise resolution during module loading

Go read the technical-documentation if interested, but I put a bunch of effort into this...

### Miscellaneous

- There's a new file called emotetest.js that has the new format for the next big change, I just wanted to get these things out of my way for now.
- Moved string literals into constants at the top of the page (for now, will probably be moved somewhere else)
- Removed the line that made ctrl+a not work, this was intentionally put there by someone, I'm blaming Luxes
  - This of course comes with one or two minor things like the textbox not being automatically focused, but this is better than what we had (which was fucking nothing)
- Renamed github1.css to migobote-stylesheet.css and cleaned it up of a bunch of filth
- Removed a shit ton of JavaScript/CSS backups we had for no reason. For the love of fuck, we use git, we already have those backups by default.

### I *haven't* touched

Most of the XaeModules-modules are intact, completely. Even I'm scared of them for now. So: BetterPms, BetterPlaylist, customSettingsModal, customUserlist, moreLayoutOptions and ~~soundNotifications~~.

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
