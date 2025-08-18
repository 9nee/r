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
          reject(new Error(`Timeout: Module ${moduleName} wasn't ready in 5 seconds. Did you disable a dependency?`))
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
      return readinessState[moduleName].isReady
    }}
  }
)()

