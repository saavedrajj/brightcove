var tv = tv || {};
tv.freewheel = tv.freewheel || {};
var fwPlayer;
var firstPlay = true;
tv.freewheel.DemoPlayer = function() {
  fwPlayer = this;
  // Only one AdManager instance is needed for each player.
  this.adManager = new tv.freewheel.SDK.AdManager();
  // Please contact your FreeWheel solution engineer for the values for your network.
  this.networkId = 96749;
  this.siteSectionId = "DemoSiteGroup.01";
  this.videoAssetId = "DemoVideoGroup.01";
  this.profile = "global-js";
  this.server = "https://demo.v.fwmrm.net/ad/g/1";

  this.adManager.setNetwork(this.networkId);
  this.adManager.setServer(this.server);
  /* Ad ad context object should be created for each ad request and all ad playback related.
  When a new video starts, the current ad context object should be destroyed and a new one should
  be created to handle the next lifecycle.
  */
  this.currentAdContext = null;
  /* Reference to the <video> element */
  this.videoEl = document.getElementById('videoPlayer');
  /* Reference to the base element (<div> or other) that contains the content <video> element */
  this.base = document.getElementById('displayBase');
  /* Temporarily store the video element's originalSource so when ads end, the src can be resumed. */
  this.originalSource = this.videoEl.currentSrc;

  this.prerollSlots = [];
  this.postrollSlots = [];
  this.midrollSlots = [];
  this.overlaySlots = [];

  this.adResponseLoaded = false;
  this.currentPlayingSlotType = null;
  this.videoCurrentTime = 0;
  this.adPlaying = false;

  this.onRequestComplete = this._onRequestComplete.bind(this);
  this.onSlotStarted = this._onSlotStarted.bind(this);
  this.onSlotEnded = this._onSlotEnded.bind(this);
  this.onAdEvent = this._onAdEvent.bind(this);
  this.onPlay = this._onPlay.bind(this);
  this.onPause = this._onPause.bind(this);
  this.onFullscreenChange = this._onFullscreenChange.bind(this);
  this.onContentVideoPauseRequest = this._onContentVideoPauseRequest.bind(this);
  this.onContenVideoResumeRequest = this._onContenVideoResumeRequest.bind(this);
  this.onContentVideoEnded = this._onContentVideoEnded.bind(this);
  this.onContentVideoTimeUpdated = this._onContentVideoTimeUpdated.bind(this);
  this.timeRangesToString = this._timeRangesToString.bind(this);

  var playPauseBtn = document.createElement('button');
  playPauseBtn.setAttribute('id', 'playpause');
  playPauseBtn.innerHTML='Play';
  playPauseBtn.setAttribute('class', 'btn btn-info');
  playPauseBtn.onclick = function() {
    var player = document.getElementById('videoPlayer');
    if (player.paused) {
      if (firstPlay) {
        fwPlayer.play();
        firstPlay = false;
      } else {
        player.play();
      }
      playPauseBtn.innerHTML='Pause';
    } else {
      player.pause();
      playPauseBtn.innerHTML='Play';
    }
  };
  this.videoEl.after(playPauseBtn);

  fwPlayer.fullscreenToggleBtn = document.createElement('button');
  fwPlayer.fullscreenToggleBtn.setAttribute('id', 'toggleFullscreen');
  fwPlayer.fullscreenToggleBtn.innerHTML = 'Fullscreen';
  fwPlayer.fullscreenToggleBtn.setAttribute('class', 'btn btn-info');
  fwPlayer.fullscreenToggleBtn.onclick = function () {
    var doc = window.document;
    var videoEl = document.getElementById('videoPlayer');
    var requestFullscreen = videoEl.requestFullscreen || videoEl.webkitrequestFullscreen || videoEl.mozRequestFullScreen || videoEl.webkitRequestFullScreen || videoEl.msRequestFullscreen;
    var exitFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullscreen.call(videoEl);
    }
    else {
      exitFullscreen.call(videoEl);
    }
  }
  playPauseBtn.after(fwPlayer.fullscreenToggleBtn);
};

tv.freewheel.DemoPlayer.prototype = {
  requestAds: function() {
    this.currentAdContext = this.adManager.newContext();
    // The profile value will be provided by your FreeWheel solution engineer
    this.currentAdContext.setProfile(this.profile);

    // Set the target.
    this.currentAdContext.setVideoAsset(this.videoAssetId, 888, this.networkId);
    this.currentAdContext.setSiteSection(this.siteSectionId, this.networkId);

    // Optional if using custom key-value targeting: Add key-values in the ad request.
    //this.currentAdContext.addKeyValue("customTargetingKey","JSAMDemoPlayer");

    // Add 1 preroll, 4 midroll slots
    this.currentAdContext.addTemporalSlot("Preroll_1", tv.freewheel.SDK.ADUNIT_PREROLL, 0);
    this.currentAdContext.addTemporalSlot("Midroll_1", tv.freewheel.SDK.ADUNIT_MIDROLL, 15);
    this.currentAdContext.addTemporalSlot("Midroll_2", tv.freewheel.SDK.ADUNIT_MIDROLL, 60);
    this.currentAdContext.addTemporalSlot("Midroll_3", tv.freewheel.SDK.ADUNIT_MIDROLL, 120);
    this.currentAdContext.addTemporalSlot("Postroll_1", tv.freewheel.SDK.ADUNIT_POSTROLL, 888);

    /* Listen to request_complete and slot_ended events. */
    this.currentAdContext.addEventListener(tv.freewheel.SDK.EVENT_REQUEST_COMPLETE, this.onRequestComplete.bind(this));
    this.currentAdContext.addEventListener(tv.freewheel.SDK.EVENT_AD, this.onAdEvent.bind(this));
    this.currentAdContext.addEventListener(tv.freewheel.SDK.EVENT_SLOT_STARTED, this.onSlotStarted.bind(this));
    this.currentAdContext.addEventListener(tv.freewheel.SDK.EVENT_SLOT_ENDED, this.onSlotEnded.bind(this));

    /* Listen to player play/pause events to fire correct video state tracking events */
    this.videoEl.addEventListener('play', this.onPlay.bind(this));
    this.videoEl.addEventListener('pause', this.onPause.bind(this));
    this.videoEl.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this));

    /* If you want to handle the play pause events for the content yourself, you are supposed to be able to disable the
    video extension using this setParameter call and listening for content pause and content resume request events */
    this.currentAdContext.setParameter(tv.freewheel.SDK.PARAMETER_EXTENSION_CONTENT_VIDEO_ENABLED, false, tv.freewheel.SDK.PARAMETER_LEVEL_GLOBAL);
    this.currentAdContext.addEventListener(tv.freewheel.SDK.EVENT_CONTENT_VIDEO_PAUSE_REQUEST, this.onContentVideoPauseRequest.bind(this));
    this.currentAdContext.addEventListener(tv.freewheel.SDK.EVENT_CONTENT_VIDEO_RESUME_REQUEST, this.onContenVideoResumeRequest.bind(this));


    // The video display base is the area(canvas) where overlay and rich media ads are rendered.
    this.currentAdContext.registerVideoDisplayBase(this.base.id);
    this.currentAdContext.setContentVideoElement(this.videoEl);

    this.currentAdContext.submitRequest();
  },

  _onRequestComplete: function(evt) {
    console.log('onRequestComplete');
    if (evt.success) {
      this.adResponseLoaded = true;
      // Temporal slots include preroll, midroll, postroll and overlay slots.
      var temporalSlots = this.currentAdContext.getTemporalSlots();
      for (var i = 0; i < temporalSlots.length; i++) {
        var slot = temporalSlots[i];
        switch (slot.getTimePositionClass())
        {
          case tv.freewheel.SDK.TIME_POSITION_CLASS_PREROLL:
            this.prerollSlots.push(slot);
            break;
          //case tv.freewheel.SDK.TIME_POSITION_CLASS_OVERLAY:
          //  this.overlaySlots.push(slot);
          //  break;
          case tv.freewheel.SDK.TIME_POSITION_CLASS_MIDROLL:
            this.midrollSlots.push(slot);
            break;
          case tv.freewheel.SDK.TIME_POSITION_CLASS_POSTROLL:
            this.postrollSlots.push(slot);
            break;
        }
      }
      console.log('prerolls: ' + this.prerollSlots.length);
      console.log('midrolls: ' + this.midrollSlots.length);
      console.log('postrolls: ' + this.postrollSlots.length);
      if (this.videoEl.currentSrc) {
        this.originalSource = this.videoEl.currentSrc;
      }
      document.getElementById("start").removeAttribute('disabled');
    }
  },

  _onFullscreenChange: function () {
    console.log('onFullscreenChange');
    this.currentAdContext.registerVideoDisplayBase(this.base.id);
  },

  _onPlay: function () {
    this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PLAYING);
  },

  _onPause: function () {
    this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PAUSED);
  },

  _onAdEvent: function(evt){
    console.log('onAdEvent: ' + evt.subType);
    if (evt.subType === tv.freewheel.SDK.EVENT_ERROR) {
      // Retrieve more error event information
      var adInstance = evt.adInstance;
      var slot = evt.slot;
      var errorCode = evt[tv.freewheel.SDK.INFO_KEY_ERROR_CODE];
      var errorInfo = evt[tv.freewheel.SDK.INFO_KEY_ERROR_INFO];
      var errorModule = evt[tv.freewheel.SDK.INFO_KEY_ERROR_MODULE];
      console.log('AdError: ' + errorCode + ' errorInfo: ' + errorInfo + ' in slot: ' + slot);
    }
  },

  _onSlotStarted: function(evt){
    console.log('onSlotStarted');
    // Resize the display base in case the video player was resized
    this.currentAdContext.registerVideoDisplayBase(this.base.id);
  },

  _onSlotEnded: function(evt) {
    console.log('onSlotEnded');
    var slotTimePositionClass = evt.slot.getTimePositionClass();
    switch (slotTimePositionClass) {
      case tv.freewheel.SDK.TIME_POSITION_CLASS_MIDROLL:
        this.currentPlayingSlotType = null;
        this.adPlaying = false;
        //this.videoEl.load();
        this.playContent();
        break;
      case tv.freewheel.SDK.TIME_POSITION_CLASS_PREROLL:
        this.playNextPreroll();
        break;
      case tv.freewheel.SDK.TIME_POSITION_CLASS_POSTROLL:
        this.playNextPostroll();
        break;
      //case tv.freewheel.SDK.TIME_POSITION_CLASS_OVERLAY:
      //  this.playNextOverlay();
       // break;
    }
  },

  _onContentVideoPauseRequest: function(evt) {
    console.log('onContentVideoPauseRequest');
    this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PAUSED);
    //this.videoEl.pause();
  },

  _onContenVideoResumeRequest: function(evt) {
    console.log('onContentVideoResumeRequest');
    this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PLAYING);
    //this.videoEl.play();
  },

  playNextPreroll: function() {
    console.log('playNextPreroll');
    if (this.prerollSlots.length && this.prerollSlots.length > 0) {
      var slot = this.prerollSlots.shift();
      slot.play();
    }
    else {
      setTimeout(this.playContent.bind(this), 100);
    }
  },

  playNextMidroll: function() {
    console.log('playNextMidroll');
    var slot = this.midrollSlots[0];
    this.currentPlayingSlotType = slot.getTimePositionClass();
    // tell fw we are pausing content video
    // or should this happen on content pause request???
    this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PAUSED);
    this.midrollSlots.splice(0,1);
    this.adPlaying = true;
    this.videoEl.removeEventListener('timeupdate', this.onContentVideoTimeUpdated);
    slot.play();
  },

 /* playNextOverlay: function() {
    console.log('playNextOverlay');
    if (this.overlaySlots.length) {
      var slot = this.overlaySlots.shift();
      this.currentPlayingSlotType = null;
      //slot.play();
    }
    else {
      //setTimeout(this.playContent.bind(this), 100);
    }
  },*/

  playNextPostroll: function() {
    console.log('playNextPostroll');
    this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_COMPLETED);
    if (this.postrollSlots && this.postrollSlots.length) {
      var slot = this.postrollSlots.shift();
      slot.play();
    }
    else {
      /* No more postroll slots, stop here. Whole life cycle of this video+ad experience ends here.
      So we do clean up here.
      */
      if (this.videoEl.currentSrc != this.originalSource) {
        this.videoEl.src = this.originalSource;
      }
      if (this.currentAdContext) {
        this.currentAdContext.removeEventListener(tv.freewheel.SDK.EVENT_REQUEST_COMPLETE, this.onRequestComplete);
        this.currentAdContext.removeEventListener(tv.freewheel.SDK.EVENT_SLOT_ENDED, this.onSlotEnded);
      }
      this.currentAdContext = null;
      this.adManager = null;
    }
  },

  _timeRangesToString: function (tr) {
  var arr = [];
    for (let i = 0; i < tr.length; i++) {
      arr.push('[' + tr.start(i).toFixed(2) + ', ' + tr.end(i).toFixed(2) + ']');
    }
  console.log( arr);
  },

  playContent: function() {
    console.log('playContent');
    if (this.videoEl.src !== this.originalSource) {
      console.log('restoring originalSource');
      this.videoEl.src = this.originalSource;
      this.videoEl.load();
    }
    if (this.videoEl.currentTime !== this.videoCurrentTime) {
      console.log('seekable: ' + this.timeRangesToString(this.videoEl.seekable));
      console.log('buffered: ' + this.timeRangesToString(this.videoEl.buffered));
      console.log('videoEl.currentTime: ' + this.videoEl.currentTime);
      console.log('this.videoCurrentTime: ' + this.videoCurrentTime);
      console.log('restoring content videoCurrentTime');
      this.videoEl.currentTime = this.videoCurrentTime;
      // Load here works to set currentTime in Chrome but not in Safari 11 Desktop
      this.videoEl.load();
      console.log('videoEl.currentTime: ' + this.videoEl.currentTime);
    }
    if (this.adResponseLoaded & !this.adPlaying) {
      this.videoEl.addEventListener('ended', this.onContentVideoEnded);
      this.videoEl.addEventListener('timeupdate', this.onContentVideoTimeUpdated);
      this.videoEl.setAttribute('controls', true);
      if (this.currentAdContext){
        this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_PLAYING);
      }
    }
    this.adPlaying = false;
    this.currentPlayingSlotType = null;
    this.videoEl.load();
    this.videoEl.play();
  },

  _onContentVideoTimeUpdated: function(evt) {
    console.log('onContentVideoTimeUpdated');
    if (!this.adPlaying) {
      this.videoCurrentTime = this.videoEl.currentTime;
    }
    if (!this.midrollSlots.length || this.midrollSlots.length === 0){
      this.videoEl.removeEventListener('timeupdate', this.onContentVideoTimeUpdated);
      this.adPlaying = false;
      return;
    }

    // The array of midroll slots will start with the total number of midrolls and
    // will decrease as midrolls play until there are no more items in the array.
    // We only need check the time of each midroll on timeupdate events to make sure
    // we are close to the next one to play
    // the 0th slot should always be the next one unless seeking was performed
      var slot = this.midrollSlots[0];
      var slotTimePosition = slot.getTimePosition();
      if (this.videoCurrentTime - slotTimePosition >= 0  && this.videoCurrentTime - slotTimePosition <=1 && !this.currentPlayingSlotType) {
        this.playNextMidroll();
        return;
      }
  },

  _onContentVideoEnded: function(evt) {
    console.log('onContentVideoEnded');
    console.log('currentPlayingSlotType: ' + this.currentPlayingSlotType);
    if (this.currentPlayingSlotType === tv.freewheel.SDK.TIME_POSITION_CLASS_MIDROLL){
      this.currentPlayingSlotType === null;
      this.adPlayer = false;
      return;
    }
    this.videoEl.removeEventListener("ended", this.onContentVideoEnded);
    this.videoEl.removeEventListener("timeupdate", this.onContentVideoEnded);
    this.videoEl.setAttribute('controls', false);
    if (this.currentAdContext){
      this.currentAdContext.setVideoState(tv.freewheel.SDK.VIDEO_STATE_STOPPED);
    }
    this.playNextPostroll();
  },

  play: function() {
    console.log('play');
    if (this.prerollSlots.length) {
      this.playNextPreroll();
    }  else {
      this.playContent();
    }
  }
};


