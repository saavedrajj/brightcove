<?php

include "credentials.php";

# Get time range: http://php.net/manual/en/function.gmdate.php
$from = gmdate("Y-m-d\TH:i:s\Z", strtotime('-6000 minutes'));  
$to = gmdate("Y-m-d\TH:i:s\Z");

$currentOffset = 0;

$accessToken = "AOpbuIwFFdKnnDZCS01l_5cQRZWhwvSpogyYxIbs9U4Pio2Hedmqc3xuCeZ1V5lLxJYTxCeMMAFGh2MX9R4pZMlfTYwKx86kgeJLiMaRaHJ36Gye-6KRteF8bV1bI_HBhJQNvkiFHCN-Z9hv0iv1EGKqvXkLnvx_5qQA1dnohr1w4rzAstc2S0J7PhlcSqz6r5EwyTEpbU2vBoeaVYr6RMl5iJ8UtDC6hYL5G2tQ9aD1nPB_uOjcNrdTvYkcCIyj7ztKCIKSoRLoFJDTenpQaSeKe6ftd1BY0Bm789f9uc2CQrMClVLyCMQOvMNzJEfFaK9U90N8giMlvFOgRlBGKW3D7_G-P26dGO7bbWcCGW_IHqeF8S2XrD7Ljh0zVYBCKyIqsGBEhnOMmtL7lxdvUkCxu1gXnq5kPr845hZpHXdtWqKgYXe_mWN7ToaSd18g-ahhZx82JSwfJmbuSsxfTGMBFd4M7lg6hrgksxUuCO4Y1BPJF-_iLww";

$curl = curl_init();

curl_setopt_array($curl, array(
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