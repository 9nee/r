const CONFETTI_STYLE = "/custom_modules/custom_css_injection/confetti-css.js";
const HOLOPEEK_STYLE = "/custom_modules/custom_css_injection/holoPeek-css.js"

function fetchAndInjectStylesheet(cdnUrl) {
    $.getScript(makeLiveCDNLink(cdnUrl))
        .done(() => {
            console.log(`${cdnUrl} loaded`)
        })
        .fail((_, textStatus, errorThrown) => {
            console.error(`Failed to load ${cdnUrl}.js:`, textStatus, errorThrown);
        })
}

$(document).ready(() => {
    fetchAndInjectStylesheet(CONFETTI_STYLE);
    fetchAndInjectStylesheet(HOLOPEEK_STYLE);
})