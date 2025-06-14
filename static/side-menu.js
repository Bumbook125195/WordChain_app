document.addEventListener('DOMContentLoaded', () => {
    // 必要な要素をHTMLから取得
    const menuToggleButton = document.getElementById('menu-toggle'); // ハンバーガーメニューボタン
    const sideMenu = document.getElementById('side-menu');         // メニュー本体
    const closeMenuButton = document.getElementById('menu-toggle-slideout'); // メニュー内の閉じるボタン (もしあれば)

    // メニューを開閉する関数
    function toggleMenu() {
        // sideMenu に 'is-active' クラスを付け外しする
        // 'is-active' クラスが付くとメニューが表示され、外れると非表示になる
        sideMenu.classList.toggle('is-active');

        // アクセシビリティのため、aria-expanded属性の状態を切り替える
        const currentExpanded = menuToggleButton.getAttribute('aria-expanded');
        menuToggleButton.setAttribute('aria-expanded', currentExpanded === 'true' ? 'false' : 'true');
    }

    // ハンバーガーボタンがクリックされたら、toggleMenu 関数を実行
    if (menuToggleButton) { // ボタンが存在することを確認
        menuToggleButton.addEventListener('click', toggleMenu);
    }

    // メニュー内のリンクをクリックしたときに閉じる
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // メニュー内の「閉じる」ボタンがあれば、クリックされたらメニューを閉じる
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', toggleMenu);
    }
});