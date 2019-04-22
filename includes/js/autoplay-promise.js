videojs.registerPlugin('playPromise', function() {
  var myPlayer = this;  
myPlayer.on('loadedmetadata',function() {
  var promise = myPlayer.play();
  if (promise !== undefined) {
    promise.then(function() {
      // Autoplay started!
      console.log('Autoplay started!');
    }).catch(function(error) {
      // Autoplay was prevented.
      console.log('Autoplay was prevented');
      myPlayer.muted(true);
      myPlayer.play();         
    });
  }
});
});