//700+ lines IIFE :D
(() => {
    const $holoPeekbutton = $('<button>', {
        id: 'holopeek',
        class: 'holoAnim' });

    $holoPeekbutton.on('click', () => {
        $(this).toggleClass('holoAnim');
        $('#holoPeekBubble').toggle()
        $('#holoPeekBubbleTail').toggle()
    });
    
    $('body').append($holoPeekbutton);

    const $holoPeekBubbleTail = $('<div>', {
        id: "holoPeekBubbleTail" 
    });
    $holoPeekBubbleTail.hide();
    $('body').append($holoPeekBubbleTail);

    const $holoPeekBubble = $('<div>', {
        id: "holoPeekBubble"
    })
    $holoPeekBubble.hide();
    $('body').append($holoPeekBubble);

    // TODO: make mine
    const userGuide = document.createElement('a');
    userGuide.href = "https://github.com/om3tcw/r/blob/emotes/holopeek/User%20Guide.txt";
    userGuide.target = "_blank";
    userGuide.innerHTML = "User's guide";
    userGuide.style.cssText = "color: #888; font-size: small; text-align: end;";
    $holoPeekBubble.append(userGuide);

    const holoPeekOptions = [
        {
            id: 'background',
            desc: 'Change Background',
            func: self => {
                const checkboxElem = $(`holopeek_${self.id}`);
                const textElem = $(`holopeek_${self.id}_text`);
                if (checkboxElem && textElem) {
                    self.css = checkboxElem.checked && textElem.value ? `body { background-image: url(${textElem.value}); }` : null;
                }
            },
            text: {
                value: 'https://raw.githubusercontent.com/om3tcw/r/emotes/holopeek/black.png',
                inputEvent: self => {
                    $(`holopeek_${self.id}`).checked = false;
                    self.text.value = $(`holopeek_${self.id}_text`).value;
                }
            }
        },
        {
            id: 'MahjongMode',
            desc: 'Mahjong Mode',
            func: () => {
                prependMessagesWithMJ();
                toggleMJMessages();
            }
        },
        {
            id: 'MahjongLurk',
            desc: 'Mahjong Lurk',
            func: self => {
                toggleMJMessages();
            }
        },
        {
            id: 'image_hower',
            desc: 'Enable image on link hover',
            func: () => ImageHoverEnable = !ImageHoverEnable
        },
        {
            id: 'reveal_spoilers',
            desc: 'Reveal spoilers',
            css: `.spoiler { color: #ff8; }`
        },
        {
            id: 'chat_video_ratio',
            desc: '>chat:video ratio',
            func: self => {
                const $checkboxElem = $(`#holopeek_${self.id}`);
                const $rangeElem = $(`#holopeek_${self.id}_range`);
                if ($checkboxElem.is(':checked')) {
                    self.css = 
                        `#videowrap { width: ${100 - $rangeElem.val()}% !important; }
                        #videowrap-header { display: none; }
                        #chatwrap { width: ${$rangeElem.val()}% !important; }}` 
                    } else {
                    self.css = null;
                }
            },
            range: {
                value: 50,
                min: 0,
                max: 100,
                step: 1,
                inputEvent: self => {
                    //$(`holopeek_${self.id}`).is(':checked') = false;
                    self.func(self)
                    self.range.value = $(`#holopeek_${self.id}_range`).val();
                }
            }
        },
        {
            id: 'chat_transparency',
            desc: 'Chat Transparency',
            func: self => {
                const $checkboxElem = $(`#holopeek_${self.id}`);
                const $rangeElem = $(`#holopeek_${self.id}_range`);
                if ($checkboxElem && $rangeElem) {
                    const alpha = 1 - $rangeElem.val();
                    const bgColor = `rgba(0, 0, 0, ${alpha})`;
                    if ($checkboxElem.is(':checked')) {
                        self.css = `#userlist, #messagebuffer { background-color: ${bgColor} !important; }
                                    .linewrap { background-color: ${bgColor}; }`
                    } else {
                        self.css = null;
                    }
                }
            },
            range: {
                value: 0.5,
                min: 0,
                max: 1,
                step: 0.05,
                inputEvent: self => {
                    self.func(self)
                    self.range.value = $(`#holopeek_${self.id}_range`).val();
                }
            }
        },
        {
            id: 'chat_video_only',
            desc: 'Chat & video only, no bullshit',
            setupFunc: () => {
                const lunaButton = document.createElement('button');
                lunaButton.id = 'lunaButton';
                lunaButton.onclick = () => {
                    const chatwrap = $('chatwrap');
                    chatwrap.style.pointerEvents = chatwrap.style.pointerEvents === 'none' ? 'all' : 'none';
                    chatwrap.style.opacity = chatwrap.style.pointerEvents === 'none' ? 0.25 : 1;
                };
                document.body.append(lunaButton);


                const css = `
            #lunaButton {
                width: 46px;
                height: 100px;
                background: url('https://raw.githubusercontent.com/om3tcw/r/emotes/holopeek/lunapeek.png');
                position: absolute;
                right: 0;
                top: 0;
                padding: 0;
                z-index: 2147483647;
                border: none;
                outline: none;
                display: none;
                opacity: 0;
                transition: .25s;
            }
            #lunaButton:hover {
                opacity: 1;
                transition: .25s;
            }
            `;
                const style = document.createElement('style');
                style.appendChild(document.createTextNode(css));
                document.head.appendChild(style);
            },
            css: `
            #mainpage { padding-top: 0 !important; background: #000 !important; }
            ::-webkit-scrollbar { width: 0 !important; } *{ scrollbar-width: none !important; }
            #chatheader, #userlist, #videowrap-header, #vidchatcontrols, #pollwrap, #MainTabContainer, .timestamp, nav.navbar { display: none !important; }
            #chatwrap { position: fixed; width: 100%; }
            #videowrap {
            width: 100vw;
            height: 56.25vw;
            max-height: 100vh;
            max-width: 177.78vh;
            position: absolute;
            margin: 0 0 0 auto !important;
            padding: 0 !important;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            }
            #emotelistbtn {
            background-size: cover;
            background-position: initial;
            outline: none;
            }
            #chatinputrow button {
            background-position-y: -12px;
            height: 20px;
            background-color: transparent;
            border: none;
            border-radius: 0 8px 0 0;
            }
            form input#chatline { padding: 8px; background: none; }
            #emotebtndiv + form { background: none; image-rendering: pixelated; }
            #chatinputrow { flex-direction: row; }
            #messagebuffer div.nick-hover .username { color: #84f !important; }
            #messagebuffer div.nick-highlight .username { color: #f8f !important; }
            #messagebuffer div.nick-highlight.nick-hover .username { color: #fff !important; }
            #messagebuffer div {
            background-color: #0000 !important;
            box-shadow: none !important;
            }
            .linewrap {
            background-color: #0000 !important;
            box-shadow: none !important;
            text-shadow:
                1px 0 #000, 0 1px #000, -1px 0 #000, 0 -1px #000,
                2px 0 2px #000, 0 2px 2px #000, -2px 0 2px #000, 0 -2px 2px #000,
                1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000 !important;
            }
            .username {
            text-shadow:
                1px 0 #000, 0 1px #000, -1px 0 #000, 0 -1px #000,
                2px 0 2px #000, 0 2px 2px #000, -2px 0 2px #000, 0 -2px 2px #000,
                1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000 !important;
            }
            form { background: none !important; }
            #chatline {
            box-shadow: none !important;
            height: 20px;
            background-size: 44px !important;
            background-position: 0 -8px !important;
            }
            input.form-control[type=text] {
            color: #fff;
            height: 20px;
            text-shadow:
                1px 0 #000, 0 1px #000, -1px 0 #000, 0 -1px #000,
                2px 0 2px #000, 0 2px 2px #000, -2px 0 2px #000, 0 -2px 2px #000,
                1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000 !important;
            }
            #main { height: 100% !important; }
            input.form-control[type=text]::placeholder { color: #ccc !important; }
            :focus::-webkit-input-placeholder { color: #ccc !important; }
            .embed-responsive { max-height: 100% !important; }
            #lunaButton { display: block; }
        `
        },
        {
            id: 'invert_chat_position',
            desc: 'Invert chat position',
            css: `#main { flex-direction: row-reverse !important; }`
        },
        {
            id: 'hide_playlist',
            desc: 'Hide playlist',
            css: `#MainTabContainer { display: none; }`
        },
        {
            id: 'hide_navbar',
            desc: 'Hide navbar',
            css: `
            #mainpage { padding-top: 0 !important; }
            nav.navbar { display: none !important; }
        `
        },
        {
            id: 'hide_scrollbar',
            desc: 'Hide scrollbar',
            css: `
            ::-webkit-scrollbar { width: 0 !important; }
            * { scrollbar-width: none !important; }
        `
        },
        {
            id: 'custom_CSS',
            desc: 'Custom CSS',
            func: self => {
                const checkboxElem = $(`holopeek_${self.id}`);
                const textAreaElem = $(`holopeek_${self.id}_textarea`);
                if (checkboxElem && textAreaElem) {
                    self.css = checkboxElem.checked ? textAreaElem.value : null;
                }
            },
            textarea: {
                value: `
            .userlist_item { height: 14px; }
            #videowrap-header, .profile-box hr { display: none; }
            #messagebuffer > div > span > div { background-color: #0000; }
            #queue, #queue + div, .queue_entry, #pollwrap > div {
                box-shadow: none !important;
                border-radius: 0;
            }
            .queue_entry:hover:not(.queue_active), .userlist_item:hover {
                background-color: #84f8 !important;
            }
            .navbar { min-height: 32px; }
            a.navbar-brand {
                background-size: auto 45px;
                height: 32px;
                padding: 0;
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            .nav-tabs { background: #0008; }
            .nav > li, .nav > li:focus {
                margin-bottom: 0;
                background: none !important;
            }
            .nav > li > a, #nav-collapsible > form {
                color: #ccc;
                margin: 0;
                border: none !important;
                padding: 6px 16px !important;
                border-radius: 0;
            }
            .nav > li > a:hover, .nav > li.activ, .nav > li.open > a.dropdown-toggle {
                background: none !important;
                text-shadow: #0ff 0 0 4px;
            }
            .navbar-collapse .btn-sm { margin: 2px; }
            #MainTabContainer > ul > li.active > a, #MainTabContainer > ul > li:hover > a {
                color: #fff;
                background: none;
                text-shadow: #0ff 0 0 4px;
                cursor: pointer !important;
            }
            .container-fluid { padding: 0; }
            #videowrap { padding: 0 0 0 350px; }
            .row { margin: 0; }
            #chatheader {
                box-shadow: none;
                background-color: #000a;
            }
            #mainpage { padding-top: 32px; }
            .navbar {
                border: none;
                box-shadow: none !important;
                background-color: #000a !important;
            }
            .profile-box {
                min-height: 0;
                background-color: #000c;
                border: none;
                padding: 8px 8px 0px 8px;
            }
            .profile-box p { margin: 4px 0 8px 0; }
            .profile-image {
                border: none;
                margin: 0 8px 4px 0;
            }
            .linewrap { z-index: 10; }
            #emotelistbtn {
                outline: none;
                padding: 0 16px;
                background-size: contain;
                background-position: center;
            }
            #chatinputrow button {
                border: none;
                border-radius: 0;
                width: 32px;
                height: 32px;
                background-color: #0000;
            }
            #chatinputrow, #chatinputrow form { height: 32px; }
            form input#chatline {
                padding: 0 0 0 5px;
                height: 32px;
            }
            #emotebtndiv + form {
                background-color: #000a;
                image-rendering: pixelated;
            }
            form input#chatline { background-size: auto; }
            #messagebuffer { background: none; }
            #messagebuffer .username { margin-top: 0; }
            #main { height: 100% !important; }
            #messagebuffer div { background-color: #0008; }
            #messagebuffer div.nick-hover {
                background-color: #4288 !important;
                box-shadow: none !important;
            }
            #messagebuffer div.nick-highlight {
                background-color: #84f8 !important;
                box-shadow: none !important;
            }
            #messagebuffer div.nick-highlight.nick-hover { background-color: #f8f8 !important; }
            #messagebuffer div.nick-highlight .username { color: #f8f; }
            #messagebuffer { box-shadow: none; }
            #userlist {
                box-shadow: none;
                background: #0008;
                }
                #main.flex > #chatwrap { box-shadow: none; }
                .embed-responsive {
                box-shadow: none;
                margin: 0;
                background-color: #000;
                }
                #pollwrap > div { margin: 0; }
                .queue_active.queue_temp { border-radius: 0; }
                #rightcontrols, #rightpane {
                box-shadow: none;
                background: #0008;
                border-radius: 0;
                }
                #pollwrap { min-height: 0px; }
                #pin-dropdown > .dropdown-menu { max-height: calc(100vh - 32px) !important; }
                #messagebuffer { padding: 0px; }
            `,
                inputEvent: self => {
                    $(`holopeek_${self.id}`).checked = false;
                    self.textarea.value = $(`holopeek_${self.id}_textarea`).value;
                }
            }
        },
        {
            id: 'Potato',
            desc: 'SmartFridgeOwner',
            func: self => {
                const checkboxElem = $(`holopeek_${self.id}`);
                if (checkboxElem && checkboxElem.checked) {
                    self.css = `
                .videolist { background: none !important; }
                a.navbar-brand { background: none !important; }
                form input#chatline { background: none; }
                #emotelistbtn { background: none; }
                #emotebtndiv + form {
                    animation: none;
                    background-image: none;
                }
                #chatinputrow button {
                    animation: none !important;
                    background: none !important;
                }
                body { background: black !important; }
                .timestamp {
                    background-image: none !important;
                    color: white !important;
                }
                `;
                } else {
                    self.css = null;
                }
            }
        },
        {
            id: 'vertical_layout',
            desc: 'Vertical layout',
            css: `
            .navbar, #videowrap-header { display: none; }
            #mainpage {
                padding: 0;
                height: auto !important;
            }
            #main { flex-direction: column-reverse !important; }
            #videowrap, #chatwrap {
                width: 100%;
                margin: 0;
                padding: 0;
            }
            `
        },
        {
            id: 'vertical_layout2',
            desc: 'Vertical layout 2',
            css: `
            #chatwrap {
                position: fixed;
                width: 100%;
                height: auto;
                top: 60vw;
                bottom: 0;
            }
            #videowrap {
                width: 100vw;
                height: 56.25vw;
                max-height: 100vh;
                max-width: 177.78vh;
                position: absolute;
                margin: 0 0 0 auto !important;
                padding: 0 !important;
                top: 32px;
                bottom: 0;
                left: 0;
                right: 0;
            }
            #main { height: 100% !important; }
            .linewrap {
                background-color: #0000 !important;
                box-shadow: none !important;
            }
            #videowrap-header { display: none !important; }
            `
        }
    ];

///* Holopeek block
//* Holopeek style
    const optionsLegendParagraph = $('<p>').html('Options').css('text-align', 'center');
    $holoPeekBubble.append(optionsLegendParagraph);

    const holoPeekOptionsContainer = $('<div>').attr('id', 'holoPeekOptionsContainer');
    $holoPeekBubble.append(holoPeekOptionsContainer);


    //* HoloPeek prototype-esque definition
    holoPeekOptions.forEach(holoPeekOption => {
        const div = $('<div>').appendTo(holoPeekOptionsContainer);

        const optId = `holopeek_${holoPeekOption.id}`;
        const $checkboxElem = $('<input>', {
            id: optId,
            type: 'checkbox',
            click: () => {
                if (holoPeekOption.func) {
                    holoPeekOption.func(holoPeekOption);
                } 

                $(`#${optId}_style`).remove();
                
                if (holoPeekOption.css && $checkboxElem.prop('checked')) {
                    $('<style>', {
                        id: `${optId}_style`,
                        text: holoPeekOption.css
                    }).appendTo('head');
                }
            }
        }).appendTo(div);

        // Load cookie option
        let cookieValue = readCookie(holoPeekOption.id)
        if (cookieValue) {
            const valueElem = holoPeekOption.textarea ? 'textarea' : holoPeekOption.range ? 'range' : holoPeekOption.text ? 'text' : null;
            if (valueElem) holoPeekOption[valueElem].value = cookieValue;
            $checkboxElem.prop('checked', true);
            const interval = setInterval(() => {
                //TODO: What the fuck is all this
                if ($(".userlist_item").length) {
                    clearInterval(interval);
                    $checkboxElem.triggerHandler('click');
                }
            }, 100);
        }

        const label = $('<label>', {
            id: `${optId}_label`,
            text: holoPeekOption.desc,
            title: holoPeekOption.id,
            for: optId
        }).appendTo(div);

        if (holoPeekOption.textarea) {
            const textareaElem = $('<textarea>', {
                id: `${optId}_textarea`,
                val: holoPeekOption.textarea.value,
                on: {
                    input: () => {
                        $checkboxElem.prop('checked', false);
                        holoPeekOption.textarea.value = textareaElem.val();
                    }
                }
            }).appendTo(holoPeekOptionsContainer);
        }

        if (holoPeekOption.range) {
            const rangeElem = $('<input>', {
                id: `${optId}_range`,
                type: 'range',
                css: { display: 'inline-block' },
                min: holoPeekOption.range.min,
                max: holoPeekOption.range.max,
                step: holoPeekOption.range.step,
                val: holoPeekOption.range.value,
                on: {
                    input: () => {
                        holoPeekOption.range.value = rangeElem.val();
                        if (holoPeekOption.func) {
                            holoPeekOption.func(holoPeekOption);
                            if (holoPeekOption.css && $checkboxElem.prop('checked')) {
                                $('<style>', {
                                    id: `${optId}_style`,
                                    text: holoPeekOption.css
                                }).appendTo('head');
                            }
                        }
                    }
                }
            }).appendTo(holoPeekOptionsContainer);
        }

        if (holoPeekOption.text) {
            const textElem = $('<input>', {
                id: `${optId}_text`,
                type: 'text',
                val: holoPeekOption.text.value,
                on: {
                    input: () => {
                        $checkboxElem.prop('checked', false);
                        holoPeekOption.text.value = textElem.val();
                    }
                }
            }).appendTo(holoPeekOptionsContainer);
        }

        if (holoPeekOption.setupFunc) holoPeekOption.setupFunc(holoPeekOption);
    });

    const saveAndResetCookieButtonsDiv = $('<div>', {
        id: 'saveAndResetCookieButtonsDiv'
    }).appendTo($holoPeekBubble);

    const saveButton = $('<button>', {
        id: 'saveButton',
        html: 'Save<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAbUlEQVQ4y2NgGLTAk+Exw38csB6bhkc4lePQAhLGDsIZfmPTAtGAaTZOLfg0gLRguAC/BgaqacANqKuBjaGd4RkQtgNZRGnogPuggzgNT+EantJIA8lOItnTRAUr/uQNgo+Iz0Ag+JjBY9BmfgAjpbf/V5agRgAAAABJRU5ErkJggg==">',
        click: () => {
            holoPeekOptions.forEach(holoPeekOption => {
                const valueElem = holoPeekOption.textarea ? 'textarea' : holoPeekOption.range ? 'range' : holoPeekOption.text ? 'text' : null;
                const value = valueElem ? holoPeekOption[valueElem].value : $(`#holopeek_${holoPeekOption.id}`).prop('checked') ? 1 : 0;
                if ($(`#holopeek_${holoPeekOption.id}`).prop('checked')) {
                    createCookie(holoPeekOption.id, value, 365)
                } else {
                    eraseCookie(holoPeekOption.id)
                }
            });
        }
    }).appendTo(saveAndResetCookieButtonsDiv);

    const resetButton = $('<button>', {
        id: 'resetButton',
        html: 'Reset<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAPElEQVQ4y2NgGAJAgeE+w38ovA/k4QH/8UDqaCADkGw+WRqIERvVMNQ1PMKaMB7h1uDB8BhD+WOg6OAGADZZd6fzGEl6AAAAAElFTkSuQmCC">',
        click: () => {
            holoPeekOptions.forEach(holoPeekOption => {
                eraseCookie(holoPeekOption.id)
                $(`#holopeek_${holoPeekOption.id}`).prop('checked', false);
            });
        }
    }).appendTo(saveAndResetCookieButtonsDiv);

    // Holopeek CSS
    const css = `
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
        background-image: url('https:///raw.githubusercontent.com/om3tcw/r/emotes/holopeek/polkapeek.png');
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
    #holoPeekBubble textarea {
        width: 100%;
        min-height: 128px;
        margin-bottom: 5px;
        resize: both;
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
    #holoPeekOptionsContainer {
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

    const style = document.createElement('style');
    if (style.styleSheet)
        style.styleSheet.cssText = css;
    else
        style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

})();