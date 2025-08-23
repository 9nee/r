const validOptionTypes = Object.freeze({
    TEXTAREA: 'textarea',
    RANGE: 'range', 
    TEXT: 'text', 
    DROPDOWN: 'dropdown'
});
let $holoPeekBubble;
let $holoPeekBubbleTail;
let $holoPeekButton;
let holoPeekItems = [];
const $holoPeekItemsContainer = $('<div>').attr('id', 'holoPeekItemsContainer');

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

function loadStoredValueForHolopeek(holoPeekItem) {
    let localStorageValue = localStorage.getItem(holoPeekItem.id);
    if (localStorageValue) {
        if (holoPeekItem.inputElement) {
            holoPeekItem.value = localStorageValue;
        }

        holoPeekItem.checkbox.prop('checked', true);
        holoPeekItem.checkbox.triggerHandler('click');
    }
}

(async function createHoloPeekMenuItems() {
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
})();

(async function holoPeekBuilder() {
    const optionsLegendParagraph = $('<p>').html('Options').css('text-align', 'center');
    $holoPeekBubble.append(optionsLegendParagraph);

    $holoPeekBubble.append($holoPeekItemsContainer);

    const localStorageButtonsDiv = $('<div>', {
        id: 'localStorageButtonsDiv'
    }).appendTo($holoPeekBubble);

    $('<button>', {
        id: 'saveButton',
        html: 'Save<img width="24" height="24" alt="save" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAbUlEQVQ4y2NgGLTAk+Exw38csB6bhkc4lePQAhLGDsIZfmPTAtGAaTZOLfg0gLRguAC/BgaqacANqKuBjaGd4RkQtgNZRGnogPuggzgNT+EantJIA8lOItnTRAUr/uQNgo+Iz0Ag+JjBY9BmfgAjpbf/V5agRgAAAABJRU5ErkJggg==">',
        click: () => {
            holoPeekItems.forEach(holoPeekItem => {
                const optionName = holoPeekItem.id;
                if (holoPeekItem.checkbox.prop('checked')) {
                    let value = 1;
                    if (holoPeekItem.value) {
                        value = holoPeekItem.value
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
                    localStorage.removeItem(optionName)
                    location.reload();
                });
            }
        }
    }).appendTo(localStorageButtonsDiv);

})();

function createHoloPeekItem({optionName,
                            optionDescription,
                            optionFunc = null,
                            type = null,
                            defaultValue = null}) {
    let holoPeekItem = {}
    holoPeekItem.id             = optionName;
    holoPeekItem.description    = optionDescription;
    holoPeekItem.func           = optionFunc;
    holoPeekItem.checkbox       = createCheckboxForItem(holoPeekItem);
    holoPeekItem.label          = createLabelForItem(holoPeekItem);
    holoPeekItem.cssData        = null;
    holoPeekItem.value          = defaultValue;

    let $holoPeekInputElement;
    switch (type) {
        case validOptionTypes.TEXTAREA: {
            $holoPeekInputElement = createTextAreaElement(holoPeekItem, holoPeekItem.id, $checkboxElem);
            break;
        } 
        case validOptionTypes.RANGE: {
            $holoPeekInputElement = createRangeElement(holoPeekItem);
            break;
        }
        case validOptionTypes.TEXT: {
            $holoPeekInputElement = createShortTextElement(holoPeekItem);
            break;
        }
    }

    holoPeekItem.inputElement   = $holoPeekInputElement;

    return holoPeekItem;
}

function createStyleForItem(holoPeekItem) {
    return $('<style>', {
        id: `${holoPeekItem.id}_style`,
        text: holoPeekItem.cssData
    })
}

function createCheckboxForItem(holoPeekItem) {
    return $('<input>', {
        id: holoPeekItem.id,
        type: 'checkbox',
        click: (() => holoPeekCheckboxTrigger(holoPeekItem))
    })
}

//Uncle Bob would be proud. I'm unsure if that's a good thing.
function removeDuplicateStyles(holoPeekItem) {
    if (holoPeekItem.style) {
        holoPeekItem.style.remove();
    }
}

function holoPeekCheckboxTrigger(holoPeekItem) {
    if (holoPeekItem.checkbox.prop('checked')) {
        if (holoPeekItem.func) {
            holoPeekItem.func(holoPeekItem);
        }
        if (holoPeekItem.cssData) {
            removeDuplicateStyles(holoPeekItem);
            holoPeekItem.style = createStyleForItem(holoPeekItem)
            holoPeekItem.style.appendTo('head');
        }
    } else {
        holoPeekItem.cssData = null;
        removeDuplicateStyles(holoPeekItem);
    }
}

function createLabelForItem(holoPeekItem) {
    return $('<label>', {
            id: `${holoPeekItem.id}_label`,
            text: holoPeekItem.description,
            title: holoPeekItem.id,
            //what the helly is this
            for: holoPeekItem.id
        })
}

function createShortTextElement(holoPeekItem) {
    return $('<input>', {
        id: `${holoPeekItem.id}_text`,
        type: 'text',
        val: holoPeekItem.value,
        on: {
            input: (event) => {
                holoPeekItem.checkbox.prop('checked', false);
                holoPeekItem.checkbox.triggerHandler('click');
                holoPeekItem.value = event.target.value;
            }
        }
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


function createRangeElement(holoPeekItem) {
    return $('<input>', 
    {
        id: `${holoPeekItem.id}_range`,
        type: 'range',
        css: { display: 'inline-block' },
        on: {
            input: function(event) {
                holoPeekItem.value = event.currentTarget.value;
                holoPeekCheckboxTrigger(holoPeekItem);
                }
            }
    })
}

function appendItemToHoloPeekContainer(holoPeekItem, prepend = false) {

    if (holoPeekItems.includes(holoPeekItem)) {
        return;
    }

    holoPeekItems.push(holoPeekItem);

    const $div = $('<div>')
    if (prepend) {
        $div.prependTo($holoPeekItemsContainer);
    } else {
        $div.appendTo($holoPeekItemsContainer);
    }

    holoPeekItem.checkbox.appendTo($div);

    holoPeekItem.label.appendTo($div);

    loadStoredValueForHolopeek(holoPeekItem);

    $div.after(holoPeekItem.inputElement)
}

let defaultItemsURL = `${MODULES_FOLDER}holopeek/holoPeekItems.js`
import(makeLiveCDNLink(defaultItemsURL)).then((data) => {
    for (const item of data.holoPeekObjects) {
        let newItem = createHoloPeekItem(item)
        appendItemToHoloPeekContainer(newItem);
    }
})

