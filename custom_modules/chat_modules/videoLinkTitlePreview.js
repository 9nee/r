// Pasted from matsuridos, thanks!
function replaceLink(element) {
    let request = "",
        site = "";
    const parent = element.parentElement;

    if (element.href.search(/youtube\.com|youtu\.be/i) > -1) {
        request = `https://www.youtube.com/oembed?url=${element.href}&format=json`;
        site = "YouTube";
    }
    if (element.href.search(/streamable\.com/i) > -1) {
        request = `https://api.streamable.com/oembed.json?url=${element.href}`;
        site = "Streamable"
    }
    if (element.href.search(/vimeo\.com/i) > -1) {
        request = `https://vimeo.com/api/oembed.json?url=${element.href}`;
        site = "Vimeo"
    }

    if (!request) { return; }

    fetch(request, {headers: {'Content-Type': 'text/json'}}).then(response => {

        if (!response.ok) { return; }

        response.json().then((json) => {
            // If the message was sent in a filter, the text is modified and the element
            // passed to us is no longer in the DOM. Find it again.
            const a = parent.querySelector(`a[href="${element.href}"]`);
            if (a) {
                a.innerText = `[${site}] ${json.title}`;
            }
        });
    });
}

(async () => {
    await window.waitForFunc("chatMsgSocketTapFunctions")
    window.chatMsgSocketTapFunctions.push(($message) => {
        $message.find("a").each((k, v) => {
            replaceLink(v)
        });
    });
})();
