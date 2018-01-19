/*
  Playback Rates
  - Sets sourceOrder to false - this means old browsers that support HLS in Flash but not HTML5/MSE will use MP4
  - Adds specified playbackRates to player and updates / creates menu
*/


(function(window, document, videojs) {
    
  var forceMP4IE = function(settings) {
    var player = this;
     
    options =  videojs.util.mergeOptions(options,settings);
    
    // IE will use MP4/HTML5 before HLS/Flash
    player.options_.sourceOrder = false;
       
  }

  videojs.plugin('forceMP4IE', forceMP4IE);
})(window, document, videojs);