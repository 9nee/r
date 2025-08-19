(function injectHoloPeekStyle() {
    const cssHoloPeek = `
        #holopeek {
            width: 57px;
            height: 60px;
            z-index: 2147483647;
            position: fixed;
            padding: 0;
            bottom: 0;
            right: 42px;
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
            flex-grow: 0;
            flex-direction: column;
            padding: 12px 16px;
            z-index: 2147483647;
            position: fixed;
            bottom: 48px;
            right: 90px;
            background: #fff;
            border-radius: 8px;
            height: 50%;
        }
        #holoPeekBubble button {
            color: #000;
        }
        #holoPeekBubble text,  
        #holoPeekBubble textarea {
            width: 100%;
            margin-bottom: 5px;
            resize: both;
            display: block;
        },
        #holoPeekBubble textarea {
            min-height: 128px;
        }
        #holoPeekBubble label {
            color: #888;
        }
        #holoPeekBubble input[type=checkbox] {
            margin-right: 8px;
        }
        #holoPeekBubble input[type=range] {
            display: inline-block;
            margin-bottom: 5px;
        }
        #holoPeekBubble input[type=text] {
            display: block;
            margin-bottom: 5px;
        }
        #holoPeekBubbleTail {
            width: 50px;
            height: 25px;
            z-index: 2147483647;
            position: fixed;
            bottom: 42px;
            right: 122px;
            background: #fff;
            transform: skew(15deg, 15deg);
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
            overflow-y: scroll;
            display: flex;
            flex-direction: column;
            max-height: 75%;
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
