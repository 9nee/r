/*
  TODO: 
  MOVE THESE TO ANOTHER NAMESPACE THAT ISN'T THE BASE GLOBAL 
  SOMETHING LIKE PROMISES.ISXREADY AND PROMISES.RESOLVEY
  BRAIN HURT
*/

//TODO: TURN THESE TODOS INTO ACTUAL GITHUB ISSUES

let isHoloPeekReady = false;
let isMahjongModeReady = false;

//TODO: DRY
let resolveMahjong;
window.mahjongPromise = new Promise(resolve => {
    resolveMahjong = resolve;
});

let resolveHoloPeek;
window.holoPeekPromise = new Promise(resolve => {
    resolveHoloPeek = resolve;
});

async function resolveHoloPeekPromise() {
  if (!isHoloPeekReady) {
    return Promise.all([window.holoPeekPromise])
      .then(() => {
        isHoloPeekReady = true;
      })
  } else {
    return Promise.resolve(true);
  }
}

async function resolveMahjongModePromise(){
    if (!isMahjongModeReady) {
        return Promise.all([window.mahjongPromise])
            .then(() => {
            isMahjongModeReady = true;
        })
    } else {
        return Promise.resolve(true);
    }
} 

//TODO: KMS