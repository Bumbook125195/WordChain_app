# ソースコード「app.py」の解説

## 使用するモジュール
- os
  os対話用モジュール。環境変数へのアクセスを可能とする。
- flask 
  Webアプリ構築用フレームワーク。

| from | 説明 |
| ---- | ---- |
| Flask | Webアプリ本体のオブジェクトを生成するクラス |
| render\_template | HTMLファイルを読み込み・変更する関数 |
| request | HTTPリクエスト関連のオブジェクト |
| jsonify | Pythonの辞書・リストをJSON形式に変換する関数 |

- google.generativeai
  Gemini APIを利用するためのPython SDK-モジュール
- load_dotenv(from dotenv)
  .envファイルから環境変数の読み込み

## コマンド

- `load_dotenv()`
  .envファイルの`KEY=VALUE`をシステムの環境変数として読み込む。

- `app = Flask(__name__)`
  "app"というFlaskインスタンスの作成。＊1


## 補足
＊1
'__name__'はPythonインタプリタが自動的に値を設定する変数。そのスクリプトが**直接実行されたときには`__main__`**、**モジュールとして実行されたときには`__<filename>__`**となる。

