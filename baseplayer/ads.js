var videoContent = document.getElementById('contentElement');
var playButton = document.getElementById('playButton');
playButton.addEventListener('click', onPlayButtonClick);

function onPlayButtonClick() {
  videoContent.play();
}
