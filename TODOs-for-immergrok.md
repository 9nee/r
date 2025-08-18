# gwak

- CTRL+A throws error if textbox is empty
- MofuMofuRisu: <https://pastebin.com/pStfz18V> put this as the default shit in the polkapeek  [:ayamepray:]
- the options window stays up but polka disappears when not mousing over her
- "make the bees fly"
- Egao: make the mods able to turn of and on the change votes option
- "live reaction"
- ctrl + e opens up emotes
- [HIGH PRIO] dropdown for styles
- make holopeek bigger?
- low-bandwidth mode (gifs unload or don't load)
- you shouldn't have to make the constant for the module and then add the module, it should be a single update and maybe a function that parametrizes it

```js
if (!['[server]', '[voteskip]'].includes(username.toLowerCase()) && username !== "softbanneduser")
```

- this piece of code is repeated and should be exported to something readable and reusable
- MOVE THE IIFE FROM THE PROMISES TO THE XAEMODULE LOAD ROUTINE ITSELF
- [HIGH PRIO] CI/CD/a method to remove all cookies on live deployment
  - mostly because it's good resume CV fluff.
- handle errors when fetching a script that isn't found in the getscript part of xaemodules
- CURRENT BUGS:
  - EMOTES DON'T SCROLL THE SCREEN
  - XAEMODULES DON'T USE PROMISES

- You can turn a discord external CDN image into the original source
- <https://images-ext-1.discordapp.net/external/1EaJOBLrzSlcPgd5UaEtPplZ6cZRIGCotFchDrYWFPE/%3Fformat%3Djpg%26name%3Dsmall/https/pbs.twimg.com/media/GyifgfgXsAA0iPx?format=webp&width=745&height=672> finding "https/pbs.twimg" turns it into <https://pbs.twimg.com/media/GyifgfgXsAA0iPx> which then when you add ?format=jpg&name=small turns into a visible image
