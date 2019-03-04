<?php

include "credentials.php";

# Get time range: http://php.net/manual/en/function.gmdate.php
$from = gmdate("Y-m-d\TH:i:s\Z", strtotime('-6000 minutes'));  
$to = gmdate("Y-m-d\TH:i:s\Z");

$accessToken = "AHmWnMxk0ZUkMSzNp4hZQc-YYlwu5UBsmLIw4aWDgQNQFEGhzMycA3UOrfybWEdcON9XXD6lBXGnceJmMqmaewozlj9m2QLaS7ae4IycBJBq64OpuVtupADPeb5-FzxrNaEeN0JEnm3UGN304A18fFMXMzNasmCWLNBmygMwufW74g4mN3-HwnnT8zHMVRiBQEUmf3S0WrQsWi6nlCCNqTAlmO7cOZ0srVXlEu6NVjNFqoTOi-3iS91hWCddeL1VZW_ynKBUq1qW2oDIcnr-eLxEKZa9dKs_5nXSwhKCybVU4Cw5tsoS1UMB1u9LBbKzM8Yjk4j1PlUEnpM0UAxNUjrQlK7QEoRzZSzKOEC0myXkK4MYR9dABZNJHys4e8HP7heUi_jxKU01dqf3ZahWTGsCAfxhKsDPPV4iyn9soGnvNPgbykSehwORZ0lzFRiIDdshsQGjp3qpylZ5BCSek1oaVjp9Gwc0OERdINAC7ynvfGQve5xrJeY";

$curl = curl_init();

curl_setopt_array($curl, array(
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

$response = curl_exec($curl);
$error = curl_error($curl);

curl_close($curl);
if ($error) {
  echo "cURL Error #:" . $error;
} else {
  echo $response;
  $jcurl = json_decode($response, true);
      #$totalVideos = $jcurl["count"];  
      #echo "<p>Total videos: " . $totalVideos . "</p>";   
}