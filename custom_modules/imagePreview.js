

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

function createHoverImage2(jqChatMessage) {
    jqChatMessage
    .querySelectorAll("a")
    .forEach(a =>{
        a.addEventListener("mouseenter", ({target}) => {
            var img = target.parentElement.querySelector(":scope > img")
            if (!img) {
                img = new Image();
                img.style.position = "fixed";
                img.onload = function () {
                    this.classList.add("imageHoverPreview", "imageLoaded");
                };
                img.referrerPolicy = "no-referrer";

                img.src = target.href;

                if (target.href.search(/youtube\.com|youtu\.be/i) > -1) {
                    let videoUrl = (new URL(target.href));
                    let videoId = videoUrl.searchParams.get("v") || videoUrl.pathname.split("/").at(1);

                    img.src = videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : img.src;
                }


                target.parentElement.appendChild(img);
            }
            img.style.display = "";
        });

        a.addEventListener("mouseout", ({target}) =>{
            target.parentElement.querySelector("img").style.display = "none";
        });

        a.addEventListener("mousemove", ({target, clientX, clientY}) =>{
            let offset = 30;
            let img = target.parentElement.querySelector("img");
            if (img.clientWidth + clientX + offset > window.innerWidth) {
                clientX -= (img.clientWidth + offset * 2.0);
            }
            if (img.clientHeight + clientY + offset > window.innerHeight) {
                clientY -= img.clientHeight + offset * 2.0;
            }
            img.style.top  = `${clientY + offset}px`;
            img.style.left = `${clientX + offset}px`;
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
                        .forEach(node => createHoverImage2(node));
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
            createHoverImage2($(this)[0]);
        });
    } else {
        if (window.imagePreview) {
            window.imagePreview.observer.disconnect();
            window.imagePreview.enabled = false;
        }
    }
}

