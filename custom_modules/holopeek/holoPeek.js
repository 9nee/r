const validValues = ['textarea', 'range', 'text', 'dropdown'];
let $holoPeekBubble;
let $holoPeekBubbleTail;
let $holoPeekButton;
let holoPeekOptions; 

(function createHoloPeek() {
    $holoPeekButton = $('<button>', {
        id: 'holopeek',
        class: 'holoAnim' });

    $holoPeekButton.on('click', () => {
        $(this).toggleClass('holoAnim');
        $('#holoPeekBubble').toggle()
        $('#holoPeekBubbleTail').toggle()
    });
    
    $('body').append($holoPeekButton);

    $holoPeekBubbleTail = $('<div>', {
        id: "holoPeekBubbleTail" 
    });
    $holoPeekBubbleTail.hide();
    $('body').append($holoPeekBubbleTail);

    $holoPeekBubble = $('<div>', {
        id: "holoPeekBubble"
    })
    $holoPeekBubble.hide();
    $('body').append($holoPeekBubble);

    holoPeekOptions = [
        {
            id: 'background',
            desc: 'Change Background',
            func: self => {
                const $checkboxElem = $(`#holopeek_${self.id}`);
                const $textElem = $(`#holopeek_${self.id}_text`);

                if ($checkboxElem.is(':checked')) {
                    self.css = `body { background-image: url(${$textElem.val()}); }`
                } else {
                    self.css = null; 
                }
                
            },
            text: {
                value: `https://raw.githubusercontent.com/${CURRENT_REPO}/r/emotes/custom_modules/holopeek/black.png`,
                inputEvent: self => {
                    $(`#holopeek_${self.id}`).is(':checked') = false;
                    self.text.value = $(`holopeek_${self.id}_text`).value;
                }
            }
        },
        {
            id: 'MahjongMode',
            desc: 'Mahjong Mode',
            func: async () => {

                await window.moduleRegistry.waitForReady("mahjongMode.js")

                const $chatInput = $('#chatline');
                if ($(`#holopeek_MahjongMode`).is(':checked')) {
                    $chatInput.on('input', prependMessagesWithMJ)
                    $chatInput.on('focus', prependMessagesWithMJ)
                } else {
                    $chatInput.off('input', prependMessagesWithMJ)
                    $chatInput.off('focus', prependMessagesWithMJ)
                    if ($chatInput.val().startsWith('MJ:')) {
                        $chatInput.val($chatInput.val().replace(/^MJ: /, ''));
                    }
                }
                
                await toggleMJMessages();
            }
        },
        {
            id: 'MahjongLurk',
            desc: 'Mahjong Lurk',
            func: async self => {
                await window.moduleRegistry.waitForReady("mahjongMode.js")
                toggleMJMessages();
            }
        },
        {
            id: 'image_hover',
            desc: 'Enable image on link hover',
            func: () => {
                alert("it don't work")
                $('#holopeek_image_hover').prop('checked', false)
            }
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
                inputEvent: self => {}
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
                inputEvent: self => {}
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
                background: url('https://raw.githubusercontent.com/${CURRENT_REPO}/r/emotes/custom_modules/holopeek/lunapeek.png');
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
            func: self => {
                const $checkboxElem = $(`#holopeek_${self.id}`);
                if ($checkboxElem.is(':checked')) {
                    self.css = `#main { flex-direction: row-reverse !important; }`
                } else {
                    self.css = null;
                }
            }
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
                const $checkboxElem = $(`holopeek_${self.id}`);
                const $textAreaElem = $(`holopeek_${self.id}_textarea`);
                if ($checkboxElem.is(':checked') && $textAreaElem) {
                    self.css = $textAreaElem.value;
                } else {
                    self.css = null;
                }
            },
            dropdown: {
                value: "",
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
})();

(() => {
    const optionsLegendParagraph = $('<p>').html('Options').css('text-align', 'center');
    $holoPeekBubble.append(optionsLegendParagraph);

    const holoPeekOptionsContainer = $('<div>').attr('id', 'holoPeekOptionsContainer');
    $holoPeekBubble.append(holoPeekOptionsContainer);

    //* HoloPeek prototype-esque definition
    holoPeekOptions.forEach(async (holoPeekOption) => {
        const div = $('<div>').appendTo(holoPeekOptionsContainer);

        const optId = `holopeek_${holoPeekOption.id}`;
        const $checkboxElem = $('<input>', {
            id: optId,
            type: 'checkbox',
            click: async () => {
                if (holoPeekOption.func) {
                    holoPeekOption.func(holoPeekOption);
                } 

                //this helps in case the function has created unremoved styles
                $(`style[id="${optId}_style"]`).remove()

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
                //TODO: this is what executes every "clicked" option change
                if ($(".userlist_item").length) {
                    clearInterval(interval);
                    $checkboxElem.triggerHandler('click');
                }
            }, 100);
        }

        $('<label>', {
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
                    input: async () => {
                        const styleId = `${optId}_style` 
                        holoPeekOption.range.value = rangeElem.val();
                            if ($(`#${styleId}`).length > 0) {
                                $(`#${styleId}`).remove();
                            }
                            $('<style>', {
                                id: styleId,
                                text: holoPeekOption.css
                            }).appendTo('head');
                                                    
                            if (holoPeekOption.func) {
                                holoPeekOption.func(holoPeekOption);
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
                        $(`style[id="${optId}_style"]`).remove()
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

    $('<button>', {
        id: 'saveButton',
        html: 'Save<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAbUlEQVQ4y2NgGLTAk+Exw38csB6bhkc4lePQAhLGDsIZfmPTAtGAaTZOLfg0gLRguAC/BgaqacANqKuBjaGd4RkQtgNZRGnogPuggzgNT+EantJIA8lOItnTRAUr/uQNgo+Iz0Ag+JjBY9BmfgAjpbf/V5agRgAAAABJRU5ErkJggg==">',
        click: () => {
            holoPeekOptions.forEach(holoPeekOption => {
                const optionName = holoPeekOption.id;
                const $jqSelector = $(`#holopeek_${optionName}`)
                let valueElem = null;
                for (const type of validValues) {
                    if (holoPeekOption[type]) {
                        valueElem = type;
                        break;
                    }
                }
                let value = 0;
                if (valueElem) {
                    value = holoPeekOption[valueElem].value
                } else if ($jqSelector.is(':checked')) {
                    value = 1;
                }
                
                if ($jqSelector.prop('checked')) {
                    createCookie(optionName, value, 365)
                } else {
                    eraseCookie(optionName)
                }
            });
        }
    }).appendTo(saveAndResetCookieButtonsDiv);

    $('<button>', {
        id: 'resetButton',
        html: 'Reset<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAPElEQVQ4y2NgGAJAgeE+w38ovA/k4QH/8UDqaCADkGw+WRqIERvVMNQ1PMKaMB7h1uDB8BhD+WOg6OAGADZZd6fzGEl6AAAAAElFTkSuQmCC">',
        click: () => {
            if (confirm("Are you sure you want to reset all the options to their defaults? THIS WILL RELOAD THE PAGE")) {
                holoPeekOptions.forEach(holoPeekOption => {
                    const optionName = holoPeekOption.id;
                    const $jqSelector = $(`#holopeek_${optionName}`)
                    eraseCookie(optionName)
                    $jqSelector.prop('checked', false);
                    location.reload();
                });
            }
        }
    }).appendTo(saveAndResetCookieButtonsDiv);

})();

(function strikeBrokenHolopeekOptions() {
    let hoverOption = $('#holopeek_image_hover_label')
    hoverOption.html(`<s>${hoverOption.html()}</s>`)
})();
