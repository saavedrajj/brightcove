videojs.registerPlugin('playMethod', function() {
  var myPlayer = this;
  myPlayer.on('loadedmetadata',function() {
    myPlayer.play();
  });
});