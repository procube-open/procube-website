# procube-website

プロキューブの Website のコンテンツを管理するリポジトリである。

- main ブランチにコミットすると Github Actions のワークフローによってさくらのレンタルサーバに反映される。
- preview.sh で Apache httpd が起動して、 www 配下を HTTP でサービスする→codespaces でポート転送してプレビューできる

## レンタルサーバの仕様

Webサーバー: Apache/2.4.65
sshサーバ: Github の Actions の環境変数 SSH_SERVER_FQDN に保持
sshサーバアカウント: Github の Actions の環境変数 SSH_SERVER_ACCOUNT に保持
ssh秘密鍵: Github の Actions の環境変数 SSH_PRIVATE_KEY_B64 にパスフレーズなしの PEM形式のデータを base64 エンコードした値を保持

