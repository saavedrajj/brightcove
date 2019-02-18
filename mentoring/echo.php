<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<h1>Title</h1>

	<!-- http://php.net/manual/en/function.echo.php -->
	<?php echo "<h2>Echo Subtitle</h2>"; ?>

	<?php echo "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, temporibus qui! Explicabo veniam molestias saepe ipsa autem odio assumenda a dolor doloribus similique neque, ex ut nobis sit incidunt odit!</p>"; ?>

	<h3>PHP + HTML example 1</h3>

	<?php
	for ($i = 1; $i <= 10; $i++) {
		echo "i: " . $i . "<br/>";
	}
	?>

	<h3>PHP + HTML example 2</h3>

	<?php
	for ($i = 1; $i <= 10; $i++) {
		?>
		i: <?php echo $i ?><br/>
		<?php
	}
	?>

	<h3>PHP + Javascript</h3>
	<p id="message"></p>
	<script>
		<?php
		for ($i = 1; $i <= 10; $i++) {
			?>
			message.innerHTML += "i: " + <?php echo $i ?> + "<br/>";	
			<?php
		}
		?>
	</script>
</body>
</html>