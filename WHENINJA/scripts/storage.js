// storage.js - データ管理とlocalStorage操作

const Storage = {
  // キー名
  KEYS: {
    USER_DATA: 'wheninjapan_userData',
    DATA_HASH: 'wheninjapan_dataHash',
    HAS_SEEN_WARNING: 'wheninjapan_hasSeenWarning',
    HAS_VISITED: 'wheninjapan_hasVisited'  // 修正2: 初回訪問判定フラグ
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
  // データとハッシュを1つのオブジェクトにまとめて単一の setItem で書き込む
  // → 2回に分けて書くと2回目が失敗したときハッシュ不一致でデータがリセットされる問題を防ぐ
  save(data) {
    try {
      const hash = this.generateHash(data);
      localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify({ data, hash }));
      // 旧フォーマットのハッシュキーが残っていれば削除
      localStorage.removeItem(this.KEYS.DATA_HASH);
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

      const parsed = JSON.parse(stored);
      let data;

      // 新フォーマット判定: { data, hash } 形式かどうか
      if (parsed && typeof parsed === 'object' && parsed.data && parsed.hash !== undefined) {
        // 新フォーマット（アトミック書き込み版）
        const computedHash = this.generateHash(parsed.data);
        if (parsed.hash !== computedHash) {
          console.warn('データ整合性エラー: 初期化します');
          return this.getDefaultData();
        }
        data = parsed.data;
      } else {
        // 旧フォーマット（平オブジェクト）: 旧ハッシュキーで検証
        const storedHash = localStorage.getItem(this.KEYS.DATA_HASH);
        const computedHash = this.generateHash(parsed);
        if (storedHash !== computedHash) {
          console.warn('データ整合性エラー（旧フォーマット）: 初期化します');
          return this.getDefaultData();
        }
        data = parsed;
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

  // データの削除（修正2: リセット時にトップ画面へ戻るよう HAS_VISITED も削除）
  clear() {
    localStorage.removeItem(this.KEYS.USER_DATA);
    localStorage.removeItem(this.KEYS.DATA_HASH);
    localStorage.removeItem(this.KEYS.HAS_VISITED);
  },

  // 修正2: 初回訪問フラグ
  hasVisited() {
    return localStorage.getItem(this.KEYS.HAS_VISITED) === 'true';
  },

  setVisited() {
    localStorage.setItem(this.KEYS.HAS_VISITED, 'true');
  },

  // 警告表示フラグ
  hasSeenWarning() {
    return localStorage.getItem(this.KEYS.HAS_SEEN_WARNING) === 'true';
  },

  setSeenWarning() {
    localStorage.setItem(this.KEYS.HAS_SEEN_WARNING, 'true');
  }
};
