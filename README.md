承知いたしました！日本語で回答しますね。

-----

## 📝 Word Chain App (しりとりアプリ)

Word Chain App へようこそ！このアプリは、Google の Gemini を搭載した AI と対戦できるシンプルな「しりとり」ゲームです。難易度選択、レスポンシブデザイン、リアルタイムのフィードバックなど、様々な機能を備えています。

-----

## ✨ アプリの主な機能

  * **しりとりの基本ルール:** 日本語のしりとりの伝統的なルールでプレイできます。
  * **AI 対戦相手 (Gemini 搭載):** あなたの入力に応じて単語を生成する、賢い AI と対戦できます。
  * **難易度レベル選択:** Easy、Medium、Hard の難易度を選べます。AI の単語の選び方や、「ん」で終わる単語の頻度が変化します。
      * **Easy (対小学生):** AI は小学生のように、簡単で日常的な単語を使います。
      * **Medium (対中学生):** AI は中学生のように、一般的な単語や基礎的な社会・科学用語を使います。
      * **Hard (対高校生):** AI は高校生のように、専門的で複雑な単語、難読漢字の読み、カタカナ語も積極的に使います。
  * **レスポンシブデザイン:** デスクトップ、タブレット、モバイルなど、様々な画面サイズでスムーズにプレイできます。
  * **リアルタイム更新:** JavaScript の非同期通信により、ページをリロードすることなく単語の入力と表示がスムーズに行われます。
  * **エラー表示:** ルール違反（例: 先頭の文字が違う、重複した単語）があった場合、すぐにフィードバックが表示されます。
  * **ゲームリセット:** いつでも新しいゲームを開始できます。
  * **ハンバーガーメニュー:** ナビゲーションリンクに簡単にアクセスできます。

-----

## 🎮 プレイ方法

1.  **ゲーム開始:** タイトル画面から「Play」を選択するか、直接 `/play` ページにアクセスしてください。ゲームは「しりとり」から始まります。
2.  **単語の入力:** 入力欄に日本語の単語（ひらがなまたはカタカナのみ）を入力してください。
3.  **文字合わせ:** 入力した単語の最初の文字は、前の単語の最後の文字と同じでなければなりません。
4.  **AI のターン:** あなたが有効な単語を入力すると、AI (Gemini) のターンになります。
5.  **ゲーム終了条件:** 以下の場合、ゲームは終了します。
      * あなた、または AI が「ん」で終わる単語を入力した。
      * あなた、または AI が、現在のゲームですでに使われた単語を入力した。
      * あなたが入れた単語の最初の文字が、前の単語の最後の文字と合っていない場合（再入力を促します）。
      * AI が有効な単語を生成できなかった。
6.  **リセット:** 「ゲームをリセット」ボタンをクリックすると、いつでも新しいゲームを開始できます。

-----

## ⚙️ セットアップとデプロイ

このアプリは、バックエンドに Flask、フロントエンドに HTML/CSS/JavaScript、AI 機能に Google の Gemini API を使用しています。さくらの VPS のような Linux ベースのクラウドサーバーへのシンプルなデプロイを想定しています。

### 必要環境

  * **Python 3.8 以上:**
  * **`pip`:** Python のパッケージ管理ツール。
  * **`venv` モジュール:** 仮想環境作成用 (`python3 -m venv`)。
  * **Git:** バージョン管理用。
  * **Google Gemini API キー:** [Google AI Studio](https://aistudio.google.com/) から取得してください。
  * **Linux コマンドの基本的な知識:** サーバーへのデプロイ時に必要です。

### ローカル開発環境のセットアップ

1.  **リポジトリのクローン:**

    ```bash
    git clone https://github.com/your_github_username/shiritori-app.git
    cd shiritori-app
    ```

    *(`your_github_username` はご自身の GitHub ユーザー名に置き換えてください)*

2.  **仮想環境の作成と有効化:**

    ```bash
    python3 -m venv venv
    # Windows の場合: .\venv\Scripts\activate
    # macOS/Linux/WSL の場合: source venv/bin/activate
    ```

3.  **依存関係のインストール:**

    ```bash
    pip install -r requirements.txt
    ```

    *`requirements.txt` に `Flask` と `google-generativeai` が含まれていることを確認してください。*

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

### クラウドサーバーへのデプロイ (例: さくらの VPS)

ここでは、基本的な Linux サーバー (Ubuntu を想定) と SSH アクセスを前提としています。

1.  **サーバーへの SSH ログイン:**

    ```bash
    ssh your_user@your_server_ip
    ```

2.  **サーバー環境の準備:**

      * Python 3、`venv`、`pip`、Git が未インストールの場合はインストールします:
        ```bash
        sudo apt update
        sudo apt install python3 python3-venv python3-pip git
        # もし python3.10-venv が具体的に必要であれば: sudo apt install python3.10-venv
        ```

3.  **サーバー上でリポジトリをクローン:**

    ```bash
    cd ~ # または、お好みのデプロイディレクトリ (例: /var/www/)
    mkdir shiritori-app && cd shiritori-app
    git clone https://github.com/your_github_username/shiritori-app.git .
    ```

4.  **サーバー上で仮想環境をセットアップし、依存関係をインストール:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

5.  **サーバー上で `.env` ファイルを作成:**
    `.env` ファイルは Git で管理されないため、**サーバー上で手動で作成**する必要があります。

    ```bash
    nano .env
    ```

    ローカルの `.env` と同じ内容 (実際の `FLASK_SECRET_KEY` と `GOOGLE_API_KEY`) を記述し、保存します。

6.  **ポート 5000 を許可するファイアウォール設定:**

      * **Ubuntu (UFW の場合):**
        ```bash
        sudo ufw allow 5000/tcp
        sudo ufw enable # UFW がアクティブでない場合
        ```
      * **CentOS (firewalld の場合):**
        ```bash
        sudo firewall-cmd --permanent --add-port=5000/tcp
        sudo firewall-cmd --reload
        ```

7.  **Flask アプリケーションの実行:**

    ```bash
    # アプリケーションディレクトリに移動 (もし移動していなければ)
    cd ~/shiritori-app
    # 仮想環境を有効化
    source venv/bin/activate
    # アプリを実行 (このコマンドは SSH セッションを占有します)
    python3 app.py
    ```

    *アプリは `http://あなたのサーバーのIPアドレス:5000` からアクセスできるようになります。SSH セッションを開いたままにしておく必要があります。*

-----

## 🚀 ライブデモ

[ここにデプロイされた Web アプリの URL を貼り付けてください] *(例: `http://あなたのサーバーのIPアドレス:5000`)*

-----

## 🛠️ 使用技術

  * **バックエンド:** Python, Flask
  * **AI:** Google Gemini API (`google-generativeai` SDK)
  * **フロントエンド:** HTML, CSS, JavaScript (Jinja2 テンプレート)
  * **デプロイ:** Linux (Ubuntu/CentOS), 仮想環境 (`venv`)
  * **バージョン管理:** Git, GitHub

-----

## 💡 今後の改善点

  * 本番環境での安定性とセキュリティのために、WSGI サーバー (Gunicorn) とリバースプロキシ (Nginx) を導入する。
  * 複数ユーザー対応と状態の永続化のために、ゲーム状態をデータベース (例: SQLite, PostgreSQL) に保存する。
  * Gemini の単語生成ロジックとエラー処理をさらに洗練させる。
  * よりインタラクティブな UI 要素やアニメーションを追加する。
  * WebSocket を使用してプレイヤー vs プレイヤーの対戦モードを実装する。