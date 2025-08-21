const validOptionTypes = ['textarea', 'range', 'text', 'dropdown'];
let $holoPeekBubble;
let $holoPeekBubbleTail;
let $holoPeekButton;
let holoPeekItems; 

function setupOnClickForHoloPeek($holoPeekButton, $holoPeekBubble, $holoPeekBubbleTail) {
    $holoPeekButton.on('click', (event) => {
        if ($(event.target).is($holoPeekButton)) {
            $(this).toggleClass('holoAnim');
            $holoPeekBubble.toggle();
            $holoPeekBubbleTail.toggle();
            $(document).off('click.holoPeekRemove');
        } 

        event.stopPropagation();

        $(document).one('click.holoPeekRemove', (event) => {
            if ($(event.target).not($holoPeekButton)) {
                $holoPeekBubble.hide();
                $holoPeekBubbleTail.hide();
            }
        })
    });
}

(async function createHoloPeekDOMElements() {
    $holoPeekButton = $('<button>', {
        id: 'holopeek',
        class: 'holoAnim' });

    $('body').append($holoPeekButton);

    $holoPeekBubble = $('<div>', {
        id: "holoPeekBubble"
    })
    $holoPeekBubble.hide();
    $($holoPeekButton).append($holoPeekBubble);

    $holoPeekBubbleTail = $('<div>', {
        id: "holoPeekBubbleTail" 
    });
    $holoPeekBubbleTail.hide();
    $($holoPeekBubble).append($holoPeekBubbleTail);

    setupOnClickForHoloPeek($holoPeekButton, $holoPeekBubble, $holoPeekBubbleTail);

    holoPeekItems = [
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
                value: `https://raw.githubusercontent.com/${CURRENT_BRANCH}/r/emotes/custom_modules/holopeek/black.png`,
                inputEvent: self => {
                    $(`#holopeek_${self.id}`).is(':checked') = false;
                    self.text.value = $(`holopeek_${self.id}_text`).value;
                }
            }
        },
        {
            id: 'image_hover',
            desc: 'Enable image on link hover',
            func: () => {
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
                checkAndDestroyDuplicateStyles(`${self.id}_style` );
                if ($checkboxElem.is(':checked')) {
                    self.css = 
                        `#videowrap { width: ${100 - self.range.value}% !important; }
                        #videowrap-header { display: none; }
                        #chatwrap { width: ${self.range.value}% !important; }}` 
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
                checkAndDestroyDuplicateStyles(`${self.id}_style` );
                if ($checkboxElem.is(':checked')) {
                    const alpha = 1 - self.range.value;
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
                background: url('https://raw.githubusercontent.com/${CURRENT_BRANCH}/r/emotes/custom_modules/holopeek/lunapeek.png');
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

function checkAndDestroyDuplicateStyles(holoPeekItemName) {
    //holoPeekItemName should be something like holopeek_x_y_z_style
    if ($(`#${holoPeekItemName}`).length > 0) {
        $(`#${holoPeekItemName}`).remove();
    }
}

function loadStoredValueForHolopeek(holoPeekItem, $checkboxForItem) {
    let localStorageValue = localStorage.getItem(holoPeekItem.id);
    if (localStorageValue) {
        const foundElemType = validOptionTypes.find(type => holoPeekItem[type]);

        if (foundElemType) {
            holoPeekItem[foundElemType].value = localStorageValue;
        }

        $checkboxForItem.prop('checked', true);
        $checkboxForItem.triggerHandler('click');
    }
}

function createCheckboxForItem(holoPeekItem, optId) {
    return $('<input>', {
            id: optId,
            type: 'checkbox',
            click: function() {
                checkAndDestroyDuplicateStyles(`holopeek_${holoPeekItem.id}_style` );
                if (holoPeekItem.func) {
                    holoPeekItem.func(holoPeekItem);
                } 
                if (holoPeekItem.css && $(this).prop('checked')) {
                    $('<style>', {
                        id: `${optId}_style`,
                        text: holoPeekItem.css
                    }).appendTo('head');
                }
            }
        })
}

function createLabelForItem(holoPeekItem, optId) {
    return $('<label>', {
            id: `${optId}_label`,
            text: holoPeekItem.desc,
            title: holoPeekItem.id,
            for: optId
        })
}

function createTextAreaElement(holoPeekItem, optId, $checkboxElem) {
    return $('<textarea>', 
    {
        id: `${optId}_textarea`,
        val: holoPeekItem.textarea.value,
        on: {
            input: () => {
                $checkboxElem.prop('checked', false);
                holoPeekItem.textarea.value = textareaElem.val();
            }
        }
    })
}

function createRangeElement(holoPeekItem, optId) {
    return $('<input>', 
    {
        id: `${optId}_range`,
        type: 'range',
        css: { display: 'inline-block' },
        min: holoPeekItem.range.min,
        max: holoPeekItem.range.max,
        step: holoPeekItem.range.step,
        val: holoPeekItem.range.value,
        on: {
            input: function(event) {
                    //It's important to keep the object (holopeek) 
                    // and the object (input) values synchronized
                    holoPeekItem.range.value = event.currentTarget.value;

                    const styleId = `${optId}_style` 
                    checkAndDestroyDuplicateStyles(styleId);
                    if (holoPeekItem.func) {
                        holoPeekItem.func(holoPeekItem);
                    }
                    $('<style>', {
                        id: styleId,
                        text: holoPeekItem.css
                    }).appendTo('head');            
                }
            }
    })
}

function createShortTextElement(holoPeekItem, optId, $checkboxElem) {
    return $('<input>', {
        id: `${optId}_text`,
        type: 'text',
        val: holoPeekItem.text.value,
        on: {
            input: () => {
                $(`style[id="${optId}_style"]`).remove()
                $checkboxElem.prop('checked', false);
                holoPeekItem.text.value = textElem.val();
            }
        }
    })
}

(function holoPeekBuilder() {
    const optionsLegendParagraph = $('<p>').html('Options').css('text-align', 'center');
    $holoPeekBubble.append(optionsLegendParagraph);

    const holoPeekItemsContainer = $('<div>').attr('id', 'holoPeekItemsContainer');
    $holoPeekBubble.append(holoPeekItemsContainer);

    const localStorageButtonsDiv = $('<div>', {
        id: 'localStorageButtonsDiv'
    }).appendTo($holoPeekBubble);

    holoPeekItems.forEach((holoPeekItem) => {
        appendItemToHoloPeekContainer(holoPeekItem, holoPeekItemsContainer)
    });


    $('<button>', {
        id: 'saveButton',
        html: 'Save<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAbUlEQVQ4y2NgGLTAk+Exw38csB6bhkc4lePQAhLGDsIZfmPTAtGAaTZOLfg0gLRguAC/BgaqacANqKuBjaGd4RkQtgNZRGnogPuggzgNT+EantJIA8lOItnTRAUr/uQNgo+Iz0Ag+JjBY9BmfgAjpbf/V5agRgAAAABJRU5ErkJggg==">',
        click: () => {
            holoPeekItems.forEach(holoPeekItem => {
                const optionName = holoPeekItem.id;
                const $jqSelector = $(`#holopeek_${optionName}`)
                if ($jqSelector.prop('checked')) {
                    let valueElem = null;
                    for (const type of validOptionTypes) {
                        if (holoPeekItem[type]) {
                            valueElem = type;
                            break;
                        }
                    }
                    let value = 0;
                    if (valueElem) {
                        value = holoPeekItem[valueElem].value
                    } else if ($jqSelector.is(':checked')) {
                        value = 1;
                    }
                    localStorage.setItem(optionName, value)
                } else {
                    localStorage.removeItem(optionName)
                }
            });
        }
    }).appendTo(localStorageButtonsDiv);

    $('<button>', {
        id: 'resetButton',
        html: 'Reset<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAPElEQVQ4y2NgGAJAgeE+w38ovA/k4QH/8UDqaCADkGw+WRqIERvVMNQ1PMKaMB7h1uDB8BhD+WOg6OAGADZZd6fzGEl6AAAAAElFTkSuQmCC">',
        click: () => {
            if (confirm("Are you sure you want to reset all the options to their defaults? THIS WILL RELOAD THE PAGE")) {
                holoPeekItems.forEach(holoPeekItem => {
                    const optionName = holoPeekItem.id;
                    const $jqSelector = $(`#holopeek_${optionName}`)
                    localStorage.removeItem(optionName)
                    $jqSelector.prop('checked', false);
                    location.reload();
                });
            }
        }
    }).appendTo(localStorageButtonsDiv);

})();

function addItemToHoloPeek(holoPeekItem, holoPeekItemsContainer, prepend) {
    holoPeekItems.push(holoPeekItem);
    appendItemToHoloPeekContainer(holoPeekItem, holoPeekItemsContainer, prepend)
}

function appendItemToHoloPeekContainer(holoPeekItem, holoPeekItemsContainer, prepend = false) {
    const $div = $('<div>')
    if (prepend) {
        $div.prependTo(holoPeekItemsContainer);
    } else {
        $div.appendTo(holoPeekItemsContainer);
    }

    const optId = `holopeek_${holoPeekItem.id}`;

    const $checkboxElem = createCheckboxForItem(holoPeekItem, optId).appendTo($div);

    loadStoredValueForHolopeek(holoPeekItem, $checkboxElem);

    createLabelForItem(holoPeekItem, optId).appendTo($div);

    let holoPeekItemType;
    for (const type of validOptionTypes) {
        if (holoPeekItem[type]) {
            holoPeekItemType = type;
            break;
        }
    }

    let holoPeekInputElement;
    switch (holoPeekItemType) {
        case 'textarea': {
            holoPeekInputElement = createTextAreaElement(holoPeekItem, optId, $checkboxElem);
            break;
        } 
        case 'range' : {
            holoPeekInputElement = createRangeElement(holoPeekItem, optId);
            break;
        }
        case 'text': {
            holoPeekInputElement = createShortTextElement(holoPeekItem, optId, $checkboxElem);
            break;
        }
    }

    if (holoPeekInputElement) {
        $div.after(holoPeekInputElement)
    }

    if (holoPeekItem.setupFunc) {
        holoPeekItem.setupFunc(holoPeekItem);
    }

}