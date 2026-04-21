/**
 * お問い合わせフォーム受信用 Google Apps Script
 *
 * 【設定手順】
 * 1. 受信先のGoogleスプレッドシートを開く
 * 2. メニュー「拡張機能 > Apps Script」を開く（= スクリプトがスプレッドシートに紐づく）
 * 3. このファイルの内容を Code.gs に貼り付け、保存
 * 4. 「デプロイ > 新しいデプロイ」
 *    - 種類: ウェブアプリ
 *    - 実行するユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 5. 発行されたURL（.../exec）を index.html の data-gas-url にコピー
 *
 * 【重要】コードを更新したら、必ず「デプロイを管理 > 編集 > バージョン: 新しいバージョン」で
 *        再デプロイしてください。同じURLのまま最新コードが反映されます。
 */

const SHEET_NAME = 'お問い合わせ';

function doPost(e) {
  // ※ try/catchを外してエラーを実行ログに表示させる。問題が解決したら try/catch で囲んでも良い。
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // ヘッダが無ければ追加
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '受信日時', '会社名・組織名', 'ご担当者名',
      'メールアドレス', '電話番号', '業種', 'お困りごと・ご相談内容'
    ]);
  }

  sheet.appendRow([
    new Date(data.timestamp || Date.now()),
    data.companyName || '',
    data.contactName || '',
    data.email || '',
    data.phone || '',
    data.industry || '',
    data.message || ''
  ]);

  // 任意: 通知メール送信
  // MailApp.sendEmail({
  //   to: 'youmayitian@gmail.com',
  //   subject: '【SUWA tech】新しいお問い合わせ',
  //   body: `会社名: ${data.companyName}\n担当者: ${data.contactName}\nメール: ${data.email}\n電話: ${data.phone}\n業種: ${data.industry}\n\n${data.message}`
  // });

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('OK');
}

/**
 * 手動テスト用: Apps Scriptエディタで実行して動作確認できます。
 */
function testAppend() {
  doPost({
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        companyName: 'テスト株式会社',
        contactName: 'テスト 太郎',
        email: 'test@example.com',
        phone: '000-0000-0000',
        industry: '製造業',
        message: 'テスト送信です'
      })
    }
  });
}
