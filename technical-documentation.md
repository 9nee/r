# Notes for further development

Just kidding this is documentation written for non developers at this point

## Reverse

In its current implementation reverse is a two-part piece of code
The first is a css rule, and the second is two filter lists.
If one must edit these, this should be taken into account, no "code" regarding the reverse addition can be found in this repo.

## Module Loading (Synchronizing states)

XaeModules are the most held-together-by-spit-hopes-and-dreams piece of code I've ever encountered, so I've rewritten the way the modules are loaded in its entirety. We still use some legacy XaeModules and I'm genuinely scared to touch them, but the load and orchestration logic is entirely new.

The current load logic is the following:

1. Base Cytube JS is loaded, HTML is called but loads later.
2. Our JS file is called
3. The const ModuleLoaderPromise (subject to change) is called, this loads the remote file ModuleLoader.js
4. The loadLogic async IIFE is run, this does the following:
   1. Instantiate the Modules with an array of paths.
   2. Load the Module Registry module.
   3. Load every other module.
   4. Wait until they're loaded*
   5. Run the rest of the logic.

(*) They may very well be loaded as a script within the DOM, but they might not be accessible in the global scope.

So now posing the following scenario:

- Module 1 Requires Holopeek to exist
- When pressing a button in Holopeek, it runs a function from module 1.

If Holopeek or Module 1 haven't loaded by the time that the code is *read* (Not executed!) the whole module will crash.

I made a module registry that can be accessed through:

- `window.moduleRegistry.waitForReady("ModuleName") //Returns Promise`
- `window.moduleRegistry.isReady("ModuleName") //Returns Boolean`
- `window.moduleRegistry.markReady("ModuleName") //Resolves the Promise`

Or, the more robust and preferred solution:

- `window.waitForModule("ModuleName", function) //Returns Promise`

`moduleRegistry.js`

```js
window.waitForModule = (async (name, functionalityWanted = null) => {
  if (!window.moduleRegistry.isReady(name)) {
    await window.moduleRegistry.waitForReady(name);
  }

  if (functionalityWanted) {
    while (typeof window[functionalityWanted] === 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
  }
})
```

`mahjongMode.js`

```js
//This adds the Mahjong Mode toggles to Holopeek.
await window.waitForModule("HoloPeek", "addItemToHoloPeek")
window.addItemToHoloPeek(...)
```

Alternatively, and because sometimes you need multiple things loaded at the same time, you also have access to the following:

`chatMessageProcessor.js`

```js
await window.allModulesReady;
```

### How to add a new script

**You add it to the ModulePaths constant**, that's kind of it. At least for right now, the way in which it will be done (and for the foreseeable future unless we get 20 more modules) will just be adding the name of the file, and putting said file in the custom_modules folder.

This folder is already getting bloated, but for now it's fine 🙂

The formatter accepts either a string or an Object, if it's a string it's simple enough, if it's an object it has to have the following syntax:

```js
const ModulePaths = [
  { ANormalModule: `modulePath.js`}, 
  { ... },
  { NNDChatModule: `chat_modules/nndChatModule.js`, isActive: 0, rank: -1}
]
```

**isActive**: provides another way of disabling the script other than removing its name, this is nice in the case in the future I decide that the scripts should be loaded by looping through a folder's contents. Which will probably be the case.

**rank**: That's the cytube rank, -1 is Anonymous IIRC. If you want to make a script *only* available for purples, for whatever reason.

If you need the script to interact with any other script, refer to the Module Registry example

## Socket.on('chatMsg', ()); chatMessageProcessor.js

Originally, while writing the first draft of this documentation, I realized that the current implementation was bad.
So I rewrote all of that, now we have `chatMessageProcessor.js`

If you have a module that effects changes onto a DOM element after a chat message is sent (e.g: starts with MJ:, starts with /, contains a specific stirng), the way you want to make this change take effect is by tapping onto the socket.

The socket emits events whenever certain actions are done, one of them is the server emitting a "chatMsg" so that the code can translate that into the messages seen in the chat.

By tapping into this socket, with a `socket.on('chatMsg', ()=>{})`, we can then call an util function `fetchLastChatMessage()` and edit the message on the HTML itself.

But instead of having `n` modules doing this and tapping the socket, we instead use a single function that acts as an orchestrator.

In `chatMessageProcessor.js` we expose the array `window.chatMsgSocketTapFunctions = []`, and if we push a function onto it, it will be ran in the following loop:

```js
  for (const func of window.chatMsgSocketTapFunctions) {
    func($messageElement);
  }
```

This functionality can be extended and added at will for anything relating to DOM message manipulation, including a currently unused `window.postMessageTapFunctions` and an IIAFE that runs the very same loop as before when every module loads.
