<!DOCTYPE html>
<html lang="en">
<head> 
	<meta charset="UTF-8">
	<title>Index /</title>		
</head>
<body>
	<?php
	$name="Plaid CD";
	$available = null;
	$current = 1000;
	$subtype="cd";
	$mask="2222";
	?>

	<table>
		<tr>
			<td> <?php echo $name ?></td>
			<!--
			<td>(account.balances.available != null ? account.balances.available : account.balances.current) + '</td>
-->
			<td>(<?php $available != null ? $available : $current; ?>)</td>


			<td> <?php echo $mask ?></td>
			<td> <?php echo $subtype ?></td>
		</tr>
	</table>

	</body>
	</html>



