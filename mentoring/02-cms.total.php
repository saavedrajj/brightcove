<?php

include "credentials.php";

# Get time range: http://php.net/manual/en/function.gmdate.php
$from = gmdate("Y-m-d\TH:i:s\Z", strtotime('-6000 minutes'));  
$to = gmdate("Y-m-d\TH:i:s\Z");

$accessToken = "AOpbuIxUEWEeXuGdsuY-7Q8pG-ycGJ6grYMsVMJIBhClfl5mIbFdD7OBDv7uwFBWx4II31pOo1vtLCINT0Qoq7cqy9kB2bHICwdkOXzaksnsOPkfi874_pnUA9EG5TWM-qlXID_7u3eEEd4RmtOE3a2PSrbWC45oNDOkVxaGE3jMjqAYP310Dp6G2dhKgWc7dbRMRqmeboVZDiQuXE7m8YYeQW0eDZ5fUkoJBaJ2voRSViJ593pluzQ5FLHmxux1FNfSr48Z5655iExLZ3n-D9xjOEf4l7f_X67QoBtcV9wWupbAazA89pDtZahwmLJW6UAy6AZJJKT5JCHLzVRwN2HBIFePnuSyaaElKhoVhzsP7dfM48E4CuQGHpt7Tt9_VnZO1yhpSWV4nQlbEV2Kf9kK-XJFnkfgSqRLqRZ5uiLthPC9SJfg8D2ztyn1Rdql_Yvlsdhr7sKidYFiRzbWQqsp10biL4gyhZTIfxw7-XYDnmhoZcUEYO8";

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