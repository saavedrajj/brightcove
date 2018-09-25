<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>

<h1>Rendition checker</h1>
<?php
/*
echo  $_POST["from"];
echo  $_POST["to"];
*/
/*
GET https://cms.api.brightcove.com/v1/accounts/account_id/videos?q=created_at:2018-09-18T11:00:00Z..2018-09-18T12:00:00Z
*/

$account_id = "5458602755001"; 
$curl1 = curl_init();

curl_setopt_array($curl1, array(
  CURLOPT_URL => "https://oauth.brightcove.com/v4/access_token",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "grant_type=client_credentials",
  CURLOPT_HTTPHEADER => array(
    "Authorization: Basic OTMzMmJiODYtYTlhZC00Y2IxLThhNjAtOTU2MDNmYzk4YmMwOnJ3M2VBZlBOSFpEUW5oUEdIanRoTWtORVFWS2o3SWhMWmZLRDdnZ1YtLWdqa0JzRXVsSmJjbGJSTFJpSnlYTUdUYm41YWQxeFBBNldEejFnVEN5R1ln",
    "Cache-Control: no-cache",
    "Postman-Token: 233cdf74-5a01-4418-975a-fc61d3a131e5"
  ),
));

$response1 = curl_exec($curl1);
$err1 = curl_error($curl1);

curl_close($curl1);

if ($err1) {
  echo "cURL Error #:" . $err1;
} else {
$json1 = json_decode($response1);
$access_token=$json1->access_token;
echo "access_token:<br>" . $access_token;
}
?>




<h2>get video range</h2>
<?php

$curl2 = curl_init();

/*
echo "https://cms.api.brightcove.com/v1/accounts/" . $account_id . "/videos/?q=created_at:" . $_POST['from'] . ".." . $_POST['to'];
*/
curl_setopt_array($curl2, array(
  CURLOPT_URL => "https://cms.api.brightcove.com/v1/accounts/" . $account_id . "/videos/?q=created_at:" . $_POST['from'] . ".." . $_POST['to'],
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Authorization: Bearer " . $access_token,
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
  /*echo $response2;*/
$json2 = json_decode($response2);
/*$json = json_decode($data[0]['json']);*/
/*$hey = json_decode($response2[0]['id']);
echo  $hey;*/
echo var_dump($json2);
$hey = json_decode($json2[0]['id']);


}  

 ?>

</body>
</html>