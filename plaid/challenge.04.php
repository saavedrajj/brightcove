<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="icon" href="https://dashboard.plaid.com/favicon.ico" type="image/x-icon"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="author" content="Juan Saavedra">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

	<title></title>
</head>
<body>
	<div class="container">
		<h1>Challenge 4</h1>
		<p>Write a script that uses Plaid’s <var>/institution/get</var> endpoint to output the total number of institutions that:</p>
		<ul>
			<li>support Plaid's identity product: <span id="total_identity"></span></li>
			<li>has the word "first" in the name: <span id="total_name"></span></li>
		</ul>
		<?php

		$currentOffset = 0;

		$curl = curl_init();
		curl_setopt_array($curl, array(
			CURLOPT_URL => "https://sandbox.plaid.com/institutions/get",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "POST",
			CURLOPT_POSTFIELDS => "{
				\"client_id\": \"5cd9c98f5470830011c6a5e1\",
				\"secret\": \"db72240dbcad0f121c96ead140cbc8\",
				\"count\": 500,
				\"offset\": 0,
				\"options\": {\"products\":[\"identity\"]}
			}",			
			CURLOPT_HTTPHEADER => array(
				"Content-Type: application/json"
			),
		));


    	$response = curl_exec($curl);
		$err = curl_error($curl);

		curl_close($curl);

		if ($err) {
			echo "cURL Error #:" . $err;
		} else {

			$json = json_decode($response, true);
			$total_identity = $json["total"];  

			$offsetIterations = $total_identity / 500;

			/* Calculate number of offset itarations */
			if(is_int($offsetIterations)){} else { $offsetIterations = intval($offsetIterations) + 1; }



		}
		?>

		<script>
			total_identity.innerHTML += "<code><?php echo $total_identity?></code>";
		</script>

		<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
	</div>
</body>
</html>