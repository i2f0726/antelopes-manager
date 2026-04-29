// ===================================================================
// sw.js のバージョンを自動更新するスクリプト（ミニバス用）
// npm run deploy 実行時に自動で走ります
// ===================================================================

const fs = require('fs');
const path = require('path');

// 同じフォルダ内の sw.js を対象にする
const SW_PATH = path.join(__dirname, 'sw.js');

// 今の日時から バージョン文字列を作る（例: 2026-04-29-1430）
function makeVersion() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}-${hh}${mm}`;
}

const newVersion = makeVersion();

if (!fs.existsSync(SW_PATH)) {
  console.error('❌ sw.js が見つかりません: ' + SW_PATH);
  process.exit(1);
}

let content = fs.readFileSync(SW_PATH, 'utf8');
const before = content;

// const CACHE_VERSION = '...' の部分を書き換え
content = content.replace(
  /const\s+CACHE_VERSION\s*=\s*['"][^'"]*['"]\s*;/,
  `const CACHE_VERSION = '${newVersion}';`
);

if (content === before) {
  console.error('⚠️ sw.js に CACHE_VERSION が見つかりません');
  process.exit(1);
}

fs.writeFileSync(SW_PATH, content, 'utf8');
console.log(`✅ sw.js のバージョンを更新: ${newVersion}`);
