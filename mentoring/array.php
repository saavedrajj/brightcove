<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<!-- http://php.net/manual/en/function.array.php -->
	<h1>array</h1>

	<h1>1 dimension array</h1>
	<?php
	$arr1 = array(1, 2, 3, 4);
	echo "<pre>" . print_r($arr1) . "</pre>"; ?>
	?>

	<h1>2 dimension array</h1>
	<?php
	$arr2 = array();

	$arr2[] = array(0, 1, 2);
	$arr2[] = array(3, 4, 5);

	echo "<pre>" . print_r($arr2) . "</pre>"; ?>

	?>
</body>
</html>