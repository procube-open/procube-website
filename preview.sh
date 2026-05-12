#!/bin/bash
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
WWW_DIR="$SCRIPT_DIR/www"

# ポート 8080 でリッスンするよう設定
sudo tee /etc/apache2/ports.conf > /dev/null << 'PORTS'
Listen 8080
PORTS

# DocumentRoot を www/ に向けたバーチャルホストを設定
sudo tee /etc/apache2/sites-available/preview.conf > /dev/null << EOF
<VirtualHost *:8080>
    DocumentRoot ${WWW_DIR}
    <Directory ${WWW_DIR}>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
EOF

sudo a2dissite 000-default 2>/dev/null || true
sudo a2ensite preview
sudo apachectl restart

echo "Preview server started at http://localhost:8080"
