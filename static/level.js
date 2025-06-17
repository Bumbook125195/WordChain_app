document.addEventListener('DOMContentLoaded', () => {
    
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');

    
    [easyButton, mediumButton, hardButton].forEach(button => {
        if (button) { 
            button.addEventListener('click', async () => {
                const selectedLevel = button.dataset.level; 
                console.log(`Selected Level: ${selectedLevel}`);

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
                        
                        window.location.href = PLAY_PAGE_URL;
                    } else {
                        alert(`レベル設定に失敗しました: ${data.message}`);
                    }
                } catch (error) {
                    console.error('レベル設定中にエラーが発生しました:', error);
                    alert('レベル設定中に通信エラーが発生しました。');
                }
            });
        }
    });
});