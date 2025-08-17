

function createHoverImage(jqChatMessage) {
    jqChatMessage.find("a").bind("mouseenter", function ({ target }) {
        if (!window.imagePreview || !window.imagePreview.enabled) {
            return;
        }
        const messageAfter = $(this).parent().parent().find("img");
        if (!messageAfter[0]) {
            const newImg = new Image();
            newImg.style.display = "none";
            newImg.referrerPolicy = "no-referrer";
            newImg.onload = function () {
                this.classList.add("imageHoverPreview", "imageLoaded");
            };
            newImg.src = target.href;
            target.parentElement.parentElement.appendChild(newImg); // fuck jqueery
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
        window.imagePreview.observer.observe($("#messagebuffer")[0], { childList: true, subtree: true });

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

