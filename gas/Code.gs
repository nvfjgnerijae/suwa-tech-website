/**
 * お問い合わせフォーム受信用 Google Apps Script
 *
 * 【設定手順】
 * 1. Googleスプレッドシートを新規作成し、シート名を「お問い合わせ」にする
 * 2. スプレッドシートのメニュー「拡張機能 > Apps Script」を開く
 * 3. このファイルの内容を貼り付け、SHEET_ID にスプレッドシートのIDを設定
 *    （URLの /d/【ここがID】/edit の部分）
 * 4. 「デプロイ > 新しいデプロイ」を選択
 *    - 種類: ウェブアプリ
 *    - 実行するユーザー: 自分
 *    - アクセスできるユーザー: 全員
 * 5. 発行されたURLを index.html の data-gas-url 属性にコピー
 */

const SHEET_ID = '1e24WL7NGE19uV94yTGqY7F2ErjNJkuirB-9a1vGYv6E';
const SHEET_NAME = 'お問い合わせ';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
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

     MailApp.sendEmail({
       to: 'youmayitian@gmail.com',
       subject: '【SUWA tech】新しいお問い合わせ',
       body: `会社名: ${data.companyName}\n担当者: ${data.contactName}\nメール: ${data.email}\n電話: ${data.phone}\n業種: ${data.industry}\n\n${data.message}`
     });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('OK');
}
