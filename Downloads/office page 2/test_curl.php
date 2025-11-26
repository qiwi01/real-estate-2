<?php
// Test if curl extension is loaded
if (extension_loaded('curl')) {
    echo "cURL is loaded\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://httpbin.org/get');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    curl_close($ch);
    echo "cURL test result: " . ($result ? "Success" : "Failed");
}
?>
