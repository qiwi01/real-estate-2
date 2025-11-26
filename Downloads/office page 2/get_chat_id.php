<?php
$botToken = "8272404690:AAFjvKof7tWOT2ITQTWXWxJyr32dYW8QWi4";

// Get recent updates from the bot
$url = "https://api.telegram.org/bot$botToken/getUpdates";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$result = curl_exec($ch);
curl_close($ch);

echo "Send a message to your bot @sharplogs2_bot\n";
echo "Then refresh this page to get the chat ID:\n\n";

$data = json_decode($result, true);

if ($data['ok'] && !empty($data['result'])) {
    echo "<h2>Latest Chat IDs:</h2>";
    foreach (array_reverse($data['result']) as $update) {
        $chat_id = $update['message']['chat']['id'];
        $username = $update['message']['from']['username'] ?? $update['message']['from']['first_name'];
        echo "<p>Chat ID: <strong>$chat_id</strong> (from: $username)</p>";
    }
} else {
    echo "<p>No recent messages. Send a message to @sharplogs2_bot first!</p>";
}
?>
