document.addEventListener('DOMContentLoaded', () => {
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');

    const buttons = [easyButton, mediumButton, hardButton];

    function updateButtonImages(activeLevel) {
        buttons.forEach(btn => {
            if (!btn) return;
            const img = btn.querySelector('img');
            if (btn.dataset.level === activeLevel) {
                img.src = img.dataset.on;
            } else {
                img.src = img.dataset.off;
            }
        });
    }

    async function fetchCurrentLevel() {
        try {
            const res = await fetch(GET_GAME_STATUS_URL);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            updateButtonImages(data.level);
        } catch (e) {
            console.error('現在のレベル取得に失敗しました:', e);
        }
    }

    buttons.forEach(button => {
        if (!button) return;
        button.addEventListener('click', async () => {
            const selectedLevel = button.dataset.level;

            try {
                const response = await fetch(SELECT_LEVEL_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ level: selectedLevel })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.status === 'success') {
                    alert(`レベルを「${data.level}」に設定しました！`);
                    updateButtonImages(data.level);
                } else {
                    alert(`レベル設定に失敗しました: ${data.message}`);
                }
            } catch (error) {
                console.error('レベル設定中にエラーが発生しました:', error);
                alert('レベル設定中に通信エラーが発生しました。');
            }
        });
    });

    fetchCurrentLevel();
});