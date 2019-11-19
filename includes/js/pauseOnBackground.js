		videojs.registerPlugin('pauseOnBackground', function(){
			var player = this;
			document.addEventListener('visibilitychange', function() {
				if(document.hidden) {
					player.pause();
				} else {
					player.play();
				}
			});
		});