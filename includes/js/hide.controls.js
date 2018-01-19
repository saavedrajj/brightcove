videojs.plugin('hideControls', function(){
  myPlayer = this;
  myPlayer.ready(function(){

    myPlayer.controlBar.hide(true);    
  })
})