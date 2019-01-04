<?php
//error_reporting(0);
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Express Newspapers rendition checker</title> 
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
	<div class="container">
		<h1>Express Newspapers rendition checker</h1>
		<?php
		include_once "credentials.php";
		$authString = "{$clientId}:{$clientSecret}";
		$bcToken = base64_encode($authString);
		$sizeZero = 0;
		
		# OAuth API: Get access_token  ********************************************************************************

		$cAccessToken = curl_init();
		curl_setopt_array($cAccessToken, array(
			CURLOPT_URL => "https://oauth.brightcove.com/v4/access_token",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 360,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => "grant_type=client_credentials",
			CURLOPT_HTTPHEADER => array(
				"Authorization: Basic " . $bcToken . "",
				"Cache-Control: no-cache"
			),
		));
		$rAccessToken = curl_exec($cAccessToken);
		$eAccessToken = curl_error($cAccessToken);
		curl_close($cAccessToken);
		if ($eAccessToken) {  
			echo "cURL Error #:" . $eAccessToken; 
		} 
		else {
			$jAccessToken = json_decode($rAccessToken);
			$accessToken = $jAccessToken->access_token;
		}

		# CMS API: Total of videos ************************************************************************************				
		
		$cTotalVideos = curl_init();

		curl_setopt_array($cTotalVideos, array(
			CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $accountId . "/counts/videos/?q=created_at:" . $_POST['from'] . ".." . $_POST['to'],
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 360,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				"Authorization: Bearer " . $accessToken . "",
				"Cache-Control: no-cache",
				"Content-Type: application/json"
			),
		));

		$rTotalVideos = curl_exec($cTotalVideos);
		$eTotalVideos = curl_error($cTotalVideos);

		curl_close($cTotalVideos);
		if ($eTotalVideos) {
			echo "cURL Error #:" . $eTotalVideos;
		} else {
			$jTotalVideos = json_decode($rTotalVideos, true);
			$totalVideos = $jTotalVideos["count"];  
		}

		echo "total de videos:" . $totalVideos . "<br/>";

		# Get Offset Iterations *******************************************************************************************

		$offsetIterations = $totalVideos / 100;
		if(is_int($offsetIterations)){}
		else {
			$offsetIterations = intval($offsetIterations) + 1;
		}

        echo "offsetIterations:". $offsetIterations . "<br>";
		# *****************************************************************************************************************
		?>




		<h2>Videos from <?php echo $_POST["from"];?> to <?php echo $_POST["to"];?></h2>
		<hr>
		<?php 
		//echo "<p>Total of new videos created: ". $totalVideos. "</p>";
		echo "<p>Videos with no renditions:</p>";  
		echo "<div class='alert alert-danger' role='alert'><span id='no_rendition'></span></div>";
		echo "<p>Videos with wrong assets:</p>";  
		echo "<div class='alert alert-danger' role='alert'><span id='wrong_asset'></span></div>";

		?>
		<hr>
		<?php
		/* Get videos in data range *********************************************************************************/
		$currentOffset = 0;
		#$numVideos=0;

		for($i = 0; $i <= $offsetIterations - 1; $i++) { 
		 	echo "currentOffset: " . $currentOffset . "<br>";
			#while($numVideos = 100) {
				$cVideo = curl_init();

				curl_setopt_array($cVideo, array(

					CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $accountId . "/videos/?q=created_at:" . $_POST['from'] . ".." . $_POST['to'] . "&offset=" . $currentOffset . "&limit=100&sort=created_at",
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => "",
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 360,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => "GET",
					CURLOPT_HTTPHEADER => array(
						"Authorization: Bearer " . $accessToken . "",
						"Cache-Control: no-cache",
						"Content-Type: application/json"
					),
				));

				$rVideo = curl_exec($cVideo);
				//echo "<pre>".$rVideo."</pre>";
				$eVideo = curl_error($cVideo);

				curl_close($cVideo);

				if ($eVideo) {
					echo "cURL Error #:" . $eVideo;
				} else {



					$jVideo = json_decode($rVideo, true);

				//$video = json_decode($jVideo[$type_count2]['id']);

			#$video = $jVideo["video"];  


				#echo "video: " . $video. "<br>";



					#echo "<pre>"; print_r($jVideo); echo "</pre>";




					/*$videoID = $jVideo[$cDeliveryType]['delivery_type']; 

					$cDeliveryType = 0;
					foreach ($jVideo as $v) {
						$dd_type = $jVideo[$cDeliveryType]['delivery_type']; 

						if ($dd_type=="dynamic_origin") {
							unset($jVideo[$cDeliveryType]);
						}
						$cDeliveryType++;
					}
*/

		            //echo "-------------------------------------------------------------------------------<br/>";

					$type_count2 = 0;

					foreach($jVideo as $v) {
						if(array_key_exists('id', $v)) {
							$videoId = json_decode($jVideo[$type_count2]['id']);
							$deliveryType = $jVideo[$type_count2]['delivery_type'];   

							# 5985921440001 unknown
						    # 5985907142001 static_origin 
							# 5985238470001 dynamic_origin

							$createdAt = $jVideo[$type_count2]['created_at'];   

							echo $type_count2 . "video: " . $videoId . " delivery_type: " . $deliveryType . " created at: " . $createdAt . "<br/>";  
							# Get video assets  ***********************************************************************************

							$curl3 = curl_init();

							curl_setopt_array($curl3, array(
								CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $accountId . "/videos/" . $videoId . "/assets/",
								CURLOPT_RETURNTRANSFER => true,
								CURLOPT_ENCODING => "",
								CURLOPT_MAXREDIRS => 10,
								CURLOPT_TIMEOUT => 360,
								CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
								CURLOPT_CUSTOMREQUEST => "GET",
								CURLOPT_HTTPHEADER => array(
									"Authorization: Bearer " . $accessToken . "",
									"Cache-Control: no-cache",
									"Content-Type: application/json"
								),
							));

							$response3 = curl_exec($curl3);
							$err3 = curl_error($curl3);

							curl_close($curl3);

							if ($err3) {  
								echo "cURL Error #:" . $err3; 
							} 
							else {
								$json3 = json_decode($response3,true);
								# echo "<pre>"; print_r($json3); echo "</pre>";
								if (empty($json3)) {
									//echo "<div class='alert alert-danger' role='alert'>no renditions</div>";
									?>
									<script>
										var videoFailed = "<?php echo $video ?>";
										var videoFailedCreatedAt = "<?php echo $created_at ?>";                  
										no_rendition.innerHTML += videoFailed + " created_at "+ videoFailedCreatedAt +"<br/>";
									</script>
									<?php
								}
								$type_count3 = 0;
								foreach($json3 as $v) {
									if(array_key_exists('id', $v)) {
										$asset_id = json_decode($json3[$type_count3]['id']);

										if (isset($json3[$type_count3]['video_container'])) {
											$video_container = $json3[$type_count3]['video_container'];
											$text_video_container = "video_container: " . $video_container;
										} else {$text_video_container="";}

										if (isset($json3[$type_count3]['encoding_rate'])) {
											$encoding_rate = $json3[$type_count3]['encoding_rate'];
											$text_encoding_rate = "encoding_rate: " . $encoding_rate;
										} else {
											$text_encoding_rate="";
										}	

										$type= $json3[$type_count3]['type'];  
										$frame_height= $json3[$type_count3]['frame_height'];  
										$frame_width= $json3[$type_count3]['frame_width'];  

										if ($frame_width==$sizeZero  OR $frame_height==$sizeZero) {
											//echo "<div class='alert alert-danger' role='alert'>";
										}
										else { }
										//echo "asset_id: " . $asset_id . " | " . $text_video_container . " | "	. "type: " . $type . " | " . $text_encoding_rate . " | size(" . $frame_width .", " . $frame_height . ")<br/>";                         
											if ($frame_width==$sizeZero OR $frame_height==$sizeZero) {
												echo "</div>";
												?>
												<script>
													var videoFailed = "<?php echo $video ?>";              
													var assetFailed = "<?php echo $asset_id ?>";                  
													var videoContainer = "<?php echo $video_container ?>";
													var assetType = "<?php echo $type ?>";  
													if (assetType=="VIDEO_STILL" || assetType=="THUMBNAIL") {
														textVideoContainer = "";
													}
													else {
														textVideoContainer = " | video_container: " + videoContainer;
													}
													var widthFailed = "<?php echo $frame_width ?>";
													var heightFailed = "<?php echo $frame_height ?>";                                      
													wrong_asset.innerHTML += "video: " + videoFailed + " | asset_id: " + assetFailed + "  " + textVideoContainer + " | type: " + assetType + " | size: (" + widthFailed + ", " + heightFailed + ")<br/>";
												</script>
												<?php
											}
											else { 
											}
											$type_count3++;            
										}
									}
								}
							//echo "<hr>";
								$type_count2++; 
							}
						}










					}
					#$numVideos = $type_count2;
					#if ($numVideos == 0) {break;}
					$currentOffset+=100;
}


?>
</div>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
</body>
</html>
