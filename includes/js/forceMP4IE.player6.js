videojs.registerPlugin('forceMP4IE', function() {

var myPlayer = this,
   videoID,
   totalRenditions,
   mp4Ara = [],
   highestQuality;

myPlayer.one('loadstart', function(evt) {
      console.log("ie");
      videoName = myPlayer.mediainfo['name'];
      rendtionsAra = myPlayer.mediainfo.sources;
      totalRenditions = rendtionsAra.length;
      for (var i = 0; i < totalRenditions; i++) {
          if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
              mp4Ara.push(rendtionsAra[i]);
          };
      };
      mp4Ara.sort(function(a, b) {
          return b.size - a.size;
      });
      highestQuality = mp4Ara[0].src;
      myPlayer.src(highestQuality);
  });
  // listen for the "ended" event and play the video
});
