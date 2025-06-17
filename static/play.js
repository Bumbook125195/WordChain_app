document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('word-input');
    const submitButton = document.getElementById('submit-button');
    const resetButton = document.getElementById('reset-button');
    const currentWordSpan = document.getElementById('current-word-display');
    const geminiWordSpan = document.getElementById('gemini-word-display');
    const gameMessageP = document.getElementById('game-message');
    const errorMessageP = document.getElementById('error-message');
    const geminiErrorDisplayP = document.getElementById('gemini-error-display'); // 新規追加
    const usedWordsList = document.getElementById('used-words-list');

    let isGameOver = false;

    // ゲームの状態をサーバーから取得・更新し、UIに反映する関数
    async function updateGameState(source = 'initial_load') {
        let endpoint = GET_GAME_STATUS_URL;
        let method = 'GET';
        let bodyData = {};

        if (source === 'user_submit') {
            endpoint = SUBMIT_WORD_URL;
            method = 'POST';
            bodyData = { word: wordInput.value };
        } else if (source === 'reset') {
            endpoint = RESET_GAME_API_URL;
            method = 'POST';
        } else if (source === 'gemini_turn') {
            endpoint = GET_GEMINI_WORD_URL;
            method = 'POST';
        }

        // エラーメッセージとGeminiエラーメッセージをクリア
        errorMessageP.textContent = "";
        errorMessageP.style.display = 'none';
        geminiErrorDisplayP.textContent = ""; // Geminiエラーメッセージもクリア
        geminiErrorDisplayP.style.display = 'none';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: method === 'POST' ? JSON.stringify(bodyData) : undefined
            });

            if (!response.ok) {
                // HTTPエラー（例: 500 Internal Server Error）の場合
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // UIの更新
            currentWordSpan.textContent = data.current_word || 'しりとり';
            geminiWordSpan.textContent = ''; // Geminiの表示は一旦クリア
            gameMessageP.textContent = data.message;
            isGameOver = data.game_over;
            updateUsedWordsList(data.used_words);

            // Geminiのエラーメッセージがあれば表示
            if (data.gemini_error_message) {
                geminiErrorDisplayP.textContent = data.gemini_error_message;
                geminiErrorDisplayP.style.display = 'block';
            }

            // ゲームオーバーの場合
            if (isGameOver) {
                submitButton.disabled = true;
                wordInput.disabled = true;
                gameMessageP.style.color = 'red'; // ゲームオーバーメッセージを赤くする
                // 結果ページにリダイレクト
                setTimeout(() => {
                    window.location.href = RESULT_PAGE_URL;
                }, 10000); // 1.5秒後にリダイレクト
            } else {
                submitButton.disabled = false;
                wordInput.disabled = false;
                gameMessageP.style.color = 'black'; // 通常メッセージは黒
                wordInput.value = '';

                // Geminiのターンであれば、Geminiの単語生成APIを呼び出す
                if (data.player_turn === 'gemini') {
                    gameMessageP.textContent = "Geminiが単語を考え中...";
                    submitButton.disabled = true; // Geminiの思考中はボタン無効化
                    wordInput.disabled = true;
                    setTimeout(async () => {
                        await updateGameState('gemini_turn');
                    }, 1000); // 1秒待ってからGeminiのターンを実行
                } else if (data.player_turn === 'user' && source === 'gemini_turn') {
                    // Geminiが単語を生成し、今ユーザーのターンになった場合
                    geminiWordSpan.textContent = data.current_word; // Geminiが出した単語を表示
                    // ユーザーが最後に出した単語はused_wordsの最後から2番目
                    currentWordSpan.textContent = data.used_words[data.used_words.length - 2] || '（なし）';
                    gameMessageP.textContent = data.message;
                    submitButton.disabled = false;
                    wordInput.disabled = false;
                }
            }
        } catch (error) {
            console.error('更新エラー:', error);
            gameMessageP.textContent = "エラー";
            errorMessageP.textContent = "通信エラーが発生しました。";
            errorMessageP.style.display = 'block';
            submitButton.disabled = true;
            wordInput.disabled = true;
        }
    }

    function updateUsedWordsList(words) {
        usedWordsList.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            usedWordsList.appendChild(li);
        });
    }

    // --- イベントリスナーの登録 ---
    submitButton.addEventListener('click', () => {
        errorMessageP.textContent = "";
        errorMessageP.style.display = 'none';
        geminiErrorDisplayP.textContent = ""; // クリック時にGeminiエラーもクリア
        geminiErrorDisplayP.style.display = 'none';
        updateGameState('user_submit');
    });

    wordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });

    resetButton.addEventListener('click', async () => {
        await updateGameState('reset');
    });

    // ページロード時の初期処理
    updateGameState('initial_load');
});