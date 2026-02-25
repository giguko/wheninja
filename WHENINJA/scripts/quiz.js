// quiz.js - クイズデータとロジック

const QuizManager = {
  questions: [],
  chats: [],
  currentQuestion: null,
  currentCategory: null,

  // データ読み込み
  async loadData() {
    try {
      const response = await fetch('/assets/data/quizzes.b64');
      const encoded = await response.text();
      const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
      const data = JSON.parse(new TextDecoder('utf-8').decode(bytes));
      this.questions = data.questions;
      this.chats = data.chats;
      return true;
    } catch (error) {
      console.error('クイズデータ読み込みエラー:', error);
      return false;
    }
  },

  // カテゴリー別の問題を取得
  getQuestionsByCategory(categoryId) {
    return this.questions.filter(q => {
      const qCategoryId = LevelSystem.getCategoryId(q.category.en);
      return qCategoryId === categoryId;
    });
  },

  // 次の問題を取得
  getNextQuestion(categoryId, userData) {
    const categoryQuestions = this.getQuestionsByCategory(categoryId);
    
    // 未回答の問題を探す
    const unanswered = categoryQuestions.find(q => {
      return !userData.answeredQuestions[q.id];
    });
    
    if (unanswered) {
      this.currentQuestion = unanswered;
      this.currentCategory = categoryId;
      return unanswered;
    }
    
    // すべて回答済み
    return null;
  },

  // 解答チェック
  checkAnswer(selectedIndex) {
    if (!this.currentQuestion) return null;
    
    const selectedOption = this.currentQuestion.options[selectedIndex];
    const isCorrect = selectedOption.type === 'best';
    const isConditional = selectedOption.type === 'conditional';
    
    // ポイント計算（整数）
    let points = 0;
    if (isCorrect) {
      points = 10;
    } else if (isConditional) {
      points = 5;
    } else {
      points = 0;
    }
    
    return {
      isCorrect,
      isConditional,
      type: selectedOption.type,
      feedback: this.currentQuestion.feedback,
      points: points
    };
  },

  // カテゴリー完了チェック
  isCategoryComplete(categoryId, userData) {
    const categoryQuestions = this.getQuestionsByCategory(categoryId);
    return categoryQuestions.every(q => userData.answeredQuestions[q.id]);
  },

  // Cat's Chatを取得（ランダム）
  getRandomChatForCategory(categoryId) {
    // カテゴリーIDから英語名を取得
    const categoryInfo = this.getCategoryInfo().find(c => c.id === categoryId);
    if (!categoryInfo) return null;
    
    const categoryNameEn = categoryInfo.nameEn;
    
    // 英語名で一致するチャットを検索
    const categoryChats = this.chats.filter(c => c.category === categoryNameEn);
    
    if (categoryChats.length === 0) return null;
    
    return categoryChats[Math.floor(Math.random() * categoryChats.length)];
  },

  // カテゴリーIDから英語名を取得
  getCategoryNameEn(categoryId) {
    const mapping = {
      'transport': 'Transport & Public Spaces',
      'stay': 'Stay & Accommodation',
      'food': 'Food & Dining',
      'communication': 'Communication',
      'home': 'Home & Daily Life',
      'temple': 'Temple Shrine & Onsen'
    };
    return mapping[categoryId] || categoryId;
  },

  // カテゴリー情報の取得
  getCategoryInfo() {
    return [
      { id: 'transport', icon: '🚃', nameJa: '交通・公共空間', nameEn: 'Transport & Public Spaces' },
      { id: 'stay', icon: '🏨', nameJa: '宿泊', nameEn: 'Stay & Accommodation' },
      { id: 'food', icon: '🍜', nameJa: '食事', nameEn: 'Food & Dining' },
      { id: 'communication', icon: '💬', nameJa: 'コミュニケーション', nameEn: 'Communication' },
      { id: 'home', icon: '🏠', nameJa: '日常・生活', nameEn: 'Home & Daily Life' },
      { id: 'temple', icon: '🙏', nameJa: '神社・温泉', nameEn: 'Temple Shrine & Onsen' }
    ];
  },

  // カテゴリーの進捗を取得
  getCategoryProgress(categoryId, userData) {
    const categoryQuestions = this.getQuestionsByCategory(categoryId);
    const answered = categoryQuestions.filter(q => userData.answeredQuestions[q.id]).length;
    return {
      answered,
      total: categoryQuestions.length,
      percentage: Math.round((answered / categoryQuestions.length) * 100)
    };
  }
};
