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
    waitForReady: (moduleName) => {
      return manageReadinessState(moduleName).promise
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
)

