document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('word-input');
    const submitButton = document.getElementById('submit-button');
    const resetButton = document.getElementById('reset-button');
    const currentWordSpan = document.getElementById('current-word-display');
    const geminiWordSpan = document.getElementById('gemini-word-display');
    const gameMessageP = document.getElementById('game-message');
    const errorMessageP = document.getElementById('error-message');
    const geminiErrorDisplayP = document.getElementById('gemini-error-display'); 
    const usedWordsList = document.getElementById('used-words-list');

    let isGameOver = false;

    
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

        
        errorMessageP.textContent = "";
        errorMessageP.style.display = 'none';
        geminiErrorDisplayP.textContent = ""; 
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
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            
            currentWordSpan.textContent = data.current_word || 'しりとり';
            geminiWordSpan.textContent = ''; 
            gameMessageP.textContent = data.message;
            isGameOver = data.game_over;
            updateUsedWordsList(data.used_words);

            
            if (data.gemini_error_message) {
                geminiErrorDisplayP.textContent = data.gemini_error_message;
                geminiErrorDisplayP.style.display = 'block';
            }

            
            if (isGameOver) {
                submitButton.disabled = true;
                wordInput.disabled = true;
                gameMessageP.style.color = 'red'; 
                
                setTimeout(() => {
                    window.location.href = RESULT_PAGE_URL;
                }, 10000); 
            } else {
                submitButton.disabled = false;
                wordInput.disabled = false;
                gameMessageP.style.color = 'black'; 
                wordInput.value = '';

                
                if (data.player_turn === 'gemini') {
                    gameMessageP.textContent = "Geminiが単語を考え中...";
                    submitButton.disabled = true; 
                    wordInput.disabled = true;
                    setTimeout(async () => {
                        await updateGameState('gemini_turn');
                    }, 1000); 
                } else if (data.player_turn === 'user' && source === 'gemini_turn') {
                    
                    geminiWordSpan.textContent = data.current_word; 
                    
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

    
    submitButton.addEventListener('click', () => {
        errorMessageP.textContent = "";
        errorMessageP.style.display = 'none';
        geminiErrorDisplayP.textContent = ""; 
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

    
    updateGameState('initial_load');
});