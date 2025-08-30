
const validImageExtensions = ["jpg", "png", "jpeg", "gif", "webp", "apng"];

function isUrlAValidImage(url) {
  let ext = (new URL(url)).pathname.split(".").at(-1).toLowerCase();
  return validImageExtensions.indexOf(ext) >= 0;
}

function doesMessageContainALink($messageElement) {
  //Unfinished :D
  return $messageElement.children().last().attr('href')
}

function fixPosition($img, x, y, yOffset = 15) {
    // Center on cursor and keep it inside the screen
    x = Math.min(Math.max(x - $img.width() / 2, 0), window.innerWidth - $img.width());
    y = y - $img.height() - yOffset >= 0 ?  y - $img.height() - yOffset : y + yOffset;
    $img.css({
      'top' : y,
      'left': x
    })
}

function createHoverImage($linkElement) {
  $linkElement.on("mouseenter", (event) => {
   	let prevImg = $linkElement.data('imageInstance');
    if (prevImg) {
      $(prevImg).stop();
      $linkElement.removeData('imageInstance')
      prevImg.remove();
    }
    let newImg = new Image();
    newImg.style.display = "block";
    newImg.referrerPolicy = "no-referrer";
    newImg.src = $linkElement.attr("href");
    newImg.onload = function () {
      $(this).animate({ 'height':  '200px' },{
        duration: 200,
        progress: () => fixPosition($(this), event.pageX, event.pageY)
      });
    };
	fixPosition($(newImg), event.pageX, event.pageY);
    $linkElement.data('imageInstance', newImg);
    $(newImg).css({
      'background-color': '#3a3a3aff',
      'position': 'absolute',
      'z-index': '9999',
      'display': 'block',
      'height' : '0px',
      'max-height' : '200px',
      'max-width' : '500px'
    });
    $('body').append(newImg);
  })

  $parentElement.on("mousemove", (event) => {
    const imageElement = $parentElement.data('imageInstance');
    if (imageElement) {
      fixPosition($(imageElement), event.pageX, event.pageY);
    }
  });

  $linkElement.on("mouseleave", () => {
    const imageElement = $linkElement.data('imageInstance');
    if (imageElement) {
      let endX = $(imageElement).position().left + $(imageElement).width() / 2;
      let endY = $(imageElement).position().top + $(imageElement).height();
      $(imageElement).stop().animate(
        {
          'height': '0px',
          'left' :`${endX}px`,
          'top' : `${endY}px`
        },
        {
          duration: 200,
          complete: () => {
            $linkElement.removeData('imageInstance')
            imageElement.remove();
          }
      });
    }
  })
}


(async () => {
    await window.waitForFunc("chatMsgSocketTapFunctions")
    window.chatMsgSocketTapFunctions.push(($message) => {
      $message.find("a").each((k, v) => createHoverImage($(v)));
    });
})();
