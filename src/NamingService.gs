/**
 * @file ネーミング生成に関する主要なビジネスロジックを担当します。
 */

/**
 * 指定されたキーワードに基づき、Gemini APIがネーミング案を生成するためのプロンプトを作成します。
 * @param {string} keyword - ユーザーが入力したキーワード。
 * @returns {string} Gemini APIに送信するプロンプトテキスト。
 * @throws {Error} キーワードが指定されていない場合にエラーをスローします。
 */
function generatePrompt(keyword) {
  if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
    throw new Error("キーワードが指定されていません。");
  }
  const promptTemplate = "以下のキーワードに基づき、斬新で記憶に残る、日本語のプロダクトネーミング案を10個提案してください。各案はシンプルで、そのプロダクトの特性を連想させるものが望ましいです。各ネーミング案は番号付きリストで出力し、余計な説明や前後の挨拶は含めないでください。\n\nキーワード: {keyword}\n\n提案例:\n1. [ネーミング案1]\n2. [ネーミング案2]";
  return promptTemplate.replace("{keyword}", keyword);
}

/**
 * Gemini APIから返却された生のテキストレスポンスを解析し、ネーミング案の配列に整形します。
 * @param {string | null | undefined} apiResponse - Gemini APIからのテキストレスポンス。
 * @returns {string[]} 整形されたネーミング案の配列。
 */
function parseApiResponse(apiResponse) {
  if (!apiResponse) {
    return [];
  }

  return apiResponse
    .split('\n') // 1. 行ごとに分割
    .map(line => {
      // 2. 行頭の番号や記号、前後の空白を除去
      return line.replace(/^[\d.\s・-*]*/, '').trim();
    })
    .filter(line => line.length > 0); // 3. 空行や整形後に空になった行を除外
}