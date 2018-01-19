(function () {

    logobar = {};
    //these need to load separately
    var externalJSArr = ["https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"];
    var externalAfterJquery = ["https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"];
    var externalJSLoaded = 0;
    var externalsLoaded = false;
    var videoFirstPlay = false;
    var isFullscreen = false;
    var documentLoaded = false;
    var supportedPlayerType = "LB";
    var supportedPlayerVersion = "1.0";
    var divClass = "lb-asset";
    var playerType = "";
    var playerVersion = "";
    var playerUrl = "";
    var videoPlayer;
    var controlbar;
    var volumebar;
    var logoPlayButton;
    var logoBackground;
    var defaultLogoOffset = 15;
    var logoWidth;
    var logoHeight;
    var originalLogoHeight;
    var originalLogoWidth;
    var logoTransitionDelay;
    var logoTransitionTime;
    var logoTransitionStyle;
    var progressFixed;
    var fadeAfter;
    var fadeTime;
    var progressHeight;
    var logoMode;
    var controlBarPosition;
    var scrubberIsDragged = false;
    var controlBarFaded = false;
    var idleTime = 0;
    var controlBarPositioned = false;
    var jqueryIsLoaded = false;
    var vastResponse = "";
    var impressionTriggered = false;
    var interactionTriggered = false;
    var scrubberInteractionTriggered = false;
    var anchorImpressionTriggered = false;
    var defaultScrubberHeight = 25;
    var defaultScrubberWidth = 25;
    var logoResized = false;
    var scrubberResized = false;
    var scrubberIsInPosition = false;
    var backgroundStageisOff = false;
    var canFireInteraction = false;
    var counterPlay = 2;
    var adIsReady = false;
    var brightcoveSkin;
    var lunaCurrentTimeWidth = 19;

    var cornerLogo,
        player,
        seekerLogo,
        bigLogo,
        backgroundLogo,
        controlbk,
        fullscreen,
        volumeBtn,
        playButton;

    var LogoConfig = {
        enabled: true,
        url: "",
        size: 0,
        scrubberSize: "25x25",
        position: "",
        anchor: "",
        anchorUrl: "",
        anchorTarget: "",
        bgShape: ""
    };

    var AssetsConfig = {
        baseLocation: "",
        play: "",
        pause: "",
        fastForward: "",
        rewind: "",
        fullscreen: "",
        fullscreenOff: "",
        volume: "",
        scrubber: "",
        progressBar: "",
        visible: ""
    };

    var ColorSchema = {
        controlBarColor: "",
        skinColor: "",
        iconColor: "",
        playColor: "",
        logoBgColor: "",
        progressBarColor: ""
    };

    var plugin = logobar.plugin = {};
    var helper = {};
    var util = {};

    plugin._player = null;

    plugin.log = function () {
        var args = ['[LogoBar Brightcove Plugin]'];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        console.log.apply(console, args);
    };

    playerUrl = window.location.href.split("lbplayerURL=")[1];

    var LBEvents = plugin.LBEvents = {
        AdLoaded: "AdLoaded",
        AdStarted: "AdStarted",
        DisplayLogo: "DisplayLogo",
        DisplayAssets: "DisplayAssets",
        TransitionLogo: "TransitionLogo",
        ProgressBarConfig: "ProgressBarConfig",
        SetColorScheme: "SetColorScheme",
        SetAssetsMode: "SetAssetsMode",
        SetTheme: "SetTheme"
    };

    // Detect document state changes
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            documentLoaded = true;
            try {
                videoPlayer = videojs('#vjs_video_3');
            } catch(e){
                // advanced embed code probably used.
            }

            //Load external JS dependencies
            for (var externalJSid = 0; externalJSid < externalJSArr.length; externalJSid++) {
                plugin.injectJS(document, 'script', 'lbExternalJS' + externalJSid, externalJSArr[externalJSid], 1);
            }
        }
    };

    videojs.registerPlugin('lbplayer', function(options) {
        videoPlayer = this;
        if (options.lbplayerURL != undefined) {
            playerUrl = options.lbplayerURL;
        } else if (options.vast != "") {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    helper.vastResponse(xhttp);
                }
            };
            xhttp.open("GET", options.vast, false);
            xhttp.send();

        }
    });

    helper.vastResponse = function (xml) {
        vastResponse = xml.responseXML;
        if (vastResponse) {
            if (vastResponse.getElementsByTagName("MediaFile")[0].childNodes[0].nodeValue != "") {
                playerUrl = vastResponse.getElementsByTagName("MediaFile")[0].childNodes[0].nodeValue;
            }
        }
    };

    var jqueryLoaded = function () {
        jqueryIsLoaded = true;
        for (var externalJSid = 0; externalJSid < externalAfterJquery.length; externalJSid++) {
            plugin.injectJS(document, 'script', 'lbExternal2JS' + externalJSid, externalAfterJquery[externalJSid], 2);
        }
    };

    // this will be executed when the external scripts are loaded
    var externalScriptsLoaded = function () {

        externalsLoaded = true;
        videoPlayer.on("timeupdate", helper.onPlayerProgress);
        videoPlayer.on("seeked", helper.onPlayerProgress);
        videoPlayer.on("seeking", helper.onSeeking);
        videoPlayer.on("pause", helper.onPlayerPaused);
        videoPlayer.on("play", helper.onPlayerResumed);
        videoPlayer.on("fullscreenchange", helper.changeFSButton);
        videoPlayer.on("firstplay", helper.start);
        videoPlayer.on("adsready", helper.onAdReady);
        videoPlayer.on("ads-pod-started", helper.onAdStarts);
        videoPlayer.on("ads-pod-ended", helper.onAdEnds);
        videoPlayer.on("adtimeout", helper.onAdTimeout);
        videoPlayer.on("resize", helper.playerResized);

        if (playerUrl != "") {
            plugin.loadLBPlayer(playerUrl, lbPlayerLoaded);
        } else {
            plugin.log("Error! playerUrl is not specified. LogoBar Player will not be loaded.")
        }

        jQuery.triggerLBEvent = function(eventName) {
            helper.trigger(eventName);
        }

    };


    // helper function for injecting JS on the page
    plugin.injectJS = function (d, s, id, src, mode) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        externalJSLoaded = 0;
        js.onload = function () {
            externalJSLoaded++;
            plugin.log("Remote script: " + src + " has loaded.");
            var arrLength = 0;
            if (mode == 1) {
                arrLength = externalJSArr.length;
            } else {
                arrLength = externalAfterJquery.length;
            }
            if (externalJSLoaded == arrLength) {
                if (jqueryIsLoaded == true) {
                    externalScriptsLoaded();
                } else {
                    jqueryLoaded();
                }
            }
        };
        js.src = src;
        fjs.parentNode.insertBefore(js, fjs);
    };


    plugin.loadLBPlayer = function (url, callback) {
        var iframe = document.createElement('iframe');
        iframe.className = 'lbplayer-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        // "url" points to the logobar js file
        iframe.contentWindow.document.write('<script src="' + url + '"></scr' + 'ipt>');
        var checkInterval = 100;
        var timeToWait = 2000;
        (function () {
            var fn = iframe.contentWindow['getLBPlayer'];
            if (fn && typeof fn == 'function') {
                callback(fn(), iframe);
            } else {
                timeToWait -= checkInterval;
                if (timeToWait) videoPlayer.setTimeout(arguments.callee, checkInterval);
                else {
                    callback(undefined);
                }
            }
        })();
    };

    //*
    // Inject CSS
    plugin.injectCSS = function () {
        util.createCSS('lbcssId', "https://cdn2.logobar.tv/plugin/brightcove/lb_style.css");
        util.createCSS('iconsCssId', "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css");

    };

    var lbPlayerLoaded = function (LBPlayer, loaderReference) {
        if (LBPlayer) {
            helper.createAssetDivs();
            plugin._player = LBPlayer;
            setCallbacksForLBPlayer();
            plugin.doHandShake();
        } else {
            helper.removeEventListners();
        }
    };

    // Looping through the object and registering each of the callbacks with the LB Player
    var setCallbacksForLBPlayer = function () {
        for (var eventName in LBEvents) {
            plugin._player.subscribe(plugin._onEvent.bind(this, eventName), eventName);
            plugin._player.subscribe(plugin['on' + eventName], eventName, plugin);
        }
    };

    plugin.doHandShake = function () {
        var playerSupports = plugin._player.handshakeVersion();
        var versionSplit = playerSupports.split(".");
        playerType = versionSplit[0];
        playerVersion = versionSplit[1] + "." + versionSplit[2];
        plugin.log("The plugin supports: " + supportedPlayerType + "." + supportedPlayerVersion + ". Player supports: " + playerType + "." + playerVersion);

        if (playerType == supportedPlayerType) {
            if (playerVersion <= supportedPlayerVersion) {
                plugin.log("Player version supported.");
            } else {
                plugin.log("[Warning] Player version is more recent. Please Update Plugin");
            }
            plugin.doInitAd();
        } else {
            plugin.log("[Error] Player type not supported!");
            //Stop execution
        }
    };

    plugin.doInitAd = function () {
        plugin._player.initAd();
    };

    plugin.onAdLoaded = function () {
        plugin._player.startAd();
    };

    plugin.onAdStarted = function () {
        //Ad just started, execute whatever is needed (tracking or whatnot)
    };

    plugin.onDisplayLogo = function () {
        LogoConfig.enabled = this._player.getLogoEnabled();
        LogoConfig.url = this._player.getLogo();
        LogoConfig.size = this._player.getLogoSize();
        LogoConfig.scrubberSize = this._player.getScrubberSize();
        LogoConfig.position = this._player.getLogoPosition();
        LogoConfig.anchor = this._player.getAnchor();
        LogoConfig.anchorUrl = this._player.getAnchorLandingPage();
        LogoConfig.anchorTarget = this._player.getAnchorTarget();
        LogoConfig.bgShape = this._player.getLogoBgShape();

        if (LogoConfig.size != undefined) {
            originalLogoWidth = logoWidth = LogoConfig.size.split("x")[0];
            originalLogoHeight = logoHeight = LogoConfig.size.split("x")[1];
        } else {
            //If we want to, we could read the dimensions of the logo via document.getElementById("myImg").naturalWidth here
        }

        if(LogoConfig.scrubberSize != undefined) {
            defaultScrubberHeight = LogoConfig.scrubberSize.split("x")[1];
            defaultScrubberWidth = LogoConfig.scrubberSize.split("x")[0];
        }


        this.skinPlayer();
    };

    plugin.onDisplayAssets = function () {
        AssetsConfig.baseLocation = this._player.getBaseLocation();
        AssetsConfig.play = this._player.getPlayUrl();
        AssetsConfig.pause = this._player.getPauseUrl();
        AssetsConfig.fastForward = this._player.getFFUrl();
        AssetsConfig.rewind = this._player.getRewindUrl();
        AssetsConfig.fullscreen = this._player.getFullscreenUrl();
        AssetsConfig.fullscreenOff = this._player.getFullscreenOffUrl();
        AssetsConfig.scrubber = this._player.getScrubberUrl();
        AssetsConfig.volume = this._player.getVolumeUrl();
        AssetsConfig.progressBar = this._player.getProgressBarUrl();
        this.skinPlayer();
    };

    plugin.onTransitionLogo = function () {

        logoTransitionDelay = this._player.getLogoTransitionDelay();
        logoTransitionTime = this._player.getLogoTransitionTime();
        logoTransitionStyle = this._player.getLogoTransitionStyle();
        logoMode = this._player.getLogoMode();


        this.skinPlayer();

        //setting interval to make sure the scrubber stays syncronized with the progressbar.
        var tid = videoPlayer.setInterval(function () {
            if (videoPlayer.paused() && !scrubberIsDragged) {
                helper.onPlayerProgress();
            }
        }, 500);
    };

    plugin.onProgressBarConfig = function () {
        fadeTime = this._player.getProgressBarFadeTime();
        progressHeight = this._player.getProgressBarHeight();
        controlBarPosition = this._player.getControlBarPosition();
        progressFixed = this._player.getProgressBarFixed();
        fadeAfter = this._player.getProgressBarFadeAfter();

        if (progressFixed == true || fadeAfter == 0) {
            plugin.log("Progress bar will be 'fixed'");
            videoPlayer.options().inactivityTimeout = 0;
        } else {
            plugin.log("Progress bar will not be 'fixed' and will fade after " + fadeAfter + " seconds.");
            //Does not seem to work - ask brightcove about this
            videoPlayer.options().inactivityTimeout = fadeAfter * 1000;
        }

        this.skinPlayer();
    };

    plugin.onSetColorScheme = function () {

        ColorSchema.controlBarColor = this._player.getControlBarColor();
        ColorSchema.skinColor = this._player.getSkinBackgroundColor();
        ColorSchema.iconColor = this._player.getIconColor();
        ColorSchema.playColor = this._player.getPlayColor();
        ColorSchema.logoBgColor = this._player.getLogoBgColor();
        ColorSchema.progressBarColor = this._player.getProgressBarColor();

        this.skinPlayer();
    };

    plugin.onSetAssetsMode = function () {
        AssetsConfig.visible = this._player.getAssetsVisible();
        this.skinPlayer();
    };

    plugin.onSetTheme = function () {
        this.skinPlayer();
    };

    plugin._onEvent = function (eventName) {
        plugin.onEvent.apply(this, arguments);
    };

    plugin.onEvent = function (eventName) {
        plugin.log('[EVENT]', eventName);
    };

    plugin.skinPlayer = function () {
        plugin.log('Skinning the player!');

        // Wait for the external scripts to load first before updating CSS
        var tid = videoPlayer.setInterval(function () {
            if (externalsLoaded !== true) return;
            videoPlayer.clearInterval(tid);
            helper.updateCSS();
        }, 100);

    };


    helper.changeFSButton = function () {
        plugin.log("Change full-screen state");
        controlBarPositioned = false;

        isFullscreen = (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement);

        helper.showControlBarForLuna();
    };

    helper.onPlayerProgress = function () {
        setTimeout(function () {
            helper.repositionScrubber();
        }, 100);
    };

    helper.onPlayerPaused = function () {
        if (AssetsConfig.visible) {
            videoPlayer.options().inactivityTimeout = 0;
        }
        if (canFireInteraction) {
            helper.trigger("interaction");
        }
        helper.onPlayerProgress();
    };

    helper.onPlayerResumed = function () {
        if (AssetsConfig.visible && !progressFixed) {
            videoPlayer.options().inactivityTimeout = fadeAfter * 1000;
        }
        if (canFireInteraction) {
            helper.trigger("interaction");
        } else {
            counterPlay--;
            if (counterPlay == 0) {
                canFireInteraction = true;
            }
        }
    };

    helper.playerResized = function () {
        setTimeout(helper.updateCSS, 300);
    };

    helper.onAdReady = function () {
        adIsReady = true;
    };

    helper.onAdStarts = function () {
        jQuery('.' + divClass).hide();
        $('#myControlbar').hide();
    };

    helper.onAdEnds = function () {
        adIsReady = false;
        $('#myControlbar').show();
        jQuery('.' + divClass).show();
    };

    helper.onAdTimeout = function () {
        adIsReady = false;
    };

    helper.repositionScrubber = function () {
        if (!scrubberIsDragged) {
            var seeker_logo = $('#seeker-logo');
            var play_progress = $('.vjs-play-progress');
            var progressPx = play_progress.width() - (seeker_logo.width() / 2);

            var _logoXPos = 0;
            var _logoYPos = 0;

            if (videoPlayer.paused()) {
                _seekerXPos = play_progress.offset().left + progressPx;
            } else {
                _seekerXPos = play_progress.offset().left + progressPx;
            }
            _seekerYPos = play_progress.offset().top - (seeker_logo.height() / 2);
            if (play_progress.offset().top != 0) {
                seeker_logo.css({
                    'top': _seekerYPos + "px",
                    'left': _seekerXPos + "px",
                    'margin-left': 0
                });
                document.getElementById("control-bk").style.top = ($('#myControlbar').offset().top - videoPlayer.el_.offsetTop) + "px";
            }
            setTimeout(function() { $('#seeker-logo').css({
                'opacity': 1
            }); }, 750);

            if (logoMode == "scrubber") {
                if (!logoResized) {
                    tempHeight = defaultScrubberHeight;
                    tempWidth = logoWidth * defaultScrubberHeight / logoHeight;
                    logoHeight = tempHeight;
                    logoWidth = tempWidth;
                    logoResized = true;
                }

                if (videoPlayer.paused()) {
                    _logoXPos = play_progress.offset().left + progressPx + seeker_logo.width() / 2;
                    _logoYPos = play_progress.offset().top;
                } else {
                    _logoXPos = play_progress.offset().left + progressPx + seeker_logo.width() / 2;
                    _logoYPos = play_progress.offset().top;
                }


                if (videoFirstPlay == true) {
                    var scrubberYOffset = 0;
                    var scrubberXOffset = 0;
                    if (originalLogoHeight != defaultScrubberHeight) {
                        scrubberYOffset = (originalLogoHeight - defaultScrubberHeight) / 2;
                    }
                    if (originalLogoWidth != defaultScrubberWidth) {
                        scrubberXOffset = (originalLogoWidth - defaultScrubberWidth) / 2;
                    }
                    var tempY = play_progress.offset().top + scrubberYOffset - defaultScrubberHeight/2;
                    var tempX = _logoXPos + scrubberXOffset;
                    if (!backgroundStageisOff) {
                        logoPlayButton.css({
                            'top': tempY + "px",
                            'left': tempX + "px",
                            'width': logoWidth + "px",
                            'height': logoHeight + "px"
                        });
                    } else if (backgroundStageisOff && scrubberIsInPosition) {

                        if (logoHeight > logoWidth) {
                            $('#actual-big-logo').css({
                                'transform' : 'translate(0,' + (logoWidth/logoHeight*100/2) + '%)'
                            });
                        }

                        logoPlayButton.css({
                            'top': tempY + "px",
                            'left': tempX + "px",
                            'width': logoWidth + "px",
                            'height': logoHeight + "px"
                        });
                    }
                }

            } else if (logoMode == "anchor") {
                var corner_logo = $('#corner-logo');
                _logoXPos = corner_logo.offset().left + $('#big-play-button').width() / 2;
                _logoYPos = corner_logo.offset().top + $('#big-play-button').height();

                if (videoFirstPlay == true) {
                    logoPlayButton.css({
                        'top': _logoYPos + "px",
                        'left': _logoXPos + "px",
                        'margin-top': (-corner_logo.height())+"px"
                    });
                }
            }
        }
    };

    helper.start = function() {
        document.getElementById("play-button").style.opacity = 0;
        if (!adIsReady) {
            helper.onFirstPlay();
        } else {
            //wait for ads to finish or error out
            (function () {
                if (!adIsReady) {
                    helper.onFirstPlay();
                } else {
                    videoPlayer.setTimeout(arguments.callee, 200);
                }
            })();
        }
    };

    helper.onFirstPlay = function () {
        helper.trigger("initPlay");
        if (logoMode == "anchor") {
            helper.trigger("anchorImpression");
        }
        videoFirstPlay = true;
        videoPlayer.pause();

        if (LogoConfig.enabled != true) {

            logoBackground.css({
                'width': '100%',
                'height': '100%',
                'opacity': 0.6
            });

            logoPlayButton.css({
                'opacity': 1,
                'visibility': 'visible'
            });

            if (logoMode == "scrubber") {

                _logoXPos = $('#seeker-logo').offset().left + originalLogoWidth / 2;
                _logoYPos = $('#seeker-logo').offset().top + originalLogoHeight / 2;

                logoPlayButton.css({
                    'top': _logoYPos + "px",
                    'left': _logoXPos + "px"
                });
            } else {
                switch (logoTransitionStyle) {
                    case "slideDown":
                        logoPlayButton.css({
                            'top': (Number($(".vjs-tech").height()) + Number($('#big-play-button').height()) *1.6) + 'px'
                        });
                        break;
                    case "slideRight":
                        logoPlayButton.css({
                            'left': '120%'
                        });
                        break;
                    case "slideLeft":
                        logoPlayButton.css({
                            'left': '-' + logoWidth +"px"
                        });
                        break;
                }
            }

            setTimeout(function () {
                logoBackground.css({
                    'opacity': 0
                });
                backgroundStageisOff = true;
            }, logoTransitionDelay * 1000); // 0 milliseconds

            setTimeout((function () {
                var big_play_button = $("#big-play-button");
                videoPlayer.play();
                logoBackground.css({
                    'display': 'none'
                });

                if (logoMode == "scrubber") {
                    //apply transition style for when the logo is in scrubber mode
                    document.getElementById("big-play-button").style.transition = "opacity 1s ease 0.75s, top 0.1s linear, left 0.75s linear";

                    big_play_button.draggable();
                    big_play_button.on("dragstart", function (event, ui) {
                        scrubberIsDragged = true;
                        document.getElementById("big-play-button").style.transition = "";
                    });
                    big_play_button.on("dragstop", function (event, ui) {
                        scrubberIsDragged = false;
                        videoPlayer.currentTime((big_play_button.position().left - $(".vjs-progress-control").position().left) / $(".vjs-progress-control").width() * videoPlayer.duration());
                        document.getElementById("big-play-button").style.transition = "opacity 1s ease 0.75s, top 0.1s linear, left 0.75s linear";
                        if (videoPlayer.paused()) {
                            videoPlayer.play();
                            videoPlayer.pause();
                        }
                    });
                    big_play_button.draggable({axis: "x"});
                    big_play_button.draggable("option", "containment", $(".vjs-progress-control"));


                } else if (logoMode == "anchor") {
                    big_play_button.click(function () {
                        var win = window.open(LogoConfig.anchorUrl, LogoConfig.anchorTarget);
                        win.focus();
                        if (videojs('#vjs_video_3').paused() != true) {
                            videojs('#vjs_video_3').pause();
                        }
                        $.triggerLBEvent('anchorClick');
                    });
                }

                $("#seeker-logo").draggable();
                $("#seeker-logo").on("dragstart", function (event, ui) {
                    scrubberIsDragged = true;
                    document.getElementById("seeker-logo").style.transition = "";
                });
                $("#seeker-logo").on("dragstop", function (event, ui) {
                    scrubberIsDragged = false;
                    videoPlayer.currentTime(($("#seeker-logo").position().left - $(".vjs-progress-control").position().left) / $(".vjs-progress-control").width() * videoPlayer.duration());
                    document.getElementById("seeker-logo").style.transition = "top 0.1s linear, left 0.75s linear";
                    if (videoPlayer.paused()) {
                        videoPlayer.play();
                        videoPlayer.pause();
                    }
                });
                $("#seeker-logo").draggable({axis: "x"});
                $("#seeker-logo").draggable("option", "containment", $(".vjs-progress-control"));

                document.getElementById("seeker-logo").style.cursor = "pointer";
                document.getElementById("big-play-button").style.cursor = "pointer";
                scrubberIsInPosition = true;
            }), logoTransitionDelay * 1000 + logoTransitionTime * 1000);
        } else {
            switch (logoTransitionStyle) {
                case "slideDown":
                    logoPlayButton.css({
                        'top': '100%'
                    });
                    break;
                case "slideRight":
                    logoPlayButton.css({
                        'left': '100%'
                    });
                    break;
                case "slideLeft":
                    logoPlayButton.css({
                        'left': '0%'
                    });
                    break;
            }
            setTimeout((function () {
                scrubberIsInPosition = true;
                videoPlayer.play();
            }), logoTransitionTime * 1000 + 1000);
        }


        //Increment the idle time counter every minute.
        var idleInterval = setInterval(helper.timerIncrement, 1000);

        //Zero the idle timer on mouse movement.
        $(document.documentElement).mousemove(function (e) {
            idleTime = 0;
            if (controlBarFaded == true) {
                helper.fadeControlBarIn();
            }
        });
        $(document.documentElement).keypress(function (e) {
            idleTime = 0;
            if (controlBarFaded == true) {
                helper.fadeControlBarIn();
            }
        });

        videoPlayer.off("firstplay", helper.start);
    };

    helper.createAssetDivs = function () {
        var _anchorBeginHtml = "<a id='lb-anchor-link' href='' target='_blank' onclick=\"if (videojs('#vjs_video_3').paused() != true) {videojs('#vjs_video_3').pause();} $.triggerLBEvent('anchorClick');\" >";
        var _anchorEndHtml = "<\a>";
        cornerLogo = _anchorBeginHtml + "<div class='" + divClass + "' id='corner-logo'></div>" + _anchorEndHtml;
        bigLogo = "<div class='" + divClass + "' id='big-play-button' style='opacity:0'></div>";

        $('.vjs-control-bar').prepend(cornerLogo);

        seekerLogo = "<div class='" + divClass + "' id='seeker-logo'></div>";
        backgroundLogo = "<div id='black-background-logo'></div>";
        $('.vjs-big-play-button').before(backgroundLogo);
        logoBackground = $('#black-background-logo');
        $('#black-background-logo').before($('.vjs-control-bar'));


        $('.vjs-big-play-button').parent().append(bigLogo);
        $('.vjs-big-play-button').parent().append(seekerLogo);

        if ($('.vjs-big-play-button').css('border-radius') == '50%') {
            brightcoveSkin = "luna";
        } else {
            brightcoveSkin = "graphite";
        }

        logoPlayButton = $('#big-play-button');

        controlbar = document.getElementsByClassName("vjs-control-bar")[0];
        controlbar.setAttribute("id", "myControlbar");

        controlbk = "<div class='" + divClass + "' id='control-bk'></div>";
        $('#myControlbar').before(controlbk);

        $('.vjs-big-play-button').hide();
        playButton = "<div class='" + divClass + "' id='play-button' style='pointer-events: none'><i class='fa fa-play-circle-o' style='font-size: 600%'></i></div>";
        $('.vjs-big-play-button').parent().append(playButton);

        if (util.getMobileOperatingSystem() != "unknown" && util.getMobileBrowser() != "Chrome") {
            helper.onAdStarts();
        }

        plugin.injectCSS();
    };

    helper.showControlBarForLuna = function() {
        $('#myControlbar').show();
        var progressBar = $($('.vjs-progress-control')[0]);
        var progressTop = progressBar.offset().top + 5;
        var anchorWidth = $('#corner-logo').width();
        $($('.vjs-play-control')[0]).offset({top: progressTop, left:anchorWidth});
        $($('.vjs-volume-menu-button')[0]).offset({top: progressTop, left:anchorWidth + $($('.vjs-play-control')[0]).width()});
        $($('.vjs-current-time')[0]).offset({top: progressTop, left:$($('.vjs-volume-menu-button')[0]).offset().left + $($('.vjs-volume-menu-button')[0]).width() + 40});
        $($('.vjs-current-time')[0]).width(lunaCurrentTimeWidth);
        $($('.vjs-time-divider')[0]).offset({top: progressTop, left:$($('.vjs-current-time')[0]).offset().left + $($('.vjs-current-time')[0]).width() + 20});
        $($('.vjs-duration')[0]).offset({top: progressTop, left:$($('.vjs-time-divider')[0]).offset().left + $($('.vjs-time-divider')[0]).width() + 20});
        $($('.vjs-fullscreen-control')[0]).offset({top: progressTop, left:progressBar.width()-$($('.vjs-fullscreen-control')[0]).width()});
    };

    helper.updateCSS = function () {
        if (!impressionTriggered) {
            helper.trigger("impression");
            impressionTriggered = true;
        }
        plugin.log(" Updating CSS!");

        $('.vjs-current-time-display')[0].style.color = "rgba(" + ColorSchema.iconColor + ")";
        $('.vjs-time-divider')[0].style.color = "rgba(" + ColorSchema.iconColor + ")";
        $('.vjs-duration-display')[0].style.color = "rgba(" + ColorSchema.iconColor + ")";

        if (logoMode != "scrubber" && logoMode != "anchor") {
            document.getElementById("big-play-button").addEventListener("transitionend", function() {
                setTimeout(function() {
                    document.getElementById("big-play-button").style.overflow = "";
                    document.getElementById("big-play-button").style.display = "none";
                    document.getElementById("big-play-button").style.top = "10000px";
                }, 3000);
            });
            document.getElementById("seeker-logo").style.backgroundImage = "url('" + AssetsConfig.scrubber + "')";
            document.getElementById("corner-logo").style.backgroundImage = "url('" + LogoConfig.anchor + "')";
        } else if (logoMode != "anchor") {
            document.getElementById("corner-logo").style.backgroundImage = "url('" + LogoConfig.anchor + "')";
        } else if (logoMode != "scrubber") {
            document.getElementById("seeker-logo").style.backgroundImage = "url('" + AssetsConfig.scrubber + "')";
        }
        if (logoMode != "anchor" && !anchorImpressionTriggered) {
            helper.trigger("anchorImpression");
            anchorImpressionTriggered = true;
        }
        document.getElementById("seeker-logo").style.transition = "top 0.1s linear, left 0.75s linear";

        if ($('#actual-big-logo').length == 0) {
            $('#big-play-button').append($("<div id='actual-big-logo'> </div>"));
        }

        document.getElementById("actual-big-logo").style.width = "100%";
        document.getElementById("actual-big-logo").style.height = "100%";
        document.getElementById("actual-big-logo").style.backgroundImage = "url('" + LogoConfig.url + "')";
        document.getElementById("actual-big-logo").style.backgroundRepeat = "no-repeat";
        document.getElementById("actual-big-logo").style.backgroundSize = "contain";

        if (LogoConfig.bgShape == "circle" && $("#circle-background").length == 0) {
            $('#big-play-button').append($("<div id='circle-background' class='circleBase'> </div>"));
        }

        if (LogoConfig.bgShape == "circle" ) {
            document.getElementById("circle-background").style.width = "100%";
            document.getElementById("circle-background").style.height = "100%";
            document.getElementById("circle-background").style.background = "rgba(" + ColorSchema.logoBgColor + ")";
            document.getElementById("circle-background").style.zIndex = "-1";
        } else {
            document.getElementById("big-play-button").style.backgroundColor = "rgba(" + ColorSchema.logoBgColor + ")";
        }

        document.getElementById("control-bk").style.backgroundImage = "url('" + AssetsConfig.progressBar + "')";
        document.getElementById("control-bk").style.backgroundRepeat = "repeat-x";
        document.getElementById("control-bk").style.position = "absolute";
        document.getElementById("control-bk").style.width = "100%";
        document.getElementById("control-bk").style.height = "100%";
        document.getElementById("control-bk").style.pointerEvents = "none";
        document.getElementById("control-bk").style.top = ($('#myControlbar').offset().top - videoPlayer.el_.offsetTop) + "px";

        if (ColorSchema.iconColor != "") {
            $('head').append('<style>.vjs-control::before{color:rgba(' + ColorSchema.iconColor + ')}</style>');
        }

        $('head').append('<style>.vjs-progress-holder::before{opacity: 0.1;)}</style>');

        $(".vjs-play-progress").css("background-color", "rgba(" + ColorSchema.progressBarColor + ")");
        var object_selection = $(".vjs-menu-content");
        object_selection[object_selection.length - 1].style.backgroundColor = "rgba(" + ColorSchema.progressBarColor + ")";

        if (AssetsConfig.play != "") {
            document.getElementById("play-button").innerHTML = "";
            document.getElementById("play-button").style.backgroundImage = "url('" + AssetsConfig.play + "')";
        } else {
            document.getElementById("play-button").style.color = "rgba(" + ColorSchema.playColor + ")";
        }

        if (LogoConfig.anchorUrl.length > 0) {
            document.getElementById("lb-anchor-link").href = LogoConfig.anchorUrl;
        }
        document.getElementById("lb-anchor-link").target = LogoConfig.anchorTarget;

        if (logoMode == "anchor") {
            tempHeight = progressHeight;
            tempWidth = logoWidth*progressHeight/logoHeight;
            logoHeight = tempHeight;
            logoWidth = tempWidth;
        }

        var playerOffsetLeft = videoPlayer.el_.offsetLeft;
        var playerOffsetTop = videoPlayer.el_.offsetTop;
        document.getElementById("big-play-button").style.width = logoWidth + "px";
        document.getElementById("big-play-button").style.height = logoHeight + "px";

		newHeight=myPlayer.currentHeight();
		console.log(newHeight);		
		newWidth=myPlayer.currentWidth();
		console.log(newWidth);		

        document.getElementById("big-play-button").style.top = playerOffsetTop + (videoPlayer.currentHeight()/2) + "px";
        document.getElementById("big-play-button").style.left = playerOffsetLeft + (videoPlayer.currentWidth()/2) + "px";
        document.getElementById("big-play-button").style.marginLeft = (-logoWidth / 2) + "px";
        document.getElementById("big-play-button").style.marginTop = (-logoHeight / 2) + "px";
        document.getElementById("big-play-button").style.opacity = 0;
        document.getElementById("big-play-button").style.position = "absolute";
        document.getElementById("big-play-button").style.overflow = "hidden";
        document.getElementById("play-button").style.width = "75px";
        document.getElementById("play-button").style.height = "75px";
        //TODO
        document.getElementById("play-button").style.top = playerOffsetTop + (videoPlayer.currentHeight()/2) + "px";
        document.getElementById("play-button").style.left = playerOffsetLeft + (videoPlayer.currentWidth()/2) + "px";
        document.getElementById("play-button").style.marginLeft = "-37px";
        document.getElementById("play-button").style.marginTop = "-37px";

        if (LogoConfig.enabled == true) {
            document.getElementById("big-play-button").style.opacity = 1;

            switch (LogoConfig.position) {
                case "top":
                    document.getElementById("big-play-button").style.position = "absolute";
                    _logoYPos = $('#play-button').position().top - document.getElementById("big-play-button").offsetHeight - defaultLogoOffset;
                    document.getElementById("big-play-button").style.top = _logoYPos + "px";
                    _logoXPos = $('#play-button').position().left + $('#play-button').width() / 2;
                    document.getElementById("big-play-button").style.left = _logoXPos + "px";
                    document.getElementById("big-play-button").style.marginLeft = (-document.getElementById("big-play-button").offsetWidth / 2) + "px";
                    document.getElementById("big-play-button").style.marginTop = 0;
                    break;
                case "bottom":
                    document.getElementById("big-play-button").style.position = "absolute";
                    _logoYPos = $('#play-button').position().top + $('#play-button').height() + defaultLogoOffset;
                    document.getElementById("big-play-button").style.top = _logoYPos + "px";
                    _logoXPos = $('#play-button').position().left + $('#play-button').width() / 2;
                    document.getElementById("big-play-button").style.left = _logoXPos + "px";
                    document.getElementById("big-play-button").style.marginLeft = (-document.getElementById("big-play-button").offsetWidth / 2) + "px";
                    document.getElementById("big-play-button").style.marginTop = 0;
                    break;
                case "left":
                    document.getElementById("big-play-button").style.position = "absolute";
                    _logoYPos = $('#play-button').position().top + $('#play-button').height() / 2;
                    document.getElementById("big-play-button").style.top = _logoYPos + "px";
                    _logoXPos = $('#play-button').position().left - document.getElementById("big-play-button").offsetWidth - defaultLogoOffset;
                    document.getElementById("big-play-button").style.left = _logoXPos + "px";
                    document.getElementById("big-play-button").style.marginTop = (-document.getElementById("big-play-button").offsetHeight / 2) + "px";
                    document.getElementById("big-play-button").style.marginLeft = 0;
                    break;
                case "right":
                    document.getElementById("big-play-button").style.position = "absolute";
                    _logoYPos = $('#play-button').position().top + $('#play-button').height() / 2;
                    document.getElementById("big-play-button").style.top = _logoYPos + "px";
                    _logoXPos = $('#play-button').position().left + $('#play-button').width() + defaultLogoOffset;
                    document.getElementById("big-play-button").style.left = _logoXPos + "px";
                    document.getElementById("big-play-button").style.marginTop = (-document.getElementById("big-play-button").offsetHeight / 2) + "px";
                    document.getElementById("big-play-button").style.marginLeft = 0;
                    break;
                default:
                    // defaulting to 'center' position
                    document.getElementById("big-play-button").style.position = "absolute";
                    _logoYPos = $('#play-button').position().top + $('#play-button').height() / 2;
                    document.getElementById("big-play-button").style.top = _logoYPos + "px";
                    _logoXPos = $('#play-button').position().left + $('#play-button').width() / 2;
                    document.getElementById("big-play-button").style.left = _logoXPos + "px";
                    document.getElementById("big-play-button").style.marginTop = (-document.getElementById("big-play-button").offsetHeight / 2) + "px";
                    document.getElementById("big-play-button").style.marginLeft = (-document.getElementById("big-play-button").offsetWidth / 2) + "px";

            }
            document.getElementById("big-play-button").style.transition = "opacity 1s ease 0.75s, top " + logoTransitionTime + "s ease, left " + logoTransitionTime + "s ease, width " + logoTransitionTime + "s ease, height " + logoTransitionTime + "s ease";
        } else {
            document.getElementById("big-play-button").style.transition = "opacity 1s ease 0.75s, top " + logoTransitionTime + "s ease " + logoTransitionDelay + "s, left " + logoTransitionTime + "s ease " + logoTransitionDelay + "s, width " + logoTransitionTime + "s ease " + logoTransitionDelay + "s, height " + logoTransitionTime + "s ease " + logoTransitionDelay + "s";
        }

        volumebar = document.getElementsByClassName("vjs-menu-content")[4];
        volumebar.setAttribute("id", "myVolumebar");

        $('#corner-logo').css({
            'width': Number(progressHeight * 150/60) + 'px',
            'height': progressHeight + 'px'
        });

        $('#myControlbar').css({
            '-webkit-transition': '-webkit-transform ' + fadeTime + 's, margin ' + fadeTime + 's',
            '-moz-transition': '-moz-transform ' + fadeTime + 's, margin ' + fadeTime + 's',
            '-ms-transition': '-ms-transform ' + fadeTime + 's, margin ' + fadeTime + 's',
            '-o-transition': '-o-transform ' + fadeTime + 's, margin ' + fadeTime + 's'
        });

        if (controlBarPosition == "hover") {
            document.getElementById("myControlbar").style.width = "90%";
            document.getElementById("myControlbar").style.left = ($(".vjs-poster").width() - $("#myControlbar").width()) / 2 + "px";
            document.getElementById("myControlbar").style.bottom = "50px";
        } else if (controlBarPosition == "under" && progressFixed) {
            if (!controlBarPositioned) {
                videoPlayer.setTimeout(function () {
                    if (!isFullscreen) {
                        $(".vjs-tech").height($(".vjs-tech").height() - $("#myControlbar").height());
                        $(".vjs-poster").height($(".vjs-poster").height() - $("#myControlbar").height());
                    } else {
                        $(".vjs-tech").height($(window).height() - $("#myControlbar").height());
                        $(".vjs-poster").height($(window).height() - $("#myControlbar").height());
                    }
                }, 500);
                controlBarPositioned = true;
            }

        }

        if (AssetsConfig.progressBar != "") {
            ColorSchema.controlBarColor = "0,0,0,0";
        }

        $('.vjs-poster').css({
            'background-color': 'rgba(' + ColorSchema.skinColor + ')',
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'top': '0px',
            'left': '0px'
        });
        $('.vjs-tech').css({
            'background-color': 'rgba(' + ColorSchema.skinColor + ')',
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'top': '0px',
            'left': '0px'
        });

        if (ColorSchema.controlBarColor.length > 0) {
            $('#myControlbar').css({
                'height': progressHeight + 'px',
                'background-color': 'rgba(' + ColorSchema.controlBarColor + ')',
                'border': '0px'
            });
            $('#myVolumebar').css({
                'background-color': 'rgba(' + ColorSchema.controlBarColor + ')'
            });
        }

        $('.vjs-poster').css({
            'background-color': 'rgba(' + ColorSchema.skinColor + ')'
        });

        if (brightcoveSkin == 'luna') {
            helper.showControlBarForLuna();
        }
        helper.onPlayerProgress();
    };

    helper.timerIncrement = function () {
        idleTime = idleTime + 1;
        if (idleTime > fadeAfter && !progressFixed) {
            $('#big-play-button').fadeOut(fadeTime * 1000, function () {/*execute when fade completed*/
            });
            $('#actual-big-logo').fadeOut(fadeTime * 1000, function () {/*execute when fade completed*/
            });
            $('#myControlbar').fadeOut(fadeTime * 1000, function () {/*execute when fade completed*/
            });
            $('#seeker-logo').fadeOut(fadeTime * 1000, function () {/*execute when fade completed*/
            });
            $('#control-bk').fadeOut(fadeTime * 1000, function () {/*execute when fade completed*/
            });
            controlBarFaded = true;
        }
    };

    helper.fadeControlBarIn = function () {
        controlBarFaded = false;
        $("#myControlbar").fadeIn(fadeTime * 1000, function () {
            helper.trigger("controlBarImpression");
        });
        videoPlayer.setTimeout(function () {
            $('#big-play-button').fadeIn(fadeTime * 1000 - 500, function () {/*execute when fade completed*/
            });
            $('#actual-big-logo').fadeIn(fadeTime * 1000 - 500, function () {/*execute when fade completed*/
            });
            $('#seeker-logo').fadeIn(fadeTime * 1000 - 500, function () {/*execute when fade completed*/
            });
            $('#control-bk').fadeIn(fadeTime * 1000, function () {/*execute when fade completed*/
            });
        }, fadeTime * 1000 + 1000);
    };

    helper.onSeeking = function () {
        helper.trigger("scrubberInteraction");
        if (canFireInteraction) {
            helper.trigger("interaction");
        }
    };


    helper.trigger = function (eventName) {
        plugin.log("Triggering: "+eventName);
        if (vastResponse != "") {
            var url = "";
            if (eventName != "impression") {
                var trackers = $(vastResponse).find('Tracking[event="' + eventName + '"]');
                for (var urlId = 0; urlId < trackers.length; urlId++) {
                    helper.callURL(trackers[urlId].textContent);
                }
            } else {
                url = vastResponse.getElementsByTagName("Impression")[0].childNodes[0].nodeValue;
                helper.callURL(url);
            }
        }
    };

    helper.callURL = function (url) {
        var image = new Image(1, 1);
        image.src = url;
    };

    helper.removeEventListners = function() {
        videoPlayer.off("timeupdate", helper.onPlayerProgress);
        videoPlayer.off("seeked", helper.onPlayerProgress);
        videoPlayer.off("seeking", helper.onSeeking);
        videoPlayer.off("pause", helper.onPlayerPaused);
        videoPlayer.off("play", helper.onPlayerResumed);
        videoPlayer.off("fullscreenchange", helper.changeFSButton);
        videoPlayer.off("firstplay", helper.start);
        videoPlayer.off("adsready", helper.onAdReady);
        videoPlayer.off("ads-pod-started", helper.onAdStarts);
        videoPlayer.off("ads-pod-ended", helper.onAdEnds);
        videoPlayer.off("adtimeout", helper.onAdTimeout);
    };

    util.isNumeric = function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    util.createCSS = function (id, url) {
        var cssId = id;  // we could encode the css path itself to generate id..
        if (!document.getElementById(cssId)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            // This can be changed to point to a different location (absolute or relative)
            link.href = url;
            link.media = 'all';
            head.appendChild(link);
        } else {
            plugin.log("[Warning] CSS id: '" + cssId + "' already exists on the page. CSS will NOT be loaded!");
        }
    };

    util.getMobileOperatingSystem = function() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    };

    util.getMobileBrowser = function() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/chrome/i.test(userAgent)) {
            if (/version/i.test(userAgent)) {
                return "WebView";
            }
            return "Chrome";
        }

    };

})();

