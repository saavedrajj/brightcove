<?php 
    # Get time range: http://php.net/manual/en/function.gmdate.php
$from = gmdate("Y-m-d\TH:i:s\Z", strtotime('-6000 minutes'));  
$to = gmdate("Y-m-d\TH:i:s\Z");
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Automated Script</title> 

</head>

<body>
	<div class="container">
		<h1>Video id's created</h1>
		<h2>From <?php echo $from; ?> to <?php echo $to; ?></h2>		
		<?php
		#echo "from:" . $from . "<br>";
		#echo "to: ". $to . "<br>";

		include "credentials.php";

		$emailMessage = array();

		# OAuth API: Get access_token  ********************************************************************************
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
				"Authorization: Basic " . $bcToken . "",
				"Cache-Control: no-cache"
			),
		));
		$response1 = curl_exec($curl1);
		$error1 = curl_error($curl1);
		curl_close($curl1);

		if ($error1) {  
			echo "cURL Error #:" . $erro1; 
		} 
		else {
			$jcurl1 = json_decode($response1);
			# http://php.net/manual/en/function.json-decode.php
			$accessToken = $jcurl1->access_token;
			//echo "access token: " . $accessToken;
		}

		# CMS API: Total of videos ************************************************************************************	

		$curl2 = curl_init();

		curl_setopt_array($curl2, array(
			CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $accountId . "/counts/videos/?q=created_at:" . $from . ".." . $to,
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 360,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => array(
				"Authorization: Bearer " . $accessToken . "",
				"Content-Type: application/json"
			),
		));

		$response2 = curl_exec($curl2);
		$error2 = curl_error($curl2);

		curl_close($curl2);
		if ($error2) {
			echo "cURL Error #:" . $error2;
		} else {
			$jcurl2 = json_decode($response2, true);
			$totalVideos = $jcurl2["count"];  
			echo "<p>Total videos: " . $totalVideos . "</p>";		
		}

		# Get Offset Iterations *******************************************************************************************
		$offsetIterations = $totalVideos / 100;

		if(is_int($offsetIterations)){
			# http://php.net/manual/en/function.is-int.php
		}
		else {
			# http://php.net/manual/en/function.intval.php
			$offsetIterations = intval($offsetIterations) + 1;
		}

		$currentOffset = 0;

		for($i = 0; $i <= $offsetIterations - 1; $i++) { 
			$curl3 = curl_init();

			curl_setopt_array($curl3, array(
				CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $accountId . "/videos/?q=created_at:" . $from . ".." . $to . "&offset=" . $currentOffset . "&limit=100&sort=created_at",
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_ENCODING => "",
				CURLOPT_MAXREDIRS => 10,
				CURLOPT_TIMEOUT => 360,
				CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
				CURLOPT_CUSTOMREQUEST => "GET",
				CURLOPT_HTTPHEADER => array(
					"Authorization: Bearer " . $accessToken . "",
					"Content-Type: application/json"
				),
			));

			$response3 = curl_exec($curl3);
			$error3 = curl_error($curl3);
			curl_close($curl3);

			if ($error3) {
				echo "cURL Error #:" . $error3;
			} else {
				$jVideo = json_decode($response3, true);
				$videoCount = 0;

				foreach($jVideo as $v) {
					$videoId = $jVideo[$videoCount]['id'];							  
					$createdAt = $jVideo[$videoCount]['created_at'];
					$emailMessage[] = array($videoId, $createdAt); 
					echo $videoCount . ": videoId: ". $videoId . " created_at: ". $createdAt ."<br>";
					$videoCount++; 
				}
			}
			$currentOffset+=100;
		}
		# Email script
		print("<pre>".print_r($emailMessage, true)."</pre>");	
		mail("jsaavedra@brightcove.com","Videos created report", $emailMessage);
		?>
	</div>
</body>
</html>