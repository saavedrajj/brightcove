<?php
 header("Access-Control-Allow-Origin: *"); ?>
<!DOCTYPE html>
<html>
<head>
	<title>Brightcove Player - IMA3 Advertising</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
</head>
<body>
	<span class="meta">Brightcove Player</span>&nbsp;<span class="meta">Advertising</span>&nbsp;
	<h1>Brightcove Player - IMA3 Advertising</h1>
	<video
	id="bcplayer"
	width="720"
	height="405"
	data-account="5480140243001"
	data-player="B1WxIPFU"
	data-embed="default"
	data-playlist-id="4133241483001"
	class="video-js" controls></video>
	<script src="//players.brightcove.net/2602624528001/B1WxIPFU_default/index.min.js"></script>
	<script src="//players.brightcove.net/videojs-ima3/2/videojs.ima3.js"></script>

	<link href="//players.brightcove.net/videojs-ima3/2/videojs.ima3.min.css" rel="stylesheet">
	<script type="text/JavaScript">
		var brightcovePlayer = videojs('bcplayer');
		brightcovePlayer.ready(function(){

			var options = {};
			options.timeout = 15000;
			options.hardTimeouts = true;
			options.requestMode = "onplay";


			/*
			options.serverUrl = "http://pubads.g.doubleclick.net/gampad/ads?sz=3x3&iu=/4011/{site}/tv/sf&ciu_szs&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&player=bc&pos=pre&player_width=720&player_height=405&vd={mediainfo.duration}&vt={mediainfo.name}&vc=Entertainment&clip={clip}&url=[referrer_url]&correlator={timestamp}&cust_params=pos=pre&player=bc&at=&sz=3x3&tile=13&vc={vc}&clip={clip}&player_width=720&player_height=405&cateory={category}";

			options.serverUrl = "https://pubads.g.doubleclick.net/gampad/ads?unviewed_position_start=1&cust_params=type%3Darticle%26section%3Dnews%26site%3Dnme%26tagging%3Dcategory_music%2Ccategory_news%2Cpost_tag_manchester%2Cperson_category_oasis%2Cpublication_name_nme%2Cauthor_willbutler%26pub%3Dnme%26author%3Dwillbutler%26contentId%3D2084030%26subtype%3Dimage&iu=%2F18711560%2Fnme&correlator=2757949517220963&sz=400x300&url=http%3A%2F%2Fs3.amazonaws.com%2Ftiuk-umar-test%2Fvideo%2Fbrightcove%2Fplayer-issues%2Fads.html&ciu_szs&env=vp&output=xml_vast3&description_url=http%3A%2F%2Fs3.amazonaws.com%2Ftiuk-umar-test%2Fvideo%2Fbrightcove%2Fplayer-issues%2Fads.html&gdfp_req=1&sdkv=h.3.177.0&sdki=3c0d&scor=3323102469768391&adk=256788948&u_so=l&osd=2&frm=0&sdr=1&mpt=brightcove%2Fplayer-ht&mpv=2.19.4&afvsz=200x200%2C250x250%2C300x250%2C336x280%2C450x50%2C468x60%2C480x70%2C728x90&ged=ve4_td12_tt6_pd12_la5000_er90.275.450.1415_vi24.0.450.1690_vp100_ts1_eb24171";
*/

			options.serverUrl = "https://pubads.g.doubleclick.net/gampad/ads?unviewed_position_start=1&cust_params={customparams}&correlator=2757949517220963&sz=400x300&url=http%3A%2F%2Fs3.amazonaws.com%2Ftiuk-umar-test%2Fvideo%2Fbrightcove%2Fplayer-issues%2Fads.html&ciu_szs&env=vp&output=xml_vast3&description_url=http%3A%2F%2Fs3.amazonaws.com%2Ftiuk-umar-test%2Fvideo%2Fbrightcove%2Fplayer-issues%2Fads.html&gdfp_req=1&sdkv=h.3.177.0&sdki=3c0d&scor=3323102469768391&adk=256788948&u_so=l&osd=2&frm=0&sdr=1&mpt=brightcove%2Fplayer-ht&mpv=2.19.4&afvsz=200x200%2C250x250%2C300x250%2C336x280%2C450x50%2C468x60%2C480x70%2C728x90&ged=ve4_td12_tt6_pd12_la5000_er90.275.450.1415_vi24.0.450.1690_vp100_ts1_eb24171";



			options.adTechOrder = ["html5","flash"];
			options.vpaidMode = "INSECURE";
			options.contribAdsPostrollTimeout = 500;
			options.postrollTimeout = 500;
			options.debug = true;

			brightcovePlayer.ima3(options);
/*
			brightcovePlayer.ima3.adMacroReplacement = function(url){
				var parameters = {
					'{customparams}': 'type%3Darticle%26section%3Dnews%26site%3Dnme%26tagging%3Dcategory_music%2Ccategory_news%2Cpost_tag_manchester%2Cperson_category_oasis%2Cpublication_name_nme%2Cauthor_willbutler%26pub%3Dnme%26author%3Dwillbutler%26contentId%3D2084030%26subtype%3Dimage&iu=%2F18711560%2Fnme'

		
				};

				for (var i in parameters) {
					url = url.split(i).join(encodeURIComponent(parameters[i]));
				}
				return url;
			}
*/
		});
	</script>
</body>
</html>