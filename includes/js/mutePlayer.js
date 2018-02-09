videojs.plugin('mutePlayer', function(){
  myPlayer = this;
  myPlayer.ready(function(){
    myPlayer.muted(true);
  })
})
