#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cgi
import os
import re
import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate
from string import Template

# --- メール送信・認証設定 ---
SMTP_SERVER = "procube-kobe.sakura.ne.jp"
SMTP_PORT = 587
# アカウント情報
SMTP_USER = "kyabs-alert@procube-kobe.sakura.ne.jp"
SMTP_PASS = ""
# メールの宛先設定
TO_EMAIL = "mitsuru@mte.biglobe.ne.jp"
FROM_EMAIL = "kyabs-alert@procube-kobe.sakura.ne.jp" # 送信元
SUBJECT = "プロキューブホームページから問い合わせがありました"

# --- 設定 ---
CONFIRM_FILE = "confirm.html.template"  # テンプレートファイル名

def get_smtp_password():
    pass_file = "/home/procube-kobe/.smtppass"
    if os.path.exists(pass_file):
        with open(pass_file, "r", encoding="utf-8") as f:
            return f.read().strip()
    return ""

def get_html_with_includes():
    """
    ファイルを読み込み、SSI (include virtual) の記述があれば
    その中身を読み込んで置換する関数
    """
    if not os.path.exists(CONFIRM_FILE):
        return "File not found."

    with open(CONFIRM_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # SSIの を探す正規表現
    # さくらのルートディレクトリからのパスを考慮してファイルを読み込む
    def replacer(match):
        include_path = match.group(1).lstrip('/') # 先頭の / を取る
        # サーバ上の実際のパス（通常は public_html からの相対パス）に調整
        # CGIの場所が /contact/ なら ../ などの調整が必要な場合があります
        full_path = os.path.join(os.environ.get('DOCUMENT_ROOT', './'), include_path)
        
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as inc_f:
                return inc_f.read()
        else:
            return f""

    # 正規表現で置換実行
    pattern = r'include\s+(?:virtual|file)=["\']([^"\']+)["\']'
    content = re.sub(pattern, replacer, content)
    return content

def get_html_template():
    # confirm.html を読み込む関数
    if os.path.exists(CONFIRM_FILE):
        with open(CONFIRM_FILE, "r", encoding="utf-8") as f:
            return f.read()
    return "Template file not found."

# --- メイン処理 ---
form = cgi.FieldStorage()
mode = form.getfirst("mode", "confirm")

# フォームデータの取得
data = {
    "kind": form.getfirst("kind", ""),
    "company": form.getfirst("company", ""),
    "name": form.getfirst("name", ""),
    "tel": form.getfirst("tel", ""),
    "email": form.getfirst("email", ""),
    "comment": form.getfirst("comment", ""),
}
# 改行を <br> に変換したものを追加
data["comment_br"] = data["comment"].replace("\n", "<br>")

if mode == "send":
    body = "お問い合わせフォームより送信がありました。\n\n"
    for key, val in data.items():
        if key != "comment_br":
            body += f"【{key}】: {val}\n"

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = SUBJECT
    msg["From"] = FROM_EMAIL
    msg["To"] = TO_EMAIL
    msg["Date"] = formatdate(localtime=True)

    try:
        SMTP_PASS = get_smtp_password()
        # SMTP認証を使用して送信
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as s:
            s.ehlo()
            s.starttls() # TLS暗号化（推奨）
            s.ehlo()
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)

        print("Location: thanks.html\n")
        exit()
    except Exception as e:
        print("Content-Type: text/html; charset=utf-8\n")
        print(f"<h1>送信エラー</h1><p>詳細: {e}</p>")
else:
    print("Content-Type: text/html; charset=utf-8\n")

    # 確認画面（ファイルを読み込んで表示）
    template = get_html_with_includes()
    try:
        # html内の {kind} などを実際のデータで置換して表示
        print(template.format(**data))
    except KeyError as e:
        print(f"Template Error: Missing placeholder {e}")