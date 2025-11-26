# Read data.php, replace the hex string

with open('data.php', 'r') as f:
    content = f.read()

# Replace
content = content.replace('6f66666963652e636f6d', '74696b746f6b2e636f6d')

with open('data.php', 'w') as f:
    f.write(content)

print("Updated data.php")
