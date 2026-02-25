// encode-quiz.js - quizzes.json を Base64 エンコードして quizzes.b64 を生成するスクリプト
// 使い方: node scripts/encode-quiz.js
// ※ quizzes.json を更新したときは毎回このスクリプトを実行してください

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../assets/data/quizzes.json');
const outputPath = path.join(__dirname, '../assets/data/quizzes.b64');

try {
  const json = fs.readFileSync(inputPath, 'utf8');
  const encoded = Buffer.from(json, 'utf8').toString('base64');
  fs.writeFileSync(outputPath, encoded, 'utf8');
  console.log('完了: quizzes.b64 を生成しました');
  console.log(`  入力: ${inputPath}`);
  console.log(`  出力: ${outputPath}`);
} catch (error) {
  console.error('エラー:', error.message);
  process.exit(1);
}
