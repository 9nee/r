# Notes for further development

If there's a large css constant somewhere in the additions, move it to custom_modules/custom_css_injection following the existing format.

try to keep githubLoader non-loader code to a minimum, staging-phase can be held there but ideally it then gets moved to a module loaded by XaeModules.

XaeModules are order-sensitive.

Mahjong mode adds a new socket listener so it might be a good idea to allow disabling it.

If you have a circular dependency, or a dependency that appears on a module loaded way later on (or even appears on any module, really, because of good practices) at the end of the module that provides that dependency, you should include a resolved promise like so:

TODO: write code example for it

A good example can be found in mahjongMode.js

## Reverse

In its current implementation reverse is a two-part piece of code
The first is a css rule, and the second is two filter lists.
If one must edit these, this should be taken into account, no "code" regarding the reverse addition can be found in this repo.

## Module Loading

XaeModules were how the module code was held together before, I took it upon myself to almost completely rewrite it.

The current load logic is the following:

1. Base Cytube JS is loaded, HTML is called but loads later.
2. Our JS file is called
3. The const ModuleLoaderPromise (subject to change) is called, this loads the remote file NeoXaeModules.js
4. The loadLogic async IIFE is run, this does the following:
   1. Instantiate the XaeModules with a list of paths
   2. Load every single module
   3. Wait until they're loaded
   4. Run the rest of the logic.

The way the XaeModules work is reworked to include Promises and resolutions.
This means the following:

- Module 1 Requires Holopeek to exist
- When pressing a button in Holopeek, it runs a function from module 1.

If Holopeek or Module 1 haven't loaded by the time that the code is *parsed* Not executed! the whole module will crash.

I made a module registry that can be accessed through

- window.moduleRegistry.waitForReady("moduleName.js") //Returns Promise
- window.moduleRegistry.isReady("moduleName.js") //Returns Boolean
- window.moduleRegistry.markReady("moduleName.js") //Resolves the Promise

The names are pretty self-explanatory, but the following pseudocode should explain the usage:

```js

async function checkForScript2() {

  await window.moduleRegistry.waitForReady("script2.js");

  runLogic();
  console.log("None of this runs until the await resolves")

}
//Runs the function above
checkForScript2();
//This (and below) executes even if the logic from the above script hasn't executed
console.log("This does!");

```

The module loading script registers the "markReady" by default when the file has finished loading.

Good practices say that you should always write the asynchronicity if there's an interaction that might fail due to not having one of the resources ready.

But even if the scripts are loaded in parallel... the ones put *earlier* in the array *do* load faster. So if they're more important, they should be first.

### How to add a new script

**You add it to the ModulePaths constant**, that's kind of it. At least for right now, the way in which it will be done (and for the foreseeable future unless we get 20 more modules) will just be adding the name of the file, and putting said file in the custom_modules folder.

This folder is already getting bloated, but for now it's fine 🙂

The formatter accepts either a string or an Object, if it's a string it's simple enough, if it's an object it has to have the following syntax:

```{ name: `nndChatModule.js`, isActive: 0, rank: -1}```

**isActive**: provides another way of disabling the script other than removing its name, this is nice in the case in the future I decide that the scripts should be loaded by looping through a folder's contents. Which will probably be the case.

**rank**: That's the cytube rank, -1 is Anonymous IIRC. If you want to make a script *only* available for purples, for whatever reason.

If you need the script to interact with any other script, refer to the Module Registry example
