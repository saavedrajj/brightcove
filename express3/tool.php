<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Express Newspapers rendition checker</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <title></title>
</head>
<body>
  <div class="container">
    <h1>Express Newspapers rendition checker</h1>
    <form action="results.php" method="post" target="_blank">
      <div class="form-group">
        <label for="fromLabel">From</label>
        <input type="text" class="form-control" id="from" name="from" placeholder="Intial date">
        <small id="fromHelp" class="form-text text-muted">Date format: 2018-09-24T16:00:00Z</small>
      </div>
      <div class="form-group">
        <label for="toLabel">To</label>
        <input type="text" class="form-control" id="to" name="to"placeholder="Final date">
        <small id="toHelp" class="form-text text-muted">Date format: 2018-09-24T16:30:00Z</small>    
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>
<!--
case 477950
BC-42287 - Uploading Module - video IDs not being created intermitently RESOLVED 
BC-42286 - upload-module: multiple-videos created but no ingest requests made RESOLVED 
-->