window.moduleRegistry = (() => {
  const readinessState = {};

  function manageReadinessState(moduleName) {
    if (!readinessState[moduleName]) {
      let resolveFn;
      const promise = new Promise(resolve => {
        resolveFn = resolve;
      });
    
      readinessState[moduleName] = {
        promise: promise,
        resolve: resolveFn,
        isReady: false
      }
    }
    return readinessState[moduleName]
  }

  return {
    waitForReady: (moduleName, timeoutMs = 5000) => {
      const modulePromise = manageReadinessState(moduleName).promise
      const timeoutPromise = new Promise((_, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id);
          reject(new Error(`Timeout: Module ${moduleName} wasn't ready in time. Did you disable a dependency? Check for the name of the waitForReady await, it has to be the same as in ModulePaths`))
        }, timeoutMs)
      })

      return Promise.race([
        modulePromise,
        timeoutPromise
      ]);
    },
    markReady: (moduleName) => {
      const moduleState = manageReadinessState(moduleName)
      if (!moduleState.isReady) {
        moduleState.isReady = true;
        moduleState.resolve(true)
      }  
    },
    isReady: (moduleName) => {
      return readinessState[moduleName] ? readinessState[moduleName].isReady : false;
    }}
  }
)()

/**
 * Asynchronously waits for a module to be ready and, optionally, for a specific global function to be available.
 * * @param {string} name - The name of the module to wait for, which must be registered in the constant ModulePaths.
 * @param {string} [functionalityWanted=null] - The name of the global function to poll for after the module is ready. This is an optional parameter.
 * @returns {Promise<void>} A promise that resolves when the module is ready and the function is available.
 */
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

