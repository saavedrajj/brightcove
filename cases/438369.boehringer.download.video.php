<?php /*header("Content-disposition: attachment");*/ ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Download Video Plugin</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
	<link href="//cs1.brightcodes.net/jsaavedra/includes/css/download-video.css" rel="stylesheet">
</head>
<body>
	<div class="container">
		<h1>Download Video Plugin</h1>
		<div style="position: relative; display: block; max-width: 100%;">
			<div style="padding-top: 56.25%;">
				<video 
				id="myPlayerID"
				data-video-id="5622000782001" 
				data-account="5458602755001" 
				data-player="default" 
				data-embed="default" 
				data-application-id 
				class="video-js" 
				controls autoplay muted
				style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%; height: 100%;"></video>
				<script src="//players.brightcove.net/5458602755001/default_default/index.min.js"></script>
			</div>
		</div>
		<script type="text/javascript" src="//cs1.brightcodes.net/jsaavedra/includes/js/download-video.js"></script>
		<script>videojs('myPlayerID').downloadVideoPlugin();</script>
		<ul>
			<li><a href="https://support.brightcove.com/brightcove-player-sample-download-video-plugin" target="_blank">Brightcove Player Sample: Download Video Plugin</a></li>	
		</ul>
		<div class="alert alert-warning" role="alert">These are examples to demonstrate certain features and functionality of Brightcove products and services and are provided for demonstration purposes only. These examples are not to be used in production and are not supported by Brightcove or the Brightcove support team.</div>
	</div>

	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
</body>
</html>

