# Notes for further development

If there's a large css constant somewhere in the additions, move it to custom_modules/custom_css_injection following the existing format.

try to keep githubLoader non-loader code to a minimum, staging-phase can be held there but ideally it then gets moved to a module loaded by XaeModules.

XaeModules are order-sensitive.

Mahjong mode adds a new socket listener so it might be a good idea to allow disabling it.


If you have a circular dependency, or a dependency that appears on a module loaded way later on (or even appears on any module, really, because of good practices) at the end of the module that provides that dependency, you should include a resolved promise like so:

```js
//IIFE
(function script1ReadyPromise() {
  //Put the promise in the global window scope and resolve it instantly
  window.script1ReadyPromise = new Promise(resolve => {
    resolve();
  });
})()
```

this way whatever code is dependant on it can do

```js
Promise.all([window.script1ReadyPromise])
  .then(() => {
    variableFromScript1 === "true" ? [...] 
  })
```

A good example can be found in mahjongMode.js