# 📝 Word Chain App (しりとりアプリ)

Word Chain App へようこそ！このアプリは、Google の Gemini を搭載した AI と対戦できるシンプルな「しりとり」ゲームです。難易度選択、レスポンシブデザイン、リアルタイムのフィードバックなどを備えています。

-----

## 🏗️ アプリの構成

このアプリは、ユーザーがWebブラウザで操作する画面と、その裏でゲームのロジックやAIとの通信を処理するサーバーサイド（Flask）で構成されています。

### 画面遷移図 (ツリー表記)

アプリの主要な画面とその遷移は以下の通りです。

```
├── タイトル画面 (index.html)  --- アプリケーションの入り口
│   ├── "Play"
│   │   └── プレイ画面 (play.html) --- AIとのしりとり対戦
│   │       ├── 単語入力
│   │       ├── AIの単語生成
│   │       └── ゲーム終了
│   │           └── 結果画面 (result.html) --- 勝敗結果の表示
│   │
│   ├── "Rule"
│   │   └── ルール説明画面 (rule.html) --- しりとりルールの表示
│   │
│   └── "Level"
│       └── レベル選択画面 (level.html) --- AIの難易度選択
│           ├── Easy (対小学生)
│           ├── Medium (対中学生)
│           └── Hard (対高校生)
│
└── (共通) ハンバーガーメニュー --- 各画面からアクセス可能なナビゲーション
    ├── "Rule" (ルール説明画面へ)
    ├── "Level" (レベル選択画面へ)
    ├── "Back" (タイトル画面へ)
    └── "New Game" (プレイ画面・ゲームリセット)
```

-----

## ✨ アプリの主な機能

  * **しりとりの基本ルール:** 日本語のしりとりの伝統的なルールでプレイできます。
  * **AI 対戦相手 (Gemini 搭載):** あなたの入力に応じて単語を生成する AI と対戦できます。
  * **難易度レベル選択:** Easy、Medium、Hard の難易度を選べます。AI の単語の選び方や、「ん」で終わる単語の頻度等が変化します。[^1]
      * **Easy (日本語能力試験N5レベル):** AI は日本語能力試験 N5レベルの、簡単で日常的な単語を使います。基本的に、20% の確率で「ん」で終わる単語・30% の確率で、現在のゲームですでに使われた単語が生成されます。
      * **Medium (日本語能力試験N3レベル):** AI は日本語能力試験 N3レベルの、一般的な単語や基礎的な社会・科学用語を使います。基本的に、10% の確率で「ん」で終わる単語・10% の確率で、現在のゲームですでに使われた単語が生成されます。
      * **Hard (日本語能力試験N1レベル):** AI は日本語能力試験 N1レベルの、ある程度複雑な単語等を使います。基本的に、5% の確率で「ん」で終わる単語・5% の確率で、現在のゲームですでに使われた単語が生成されます。
  * **レスポンシブデザイン:** CSS におけるサイズ指定に `vw` や `vh` を使用することで、デスクトップのサイズ変更に対応しています。スマホ画面には非対応です。
  * **ハンバーガーメニュー:** ナビゲーションリンクに簡単にアクセスできます。リセット機能は"New Game"にて実装。
  
  [^1]: 応答される単語は「ひらがな」です。

-----

## 🎮 プレイ方法

1.  **ゲーム開始:** タイトル画面から「Play」を選択するか、直接 `/play` ページにアクセスしてください。ゲームは「しりとり」から始まります。
2.  **単語の入力:** 入力欄には日本語の単語を、ひらがなのみで入力してください。単語の送信は、**Enter（改行）**によって行われます。
3.  **文字合わせ:** 入力した単語の最初の文字は、前の単語の最後の文字と同じでなければなりません。語尾に「ー」がある場合は、その直前の文字を使います。[^2]
4.  **AI のターン:** あなたが有効な単語を入力すると、AI (Gemini) のターンになります。
5.  **ゲーム終了条件:** 以下の場合、ゲームは終了します。
      * あなた、または AI が「ん」で終わる単語を入力した。
      * あなた、または AI が、現在のゲームですでに使われた単語を入力した。
      * AI が有効な単語を生成できなかった。
6.  **リセット:** メニュー画面の"New Game"をクリックすると、いつでも新しいゲームを開始できます。

[^2]: あなたが入れた単語の最初の文字が、前の単語の最後の文字（語尾が「ー」の場合は直前の文字）と合っていない場合は、エラーが表示され、再入力を促します。
-----

## ⚙️ セットアップとデプロイ

このアプリは、バックエンドに Flask、フロントエンドに HTML/CSS/JavaScript、AI 機能に Google の Gemini API を使用しています。「さくらのクラウド」のような Linux ベースのクラウドサーバーへのシンプルなデプロイを想定しています。

### 必要環境

  * **Python 3.8 以上:**
  * **`pip`:** Python のパッケージ管理ツール。
  * **`venv` モジュール:** 仮想環境作成用 (`python3 -m venv`)。
  * **Git:** バージョン管理用。
  * **Google Gemini API キー:** [Google AI Studio](https://aistudio.google.com/) から取得してください。
  * **Linux / Ubuntu環境:** サーバーへのデプロイ時に必要です。

### ローカル開発環境のセットアップ

1.  **リポジトリのクローン・Gitの初期設定:**

    ```bash
    git clone https://github.com/Bumbook125195/WordChain_app.git
    cd WordChain_app

    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

    `Your Name` と `your.email@example.com` は、任意の値を取ります。

2.  **仮想環境の作成と有効化:**

    ```bash
    python3 -m venv venv
    # Windows の場合: 
    .\venv\Scripts\activate
    # macOS/Linux/WSL の場合: 
    source venv/bin/activate
    ```

3.  **依存関係のインストール:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **`.env` ファイルの作成:**
    プロジェクトのルートディレクトリ ( `app.py` と同じ階層) に `.env` というファイルを作成し、API キーなどを設定します。

    ```
    # .env
    FLASK_SECRET_KEY=your_long_and_random_flask_secret_key_here
    GOOGLE_API_KEY=AIzaSyYOUR_GEMINI_API_KEY_HERE
    ```

      * **`FLASK_SECRET_KEY`:** 強固でランダムな文字列を生成して設定してください (例: `python3 -c "import os; print(os.urandom(24).hex())"`)。これは Flask のセッションセキュリティに不可欠です。
      * **`GOOGLE_API_KEY`:** [Google AI Studio](https://aistudio.google.com/) から取得した API キーを正確に貼り付けてください。

5.  **Flask アプリケーションの実行:**

    ```bash
    python3 app.py
    ```

    アプリは通常 `http://127.0.0.1:5000` で起動します。

-----

### クラウドサーバーへのデプロイと運用 (Nginx + Gunicorn)

ここでは、基本的な Linux サーバー (Ubuntu を想定) と SSH アクセスを前提としています。

1.  **サーバーへの SSH ログイン:**

    ```bash
    ssh your_user@your_server_ip
    ```

2.  **サーバー環境の準備:**

      * Python 3、`venv`、`pip`、Git、**Nginx**、**Gunicorn** が未インストールの場合はインストールします:
        ```bash
        sudo apt update
        sudo apt install python3 python3-venv python3-pip git nginx
        # Gunicorn は、のちに pip でインストール
        ```

3.  **サーバー上でリポジトリをクローン・Gitの初期設定:**

    ```bash
    cd ~
    mkdir WordChain_app && cd WordChain_app
    git clone https://github.com/Bumbook125195/WordChain_app.git .

    git config --global user.name "Your Name"
    git config --global user.email "your.email@example.com"
    ```

    `Your Name` と `your.email@example.com` は、任意の値を取ります。

4.  **サーバー上で仮想環境をセットアップし、依存関係をインストール:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

5.  **サーバー上で `.env` ファイルを作成:**
    `.env` ファイルは Git で管理されないため、**サーバー上で手動で作成**する必要があります。

    ```bash
    vim .env
    ```

    ローカルの `.env` と同じ内容 (実際の `FLASK_SECRET_KEY` と `GOOGLE_API_KEY`) を記述し、保存します。

6.  **Nginx の設定:**
    Nginx を Webサーバーとして設定し、Flask アプリ (Gunicorn) へのリバースプロキシを行います。

    ```bash
    sudo vim /etc/nginx/sites-available/WordChain_app
    ```

    以下の内容を貼り付けます。

    ```nginx
    server {
        listen 80;
        server_name YOUR_SERVER_IP_OR_DOMAIN_NAME;

        # 静的ファイル (CSS, JS, 画像) の配信
        location /static {
            alias /home/YOUR_USER_NAME/WordChain_app/static;
        }

        # Flaskアプリ (Gunicorn) へのリバースプロキシ
        location / {
            proxy_pass http://unix:/home/YOUR_USER_NAME/WordChain_app/WordChain.sock;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

      * `YOUR_SERVER_IP_OR_DOMAIN_NAME`：あなたのサーバーのグローバルIPアドレス。
      * `YOUR_USER_NAME`： あなたのユーザー名。

    設定ファイルを有効化し、Nginx[^3] を再起動します。

    ```bash
    # シンボリックリンクの作成
    sudo ln -s /etc/nginx/sites-available/WordChain_app /etc/nginx/sites-enabled/
    # Nginxのデフォルト設定ファイルの削除
    sudo rm /etc/nginx/sites-enabled/default
    # Nginxの設定ファイルを構文チェック
    sudo nginx -t
    # Nginxの再起動（このコマンドは `/etc/nginx/sites-available/WordChain_app` の変更後に必ず実行される必要があります。）
    sudo systemctl restart nginx
    ```

    [^3]: Nginx のプログラムが、Unix ドメインソケットに接続するには、`/` から `/home/YOUR_USER_NAME/WordChain_app/WordChain.sock` 間の**ディレクトリすべてに x 権限**が必要です。他にも、パーミッションによる問題が起こりえます。デバッグ時には、`sudo tail -f /var/log/nginx/error.log` を参照することを推奨します。

7.  **Systemd サービスの設定 (Gunicorn のデーモン化):**
    Gunicorn (Flask アプリ) をバックグラウンドで起動し続け、サーバー起動時に自動で立ち上がるように Systemd を設定します。

    ```bash
    sudo vim /etc/systemd/system/WordChain.service
    ```

    以下の内容を貼り付けます。

    ```ini
    [Unit]
    Description=Gunicorn instance for WordChain App
    After=network.target

    [Service]
    User=YOUR_USER_NAME
    Group=www-data
    WorkingDirectory=/home/YOUR_USER_NAME/WordChain_app
    ExecStart=/home/YOUR_USER_NAME/WordChain_app/venv/bin/gunicorn --workers 3 --bind unix:/home/YOUR_USER_NAME/WordChain_app/WordChain.sock --umask 007 app:app
    
    Restart=on-failure
    StandardOutput=syslog
    StandardError=syslog
    SyslogIdentifier=WordChain

    [Install]
    WantedBy=multi-user.target
    ```

      * `Group`：Nginx がアクセスできるグループ (Ubuntu なら `www-data`) 。

    Systemd デーモンをリロードし、サービスを開始・有効化します。

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl start WordChain
    # Gunicorn サービスを停止するコマンドも、補足として以下に示します。
    # sudo systemctl stop WordChain
    sudo systemctl enable WordChain
    sudo systemctl status WordChain 
    # 状態が active (running) であることを確認
    ```

8.  **ファイアウォールの設定:**
    標準の HTTP ポート (80番) を開放します。5000番ポートは、Nginx が内部的に利用するため、外部公開は不要です。

      * **Ubuntu (UFW の場合):**
        ```bash
        sudo ufw allow 80/tcp
        sudo ufw status
        # OpenSSH の設定が無効になってしまった場合:
        # sudo ufw allow 22/tcp
        ```

アプリは `http://あなたのサーバーのIPアドレス/` からアクセスできるようになります。なお、アプリログの確認は `sudo journalctl -u WordChain -f` で可能です。

-----

## 🛠️ 使用技術

  * **バックエンド:** Python, Flask
  * **AI:** Google Gemini API (`google-generativeai` SDK)
  * **フロントエンド:** HTML, CSS, JavaScript (Jinja2 テンプレート)
  * **デプロイ:** [さくらのクラウド](https://cloud.sakura.ad.jp/?gad_source=1&gad_campaignid=197994764&gbraid=0AAAAADrEfxSHVDMr0g9M-LRlp1C_C9r0m&gclid=CjwKCAjw6s7CBhACEiwAuHQckrLVCDtdM7CTv7QMVv0mKto2PcK6MT2ginQ_r6Oj9Y1GsRlZPr3VQhoCI8YQAvD_BwE)(Ubuntu 22.04.5 LTS), 仮想環境 (`venv`), **Nginx**, **Gunicorn**, **Systemd**

  * **バージョン管理:** Git, GitHub

-----

## 💡 参考にしたWebサイト

- **プロトタイプ・UI 作成:** [Figma](https://www.figma.com/files/team/1513742474876045122/recents-and-sharing?fuid=1513742470753510226)
- **Figma の利用方法:** [すぐできる、figmaプロトタイプの作り方と考え方①-ボタン-](https://note.com/masumit_5734/n/na377295a2035)
- **HTML / CSS の記述:** [MDN Web Docs](https://developer.mozilla.org/ja/)

-----

## 🤖 AIの使用

- **要件整理:** Gemini
- **`app.py` のひな型生成:** Gemini
- **`README.md` のひな型生成:** Gemini
- **機能追加・デバッグ:** ChatGPT Codex
- **対戦相手:** Gemini API (gemini-1.5-flash)
- **Nginx・Gunicorn による運用:** Gemini

-----

## 🚀 ライブデモ

[Word Chain](http://163.43.114.130/)

-----