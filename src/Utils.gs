/**
 * @file プロジェクト全体で利用される共通ユーティリティ関数を提供します。
 */

/**
 * 文字列の前後空白を除去し、連続する空白や改行を単一のスペースに整形します。
 * @param {string | null | undefined} text - 整形対象の文字列。
 * @returns {string} 整形後の文字列。入力がnullやundefinedの場合は空文字列を返します。
 */
function trimAndClean(text) {
  if (!text) {
    return '';
  }
  // 改行を含む全ての空白文字の連続を単一スペースに置換し、前後の空白を除去します。
  return text.toString().replace(/\s+/g, ' ').trim();
}