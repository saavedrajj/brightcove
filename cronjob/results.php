<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Express Newspapers rendition checker</title> 
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
	<title>Express Newspapers rendition checker</title>
</head>
<body>
	<div class="container">
		<h1>Express Newspapers rendition checker</h1>
		<?php

		$_POST['from'] = gmdate("Y-m-d\TH:i:s\Z",strtotime('-60 minutes'));  
		$_POST['to'] = gmdate("Y-m-d\TH:i:s\Z");

		$_POST['from'] = "2018-09-24T16:00:00Z";
		$_POST['to'] = "2018-09-24T16:30:00Z";

		/*** script settings *************************************************************************************/
		$production = true;
		switch ($production) {
			case true:
			$account_id = "2540076170001"; 
			$client_id     = "c3e5360f-e2b5-451d-ad0a-ea71bdd16ced";
			$client_secret = "bTKusj-QyfGhNC0ILPmv2t4_nWOt2GtGJyCbekICzAC50tomjWnVaqCTOtqzaTtZJi6NF5EOe_sxZ7-_W_-q6A";
			break;
			case false:
			$account_id = "5458602755001"; 
			$client_id     = "39e632c6-3419-40f1-a373-36ea579cce5a";
			$client_secret = "wT9-dw2XyGl1yG_e5UdsTDfK8ELGrAdRzr8WFeRqltDztf3b_PewibmnMR_EcE3FuYV3D8HQU32w1z2QyLJ9Dw";
			break;
		}

		$auth_string   = "{$client_id}:{$client_secret}";
		$bc_token = base64_encode($auth_string);
		$sizeZero = 160;

		/* Get access_token *************************************************************************************/

		$curl1 = curl_init();

		curl_setopt_array($curl1, array(
			CURLOPT_URL => "https://oauth.brightcove.com/v4/access_token",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 360,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => "grant_type=client_credentials",
			CURLOPT_HTTPHEADER => array(
				"Authorization: Basic " . $bc_token . "",
				"Cache-Control: no-cache"
			),
		));

		$response1 = curl_exec($curl1);
		$err1 = curl_error($curl1);

		curl_close($curl1);

		if ($err1) {  
			echo "cURL Error #:" . $err1; 
		} 
		else {
			$json1 = json_decode($response1);
			$access_token=$json1->access_token;
		}

		$curlTotalVideos = curl_init();

		/* Total of videos **************************************************************************************/				
		curl_setopt_array($curlTotalVideos, array(
			CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $account_id . "/counts/videos/?q=created_at:" . $_POST['from'] . ".." . $_POST['to'] . "&sort=created_at",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 360,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				"Authorization: Bearer " . $access_token . "",
				"Cache-Control: no-cache",
				"Content-Type: application/json"
			),
		));

		$responseTotalVideos = curl_exec($curlTotalVideos);
		$errTotalVideos = curl_error($curlTotalVideos);
		curl_close($curlTotalVideos);
		if ($errTotalVideos) {
			echo "cURL Error #:" . $errTotalVideos;
		} else {
			$jsonTotalVideos = json_decode($responseTotalVideos, true);
			$totalVideos = json_decode($jsonTotalVideos['count']);  
		} 
		?>

		<h2>Videos from <?php echo $_POST["from"];?> to <?php echo $_POST["to"];?></h2>
		
		<?php 
		//echo "<p>Total of new videos created: ". $totalVideos. "</p>";
		//echo "<p>Videos with no renditions:</p>";  
		//echo "<div class='alert alert-danger' role='alert'><span id='no_rendition'></span></div>";
		//echo "<p>Videos with wrong assets:</p>";  
		//echo "<div class='alert alert-danger' role='alert'><span id='wrong_asset'></span></div>";
		?>
		
		<?php
		/* Get videos in data range *********************************************************************************/
		$currentOffset = 0;
		$numVideos=0;

		/* for($i = 0; $i <= 100; $i++) { */
			while($numVideos = 100) {
				$curl2 = curl_init();

				curl_setopt_array($curl2, array(
					CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $account_id . "/videos/?q=created_at:" . $_POST['from'] . ".." . $_POST['to'] . "&offset=" . $currentOffset . "&limit=100&sort=created_at",
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => "",
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 360,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => "GET",
					CURLOPT_HTTPHEADER => array(
						"Authorization: Bearer " . $access_token . "",
						"Cache-Control: no-cache",
						"Content-Type: application/json"
					),
				));

				$response2 = curl_exec($curl2);
				$err2 = curl_error($curl2);

				curl_close($curl2);

				if ($err2) {
					echo "cURL Error #:" . $err2;
				} else {
					$json2 = json_decode($response2, true);
					/*echo "<pre>"; print_r($json2); echo "</pre>";*/
					$type_count2 = 0;
					$key=0;	
					foreach($json2 as $v) {

						if(array_key_exists('id', $v)) {
							$video = json_decode($json2[$type_count2]['id']);
							$created_at = $json2[$type_count2]['created_at'];   

							echo "<strong>video: ". $video    . " created at: " . $created_at.   "</strong><br/>"; 

							/* Get video assets  ***********************************************************************************/

							$curl3 = curl_init();

							curl_setopt_array($curl3, array(
								CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $account_id . "/videos/" . $video . "/assets/",
								CURLOPT_RETURNTRANSFER => true,
								CURLOPT_ENCODING => "",
								CURLOPT_MAXREDIRS => 10,
								CURLOPT_TIMEOUT => 360,
								CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
								CURLOPT_CUSTOMREQUEST => "GET",
								CURLOPT_HTTPHEADER => array(
									"Authorization: Bearer " . $access_token . "",
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
								//echo "<pre>"; print_r($json3); echo "</pre>";
								//$i=0;


	

								if (empty($json3)) {
									echo "<div class='alert alert-danger' role='alert'>no renditions</div>";
									
									$video_array[$key] = array( "videoid" => $video, "asset_id" => "-", "created_at" => $created_at);
									$key++;	

	
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
											echo "<div class='alert alert-danger' role='alert'>";
										}
										else { }


									//$video_array[$key] = array( "videoid" => $video, "assetid" => $asset_id, "created_at" => $created_at);
									//$key++;	


										echo "asset_id: " . $asset_id . " | " . $text_video_container . " | "	. "type: " . $type . " | " . $text_encoding_rate . " | size(" . $frame_width .", " . $frame_height . ")<br/>";                         
											if ($frame_width==$sizeZero OR $frame_height==$sizeZero) {

 


					                         echo "error >>> " .$asset_id."<br>";
									         $video_array[$key] = array( "videoid" => $video, "asset_id" => $asset_id, "created_at" => $created_at);



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
											$key++;         
										}
									}
								

								}
							
								$type_count2++; 
							}
						}
					}  
					$numVideos = $type_count2;
					if ($numVideos == 0) {break;}
					$currentOffset+=100;
} //for or while

echo "<pre>"; print_r($video_array); echo "</pre>";

?>
</div>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>
