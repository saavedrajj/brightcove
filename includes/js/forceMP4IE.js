var forceMP4IE = function() {

    var myPlayer = this,
       totalRenditions,
       mp4Ara = [],
       highestQuality;
    
    if(detectIE()!==false)
    {
      myPlayer.one('loadstart', function() {
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
    }
    
    function detectIE() {
      var ua = window.navigator.userAgent;
    
      var msie = ua.indexOf('MSIE ');
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
    
      var trident = ua.indexOf('Trident/');
      if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }
    
      var edge = ua.indexOf('Edge/');
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }
    
      // other browser
      return false;
    }
};

var registerPlugin = videojs.registerPlugin || videojs.plugin;
registerPlugin('forceMP4IE', forceMP4IE);