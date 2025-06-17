document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');

    // レベル選択ボタンのイベントリスナー
    [easyButton, mediumButton, hardButton].forEach(button => {
        if (button) { // ボタンが存在することを確認
            button.addEventListener('click', async () => {
                const selectedLevel = button.dataset.level; // data-level 属性からレベル名を取得
                console.log(`Selected Level: ${selectedLevel}`);

                try {
                    // サーバーにレベル選択を送信
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
                        // レベル設定後、ゲーム開始ページに遷移
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