function moduleReadinessState(name) {

  if (!name) {
    name = "[name wasn't provided]!"
  }

  const isReady = { value: false };
  let resolveFn;
  const promise = new Promise(resolve => {
    resolveFn = resolve;
  });

  function markReady() {
    if (!isReady.value) {
      resolveFn()
      isReady.value = true;
      console.log(`${name} resolved`)
    }
  }

  async function waitForReady() {
    if (!isReady.value) {
      await promise;
    }
    return true;
  }

  return {
    promise, 
    resolve: markReady,
    isReady: isReady}
}

const moduleReadinessMap = {
  mahjongMode: moduleReadinessState("Mahjong Mode"),
  holoPeek: moduleReadinessState("HoloPeek")
}

