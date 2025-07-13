/**
 * @file GeminiApi.gsのテスト
 */

function GeminiApi_Test() {
  QUnit.module('GeminiApi', {
    beforeEach: function () {
      // テスト前にグローバルオブジェクトのバックアップ
      this.originalUrlFetchApp = globalThis.UrlFetchApp;
      this.originalPropertiesService = globalThis.PropertiesService;
    },
    afterEach: function () {
      // テスト後にグローバルオブジェクトを元に戻す
      globalThis.UrlFetchApp = this.originalUrlFetchApp;
      globalThis.PropertiesService = this.originalPropertiesService;
    },
  });

  /**
   * callGeminiApi関数のテスト
   */
  QUnit.test('callGeminiApi', function (assert) {
    const promptText = 'test prompt';

    // TS-GA-001: 正常系
    globalThis.PropertiesService = {
      getScriptProperties: function () {
        return {
          getProperty: function (key) {
            return key === 'GEMINI_API_KEY' ? 'test_api_key' : null;
          },
        };
      },
    };
    globalThis.UrlFetchApp = {
      fetch: function (url, params) {
        return {
          getResponseCode: function () {
            return 200;
          },
          getContentText: function () {
            return JSON.stringify({
              candidates: [{ content: { parts: [{ text: 'Generated Text' }] } }],
            });
          },
        };
      },
    };
    assert.equal(callGeminiApi(promptText), 'Generated Text', 'TS-GA-001: API呼び出しが成功し、テキストが返却されること');

    // TS-GA-002: 異常系（APIキー未設定）
    globalThis.PropertiesService = {
      getScriptProperties: function () {
        return {
          getProperty: function (key) {
            return null;
          },
        };
      },
    };
    assert.throws(
      function () {
        callGeminiApi(promptText);
      },
      /Gemini APIキーが設定されていません。/,
      'TS-GA-002: APIキーが未設定の場合にエラーがスローされること'
    );

    // TS-GA-003: 異常系（APIエラーレスポンス）
    globalThis.PropertiesService.getScriptProperties = function () { // APIキーは設定済みとする
      return { getProperty: function () { return 'test_api_key'; } };
    };
    globalThis.UrlFetchApp.fetch = function (url, params) {
      return {
        getResponseCode: function () { return 400; },
        getContentText: function () { return '{"error": {"message": "Bad Request"}}'; },
      };
    };
    assert.throws(
      function () {
        callGeminiApi(promptText);
      },
      /APIエラー/,
      'TS-GA-003: APIがエラーを返した場合にエラーがスローされること'
    );

    // TS-GA-004: 異常系（レスポンス形式不正）
    globalThis.UrlFetchApp.fetch = function (url, params) {
      return {
        getResponseCode: function () { return 200; },
        getContentText: function () { return '{"unexpected_key":"value"}'; },
      };
    };
    assert.throws(
      function () {
        callGeminiApi(promptText);
      },
      /レスポンスからテキストを抽出できませんでした。/,
      'TS-GA-004: APIレスポンスの形式が不正な場合にエラーがスローされること'
    );
  });
}