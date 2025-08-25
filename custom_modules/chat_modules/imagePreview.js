function doesMessageContainALink($messageElement) {
  //Unfinished :D
  return $messageElement.children().last().attr('href')
}

function createHoverImage($linkElement,
                          xOffset = 20,
                          yOffset = 20) {
  $linkElement.on("mouseenter", (event) => {
    if ($linkElement.data('imageInstance')) {
      return;
    }
    let newImg = new Image();
    newImg.style.display = "block";
    newImg.referrerPolicy = "no-referrer";
    newImg.src = $linkElement.attr("href");
    newImg.onload = function () {
      $(this).slideUp(200);
    };

    $linkElement.data('imageInstance', newImg)
    $(newImg).css({
      'position': 'absolute',
      'z-index': '9999',
      'display': 'block',
      'top': event.pageY + yOffset,
      'left': event.pageX + xOffset
    });
    $('body').append(newImg);
  })

  $linkElement.on("mousemove", (event) => {
    const imageElement = $linkElement.data('imageInstance');
    if (imageElement) {
      $(imageElement).css({
        'top': event.pageY + yOffset,
        'left': event.pageX + xOffset
      });
    }
  });

  $linkElement.on("mouseleave", () => {
    const imageElement = $linkElement.data('imageInstance');
    if (imageElement) {
      $(imageElement).slideDown(200, () => {
        $linkElement.removeData('imageInstance')
        imageElement.remove();
      });
    }
  })
}
//Refer to Socket.on additions in technical documentation
//const linkRegex = /href="(.*?)"/;
//socket.on("chatMsg", async (msgObject)=> {
//  const match = linkRegex.test(msgObject.msg)
//  if (match) {
//    fetchLastChatElement().find("a").each((k, v) => createHoverImage($(v)));
//  }
//})