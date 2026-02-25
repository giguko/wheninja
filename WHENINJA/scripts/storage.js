// storage.js - データ管理とlocalStorage操作

const Storage = {
  // キー名
  KEYS: {
    USER_DATA: 'wheninjapan_userData',
    DATA_HASH: 'wheninjapan_dataHash',
    HAS_SEEN_WARNING: 'wheninjapan_hasSeenWarning'
  },

  // データの初期化
  getDefaultData() {
    return {
      selectedCharacter: null,
      currentLevel: 1,
      totalPoints: 0,
      completedCategories: [],
      answeredQuestions: {},
      souvenirs: [],
      snacks: [],
      settings: {
        language: this.detectLanguage(),
        theme: this.detectTheme()
      }
    };
  },

  // ブラウザ言語の検出
  detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('ja') ? 'ja' : 'en';
  },

  // システムテーマの検出
  detectTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  // 簡易ハッシュ生成
  generateHash(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32ビット整数に変換
    }
    return hash.toString(36);
  },

  // データの保存
  save(data) {
    try {
      const hash = this.generateHash(data);
      localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify(data));
      localStorage.setItem(this.KEYS.DATA_HASH, hash);
      return true;
    } catch (error) {
      console.error('データ保存エラー:', error);
      return false;
    }
  },

  // データの読み込み
  load() {
    try {
      const stored = localStorage.getItem(this.KEYS.USER_DATA);
      if (!stored) {
        return this.getDefaultData();
      }

      const data = JSON.parse(stored);
      const storedHash = localStorage.getItem(this.KEYS.DATA_HASH);
      const computedHash = this.generateHash(data);

      // 整合性チェック
      if (storedHash !== computedHash) {
        console.warn('データ整合性エラー: 初期化します');
        return this.getDefaultData();
      }

      // 異常値チェック
      if (data.currentLevel < 1 || data.currentLevel > 6) {
        console.warn('異常値検出: レベル');
        data.currentLevel = 1;
      }
      if (data.totalPoints < 0 || data.totalPoints > 500) {
        console.warn('異常値検出: ポイント');
        data.totalPoints = 0;
      }

      return data;
    } catch (error) {
      console.error('データ読み込みエラー:', error);
      return this.getDefaultData();
    }
  },

  // データのバックアップ（JSON形式）
  backup() {
    const data = this.load();
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: data
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wheninjapan-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // データの復元
  restore(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target.result);
          
          if (!backup.version || !backup.data) {
            reject(new Error('不正なバックアップファイル'));
            return;
          }

          if (this.save(backup.data)) {
            resolve(backup.data);
          } else {
            reject(new Error('データ保存に失敗'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('ファイル読み込みエラー'));
      reader.readAsText(file);
    });
  },

  // データの削除
  clear() {
    localStorage.removeItem(this.KEYS.USER_DATA);
    localStorage.removeItem(this.KEYS.DATA_HASH);
  },

  // 警告表示フラグ
  hasSeenWarning() {
    return localStorage.getItem(this.KEYS.HAS_SEEN_WARNING) === 'true';
  },

  setSeenWarning() {
    localStorage.setItem(this.KEYS.HAS_SEEN_WARNING, 'true');
  }
};
