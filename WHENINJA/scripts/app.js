// app.js - メインアプリケーション

// アプリ内テキスト定数
const TEXTS = {
  welcome: {
    subText: {
      ja: '日本の文化やマナーをシェアしてなかよくなろう！',
      en: "Let's be friends by sharing Japanese culture and manners!"
    }
  }
};

const App = {
  userData: null,
  currentScreen: 'loading',
  currentCategoryQuestionCount: 0, // カテゴリー内での問題カウント

  // 初期化
  async init() {
    console.log('🚀 WHENINJA 起動中...');
    
    // データ読み込み
    const loaded = await QuizManager.loadData();
    if (!loaded) {
      alert('データの読み込みに失敗しました');
      return;
    }

    // ユーザーデータ読み込み
    this.userData = Storage.load();
    
    // テーマ適用
    this.applyTheme(this.userData.settings.theme);

    // アプリ開始
    this.start();
  },
    
  // アプリ開始
  start() {
    this.showScreen('welcome');
  },

  // テーマ適用
  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // 画面表示
  showScreen(screenName, params = {}) {
    this.currentScreen = screenName;
    const content = document.getElementById('mainContent');
    
    switch (screenName) {
      case 'welcome':
        content.innerHTML = this.renderWelcome();
        break;
      case 'onboarding':
        content.innerHTML = this.renderOnboarding();
        break;
      case 'characterSelect':
        content.innerHTML = this.renderCharacterSelect();
        break;
      case 'home':
        content.innerHTML = this.renderHome();
        this.updateBottomNav();
        break;
      case 'quiz':
        content.innerHTML = this.renderQuiz(params.question);
        break;
      case 'feedback':
        content.innerHTML = this.renderFeedback(params);
        break;
      case 'catChat':
        content.innerHTML = this.renderCatChat(params.chat);
        break;
      case 'levelUp':
        content.innerHTML = this.renderLevelUp(params);
        break;
      case 'allComplete':
        content.innerHTML = this.renderAllComplete();
        this.updateBottomNav();
        break;
      case 'profile':
        content.innerHTML = this.renderProfile();
        this.updateBottomNav();
        break;
      case 'collection':
        content.innerHTML = this.renderCollection();
        this.updateBottomNav();
        break;
      case 'settings':
        content.innerHTML = this.renderSettings();
        break;
      default:
        content.innerHTML = '<div class="main-content"><h1>読み込み中...</h1></div>';
    }
    
    content.style.transition = 'none';
    content.style.opacity = '0';
    content.style.transform = 'translateY(12px)';

    setTimeout(() => {
      content.style.transition = 'opacity 250ms ease-out, transform 250ms ease-out';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
      // Lucide Iconsを描画
    }, 50);
  },

  // ボトムナビを更新
  updateBottomNav() {
    let nav = document.querySelector('.bottom-nav');
    if (!nav) {
      nav = document.createElement('div');
      document.querySelector('.app-container').appendChild(nav);
    }
    nav.outerHTML = this.renderBottomNav();
  },

  // ウェルカム画面
  renderWelcome() {
    const lang = this.userData.settings.language;
    const subText = TEXTS.welcome.subText[lang];

    return `
      <div style="
        min-height: 100vh;
        background: #FFFBF0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        position: relative;
      ">
        <!-- 言語切り替えボタン -->
        <div style="position: absolute; top: 1.5rem; right: 1.5rem;">
          <button onclick="app.toggleLangMenu()" id="langBtn" style="
            background: var(--card);
            border: 1px solid #ddd;
            border-radius: 9999px;
            padding: 0.4rem 0.9rem;
            font-size: 0.875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            color: #555;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          ">🌐 ${lang === 'ja' ? 'JP' : 'EN'}</button>

          <!-- ドロップダウンメニュー -->
          <div id="langMenu" style="
            display: none;
            position: absolute;
            top: 2.5rem;
            right: 0;
            background: var(--card);
            border: 1px solid #eee;
            border-radius: 1rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12);
            min-width: 180px;
            overflow: hidden;
            z-index: 100;
          ">
            <!-- English -->
            <div id="rowEn" onclick="app.setLanguage('en')" style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.9rem 1.25rem;
              cursor: pointer;
              background: ${lang === 'en' ? '#f0fffe' : 'white'};
            ">
              <span style="font-size: 0.75rem; font-weight: 700; color: #888; width: 20px;">US</span>
              <span style="font-size: 0.95rem; color: #333;">English</span>
              <span id="checkEn" style="margin-left: auto; color: #4DC8C8; display: ${lang === 'en' ? 'inline' : 'none'};">✓</span>
            </div>

            <!-- 日本語 -->
            <div id="rowJa" onclick="app.setLanguage('ja')" style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.9rem 1.25rem;
              cursor: pointer;
              border-top: 1px solid #f5f5f5;
              background: ${lang === 'ja' ? '#f0fffe' : 'white'};
            ">
              <span style="font-size: 0.75rem; font-weight: 700; color: #888; width: 20px;">JP</span>
              <span style="font-size: 0.95rem; color: #333;">日本語</span>
              <span id="checkJa" style="margin-left: auto; color: #4DC8C8; display: ${lang === 'ja' ? 'inline' : 'none'};">✓</span>
            </div>

            <!-- 韓国語（Soon） -->
            <div style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.9rem 1.25rem;
              border-top: 1px solid #f5f5f5;
              opacity: 0.4;
              cursor: not-allowed;
            ">
              <span style="font-size: 0.75rem; font-weight: 700; color: #888; width: 20px;">KR</span>
              <span style="font-size: 0.95rem; color: #333;">한국어</span>
              <span style="margin-left: auto; background: #eee; color: #999; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 9999px;">Soon</span>
            </div>

            <!-- 中国語（Soon） -->
            <div style="
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.9rem 1.25rem;
              border-top: 1px solid #f5f5f5;
              opacity: 0.4;
              cursor: not-allowed;
            ">
              <span style="font-size: 0.75rem; font-weight: 700; color: #888; width: 20px;">CN</span>
              <span style="font-size: 0.95rem; color: #333;">中文</span>
              <span style="margin-left: auto; background: #eee; color: #999; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 9999px;">Soon</span>
            </div>
          </div>
        </div>


        <!-- タイトルロゴ -->
        <img
          src="/assets/images/icon-512.png"
          alt="WHENINJA"
          style="
            width: 260px;
            height: auto;
            margin-bottom: 2.5rem;
            animation: fadeSlideUp 600ms ease-out both;
          "
        >

        <!-- サブテキスト -->
        <p id="welcomeSubText" style="
          color: #75665e;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-align: center;
          animation: fadeSlideUp 600ms ease-out 200ms both;
        ">${this.escapeHtml(subText)}</p>


        <!-- Tap to Start -->
        <p onclick="app.showScreen('onboarding')"
          class="tap-to-start"
          style="
          color: #5d4233;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          letter-spacing: 0.05em;
        ">Tap to Start</p>
      </div>
    `;
  },

  // オンボーディング画面
  renderOnboarding() {
    const lang = this.userData.settings.language;

    const title = lang === 'ja' ? 'WHENINJA へようこそ！' : 'Welcome to WHENINJA!';
    const btnText = lang === 'ja' ? 'はじめよう！' : "Let's Go!";

    const cards = [
      {
        icon: '🥷',
        bg: '#EEF6FF',
        text: {
          ja: '日本の文化やマナー、おもしろい習慣をクイズで楽しくシェアするよ！',
          en: 'Let\'s share Japanese culture, manners, and fun habits through quizzes!'
        }
      },
      {
        icon: '📚',
        bg: '#FFF0F0',
        text: {
          ja: '電車・食事・会話など、生活に役立つ６カテゴリーから選べるよ！',
          en: 'Pick from 6 super useful categories for trains, eating, chatting, and so on!'
        }
      },
      {
        icon: '⭐',
        bg: '#FFF9E6',
        text: {
          ja: 'クイズに答えてレベルアップやおみやげゲットをめざそう！',
          en: 'Answer quizzes to level up and collect souvenirs!'
        }
      }
    ];

    const categoryIcons = ['🚃', '🏨', '🍜', '💬', '🏠', '🙏'];

    const flexNote = lang === 'ja'
      ? '💞 実際の状況では、WHENINJA をガイドとして<br>柔軟に対応してね！'
      : '💞 In real situations, use WHENINJA as a guide and be flexible!';
    
    const cacheNote = lang === 'ja'
      ? '⚠️ プレイデータはブラウザに保存されるよ<br>データの取り扱いに気を付けてね！'
      : '⚠️ Your play data is saved in your browser<br>Be careful when clearing browser data!';

    let cardsHtml = '';
    cards.forEach(card => {
      cardsHtml += `
        <div style="
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          margin-bottom: 0.75rem;
        ">
          <div style="
            width: 48px;
            height: 48px;
            border-radius: 0.75rem;
            background: ${card.bg};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
          ">${card.icon}</div>
          <p style="
            font-size: 0.9rem;
            color: #444;
            line-height: 1.6;
            margin: 0;
            padding-top: 0.25rem;
          ">${this.escapeHtml(card.text[lang])}</p>
        </div>
      `;
    });

    let iconsHtml = '';
    categoryIcons.forEach(icon => {
      iconsHtml += `
        <div style="
          width: 48px;
          height: 48px;
          border-radius: 0.75rem;
          background: white;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        ">${icon}</div>
      `;
    });

    return `
      <div style="
        min-height: 100vh;
        background: #FFFBF0;
        padding: 3rem 1.5rem 2rem;
        display: flex;
        flex-direction: column;
      ">
        <!-- タイトル -->
        <h1 style="
          font-size: 1.5rem;
          font-weight: 800;
          color: #4DC8C8 ;
          text-align: center;
          margin-bottom: 2rem;
        ">${this.escapeHtml(title)}</h1>

        <!-- 説明カード -->
        ${cardsHtml}

        <!-- カテゴリーアイコン -->
        <div style="
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 1.5rem 0;
          flex-wrap: wrap;
        ">
          ${iconsHtml}
        </div>

        <!-- 柔軟対応テキスト -->
        <p style="
          font-size: 0.75rem;
          color: #6d6d6d;
          text-align: center;
          margin: 0 0 0.75rem;
          line-height: 1.6;
        ">${flexNote}</p>

        <!-- キャッシュ注意テキスト -->
        <p style="
          font-size: 0.75rem;
          color: #6d6d6d;
          text-align: center;
          margin: 0 0 1rem;
          line-height: 1.6;
        ">${cacheNote}</p>


        <!-- Let's Go! ボタン -->
        <button
          onclick="app.showScreen('characterSelect')"
          style="
            background: #4DC8C8;
            color: white;
            border: none;
            border-radius: 1rem;
            padding: 1.1rem;
            font-size: 1.1rem;
            font-weight: 800;
            cursor: pointer;
            width: 100%;
            margin-top: auto;
            box-shadow: 0 4px 12px rgba(77,200,200,0.3);
            transition: all 150ms;
          "
          onmouseover="this.style.transform='scale(1.02)'"
          onmouseout="this.style.transform='scale(1)'"
        >${this.escapeHtml(btnText)}</button>
      </div>
    `;
  },

  // キャラクター選択画面
  renderCharacterSelect() {
    const lang = this.userData.settings.language;
    const title = lang === 'ja' ? 'ガイドねこを選んでね！' : 'Choose Your Guide Cat!';
    const subtitle = lang === 'ja'
      ? 'ぼくらがきみの旅に同行するよ！'
      : 'We will accompany you on your journey!';

    return `
      <div style="
        min-height: 100vh;
        background: #FFFBF0;
        padding: 3rem 1.5rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <!-- タイトル -->
        <h1 style="
          font-size: 1.5rem;
          font-weight: 800;
          color: #674e41;
          text-align: center;
          margin-bottom: 0.5rem;
        ">${this.escapeHtml(title)}</h1>

        <!-- サブタイトル -->
        <p style="
          font-size: 0.875rem;
          color: #6f6f6f;
          text-align: center;
          margin-bottom: 2.5rem;
        ">${this.escapeHtml(subtitle)}</p>

        <!-- 上段: 2匹 -->
        <div style="
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          justify-content: center;
        ">
          <!-- Fuji Cat -->
          <div onclick="app.selectCharacter('fuji-cat')" style="
            background: white;
            border: 2px solid #eee;
            border-radius: 1.25rem;
            padding: 1.25rem;
            width: 160px;
            text-align: center;
            cursor: pointer;
            transition: all 150ms;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          "
          onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.1)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.06)'"
          >
            <img src="/assets/images/cat-select-fuji.png" alt="Fuji Cat"
              style="width: 130px; height: 130px; object-fit: contain; margin-bottom: 0.75rem;">
            <div style="font-size: 0.875rem; font-weight: 700; color: #333;">${lang === 'ja' ? 'ふじねこ' : 'Fuji Cat'}</div>
          </div>

          <!-- Mike Cat (Coming Soon) -->
          <div style="
            background: white;
            border: 2px solid #eee;
            border-radius: 1.25rem;
            padding: 1.25rem;
            width: 160px;
            text-align: center;
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            position: relative;
          ">
            <img src="/assets/images/cat-select-mike-locked.png" alt="Mike Cat"
              style="width: 130px; height: 130px; object-fit: contain; margin-bottom: 0.75rem; filter: grayscale(100%);">
            <div style="font-size: 0.875rem; font-weight: 700; color: #333;">${lang === 'ja' ? 'みけねこ' : 'Mike Cat'}</div>
            <div style="
              position: absolute;
              top: 0.75rem;
              right: 0.75rem;
              background: #eee;
              color: #999;
              font-size: 0.6rem;
              font-weight: 700;
              padding: 0.2rem 0.4rem;
              border-radius: 9999px;
            ">SOON</div>
          </div>
        </div>

        <!-- 下段: 1匹（中央） -->
        <div style="
          display: flex;
          justify-content: center;
        ">
          <!-- Kuro Cat (Coming Soon) -->
          <div style="
            background: white;
            border: 2px solid #eee;
            border-radius: 1.25rem;
            padding: 1.25rem;
            width: 160px;
            text-align: center;
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            position: relative;
          ">
            <img src="/assets/images/cat-select-kuro-locked.png" alt="Kuro Cat"
              style="width: 130px; height: 130px; object-fit: contain; margin-bottom: 0.75rem; filter: grayscale(100%);">
            <div style="font-size: 0.875rem; font-weight: 700; color: #333;">${lang === 'ja' ? 'くろねこ' : 'Kuro Cat'}</div>
            <div style="
              position: absolute;
              top: 0.75rem;
              right: 0.75rem;
              background: #eee;
              color: #999;
              font-size: 0.6rem;
              font-weight: 700;
              padding: 0.2rem 0.4rem;
              border-radius: 9999px;
            ">SOON</div>
          </div>
        </div>
      </div>
    `;
  },

  // キャラクター選択
  selectCharacter(characterId) {
    this.userData.selectedCharacter = characterId;
    Storage.save(this.userData);
    this.showCharacterPopup();
  },

  // キャラクター選択ポップアップ
  showCharacterPopup() {
    const lang = this.userData.settings.language;
    const message = lang === 'ja'
      ? 'ヨロシクね！<br>好きなミュージシャンは<br>サカナクションだよ！'
      : 'Hi!<br>My favorite musician is<br>Sakanaction!';

    const popup = document.createElement('div');
    popup.id = 'characterPopup';
    popup.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
      opacity: 0;
      transition: opacity 300ms ease-out;
    `;

    popup.innerHTML = `
      <div style="
        background: white;
        border-radius: 50%;
        text-align: center;
        width: 300px;
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateY(30px) scale(0.95);
        transition: transform 300ms ease-out;
        position: relative;
        overflow: hidden;
      " id="popupCard">

        <!-- 装飾（浮かぶ絵文字） -->
        <div style="position:absolute; top:50px; left:70px; font-size:1.1rem; animation: floatUp 3s ease-in-out infinite;">✈️</div>
        <div style="position:absolute; top:45px; right:70px; font-size:1rem; animation: floatUp 3s ease-in-out 0.5s infinite;">🌸</div>
        <div style="position:absolute; bottom:100px; left:60px; font-size:1rem; animation: floatUp 3s ease-in-out 1s infinite;">⛩️</div>
        <div style="position:absolute; bottom:95px; right:60px; font-size:1.1rem; animation: floatUp 3s ease-in-out 1.5s infinite;">🗻</div>
        <div style="position:absolute; top:85px; left:50px; font-size:0.9rem; animation: floatUp 3s ease-in-out 2s infinite;">🍜</div>
        <div style="position:absolute; top:80px; right:50px; font-size:0.9rem; animation: floatUp 3s ease-in-out 0.8s infinite;">🎋</div>

        <!-- キャラクター全身画像 -->
        <img
          src="/assets/images/cat-fuji-fullbody.png"
          alt="Fuji Cat"
          style="
            width: 140px;
            height: auto;
            margin-bottom: 0.5rem;
            animation: bounceIn 500ms ease-out 200ms both;
            position: relative;
            z-index: 1;
          "
        >
        <!-- メッセージ -->
        <p style="
          font-size: 0.8rem;
          font-weight: 700;
          color: #674e41;
          margin: 0 1.5rem;
          line-height: 1.5;
          animation: fadeSlideUp 100ms ease-out 400ms both;
          position: relative;
          z-index: 1;
        ">${message}</p>
      </div>
    `;

    // タップで次の画面へ
    popup.addEventListener('click', () => {
      popup.style.opacity = '0';
      setTimeout(() => {
        popup.remove();
        this.showScreen('home');
      }, 300);
    });

    document.body.appendChild(popup);

    // アニメーション開始
    requestAnimationFrame(() => {
      popup.style.opacity = '1';
      const card = document.getElementById('popupCard');
      if (card) {
        card.style.transform = 'translateY(0) scale(1)';
      }
    });
  },

  // Cat's Chat ポップアップ
  showCatChatPopup(chat) {
    const lang = this.userData.settings.language;
    const chatText = chat.text[lang];

    // 既存のポップアップを削除
    const existingPopup = document.getElementById('catChatPopup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'catChatPopup';
    popup.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
      opacity: 0;
      transition: opacity 300ms ease-out;
    `;

    popup.innerHTML = `
      <div style="
        background: white;
        border-radius: 50%;
        text-align: center;
        width: 300px;
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateY(30px) scale(0.95);
        transition: transform 300ms ease-out;
        position: relative;
        overflow: hidden;
        padding: 3rem;
      " id="popupCard">

        <!-- キャラクター顔画像 -->
        <img
          src="/assets/images/break-cat-fuji.png"
          alt="Cat"
          style="
            width: 150px;
            height: auto;
            margin-bottom: 1rem;
            animation: bounceIn 500ms ease-out 200ms both;
            position: relative;
            z-index: 1;
          "
        >
        
        <!-- チャットテキスト -->
        <p style="
          font-size: 0.85rem;
          font-weight: 600;
          color: #674e41;
          margin: 0;
          line-height: 1.6;
          animation: fadeSlideUp 100ms ease-out 400ms both;
          position: relative;
          z-index: 1;
        ">${this.escapeHtml(chatText)}</p>
      </div>
    `;

    // タップで次の画面へ
    const self = this;
    popup.addEventListener('click', () => {
      popup.style.opacity = '0';
      setTimeout(() => {
        popup.remove();
        self.currentCategoryQuestionCount = 0;
        self.closeCatChat();
      }, 300);
    });

    document.body.appendChild(popup);

    // アニメーション開始
    requestAnimationFrame(() => {
      popup.style.opacity = '1';
      const card = document.getElementById('popupCard');
      if (card) {
        card.style.transform = 'translateY(0) scale(1)';
      }
    });
  },

  // ホーム画面
  renderHome() {
    const lang = this.userData.settings.language;
    const levelTitle = LevelSystem.getLevelTitle(this.userData.currentLevel, lang);
    const categories = QuizManager.getCategoryInfo();
    
    const title = lang === 'ja' ? 'カテゴリーを選んでね' : 'Choose a Category';
    const pointsText = lang === 'ja' ? 'ポイント' : 'Points';
    const completeText = lang === 'ja' ? '完了' : 'complete';
    
    // プログレスバーの計算
    const nextLevelPoints = LevelSystem.getPointsForNextLevel(this.userData.currentLevel);
    const currentLevelBase = (this.userData.currentLevel - 1) * 0.5;
    const progress = nextLevelPoints === Infinity ? 100 : 
      Math.min(100, ((this.userData.totalPoints - currentLevelBase) / (nextLevelPoints - currentLevelBase)) * 100);
    
    // 全6カテゴリー完了済みかどうか（Bug 3 対策：完了後はカード選択を無効化）
    const allCategoriesComplete = this.userData.completedCategories.length === 6;

    let categoriesHtml = '';
    categories.forEach(cat => {
      const prog = QuizManager.getCategoryProgress(cat.id, this.userData);
      const catName = lang === 'ja' ? cat.nameJa : cat.nameEn;

      // 全完了後はクリック不可にする（onclick を削除し、見た目も完了状態に）
      const isDisabled = allCategoriesComplete;
      const cardStyle = isDisabled
        ? 'style="opacity: 0.6; cursor: default;"'
        : '';
      const clickHandler = isDisabled
        ? ''
        : `onclick="app.startCategory('${cat.id}')"`;

      categoriesHtml += `
        <div class="category-card" ${clickHandler} ${cardStyle}>
          <span class="category-icon">${cat.icon}</span>
          <span class="category-name">${this.escapeHtml(catName)}</span>
          <div class="category-progress">
            <div class="category-progress-bar">
              <div class="category-progress-fill" style="width: ${prog.percentage}%"></div>
            </div>
            <span class="category-progress-text">${prog.answered}/${prog.total} ${completeText}</span>
          </div>
        </div>
      `;
    });
    
    return `
      <div class="header">
        <h1>WHENINJA</h1>
        <div class="profile-section">
          <div class="cat-avatar" onclick="app.showScreen('profile')">
            <img src="/assets/images/cat-fuji-basic.png" alt="Cat">
          </div>
          <div class="progress-section">
            <div>
              <span class="level-badge">Lv.${this.userData.currentLevel}</span>
              <span class="level-title">${this.escapeHtml(levelTitle)}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="points-display">
              <span>⭐</span>
              <span>${Math.floor(this.userData.totalPoints)} ${pointsText}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <h2 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--foreground);">${this.escapeHtml(title)}</h2>
        <div class="category-grid">
          ${categoriesHtml}
        </div>
      </div>
    `;
  },

  // ボトムナビ
  renderBottomNav() {
    const lang = this.userData.settings.language;
    const screens = ['home', 'collection', 'profile'];
    const activeScreen = screens.includes(this.currentScreen) ? this.currentScreen : 'home';

    return `
      <nav class="bottom-nav">
        <button class="nav-button ${activeScreen === 'home' ? 'active' : ''}" onclick="app.showScreen('home')">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>${lang === 'ja' ? 'ホーム' : 'Home'}</span>
        </button>
        <button class="nav-button ${activeScreen === 'collection' ? 'active' : ''}" onclick="app.showScreen('collection')">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          <span>${lang === 'ja' ? 'コレクション' : 'Collection'}</span>
        </button>
        <button class="nav-button ${activeScreen === 'profile' ? 'active' : ''}" onclick="app.showScreen('profile')">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>${lang === 'ja' ? 'プロフィール' : 'Profile'}</span>
        </button>
        <button class="nav-button" onclick="app.toggleTheme()">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span>${this.userData.settings.theme === 'dark' 
            ? (lang === 'ja' ? 'ライト' : 'Light')
            : (lang === 'ja' ? 'ダーク' : 'Dark')
          }</span>
        </button>
      </nav>
    `;
  },

  // XSSエスケープ
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // カテゴリー開始
  startCategory(categoryId) {
    // 全カテゴリー完了済みの場合はカテゴリー選択を無効化（Bug 3 対策）
    // → allComplete 画面から先に進めないようにする
    if (this.userData.completedCategories.length === 6) {
      this.showScreen('allComplete');
      return;
    }

    this.currentCategoryQuestionCount = 0;
    QuizManager.currentCategory = categoryId;
    this.nextQuestion(categoryId);
  },

  // 次の問題へ
  nextQuestion(categoryId) {
    const question = QuizManager.getNextQuestion(categoryId, this.userData);
    
    if (!question) {
      // カテゴリー完了
      this.onCategoryComplete(categoryId);
      return;
    }
    
    this.showScreen('quiz', { question });
  },

  // クイズ画面
  renderQuiz(question) {
    if (!question) return '<div style="padding:2rem;text-align:center;">読み込み中...</div>';
    const lang = this.userData.settings.language;

    // クイズ画像HTML（固定サイズ＋フェードイン）
    const imageHtml = question.imageUrl ? `
      <div style="
        width: 200px;
        height: 200px;
        margin: 0 auto 1.5rem;
        background: var(--muted, #f0f0f0);
        border-radius: 0.75rem;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img
          src="${question.imageUrl}"
          alt="Quiz Image"
          style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 0.75rem;
            opacity: 0;
            transition: opacity 250ms ease-in;
          "
          onload="this.style.opacity='1'"
        >
      </div>
    ` : '';

    const questionText = question.question[lang];
    
    // 現在のカテゴリーの進捗を取得
    const categoryQuestions = QuizManager.getQuestionsByCategory(QuizManager.currentCategory);
    const answeredInCategory = categoryQuestions.filter(q => this.userData.answeredQuestions[q.id]).length;
    const currentNumber = answeredInCategory + 1;
    const totalNumber = categoryQuestions.length;
    
    const progressText = lang === 'ja' 
      ? `クイズ ${currentNumber}/${totalNumber}`
      : `Question ${currentNumber}/${totalNumber}`;
    
    // カテゴリー情報
    const categoryInfo = QuizManager.getCategoryInfo().find(c => c.id === QuizManager.currentCategory);
    
    // 選択肢をシャッフル（元のインデックスを保持）
    const shuffledOptions = question.options
      .map((opt, originalIndex) => ({ ...opt, originalIndex }))
      .sort(() => Math.random() - 0.5);
    
    let optionsHtml = '';
    shuffledOptions.forEach((opt) => {
      const optText = opt.text[lang];
      optionsHtml += `
        <button class="option-button" onclick="app.selectAnswer(${opt.originalIndex})">
          ${this.escapeHtml(optText)}
        </button>
      `;
    });
    
    return `
      <div style="min-height: calc(100vh - 56px); display: flex; flex-direction: column; background: var(--background);">
        <!-- ヘッダー -->
        <div style="
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border);
        ">
          <button onclick="app.showScreen('home')" style="
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.5rem;
            color: var(--foreground);
            padding: 0.5rem;
          ">←</button>
          <span style="font-size: 0.9rem; font-weight: 700; color: var(--foreground);">${progressText}</span>
          <div style="width: 40px;"></div>
        </div>
        
        <!-- プログレスバー -->
        <div style="height: 6px; background: #e0e0e0;">
          <div style="height: 100%; background: var(--primary); width: ${(currentNumber / totalNumber) * 100}%; transition: width 300ms;"></div>
        </div>
        
        <!-- コンテンツ -->
        <div style="flex: 1; padding: 2rem 1.5rem; overflow-y: auto;">
          ${imageHtml}
          
          <!-- カテゴリーアイコン + 難易度 -->
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.25rem;">${categoryInfo.icon}</span>
            <span style="font-size: 0.9rem; color: #FFD93D;">
              ${'★'.repeat(question.difficulty)}${'☆'.repeat(3 - question.difficulty)}
            </span>
          </div>
          
          <div style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--foreground); line-height: 1.6;">
            ${this.escapeHtml(questionText)}
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
            ${optionsHtml}
          </div>
        </div>
      </div>
    `;
  },

  // 解答選択
  selectAnswer(index) {
    const result = QuizManager.checkAnswer(index);
    if (!result) return;
    
    // 解答を記録
    this.userData.answeredQuestions[QuizManager.currentQuestion.id] = {
      answered: true,
      correct: result.isCorrect || result.isConditional
    };
    
    // ポイント加算（整数）
    this.userData.totalPoints += result.points;

    // おみやげ獲得（3問正解ごと）
    let newSouvenir = null;
    if (result.isCorrect || result.isConditional) {
      // カテゴリー内の正解数をカウント
      const categoryId = QuizManager.currentCategory;
      const categoryQuestions = QuizManager.getQuestionsByCategory(categoryId);
      const correctCount = categoryQuestions.filter(q => {
        const answered = this.userData.answeredQuestions[q.id];
        return answered && answered.correct;
      }).length;
      
      // 3問正解ごとにおみやげ獲得
      if (correctCount > 0 && correctCount % 3 === 0) {
        const categorySouvenirs = LevelSystem.SOUVENIRS[categoryId] || [];
        const unownedSouvenir = categorySouvenirs.find(s => !this.userData.souvenirs.includes(s.emoji));
        
        if (unownedSouvenir) {
          this.userData.souvenirs.push(unownedSouvenir.emoji);
          newSouvenir = unownedSouvenir;
        }
      }
    }
    
    // レベルアップチェック
    const levelUpResult = LevelSystem.checkLevelUp(this.userData);
    
    Storage.save(this.userData);
    
    this.showScreen('feedback', {
      isCorrect: result.type,
      feedback: {
        simple: result.feedback.point,
        detailed: result.feedback.detail,
        comparison: result.feedback.comparison
      },
      points: result.points,
      levelUpResult: levelUpResult,
      newSouvenir: newSouvenir
    });
  },
 
  // フィードバック画面
  renderFeedback(params) {
    this.currentFeedbackParams = params; 
    const lang = this.userData.settings.language;
    const { isCorrect, feedback, points } = params;
    
    // アイコン、画像、テキスト
    let icon, iconBg, iconColor, title, pointsText, catImage;
    
    if (isCorrect === 'best') {
      icon = '◎';
      iconBg = '#E8F5E9';
      iconColor = '#4CAF50';
      title = lang === 'ja' ? 'さいこう！' : 'Awesome!';
      pointsText = `+${points} pts`;
      catImage = '/assets/images/cat-fuji-celebrate.png';
    } else if (isCorrect === 'conditional') {
      icon = '◯';
      iconBg = '#FFF9E6';
      iconColor = '#FFB800';
      title = lang === 'ja' ? 'イイネ！' : 'Good!';
      pointsText = `+${points} pts`;
      catImage = '/assets/images/cat-fuji-happy.png';
    } else {
      icon = '✕';
      iconBg = '#FFEBEE';
      iconColor = '#F44336';
      title = lang === 'ja' ? 'おっと...' : 'Oh...';
      pointsText = '';
      catImage = '/assets/images/cat-fuji-thinking.png';
    }
    
    const simpleTitle = lang === 'ja' ? 'シンプル説明' : 'Simple Explanation';
    const detailedTitle = lang === 'ja' ? 'もっと詳しく' : 'Detailed Explanation';
    const nextBtnText = lang === 'ja' ? '次のクイズ' : 'Next Question';
    const backBtnText = lang === 'ja' ? 'カテゴリーに戻る' : 'Back to Categories';
    
    return `
      <div style="
        min-height: calc(100vh - 56px);
        display: flex;
        flex-direction: column;
        background: var(--background);
        padding: 1.5rem 1.5rem;
      ">
        <!-- 猫の顔 + アイコン -->
        <div style="
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 1rem;
          animation: scaleIn 400ms ease-out;
        ">
          <!-- 猫の顔 -->
          <img 
            src="${catImage}" 
            alt="Cat"
            style="
              width: 100%;
              height: 100%;
              object-fit: contain;
            "
          >
          <!-- ◎◯✕ -->
          <div style="
            position: absolute;
            top: -10px;
            right: -10px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: ${iconBg};
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounceIcon 500ms ease-out 200ms;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ">
            <span style="
              font-size: 2.5rem;
              font-weight: 700;
              color: ${iconColor};
            ">${icon}</span>
          </div>
        </div>
        
        <!-- タイトル -->
        <h2 style="
          font-size: 1.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        ">${title}</h2>
        
        <!-- ポイント表示 -->
        ${pointsText ? `
          <div style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: #FFD93D;
            color: #4A3428;
            padding: 0.5rem 1.25rem;
            border-radius: 9999px;
            font-weight: 800;
            font-size: 1rem;
            margin: 0 auto 1.25rem;
            animation: slideUp 400ms ease-out 300ms both;
          ">
            <span>🌟</span>
            <span>${pointsText}</span>
          </div>
        ` : '<div style="height: 1rem;"></div>'}
     
      
        <!-- シンプル説明 -->
        <div style="
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 1rem;
        ">
          <p style="
            font-size: 0.95rem;
            line-height: 1.7;
            font-weight: 600;
            color: var(--foreground);
          ">${this.escapeHtml(feedback.simple[lang])}</p>
        </div>
        
        <!-- 詳しい説明（アコーディオン） -->
        <details style="
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 2rem;
        ">
          <summary style="
            font-size: 0.875rem;
            font-weight: 700;
            color: var(--muted-foreground);
            cursor: pointer;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
            ${detailedTitle}
            <span style="color: var(--muted-foreground);">▼</span>
          </summary>
          <p style="
            font-size: 0.95rem;
            line-height: 1.7;
            color: var(--foreground);
            margin-top: 1rem;
          ">${this.escapeHtml(feedback.detailed[lang])}</p>
          
          ${feedback.comparison && feedback.comparison[lang] ? `
            <div style="
              background: var(--card);
              border-left: 3px solid var(--primary);
              border-radius: 0.5rem;
              padding: 0.75rem;
              margin-top: 1rem;
              font-size: 0.85rem;
              line-height: 1.6;
              color: var(--foreground);
            ">${this.escapeHtml(feedback.comparison[lang])}</div>
          ` : ''}
        </details>
        
        <!-- ボタン -->
        <div style="margin-top: auto;">
          <button 
            onclick="app.continueFromFeedback()"
            style="
              width: 100%;
              background: var(--primary);
              color: white;
              border: none;
              border-radius: 1rem;
              padding: 1rem;
              font-size: 1rem;
              font-weight: 800;
              cursor: pointer;
              margin-bottom: 0.75rem;
            "
          >${nextBtnText}</button>
          
          <button 
            onclick="app.showScreen('home')"
            style="
              width: 100%;
              background: var(--card);
              color: var(--muted-foreground);
              border: 1px solid var(--border);
              border-radius: 1rem;
              padding: 1rem;
              font-size: 0.9rem;
              font-weight: 700;
              cursor: pointer;
            "
          >${backBtnText}</button>
        </div>
      </div>
    `;
  },

  // フィードバック画面から続ける
  continueFromFeedback() {
    const params = this.currentFeedbackParams || {};
    
    // カウンター更新（正解時のみ、最初に実行）
    if (params.isCorrect === 'best' || params.isCorrect === 'conditional') {
      this.currentCategoryQuestionCount++;
    }

    // おみやげ獲得があればポップアップを表示
    // ※ body に直接追加することで mainContent の transform/opacity の影響を受けないようにする
    if (params.newSouvenir) {
      const souvenirEl = document.createElement('div');
      souvenirEl.innerHTML = this.renderSouvenirGet(params.newSouvenir);
      document.body.appendChild(souvenirEl.firstElementChild);
      return;
    }

    // レベルアップしていたら先にレベルアップ画面を表示
    if (params.levelUpResult && params.levelUpResult.leveledUp) {
      this.showScreen('levelUp', params.levelUpResult);
      return;
    }

    // Cat's Chat チェック（3問正解ごとに50%の確率）
    if (this.currentCategoryQuestionCount > 0 && this.currentCategoryQuestionCount % 3 === 0 && Math.random() < 0.5) {
      const chat = QuizManager.getRandomChatForCategory(QuizManager.currentCategory);
      if (chat) {
        this.showCatChatPopup(chat);
        return;
      }
    }
    
    // 次の問題へ
    const question = QuizManager.getNextQuestion(QuizManager.currentCategory, this.userData);
    
    if (!question) {
      // カテゴリー完了
      this.onCategoryComplete(QuizManager.currentCategory);
      return;
    }
    
    this.showScreen('quiz', { question });
  },

  // Cat's Chatを閉じる
  closeCatChat() {
    // ポップアップを削除
    const popup = document.querySelector('.character-popup-overlay');
    if (popup) popup.remove();
    
    // カウンターをリセット
    this.currentCategoryQuestionCount = 0;
    
    // 次の問題へ
    const question = QuizManager.getNextQuestion(QuizManager.currentCategory, this.userData);
    
    if (!question) {
      this.onCategoryComplete(QuizManager.currentCategory);
      return;
    }
    
    this.showScreen('quiz', { question });
  },

  // おみやげ獲得ポップアップ
  renderSouvenirGet(souvenir) {
    const lang = this.userData.settings.language;
    const title = lang === 'ja' ? 'おみやげゲット！' : 'Souvenir Get!';
    const buttonText = lang === 'ja' ? 'やった！' : 'Yay!';
    
    return `
      <div id="souvenirPopup" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 300ms ease-out;
      " onclick="app.closeSouvenirPopup()">

        <div style="
          background: var(--card);
          border-radius: 1.5rem;
          padding: 1.5rem;
          width: 280px;
          height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
          animation: scaleIn 400ms ease-out;
        " onclick="event.stopPropagation()">

          <h2 style="
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--foreground);
            margin: 0;
          ">${this.escapeHtml(title)}</h2>
          
          <div>
            <div style="font-size: 4rem; margin-bottom: 0.5rem;">${souvenir.emoji}</div>
            <div style="
              font-size: 1rem;
              font-weight: 400;
              color: var(--foreground);
            ">${this.escapeHtml(souvenir.name[lang])}</div>
          </div>
          
          <button 
            onclick="app.closeSouvenirPopup()"
            style="
              width: 100%;
              margin: 0;
              background: var(--primary);
              color: white;
              border: none;
              border-radius: 1rem;
              padding: 1rem;
              font-size: 1rem;
              font-weight: 800;
              cursor: pointer;
            "
          >${this.escapeHtml(buttonText)}</button>
        </div>
      </div>
    `;
  },

  // おみやげポップアップを閉じる
  closeSouvenirPopup() {
    // IDでポップアップを特定（querySelector の誤検出を防ぐ）
    const popup = document.getElementById('souvenirPopup');
    // ポップアップが存在しない場合はアーリーリターン
    // → ダブルタップ時に snack popup を誤削除 & continueAfterSouvenir 二重実行を防ぐ
    if (!popup) return;
    popup.remove();

    // 次の処理へ
    this.continueAfterSouvenir();
  },

  // おみやげポップアップの後の処理
  continueAfterSouvenir() {
    const params = this.currentFeedbackParams || {};
    
    // レベルアップチェック
    if (params.levelUpResult && params.levelUpResult.leveledUp) {
      this.showScreen('levelUp', params.levelUpResult);
      return;
    }
    
    // Cat's Chat チェック（3問正解ごとに50%の確率）
    if (this.currentCategoryQuestionCount > 0 && this.currentCategoryQuestionCount % 3 === 0 && Math.random() < 0.5) {
      const chat = QuizManager.getRandomChatForCategory(QuizManager.currentCategory);
      if (chat) {
        this.showCatChatPopup(chat);
        return;
      }
    }

    // 次の問題へ
    const question = QuizManager.getNextQuestion(QuizManager.currentCategory, this.userData);

    if (!question) {
      this.onCategoryComplete(QuizManager.currentCategory);
      return;
    }

    this.showScreen('quiz', { question });
  },

  // スナック獲得ポップアップ
  renderSnackGet(snack) {
    const lang = this.userData.settings.language;
    const title = lang === 'ja' ? 'スナックゲット！' : 'Snack Get!';
    const buttonText = lang === 'ja' ? 'おいしい！' : 'Yummy!';
    
    return `
      <div id="snackPopup" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 300ms ease-out;
      " onclick="app.closeSnackPopup()">

        <div style="
          background: var(--card);
          border-radius: 1.5rem;
          padding: 2rem;
          max-width: 400px;
          text-align: center;
          animation: scaleIn 400ms ease-out;
        " onclick="event.stopPropagation()">

          <div style="
            font-size: 0.8rem;
            color: var(--muted-foreground);
            margin-bottom: 0.5rem;
          ">${lang === 'ja' ? 'カテゴリーコンプリート' : 'Category Complete'}</div>

          <h2 style="
            font-size: 1.25rem;
            font-weight: 800;
            margin-bottom: 1.2rem;
            color: var(--foreground);
          ">${this.escapeHtml(title)}</h2>
          
          <div style="
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, #FFE8E8 0%, #FFC2C2 100%);
            border: 3px solid #FF9999;
            border-radius: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
          ">
            <div style="font-size: 4rem;">${snack.emoji}</div>
          </div>
          
          <div style="
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--foreground);
            margin-bottom: 1rem;
          ">${this.escapeHtml(snack.name[lang])}</div>
          
          <button 
            onclick="app.closeSnackPopup()"
            style="
              width: 100%;
              background: var(--primary);
              color: white;
              border: none;
              border-radius: 1rem;
              padding: 1rem;
              font-size: 1rem;
              font-weight: 800;
              cursor: pointer;
            "
          >${this.escapeHtml(buttonText)}</button>
        </div>
      </div>
    `;
  },

  // スナックポップアップを閉じる
  closeSnackPopup() {
    // IDでポップアップを特定
    const popup = document.getElementById('snackPopup');
    // ポップアップが存在しない場合はアーリーリターン
    // → ダブルタップ時に continueAfterCategoryComplete が二重実行されるのを防ぐ
    if (!popup) return;
    popup.remove();

    // スナック変数をクリア
    this.currentSnack = null;

    // カテゴリー完了後の画面遷移
    this.continueAfterCategoryComplete();
  },

  // カテゴリー完了後の処理
  continueAfterCategoryComplete() {
    // 全カテゴリー完了チェック
    if (this.userData.completedCategories.length === 6) {
      this.showScreen('allComplete');
    } else {
      this.showScreen('home');
    }
  },

  // カテゴリー完了時
  // ─ スナック獲得ロジック ─────────────────────────────────
  // 【条件】カテゴリーが初めて完了したとき（completedCategories に未登録）
  // 【タイミング】
  //   1. continueFromFeedback で次の問題がなくなったとき
  //   2. continueLevelUp で次の問題がなくなったとき
  //   3. closeCatChat で次の問題がなくなったとき
  //   4. continueAfterSouvenir で次の問題がなくなったとき
  // 【保存】スナックは必ず userData.snacks に保存（重複は除外）
  // 【表示】スナックポップアップを body に直接追加してから return
  //         closeSnackPopup → continueAfterCategoryComplete で画面遷移
  // ────────────────────────────────────────────────────────
  onCategoryComplete(categoryId) {
    // 完了済みカテゴリーに追加（初回のみ）
    if (!this.userData.completedCategories.includes(categoryId)) {
      this.userData.completedCategories.push(categoryId);

      // スナック獲得（未所持を優先してランダムに1つ選ぶ）
      // → 既所持スナックが選ばれてもポップアップは出るがコレクションが増えないバグを防ぐ
      const ownedSnackEmojis = this.userData.snacks || [];
      const unownedSnacks = LevelSystem.SNACKS.filter(s => !ownedSnackEmojis.includes(s.emoji));
      const snackPool = unownedSnacks.length > 0 ? unownedSnacks : LevelSystem.SNACKS;
      const snack = snackPool[Math.floor(Math.random() * snackPool.length)];
      this.currentSnack = snack;

      // userData.snacks に追加（未所持の場合のみ）
      if (!ownedSnackEmojis.includes(snack.emoji)) {
        this.userData.snacks.push(snack.emoji);
      }

      Storage.save(this.userData);

      // 既存のスナックポップアップが残っていれば先に削除（念のため）
      const existing = document.getElementById('snackPopup');
      if (existing) existing.remove();

      // スナックポップアップを body に直接追加
      // ※ mainContent の transform/opacity に依存しないよう body 直下に配置
      const snackEl = document.createElement('div');
      snackEl.innerHTML = this.renderSnackGet(snack);
      document.body.appendChild(snackEl.firstElementChild);
      return; // closeSnackPopup → continueAfterCategoryComplete で遷移
    }

    // すでに完了済みの場合（再クリック等）はそのまま遷移
    this.continueAfterCategoryComplete();
  },

  // レベルアップ画面
  renderLevelUp(levelUpData) {
    const lang = this.userData.settings.language;
    const levelTitle = LevelSystem.getLevelTitle(levelUpData.newLevel, lang);
    const congratsText = lang === 'ja' ? 'レベルアップおめでとう！' : 'Level Up! Congratulations!';
    const levelUpText = lang === 'ja' ? `レベルアップ！ Lv.${levelUpData.newLevel}` : `Level Up! Lv.${levelUpData.newLevel}`;
    const continueText = lang === 'ja' ? '続ける' : 'Continue';
    
    // 次のレベルまでのポイント
    const nextLevelPoints = LevelSystem.getPointsForNextLevel(levelUpData.newLevel);
    const currentPoints = Math.floor(this.userData.totalPoints);
    const nextLevelText = nextLevelPoints === Infinity 
      ? (lang === 'ja' ? '最高レベル！' : 'Max Level!')
      : `${currentPoints} / ${nextLevelPoints} ${lang === 'ja' ? 'ポイント' : 'Points'}`;
    
    // 統計情報
    const totalAnswered = Object.keys(this.userData.answeredQuestions).length;
    const completedCategories = this.userData.completedCategories.length;
    
    const statsLabels = {
      totalPoints: lang === 'ja' ? '合計ポイント' : 'Total Points',
      quizCompleted: lang === 'ja' ? 'クイズ完了' : 'Quiz Completed',
      categories: lang === 'ja' ? 'カテゴリー完了' : 'Category Completed'
    };
    
    return `
      <div style="
        min-height: calc(100vh - 56px);
        display: flex;
        flex-direction: column;
        background: var(--bg-celebrate);
        padding: 2rem 1.5rem;
      ">
        <!-- 猫の画像 -->
        <div style="width: 120px; margin: 0 auto 0rem;">
          <img src="/assets/images/cat-fuji-happy.png" alt="Happy Cat" style="width: 100%; height: auto;">
        </div>
        
        <!-- おめでとう -->
        <h2 style="
          font-size: 1.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 1rem;
          color: var(--primary);
        ">${this.escapeHtml(congratsText)}</h2>
        
        <!-- 白い角丸ボックス -->
        <div style="
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 2rem;
        ">

        <!-- 次のレベルまでのポイント -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="
            background: var(--primary);
            color: white;
            padding: 0.4rem 1rem;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 700;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          ">
            <span>Lv.${levelUpData.newLevel}</span>
            <span>${this.escapeHtml(levelTitle)}</span>
          </div>
          <div style="
            font-size: 0.8rem;
            color: var(--muted-foreground);
            margin-bottom: 0.4rem;
          ">${nextLevelText}</div>
          ${nextLevelPoints !== Infinity ? `
            <div style="
              height: 6px;
              background: #E0E0E0;
              border-radius: 9999px;
              overflow: hidden;
              max-width: 250px;
              margin: 0 auto;
            ">
              <div style="
                height: 100%;
                background: var(--primary);
                width: ${Math.min(100, (currentPoints / nextLevelPoints) * 100)}%;
                transition: width 300ms;
              "></div>
            </div>
          ` : ''}
        </div>
        
        <!-- 統計情報 -->
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          ">
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">⭐</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${currentPoints}</div>
            <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.totalPoints}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">✓</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${totalAnswered}</div>
            <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.quizCompleted}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">🏆</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${completedCategories}</div>
            <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.categories}</div>
          </div>
        </div>
        </div>
        
        <!-- 続けるボタン -->
        <button 
          onclick="app.continueLevelUp()"
          style="
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 1rem;
            padding: 1rem;
            font-size: 1rem;
            font-weight: 800;
            cursor: pointer;
          "
        >${this.escapeHtml(continueText)}</button>
      </div>
    `;
  },

  // レベルアップ後
  continueLevelUp() {
    const question = QuizManager.getNextQuestion(QuizManager.currentCategory, this.userData);

    if (!question) {
      this.onCategoryComplete(QuizManager.currentCategory);
      return;
    }

    this.showScreen('quiz', { question });
  },

  // 全カテゴリー完了画面
  renderAllComplete() {
    const lang = this.userData.settings.language;
    const congratsText = lang === 'ja' ? 'すべてのカテゴリーをクリア！' : 'All Categories Complete!';
    const messageText = lang === 'ja' ? 'もうぼくらは友達だね！' : 'We are friends now!';

    const mvpText = lang === 'ja' ?
    '💛 MVP版を試してくれてありがとう！<br>ぜひあなたの感想やリクエストを聞かせてね！<br>そして次はあなたの国のWHENINJAを作って<br>ぼくにもプレイさせてね！<br>ぼくの夢はWHENINJAで世界中のみんなと<br>文化やマナーをシェアしてなかよくなることなんだ！' :
    '💛 Thank you for trying the MVP!<br>Please share your feedback and requests!<br>And next, create a WHENINJA for your country and let me play it too!<br>My dream is to share culture and manners with people all over the world through WHENINJA and become friends!';
    const homeText = lang === 'ja' ? 'ホームへ' : 'Go Home';
    
    // 統計情報
    const currentPoints = Math.floor(this.userData.totalPoints);
    const totalAnswered = Object.keys(this.userData.answeredQuestions).length;
    const completedCategories = this.userData.completedCategories.length;
    
    const statsLabels = {
      totalPoints: lang === 'ja' ? '合計ポイント' : 'Total Points',
      quizCompleted: lang === 'ja' ? 'クイズ完了' : 'Quiz Completed',
      categories: lang === 'ja' ? 'カテゴリー完了' : 'Category Completed'
    };
    
    const html = `
      <div style="
        min-height: calc(100vh - 70px);
        display: flex;
        flex-direction: column;
        background: var(--bg-celebrate);
        padding: 2rem 1.5rem 5rem;
        position: relative;
        overflow: hidden;
      ">
      
        <!-- 紙吹雪 -->
        <div class="confetti-container"></div>

        <!-- 猫の画像 -->
        <div style="width: 120px; margin: 0 auto 1rem;">
          <img src="/assets/images/cat-fuji-celebrate.png" alt="Celebrate Cat" style="width: 100%; height: auto;">
        </div>
        
        <!-- おめでとう -->
        <h2 style="
          font-size: 1.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.5rem;
          color: var(--primary);
        ">${this.escapeHtml(congratsText)}</h2>
        
        <!-- メッセージ -->
        <div style="
          font-size: 1.125rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        ">${this.escapeHtml(messageText)}</div>
        
        <!-- レベル表示 -->
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="
            background: var(--primary);
            color: white;
            padding: 0.4rem 1rem;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 700;
            font-size: 0.9rem;
          ">
            <span>Lv.${this.userData.currentLevel}</span>
            <span>${LevelSystem.getLevelTitle(this.userData.currentLevel, lang)}</span>
          </div>
        </div>
        
        <!-- 統計情報 -->
        <div style="
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        ">
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
          ">
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">⭐</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${currentPoints}</div>
              <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.totalPoints}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">✓</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${totalAnswered}</div>
              <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.quizCompleted}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">🏆</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${completedCategories}</div>
              <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.categories}</div>
            </div>
          </div>
        </div>
        
        <!-- MVP感謝メッセージ -->
        <div style="
          background: var(--card);
          border: 2px solid #FFD93D;
          border-radius: 1rem;
          padding: 1rem;
          font-size: 0.8rem;
          line-height: 1.7;
          color: var(--foreground);
          text-align: center;
          margin: 0 auto 1.5rem;
          max-width: 350px;
        ">${mvpText}</div>
        
        <!-- ホームへボタン -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 300px; margin: 0 auto;">
          <button onclick="app.showScreen('home')" style="
            width: 100%;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 1rem;
            padding: 1rem;
            font-size: 1rem;
            font-weight: 800;
            cursor: pointer;
          ">${this.escapeHtml(homeText)}</button>
          
          <button onclick="app.shareApp()" style="
            width: 100%;
            background: var(--card);
            border: 2px solid var(--primary);
            color: var(--foreground);
            border-radius: 1rem;
            padding: 1rem;
            font-size: 1rem;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>${lang === 'ja' ? '友達にシェア' : 'Share with Friends'}</span>
          </button>
        </div>
    `;

    // 紙吹雪を生成
    setTimeout(() => {
      const container = document.querySelector('.confetti-container');
      if (container) {
        for (let i = 0; i < 15; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'confetti';
          container.appendChild(confetti);
        }
      }
    }, 100);
    
    return html;
  },

  // プロフィール画面
  renderProfile() {
    const lang = this.userData.settings.language;
    const levelTitle = LevelSystem.getLevelTitle(this.userData.currentLevel, lang);
    
    // 次のレベルまでのポイント
    const nextLevelPoints = LevelSystem.getPointsForNextLevel(this.userData.currentLevel);
    const currentPoints = Math.floor(this.userData.totalPoints);
    const nextLevelText = nextLevelPoints === Infinity 
      ? (lang === 'ja' ? '最高レベル！' : 'Max Level!')
      : `${currentPoints} / ${nextLevelPoints} ${lang === 'ja' ? 'ポイント' : 'Points'}`;
    
    // 統計情報
    const totalAnswered = Object.keys(this.userData.answeredQuestions).length;
    const completedCategories = this.userData.completedCategories.length;
    
    const statsLabels = {
      totalPoints: lang === 'ja' ? '合計ポイント' : 'Total Points',
      quizCompleted: lang === 'ja' ? 'クイズ完了' : 'Quiz Completed',
      categories: lang === 'ja' ? 'カテゴリー完了' : 'Category Completed'
    };
    
    return `
      <div style="min-height: calc(100vh - 56px); display: flex; flex-direction: column; background: var(--background);">
        <!-- ヘッダー -->
        <div style="
          background: var(--card);
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid var(--border);
        ">
          <h1 style="
            font-size: 1.125rem;
            font-weight: 800;
            color: var(--foreground);
          ">${lang === 'ja' ? 'プロフィール' : 'Profile'}</h1>
        </div>
        
        <!-- メインコンテンツ -->
        <div style="flex: 1; padding: 1.25rem 1.5rem; padding-bottom: calc(56px + 1rem); overflow-y: auto;">
          <!-- 猫の画像 -->
          <div style="width: 100px; margin: 0 auto 1rem;">
            <img src="/assets/images/cat-fuji-fullbody.png" alt="Cat" style="width: 100%; height: auto;">
          </div>
          
          <!-- レベル表示 -->
          <div style="text-align: center; margin-bottom: 0.75rem;">
            <div style="
              background: var(--primary);
              color: white;
              padding: 0.4rem 1rem;
              border-radius: 9999px;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              font-weight: 700;
              font-size: 0.9rem;
            ">
              <span>Lv.${this.userData.currentLevel}</span>
              <span>${this.escapeHtml(levelTitle)}</span>
            </div>
          </div>
          
          <!-- 次のレベルまでのポイント -->
          <div style="text-align: center; margin-bottom: 1.25rem;">
            <div style="
              font-size: 0.8rem;
              color: var(--muted-foreground);
              margin-bottom: 0.4rem;
            ">${nextLevelText}</div>
            ${nextLevelPoints !== Infinity ? `
              <div style="
                height: 6px;
                background: #E0E0E0;
                border-radius: 9999px;
                overflow: hidden;
                max-width: 250px;
                margin: 0 auto;
              ">
                <div style="
                  height: 100%;
                  background: var(--primary);
                  width: ${Math.min(100, (currentPoints / nextLevelPoints) * 100)}%;
                  transition: width 300ms;
                "></div>
              </div>
            ` : ''}
          </div>
          
          <!-- 統計情報 -->
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-bottom: 1.25rem;
          ">
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">⭐</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${currentPoints}</div>
              <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.totalPoints}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">✓</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${totalAnswered}</div>
              <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.quizCompleted}</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 1.5rem; margin-bottom: 0.15rem;">🏆</div>
              <div style="font-size: 1.25rem; font-weight: 700; color: var(--foreground);">${completedCategories}</div>
              <div style="font-size: 0.7rem; color: var(--muted-foreground);">${statsLabels.categories}</div>
            </div>
          </div>
          
          <!-- メニューボタン -->
          <div style="display: flex; flex-direction: column; gap: 0.6rem; max-width: 400px; margin: 0 auto;">
            <button 
              onclick="app.showScreen('collection')"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: 0.75rem;
                padding: 0.85rem 1rem;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--foreground);
              "
            >
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                <span>${lang === 'ja' ? 'コレクションを見る' : 'View Collection'}</span>
              </div>
              <span style="color: var(--muted-foreground);">›</span>
            </button>
            
            <button 
              onclick="app.showCharacterChangeSoon()"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: 0.75rem;
                padding: 0.85rem 1rem;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--foreground);
              "
            >
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>${lang === 'ja' ? 'キャラクター変更' : 'Change Character'}</span>
              </div>
              <span style="color: var(--muted-foreground);">›</span>
            </button>
          
            <button 
              onclick="app.toggleLanguage()"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: 0.75rem;
                padding: 0.85rem 1rem;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--foreground);
              "
            >
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>${lang === 'ja' ? '言語切り替え' : 'Change Language'}</span>
              </div>
              <span style="color: var(--primary); font-size: 0.85rem; font-weight: 700;">${lang === 'ja' ? '日本語' : 'English'}</span>
            </button>

            <button 
              onclick="app.shareApp()"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: 0.75rem;
                padding: 0.85rem 1rem;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--foreground);
              "
            >
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>${lang === 'ja' ? '友達にシェア' : 'Share with Friends'}</span>
              </div>
              <span style="color: var(--muted-foreground);">›</span>
            </button>
            
            <button 
              onclick="app.confirmReset()"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                background: transparent;
                border: 1px solid #FF6B6B;
                border-radius: 0.75rem;
                padding: 0.75rem 1rem;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 600;
                color: #FF6B6B;
                margin-top: 0.5rem;
              "
            >
              <span>⚠️</span>
              <span>${lang === 'ja' ? 'データをリセット' : 'Reset Data'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // キャラクター変更SOON通知
  showCharacterChangeSoon() {
    const lang = this.userData.settings.language;
    const message = lang === 'ja'
      ? '🔜 他のガイドねこは近日公開予定だよ！お楽しみに！'
      : '🔜 Other guide cats will be released soon! Stay tuned!';
    alert(message);
  },

  // アプリをシェア
  shareApp() {
    const lang = this.userData.settings.language;
    const url = window.location.href;
    
    // URLをコピー
    navigator.clipboard.writeText(url).then(() => {
      const message = lang === 'ja' 
        ? '📋 URLをコピーしました！' 
        : '📋 URL copied!';
      alert(message);
    }).catch(() => {
      // フォールバック
      const message = lang === 'ja'
        ? `以下のURLをシェアしてね：\n${url}`
        : `Share this URL:\n${url}`;
      alert(message);
    });
  },
  
  // データリセット確認
  confirmReset() {
    const lang = this.userData.settings.language;
    const message = lang === 'ja'
      ? '本当にすべてのデータをリセットしますか？\nこの操作は取り消せません。'
      : 'Are you sure you want to reset all data?\nThis action cannot be undone.';
    
    if (confirm(message)) {
      this.resetAllData();
    }
  },

  // すべてのデータをリセット
  resetAllData() {
    localStorage.clear();
    location.reload();
  },

  // コレクション画面
  renderCollection() {
    const lang = this.userData.settings.language;
    const title = lang === 'ja' ? 'コレクション' : 'Collection';
    
    // 獲得済みのおみやげとスナック
    const ownedSouvenirs = this.userData.souvenirs || [];
    const ownedSnacks = this.userData.snacks || [];
    
    const souvenirCount = ownedSouvenirs.length;
    const snackCount = ownedSnacks.length;
    const totalCount = souvenirCount + snackCount;
    
    const collectedText = lang === 'ja' 
      ? `${totalCount}/38 獲得`
      : `${totalCount}/38 collected`;
    
    const souvenirsText = lang === 'ja' ? 'おみやげ' : 'Souvenirs';
    const snacksText = lang === 'ja' ? 'スナック' : 'Snacks';
    
    // おみやげ（カテゴリー別）
    let souvenirsHtml = '';
    LevelSystem.CATEGORIES.forEach(catId => {
      const categoryItems = LevelSystem.SOUVENIRS[catId] || [];
      const categoryName = QuizManager.getCategoryInfo().find(c => c.id === catId);
      const catTitle = lang === 'ja' ? categoryName.nameJa : categoryName.nameEn;
      
      souvenirsHtml += `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--muted-foreground); margin-bottom: 0.4rem;">
            ${this.escapeHtml(catTitle)}
          </h3>
           <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem;">
            ${categoryItems.map(item => {
              const isOwned = ownedSouvenirs.includes(item.emoji);
              return `
                <div style="text-align: center;">
                  <div style="
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    background: ${isOwned ? 'white' : '#f5f5f5'};
                    border: 2px solid ${isOwned ? 'var(--border)' : '#e0e0e0'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    ${isOwned ? '' : 'filter: grayscale(100%); opacity: 0.4;'}
                  ">
                    ${isOwned ? `<div style="font-size: 2rem;">${item.emoji}</div>` : `<div style="font-size: 1.5rem; color: #ccc;">🔒</div>`}
                  </div>
                  <div style="font-size: 0.65rem; color: var(--muted-foreground);">
                    ${isOwned ? this.escapeHtml(item.name[lang]) : '???'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });
    
    if (souvenirsHtml === '') {
      souvenirsHtml = `
        <p style="text-align: center; color: var(--muted-foreground); margin: 3rem 0;">
          ${lang === 'ja' ? 'まだおみやげがありません' : 'No items yet'}
        </p>
      `;
    }
    
    // スナック
    const allSnacks = LevelSystem.SNACKS;
    let snacksHtml = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem;">
        ${allSnacks.map(item => {
          const isOwned = ownedSnacks.includes(item.emoji);
          return `
            <div style="text-align: center;">
              <div style="
                width: 64px;
                height: 64px;
                border-radius: 12px;
                background: ${isOwned ? 'white' : '#f5f5f5'};
                border: 2px solid ${isOwned ? 'var(--border)' : '#e0e0e0'};
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 0.5rem;
                ${isOwned ? '' : 'filter: grayscale(100%); opacity: 0.4;'}
              ">
                ${isOwned ? `<div style="font-size: 2rem;">${item.emoji}</div>` : `<div style="font-size: 1.5rem; color: #ccc;">🔒</div>`}
              </div>
              <div style="font-size: 0.65rem; color: var(--muted-foreground);">
                ${isOwned ? this.escapeHtml(item.name[lang]) : '???'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    return `
      <div style="display: flex; flex-direction: column; min-height: calc(100vh - 56px);">
        <!-- ヘッダー -->
        <div style="
          background: var(--card);
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <h1 style="font-size: 1.125rem; font-weight: 800; color: var(--foreground);">${this.escapeHtml(title)}</h1>
          <span id="collectionCount" style="font-size: 0.75rem; color: var(--primary); background: hsl(174, 52%, 95%); padding: 0.35rem 0.75rem; border-radius: 9999px; font-weight: 700;">
            ${lang === 'ja' ? `${souvenirCount}/30 獲得` : `${souvenirCount}/30 collected`}
          </span>
        </div>
        
        <!-- タブ -->
        <div style="
          background: var(--card);
          display: flex;
          gap: 0.5rem;
          padding: 0 1.5rem;
          border-bottom: 2px solid var(--border);
        ">
          <button 
            id="tabSouvenirs" 
            onclick="app.switchCollectionTab('souvenirs')"
            style="
              flex: 1;
              background: none;
              border: none;
              border-bottom: 3px solid var(--primary);
              padding: 0.75rem;
              font-size: 0.9rem;
              font-weight: 700;
              color: var(--primary);
              cursor: pointer;
              margin-bottom: -2px;
            "
          >${souvenirsText}</button>
          <button 
            id="tabSnacks" 
            onclick="app.switchCollectionTab('snacks')"
            style="
              flex: 1;
              background: none;
              border: none;
              border-bottom: 3px solid transparent;
              padding: 0.75rem;
              font-size: 0.9rem;
              font-weight: 700;
              color: var(--muted-foreground);
              cursor: pointer;
              margin-bottom: -2px;
            "
          >${snacksText}</button>
        </div>
        
        <!-- コンテンツ -->
        <div style="flex: 1; padding: 1rem 1.5rem; padding-bottom: calc(56px + 0.75rem); overflow-y: auto;">
          <div id="collectionContent">
            ${souvenirsHtml}
          </div>
          
          <!-- スナックコンテンツ（非表示） -->
          <div id="snacksContent" style="display: none;">
            ${snacksHtml}
          </div>
        </div>
      </div>
    `;
  },

  // コレクションタブ切り替え
  switchCollectionTab(tab) {
    const lang = this.userData.settings.language;
    const tabSouvenirs = document.getElementById('tabSouvenirs');
    const tabSnacks = document.getElementById('tabSnacks');
    const collectionContent = document.getElementById('collectionContent');
    const snacksContent = document.getElementById('snacksContent');
    const countBadge = document.getElementById('collectionCount');
    
    const souvenirCount = (this.userData.souvenirs || []).length;
    const snackCount = (this.userData.snacks || []).length;
    
    if (tab === 'souvenirs') {
      // おみやげタブ
      tabSouvenirs.style.borderBottomColor = 'var(--primary)';
      tabSouvenirs.style.color = 'var(--primary)';
      tabSnacks.style.borderBottomColor = 'transparent';
      tabSnacks.style.color = 'var(--muted-foreground)';
      collectionContent.style.display = 'block';
      snacksContent.style.display = 'none';
      countBadge.textContent = lang === 'ja' ? `${souvenirCount}/30 獲得` : `${souvenirCount}/30 collected`;
    } else {
      // スナックタブ
      tabSouvenirs.style.borderBottomColor = 'transparent';
      tabSouvenirs.style.color = 'var(--muted-foreground)';
      tabSnacks.style.borderBottomColor = 'var(--primary)';
      tabSnacks.style.color = 'var(--primary)';
      collectionContent.style.display = 'none';
      snacksContent.style.display = 'block';
      countBadge.textContent = lang === 'ja' ? `${snackCount}/8 獲得` : `${snackCount}/8 collected`;
    }
  },

  // 言語メニューの開閉
  toggleLangMenu() {
    const menu = document.getElementById('langMenu');
    if (menu) {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
  },

  // 言語を設定
  setLanguage(lang) {
    this.userData.settings.language = lang;
    Storage.save(this.userData);

    // メニューを閉じる
    const menu = document.getElementById('langMenu');
    if (menu) menu.style.display = 'none';

    // ボタンのテキストだけ更新
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = `🌐 ${lang === 'ja' ? 'JP' : 'EN'}`;

    // サブテキストを更新
    const subTextEl = document.getElementById('welcomeSubText');
    if (subTextEl) subTextEl.textContent = TEXTS.welcome.subText[lang];

    // チェックマークを更新
    const checkEn = document.getElementById('checkEn');
    const checkJa = document.getElementById('checkJa');
    if (checkEn) checkEn.style.display = lang === 'en' ? 'inline' : 'none';
    if (checkJa) checkJa.style.display = lang === 'ja' ? 'inline' : 'none';

    // 選択中の背景色を更新
    const rowEn = document.getElementById('rowEn');
    const rowJa = document.getElementById('rowJa');
    if (rowEn) rowEn.style.background = lang === 'en' ? '#f0fffe' : 'white';
    if (rowJa) rowJa.style.background = lang === 'ja' ? '#f0fffe' : 'white';
  },

  // 言語切り替え（設定画面用）
  toggleLanguage() {
    this.userData.settings.language = this.userData.settings.language === 'ja' ? 'en' : 'ja';
    Storage.save(this.userData);
    this.showScreen(this.currentScreen);
  },

  // テーマ切り替え
  toggleTheme() {
    this.userData.settings.theme = this.userData.settings.theme === 'light' ? 'dark' : 'light';
    Storage.save(this.userData);
    this.applyTheme(this.userData.settings.theme);
    this.showScreen(this.currentScreen);
  }
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  window.app = App;
  App.init();
});
