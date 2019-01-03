<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Express Newspapers rendition checker</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <title></title>
</head>
<body>

  <?php
    $to = gmdate("Y-m-d\TH:i:s\Z");
    $from = gmdate("Y-m-d\TH:i:s\Z",strtotime('-150 minutes'));  
  ?>

  <div class="container">
    <h1>Express Newspapers rendition checker</h1>
    <form action="results.php" method="post" target="_blank">
      <div class="form-group">
        <label for="fromLabel">From</label>
        <input type="text" class="form-control" id="from" name="from" placeholder="Initial date" value="<?php echo $from;?>">
        <small id="fromHelp" class="form-text text-muted">Date format: 2018-09-24T16:00:00Z</small>
      </div>
      <div class="form-group">
        <label for="toLabel">To</label>
        <input type="text" class="form-control" id="to" name="to"placeholder="Final date"value="<?php echo $to;?>">
        <small id="toHelp" class="form-text text-muted">Date format: 2018-09-24T16:30:00Z</small>    
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
</body>
</html>