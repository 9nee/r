

function createHoverImage(jqChatMessage) {
    jqChatMessage.find("a").bind("mouseenter", function ({ target }) {
        if (!window.imagePreview || !window.imagePreview.enabled) {
            return;
        }
        const messageAfter = $(this).parent().find("img");
        if (!messageAfter.is("img")) {
            const newImg = new Image();
            newImg.style.display = "none";
            newImg.onload = function () {
                this.classList.add("imageHoverPreview", "imageLoaded");
            };
            newImg.src = $(this).html();
            $(this).parent().after(newImg);
        }
        $("#messagebuffer div:hover .imageHoverPreview").stop(true, false).slideDown(100);
        $("#messagebuffer div:hover").one("mouseout", function () {
            $(this).children(".imageHoverPreview").stop(true, true).slideUp(100).delay(100).removeAttr("style");
        });
    });
}


function toggleImagePreview() {
    let cookie = readCookie("ImagrePreview");

    if (!cookie) {
        if (!window.imagePreview) {
            let observer = new MutationObserver(mutationList =>
                mutationList.filter(m => m.type === 'childList').forEach(m => {
                    Array.from(m.addedNodes)
                        .filter(n => n.nodeType == Node.ELEMENT_NODE)
                        .forEach(node => createHoverImage($(node)));
                })
            );

            window.imagePreview = {
                observer: observer,
                enabled: true
            };
        }
        window.imagePreview.ovserver.observe($("#messagebuffer")[0], { childList: true, subtree: true });

        // a -> span -> div
        $("#messagebuffer a").parent().parent().each(function () {
            createHoverImage($(this));
        });
    } else {
        if (window.imagePreview) {
            window.imagePreview.observer.disconnect();
            window.imagePreview.enabled = false;
        }
    }
}

