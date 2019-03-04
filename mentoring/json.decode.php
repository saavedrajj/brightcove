<h1>json_decode()</h1>
<?php
$json = '{"a":1,"b":2,"c":3,"d":4,"e":5}';


$var = json_decode($json, true);

echo "<pre>" . print_r($var) . "</pre>"; ?>

?>
