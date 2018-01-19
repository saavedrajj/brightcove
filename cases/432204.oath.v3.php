<?php
$client_id = "07aa7b60-2e1c-4775-8bc5-e3f5220d2d8d";
$client_secret = "6a8-bE1KqdzoAbxupjTiDpEriPI4lZHUDS2mxDfU697lWuCRJNRJlJchL-ZbUCsPmC3lj-r8uram6vpPKldFmg";

$auth_string = base64_encode("{$client_id}:{$client_secret}");

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://oauth.brightcove.com/v3/access_token?grant_type=client_credentials",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "",
  CURLOPT_HTTPHEADER => array(
    "authorization: Basic ".$auth_string,
    "content-type: application/x-www-form-urlencoded"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}