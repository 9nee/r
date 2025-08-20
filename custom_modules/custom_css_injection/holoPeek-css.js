(function injectHoloPeekStyle() {
    const cssHoloPeek = `
        #holopeek {
        /* I guess this is the w/h of future holopeeks too */
            width: 60px;
            height: 60px;
            z-index: 2147483647;
            position: fixed;
            padding: 0;
            bottom: 0;
            right: 2.2vw;
            border: none;
            outline: none;
            background: none;
            background-image: url('https:///raw.githubusercontent.com/${CURRENT_BRANCH}/r/emotes/custom_modules/holopeek/polkapeek.png');
            background-repeat: no-repeat;
            image-rendering: crisp-edges;
        }
        .holoAnim {
            animation: peek-out ease-in 0.2s both;
        }
        .holoAnim:hover {
            animation: peek-in ease-out 0.2s both;
        }
        @keyframes peek-in {
            from { background-position: 0px 60px; }
            to { background-position: 0px 0; }
        }
        @keyframes peek-out {
            from { background-position: 0px 0; }
            to { background-position: 0px 60px; }
        }
        #holoPeekBubble {
            padding: 1.1vh 12px;
            z-index: 4000;
            position: fixed;
            bottom: 6.5vh;
            right: 6.5vw;
            background: #fff;
            border-radius: 8px;
            height: 50%;
        }
        #holoPeekBubbleTail {
            width: 12vw;
            height: 9vh;
            z-index: 2147483647;
            position: fixed;
            bottom: 5.8vh;
            right: 9.5vw;
            background: #fff;
            transform: skew(15deg, 15deg);
            z-index: 5;
        }
        #holoPeekBubble button {
            color: #000;
            z-index: 50;
        }
        #holoPeekBubble textarea {
            min-height: 128px;
        }
        #holoPeekBubble label {
            z-index: 50;
            color: #888;
        }
        #holoPeekBubble input:not([type="checkbox"]) {
            display: block;
            margin-bottom: 5px;
            width: 95%
        }
        #holoPeekBubble input[type=checkbox] {
            margin-right: 8px;
            margin-left: 5px
        }
        #saveAndResetCookieButtonsDiv {
            margin-top: 12px;
            display: flex;
        }
        #saveAndResetCookieButtonsDiv button {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #saveAndResetCookieButtonsDiv button img {
            margin-left: 4px;
        }
        #holoPeekItemsContainer {
            align-items: flex-start;
            overflow-y: scroll;
            display: inline-flex;
            flex-direction: column;
            height: 80%;
            max-height: 83%;
        }
        #resetButton {
            margin-left: 16px;
        }
        #pinContainer {
            display: flex;
            flex-direction: column-reverse;
        }
        #pin-dropdown > .dropdown-menu {
            width: 384px;
            max-height: calc(100vh - 50px);
            overflow-y: scroll;
            padding: 0;
            margin: 0;
            border: none;
        }
        #pinContainer > li {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 8px 0;
        }
        .pin-message {
            width: calc(100% - 32px);
            overflow-wrap: break-word;
            padding: 0 4px;
        }
        .pin-close {
            width: 24px;
            height: 24px;
            border-radius: 12px;
            margin: auto 4px;
            color: #fff;
            background: #888;
            border: none;
            outline: none;
            transition: 0.2s;
        }
        .pin-close:hover {
            background: #ccc;
            color: #333;
        }
        .navbar {
            background: #0008 !important;
        }
    `;
    const $styleElement = $("<style>");

    $styleElement.text(cssHoloPeek);

    $("head").append($styleElement);
})();
