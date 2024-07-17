import { NUM_BOMBS, NUM_COLS, NUM_ROWS } from "./constants";

// eslint-disable-next-line no-unused-vars
function writeRandomBinary() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet) {
    Logger.log("シートが見つかりませんでした。");
    return;
  }

  // 14x14 の配列を初期化
  const binaryArray = Array.from({ length: NUM_ROWS * NUM_COLS }, () => 0);

  // 14x14 の配列を初期化
  const field = Array.from({ length: NUM_ROWS }, () => Array(NUM_COLS).fill("#"));

  // 配列にランダムに 10 個の 1 を挿入
  let count = 0;
  while (count < NUM_BOMBS) {
    const index = Math.floor(Math.random() * binaryArray.length);
    if (binaryArray[index] === 0) {
      binaryArray[index] = 1;
      count++;
    }
  }

  // 1 次元配列を 2 次元配列に変換
  const randomBinaryArray = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    randomBinaryArray.push(binaryArray.slice(i * NUM_COLS, (i + 1) * NUM_COLS));
  }

  Logger.log(randomBinaryArray);
  Logger.log(field);

  // フィールドを埋める
  sheet.getRange(1, 1, NUM_ROWS, NUM_COLS).setValues(field);
}

// eslint-disable-next-line no-unused-vars
function onEdit(e: GoogleAppsScript.Events.SheetsOnEdit) {
  // イベントオブジェクトが正しく渡されたか確認
  if (!e) {
    Logger.log("イベントオブジェクトが undefined です。");
    return;
  }

  const sheet = e.source.getActiveSheet();
  const range = e.range;

  if (!sheet || !range) {
    Logger.log("シートまたは範囲が取得できませんでした。");
    return;
  }

  // セルの行と列を取得
  const row = range.getRow();
  const column = range.getColumn();

  // セルの位置をログに表示
  Logger.log(`編集されたセルの位置: 行 ${row}, 列 ${column}`);
}
