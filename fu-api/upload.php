<?php
    // AWS SDK (for push ingests)
    require '../vendor/autoload.php';

 use Aws\S3\S3Client;

$bucket = 'ingestion-upload-production';
$keyname = '5458602755001/5479803057001/95956251-1343-4115-b2e5-19d12484ad0a/MyVideo.mp4';
// $filepath should be absolute path to a file on disk                      
$filepath = '/Applications/XAMPP/xamppfiles/htdocs/brightcove/fu-api/myVideo.mp4';
                        
// Instantiate the client.
$s3 = S3Client::factory();

// Upload a file.
$result = $s3->putObject(array(
    'Bucket'       => $bucket,
    'Key'          => $keyname,
    'SourceFile'   => $filepath,
    'ContentType'  => 'text/plain',
    'ACL'          => 'public-read',
    'StorageClass' => 'REDUCED_REDUNDANCY',
    'Metadata'     => array(    
        'param1' => 'value 1',
        'param2' => 'value 2'
    )
));

echo $result['ObjectURL'];
?>

