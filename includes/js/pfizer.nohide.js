	videojs.plugin('nohide', function() {
  var player = this;
  player.on('userinactive',function(){ 
  	this.removeClass('vjs-user-inactive');
  });
});