/*
  Playback Rates
  - Sets sourceOrder to false - this means old browsers that support HLS in Flash but not HTML5/MSE will use MP4
  - Adds specified playbackRates to player and updates / creates menu
*/

(function(window, document, videojs) {
  var playbackRates = function(settings) {
    var player = this;
    var options = {};
    options =  videojs.util.mergeOptions(options,settings);

    if (Array.isArray(options.playbackRates)) {
      // IE will use MP4/HTML5 before HLS/Flash
      player.options_.sourceOrder = false;
      // Update existing control or add new
      if (player.controlBar.playbackRateMenuButton) {
        var playbackControl = player.controlBar.playbackRateMenuButton;
        playbackControl.removeChild(playbackControl.menu);
        playbackControl.options_.playbackRates = options.playbackRates;
        playbackControl.addChild(playbackControl.createMenu());
        playbackControl.updateLabel();
        playbackControl.updateVisibility();
      } else {
        player.controlBar.playbackRateMenuButton = player.controlBar.addChild('PlaybackRateMenuButton', {
          playbackRates: options.playbackRates
        });
        player.controlBar.playbackRateMenuButton.updateVisibility();
      }
    }
  }

  videojs.plugin('playbackRates', playbackRates);
})(window, document, videojs);