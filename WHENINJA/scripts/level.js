// level.js - レベルシステムとおみやげ管理

const LevelSystem = {
  // レベルタイトル
  LEVEL_TITLES: {
    ja: {
      1: '観光客',
      2: '旅行者',
      3: '生活者',
      4: '文化通',
      5: '文化忍者',
      6: 'マスター忍者'
    },
    en: {
      1: 'Tourist',
      2: 'Traveler',
      3: 'Resident',
      4: 'Culture Enthusiast',
      5: 'Culture Ninja',
      6: 'Master Ninja'
    }
  },

  // カテゴリーID（順番固定）
  CATEGORIES: [
    'transport',
    'stay',
    'food',
    'communication',
    'home',
    'temple'
  ],

  // おみやげ（カテゴリー別）
  SOUVENIRS: {
    transport: [
      { emoji: '🎫', name: { ja: '電車の切符', en: 'Train Ticket' } },
      { emoji: '🚇', name: { ja: '地下鉄', en: 'Subway' } },
      { emoji: '🚄', name: { ja: '新幹線', en: 'Shinkansen' } },
      { emoji: '🗺️', name: { ja: '日本地図', en: 'Japan Map' } },
      { emoji: '🎟️', name: { ja: 'IC乗車券', en: 'IC Card' } }
    ],
    stay: [
      { emoji: '👘', name: { ja: '浴衣', en: 'Yukata' } },
      { emoji: '🛏️', name: { ja: '布団', en: 'Futon' } },
      { emoji: '🥢', name: { ja: 'お箸', en: 'Chopsticks' } },
      { emoji: '🎐', name: { ja: '風鈴', en: 'Wind Chime' } },
      { emoji: '🍵', name: { ja: 'お茶', en: 'Tea' } }
    ],
    food: [
      { emoji: '🍣', name: { ja: '寿司', en: 'Sushi' } },
      { emoji: '🍤', name: { ja: 'てんぷら', en: 'Tempura' } },
      { emoji: '🍜', name: { ja: 'ラーメン', en: 'Ramen' } },
      { emoji: '🍢', name: { ja: 'おでん', en: 'Oden' } },
      { emoji: '🍛', name: { ja: 'カレーライス', en: 'Curry Rice' } }
    ],
    communication: [
      { emoji: '📱', name: { ja: 'スマホ', en: 'Smartphone' } },
      { emoji: '🎮', name: { ja: 'ゲーム', en: 'Game' } },
      { emoji: '📚', name: { ja: '漫画', en: 'Comics' } },
      { emoji: '🎤', name: { ja: 'カラオケ', en: 'Karaoke' } },
      { emoji: '🎧', name: { ja: '音楽', en: 'Music' } }
    ],
    home: [
      { emoji: '🌸', name: { ja: '桜', en: 'Cherry Blossom' } },
      { emoji: '🍂', name: { ja: '紅葉', en: 'Autumn Leaves' } },
      { emoji: '🍊', name: { ja: 'みかん', en: 'Mandarin Orange' } },
      { emoji: '🎆', name: { ja: '花火', en: 'Fireworks' } },
      { emoji: '🍙', name: { ja: 'おにぎり', en: 'Onigiri' } }
    ],
    temple: [
      { emoji: '⛩️', name: { ja: '鳥居', en: 'Torii Gate' } },
      { emoji: '♨', name: { ja: '温泉', en: 'Onsen' } },
      { emoji: '🗻', name: { ja: '富士山', en: 'Mt. Fuji' } },
      { emoji: '🔔', name: { ja: '寺の鐘', en: 'Temple Bell' } },
      { emoji: '👕', name: { ja: '記念Tシャツ', en: 'Memorial T-shirt' } }
    ]
  },

  // スナック
  SNACKS: [
    { emoji: '🍘', name: { ja: 'せんべい', en: 'Rice Cracker' } },
    { emoji: '🍡', name: { ja: 'だんご', en: 'Dango' } },
    { emoji: '🍬', name: { ja: 'キャンディ', en: 'Candy' } },
    { emoji: '🍩', name: { ja: 'ドーナツ', en: 'Donut' } },
    { emoji: '🍫', name: { ja: 'チョコレート', en: 'Chocolate' } },
    { emoji: '🍠', name: { ja: 'やきいも', en: 'Sweet Potato' } },
    { emoji: '🍦', name: { ja: 'ソフトクリーム', en: 'Soft Cream' } },
    { emoji: '🎂', name: { ja: 'ケーキ', en: 'Cake' } }
  ],

  // カテゴリー名からIDに変換
  getCategoryId(categoryNameEn) {
    const mapping = {
      'Transport & Public Spaces': 'transport',
      'Stay & Accommodation': 'stay',
      'Food & Dining': 'food',
      'Communication': 'communication',
      'Home & Daily Life': 'home',
      'Temple Shrine & Onsen': 'temple'
    };
    return mapping[categoryNameEn] || categoryNameEn.toLowerCase();
  },

  // レベルアップチェック
  checkLevelUp(userData) {
    const currentPoints = userData.totalPoints;
    let newLevel = userData.currentLevel;
    let leveledUp = false;
    
    // ポイントベースでレベル判定
    while (newLevel < 6 && currentPoints >= this.getPointsForNextLevel(newLevel)) {
      newLevel++;
      leveledUp = true;
    }
    
    if (leveledUp) {
      userData.currentLevel = newLevel;
      return { leveledUp: true, newLevel };
    }
    
    return { leveledUp: false };
  },

  // ランダムスナック獲得
  getRandomSnack() {
    return this.SNACKS[Math.floor(Math.random() * this.SNACKS.length)];
  },

  // レベルタイトル取得
  getLevelTitle(level, lang = 'ja') {
    return this.LEVEL_TITLES[lang][level] || this.LEVEL_TITLES[lang][1];
  },

  // 次のレベルまでのポイント
  getPointsForNextLevel(level) {
    if (level >= 6) return Infinity;
    // レベル2: 50pt, レベル3: 100pt, レベル4: 150pt, レベル5: 200pt, レベル6: 250pt
    return level * 50;
  }
};
