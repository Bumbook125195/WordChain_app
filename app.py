import os
import re
import datetime
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import google.generativeai as genai
from dotenv import load_dotenv
import random

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey_for_dev_only") 


API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    print("Warning: GOOGLE_API_KEY environment variable not set. Gemini API calls will fail.")
else:
    genai.configure(api_key=API_KEY)
    
    model = genai.GenerativeModel(
        'gemini-1.5-flash',
        generation_config={
            "temperature": 0.9, 
            "max_output_tokens": 50, 
        }
    )


DEFAULT_GAME_STATE = {
    'current_word': '',
    'used_words': [], 
    'game_over': False,
    'message': '',
    'player_turn': 'user', 
    'level': 'easy', 
    'gemini_error_message': '' 
}


GEMINI_PROMPTS = {
    'easy': {
        'persona': '対小学生',
        'word_type': '簡単な日常単語、子供でも知っているような単語',
        'n_frequency': 0.3, 
        'instruction': '小学生でもわかる簡単な単語で、かつ語尾が「ん」で終わらない単語を、、七パターン考え、その中からランダムに一つの単語を選択し、提案してください。提案する単語は必ず「ひらがな」とします。'
    },
    'medium': {
        'persona': '対中学生',
        'word_type': '一般的な単語、社会や科学の基礎的な単語',
        'n_frequency': 0.2, 
        'instruction': '中学生レベルの一般的な単語で、かつ語尾が「ん」で終わらない単語を、十五パターン考え、その中からランダムに一つの単語を選択し、提案してください。提案する単語は必ず「ひらがな」とします。'
    },
    'hard': {
        'persona': '対高校生',
        'word_type': '専門性の高い単語、歴史用語、科学用語等',
        'n_frequency': 0.1, 
        'instruction': '高校生レベルの高度な単語で、かつ語尾が「ん」で終わらない単語を、二十パターン考え、その中からランダムに一つの単語を選択し、提案してください。提案する単語は必ず「ひらがな」とします。'
    }
}


def get_current_game_state():
    """現在のゲーム状態をセッションから取得する。なければ初期値を設定。"""
    if 'game_state' not in session:
        session['game_state'] = DEFAULT_GAME_STATE.copy()
    return session['game_state']

def save_game_state(state):
    """ゲーム状態をセッションに保存する。"""
    session['game_state'] = state

def reset_game_state():
    """ゲーム状態を初期化する。"""
    
    session.pop('game_state', None) 
    
    session['game_state'] = DEFAULT_GAME_STATE.copy()



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    
    reset_game_state() 
    return render_template('play.html')

@app.route('/rule')
def rule():
    return render_template('rule.html')

@app.route('/level')
def level():
    return render_template('level.html')

@app.route('/result')
def result():
    game_result = session.get('game_result', {'message': '結果不明', 'reason': ''})
    return render_template('result.html', game_result=game_result)



@app.route('/game_status', methods=['GET'])
def get_game_status():
    """現在のゲーム状態を取得するAPI (初回ロード用)"""
    state = get_current_game_state()
    
    state['gemini_error_message'] = ''
    save_game_state(state) 
    return jsonify(state)

@app.route('/submit_word', methods=['POST'])
def submit_word():
    """ユーザーの単語入力とゲームロジック処理"""
    state = get_current_game_state()
    state['gemini_error_message'] = '' 

    if state['game_over']:
        return jsonify(state)

    data = request.json
    user_word = data.get('word', '').strip()

    if not user_word:
        state['message'] = "何も入力されていません。"
        save_game_state(state)
        return jsonify(state)

    if not re.fullmatch(r'[\u3040-\u309F\u30FC\u30A0-\u30FF]+', user_word):
        state['message'] = "ひらがなまたはカタカナで入力してください。"
        save_game_state(state)
        return jsonify(state)

    if user_word.lower() == 'リセット':
        reset_game_state()
        state = get_current_game_state()
        return jsonify(state)

    
    if not state['current_word']:
        state['current_word'] = user_word
        state['used_words'].append(user_word)
        
        if user_word.endswith('ん'):
            state['game_over'] = True
            state['message'] = f"「{user_word}」は「ん」で終わるのであなたの負け！ゲーム終了！"
            session['game_result'] = {'message': '負け', 'reason': '「ん」で終わった'}
            state['redirect_to_result'] = True
        else:
            state['message'] = f"OK！次は「{user_word[-1]}」から始まる単語を入力してください。"
            state['player_turn'] = 'gemini'
        
        save_game_state(state)
        return jsonify(state)


    
    last_char = state['current_word'][-1]
    first_char = user_word[0]

    if last_char != first_char:
        state['message'] = f"「{state['current_word']}」の次は「{last_char}」です。「{user_word}」はルールに合っていません。もう一度入力してください。"
        
    elif user_word in state['used_words']:
        state['game_over'] = True
        state['message'] = f"「{user_word}」はすでに使われた単語です。あなたの負け！"
        session['game_result'] = {'message': '負け', 'reason': '重複'}
    elif user_word.endswith('ん'):
        state['game_over'] = True
        state['message'] = f"「{user_word}」は「ん」で終わるのであなたの負け！ゲーム終了！"
        session['game_result'] = {'message': '負け', 'reason': '「ん」で終わった'}
    else:
        state['current_word'] = user_word
        state['used_words'].append(user_word)
        state['message'] = f"OK！次は「{user_word[-1]}」から始まる単語を入力してください。"
        state['player_turn'] = 'gemini'

    save_game_state(state)
    if state['game_over']:
        state['redirect_to_result'] = True
    return jsonify(state)

@app.route('/reset', methods=['POST'])
def reset_game_api():
    """ゲームをリセットするAPIエンドポイント"""
    reset_game_state()
    state = get_current_game_state()
    return jsonify(state)

@app.route('/get_gemini_word', methods=['POST'])
def get_gemini_word():
    """Geminiが単語を生成するAPI"""
    state = get_current_game_state()
    state['gemini_error_message'] = '' 

    if state['game_over'] or state['player_turn'] != 'gemini':
        return jsonify(state)

    if not API_KEY:
        state['message'] = "Gemini APIキーが設定されていません。Geminiは動けません。"
        state['game_over'] = True
        save_game_state(state)
        state['redirect_to_result'] = True
        return jsonify(state)

    current_level_key = state.get('level', 'easy')
    level_config = GEMINI_PROMPTS.get(current_level_key, GEMINI_PROMPTS['easy'])

    last_char = state['current_word'][-1]
    
    prompt_base = f"""しりとりゲームをしています。
    あなたは今、{level_config['persona']}です。
    現在の単語は「{state['current_word']}」です。
    次に「{last_char}」から始まる単語を、以下の条件で1つだけ提案してください。
    - {level_config['instruction']}
    - すでに使われた単語リスト「{', '.join(state['used_words'])}」からは使わないでください。
    - 余計な説明や前置き、句読点（例：「はい、単語は〜です。」や「。」）は不要で、**単語だけ**を答えてください。
    """

    if random.random() < level_config['n_frequency']:
        prompt_final = prompt_base.replace('かつ語尾が「ん」で終わらない単語を提案してください。', '語尾が「ん」で終わる単語も提案して良いですが、**短く簡単な単語**を提案してください。')
    else:
        prompt_final = prompt_base

    gemini_word = ""

    try:
        response = model.generate_content(prompt_final)
        gemini_word = response.text.strip()
        gemini_word = re.sub(r'^[はい、そうです、\s]*[単語は、](「|『)?(.+?)(」|』)?(です)?(。)?$', r'\2', gemini_word)
        gemini_word = re.sub(r'[「」『』（）。、\s]', '', gemini_word)
        
        
        
        if not gemini_word:
            state['game_over'] = True
            state['message'] = "Geminiが有効な単語を生成できませんでした。あなたの勝ち！"
            session['game_result'] = {'message': '勝ち', 'reason': 'Geminiが単語を生成できなかった'}
            state['current_word'] = '---'
            state['gemini_error_message'] = "Geminiが単語を生成できませんでした。" 
        
        elif not gemini_word.startswith(last_char):
            state['game_over'] = True
            state['message'] = f"Geminiが「{gemini_word}」とルール違反しました（「{last_char}」から始まるはず）。あなたの勝ち！"
            session['game_result'] = {'message': '勝ち', 'reason': 'Geminiがルール違反'}
            state['current_word'] = gemini_word
            state['gemini_error_message'] = f"Geminiがルール違反: 「{gemini_word}」（期待:「{last_char}」から）" 
        
        elif gemini_word in state['used_words']:
            state['game_over'] = True
            state['message'] = f"Geminiがすでに使われた単語「{gemini_word}」を使いました。あなたの勝ち！"
            session['game_result'] = {'message': '勝ち', 'reason': 'Geminiが重複単語を使った'}
            state['current_word'] = gemini_word
            state['gemini_error_message'] = f"Geminiが重複単語: 「{gemini_word}」" 
        
        elif gemini_word.endswith('ん'):
            state['game_over'] = True
            state['message'] = f"Geminiが「{gemini_word}」で「ん」を出しました。あなたの勝ち！"
            session['game_result'] = {'message': '勝ち', 'reason': 'Geminiが「ん」を出した'}
            state['current_word'] = gemini_word
            state['gemini_error_message'] = f"Geminiが「ん」で終了: 「{gemini_word}」" 
        else:
            
            state['current_word'] = gemini_word
            state['used_words'].append(gemini_word)
            state['message'] = f"Gemini: 「{gemini_word}」！次は「{gemini_word[-1]}」から始まる単語を入力してください。"
            state['player_turn'] = 'user' 

    except Exception as e:
        print(f"Gemini API Error: {e}")
        state['game_over'] = True 
        state['message'] = "Geminiとの通信中にエラーが発生しました。あなたの勝ち！"
        session['game_result'] = {'message': '勝ち', 'reason': 'Gemini APIエラー'}
        state['current_word'] = '---'
        state['gemini_error_message'] = f"Gemini API通信エラー: {e}" 
    
    save_game_state(state)
    if state['game_over']:
        state['redirect_to_result'] = True
    return jsonify(state)

@app.route('/select_level', methods=['POST'])
def select_level():
    """レベル選択API"""
    data = request.json
    selected_level = data.get('level', 'easy')

    if selected_level in GEMINI_PROMPTS:
        state = get_current_game_state()
        state['level'] = selected_level
        save_game_state(state)
        return jsonify({'status': 'success', 'level': selected_level})
    else:
        return jsonify({'status': 'error', 'message': '無効なレベルです。'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)