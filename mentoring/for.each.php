<h1>for each</h1>
<?php
// http://php.net/manual/en/control-structures.foreach.php
$arr = array(1, 2, 3, 4);

foreach ($arr as &$value) {
    echo $value . "<br>";
}
?>