<?php
    // AWS SDK (for push ingests)
    require '../vendor/autoload.php';

    use Aws\S3\S3Client;
    use Aws\S3\MultipartUploader;
    use Aws\Exception\MultipartUploadException;

    /**
     * get S3 information as described above in this doc
     * the code below assumes it has been decoded as $s3response
     * and that $filePath is the local path to the asset file
     */

    s3 = new S3Client([
        'version' => 'latest',
        'region'  => 'us-east-1',
        'credentials' => array(
            'key'    => $s3response->access_key_id,
            'secret' => $s3response->secret_access_key,
            'token'  => $s3response->session_token
        )
    ]);

    $params = array(
        'bucket' => $s3response->s3->bucket,
        'key' => $s3response->s3->object_key
    );
    $uploader = new MultipartUploader($this->s3, $filePath, $params);
    try {
        $uploadResponse = $uploader->upload();
    } catch (MultipartUploadException $e) {
        echo $e->getMessage() . "\n";
    }
?>