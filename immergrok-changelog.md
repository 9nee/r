# immergrok's Overhaul Changelog

## [UPCOMING, FUTURE, NOT HERE YET]

- Emote overhaul
  - Meta tags and Soundposts inside the emotes themselves.
  - A method to filter and search by meta tags and soundpost status
  - A way to add meta tags and soundposts directly from the bote
- Holopeek v2
- bees?!
- Better ctrl+a
- more cleanup
- re-adding NND mode before christmasTM
  - not legally binding
    - specially if I land this job i'm in wait for

## [15Aug2025 - "Laying out the groundwork"]

### Cookies rewritten

- Did you know we've always had methods exposed in the backend to manage cookies? We did. Now we even use them!

### Small file refactors

- No more github417.js, it is now githubLoader.js, hopefully will never have a number again. (Name subject to change)
- Started moving responsibilities away from said githubLoader file.
  - NEW: holoPeek.js
  - NEW: enhancedEmotes.js (WIP)
  - NEW: confetti-styles.js
- Rewrote a lot of base javascript code to JQuery, for consistency and free headaches.

### Polkapeek rewrite

- Changed the name internally to holopeek, fuck you luxes.
- NEW: The range sliders will now update live, instead of when you refresh the checkbox.
- Reset button now comes with an alert so you don't reset on accident.
- Holopeek was very tightly tied to (the now rewritten) cookies and riddled with bad code. It still is, but a bit less now.
- [#15] Enable image on link hover hasn't worked for 17 years, just writing it down.
- [#_] Polka leaves if you leave the cursor, it's minor so I'm not going to fix it right now (note: maybe this gets fixed before live?).

### Offtopic mode rewrite

- Changed the name from "Offtopic mode" to "Mahjong Mode", subject to change.
- It... works now, kinda, mostly, go test it out.

### Overhauled a bunch of the XaeModules code (thanks Xae it's actually super cool)

- Created a function makeLiveCDNLink that should create a working CDN link as long as the following parameters are filled:

```js
/*
Example of local config
Note that this doesn't have to be changed for every update to the commit, just has to be changed when there's relevant changes to be pulled to the JS files. So not when you make a new emote. 
*/
const CURRENT_COMMIT = "37889849fb28717747828d795c9e5af24fa01f34"
//Change to om3tcw when live
const CURRENT_REPO = "immergrok"
```

Similarly, whenever you want to update the js file in the bote, just change the @\<hash> using the last commit hash.

Ideally this will be fillable directly from the cytube at some point, but it's low on the priority list

### Miscellaneous

- There's a new file called emotetest.js that has the new format for the next big change, I just wanted to get these things out of my way for now.
- Moved string literals into constants at the top of the page (for now, will probably be moved somewhere else)
- Removed the line that made ctrl+a not work, this was intentionally put there by someone, I'm blaming Luxes
  - This of course comes with one or two minor things like the textbox not being automatically focused, but this is better than what we had (which was fucking nothing)
- Renamed github1.css to migobote-stylesheet.css and cleaned it up of a bunch of filth

---

## [3Aug2025 - "My bandwidth is saved"]

- Fixed a bunch of Layoutoptions.js code
  - Remove video will stop playing the video, even if a new one starts playing, it won't consume bandwidth
  - Chat only is now restorable by pressing on a new button (Restore Header and Video)
  - [#14]: Under rare circumstances, the video won't update and has to be restored by refreshing the page

---

## \[A while ago - ":jorb: \[r]:jorb:[\/r]"]

- Added reverse tag in its first version, you can use it wrapping emotes and text under \[r][/r]
· Due to how /runescape code works, it doesn't work with /runescape.
