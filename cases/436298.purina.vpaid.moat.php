 <?php
 header("Access-Control-Allow-Origin: *");?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>IMA3 - Request Ads: On play</title>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">	
	<style>
		.video-js {
			width: 640px;
			height: 360px;
		}
	</style>
	<link href="//players.brightcove.net/videojs-ima3/2/videojs.ima3.min.css" rel="stylesheet">
</head>
<body>
	<div class="container">
		<h1>Pre-roll VPAID tag for Pet Center Sponsorship</h1>
		<div style="position: relative; display: block; max-width: 100%;">
			<div style="padding-top: 56.25%;">
				<video 
				id="myPlayerID"
				data-video-id="1966738766001" 
				data-account="429049095" 
				data-player="default" 
				data-embed="Skl4WdCvUZ" 
				data-application-id 
				class="video-js" 
				controls 
				style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%; height: 100%;"></video>
				<script src="//players.brightcove.net/429049095/default_default/index.min.js"></script>
			</div>
		</div>
		<script src="//players.brightcove.net/videojs-ima3/2/videojs.ima3.min.js"></script>
		<script type="text/javascript">
			var myPlayer;
			/* Brightcove Player initialisation */ 
			var player = bc('myPlayerID');
			/* IMA3 Plugin initialisation */ 
			player.ima3({
				adTechOrder: ['html5', 'flash'],
				debug: true,
				/*
				serverUrl: 'http://pubads.g.doubleclick.net/gampad/preview_cookie?gct=1GjkBoHw2iIY-_f9zgUw-5Oz1gWIAYCAgKDrzvmUfg&op=set&redirect=http://womenshealthmag.com/video&redirect_hash=AJlzBa1LO8e3-W_Wuud_CvcIxo7Omy0dPw&lineItemId=4437628777&creativeId=138212976243',	
*/


				serverUrl: 'http://pubads.g.doubleclick.net/gampad/preview_cookie?gct=s-IEOr2smTkYmPf9zgUwmJOz1gWIAYCAgKDrzvnYdw&op=set&redirect=http://womenshealthmag.com/video&redirect_hash=AJlzBa1LO8e3-W_Wuud_CvcIxo7Omy0dPw&lineItemId=548643733&creativeId=113279722333',

				requestMode: 'onplay', 
				timeout: 6000, 
				hardTimeouts: false,
				loadingSpinner: false,
				vpaidMode: 'ENABLED',
				ima3SdkSettings: {
					disableCustomPlaybackForIOS10Plus: true, 
					numRedirects: 10
				}
			});
		</script>
		<div class="alert alert-warning" role="alert">These are examples to demonstrate certain features and functionality of Brightcove products and services and are provided for demonstration purposes only. These examples are not to be used in production and are not supported by Brightcove or the Brightcove support team.</div>
	</div>
	<script src="https://code.jquery.com/jquery-3.1.0.min.js" integrity="sha256-cCueBR6CsyA4/9szpPfrX3s49M9vUU5BgtiJj06wt/s=" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>	  	
</body>
</html>