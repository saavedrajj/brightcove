videojs.registerPlugin('listenForParent', function() {
  var myPlayer = this;
  // This method called when postMessage sends data into the iframe
  function controlVideo(evt){
    if(evt.data === "pauseAds") {
        console.log("**** PAUSE ADS ****");
        myPlayer.ima3.adsManager.pause();
        /*myPlayer.pause();*/

   } else if (evt.data === 'resumeAds') {
        console.log("**** Resume ADS ****"); 
        myPlayer.ima3.adsManager.resume();
        /*myPlayer.play();*/
  }
};
  // Listen for the message, then call controlVideo() method when received
  window.addEventListener("message",controlVideo);
});