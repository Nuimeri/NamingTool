/**
 * @file NamingService.gsのテスト
 */

function NamingService_Test() {
  QUnit.module('NamingService');

  /**
   * generatePrompt関数のテスト
   */
  QUnit.test('generatePrompt', function (assert) {
    // TS-NS-001: 正常系
    assert.ok(
      generatePrompt('カフェ').includes('カフェ'),
      'TS-NS-001: 正常なキーワードでプロンプトが生成されること'
    );

    // TS-NS-002: 異常系（空文字）
    assert.throws(
      function () {
        generatePrompt('');
      },
      /キーワードが指定されていません。/,
      'TS-NS-002: キーワードが空文字の場合にエラーがスローされること'
    );

    // TS-NS-003: 異常系（null）
    assert.throws(
      function () {
        generatePrompt(null);
      },
      /キーワードが指定されていません。/,
      'TS-NS-003: キーワードがnullの場合にエラーがスローされること'
    );
  });

  /**
   * parseApiResponse関数のテスト
   */
  QUnit.test('parseApiResponse', function (assert) {
    // TS-NS-004: 正常系（標準的なリスト）
    const response1 = '1. ネーミングA\n2. ネーミングB\n3. ネーミングC';
    const expected1 = ['ネーミングA', 'ネーミングB', 'ネーミングC'];
    assert.deepEqual(parseApiResponse(response1), expected1, 'TS-NS-004: 標準的なリストを正しくパースできること');

    // TS-NS-005: 正常系（不規則なフォーマット）
    const response2 = '  1.  ネーミングX  \n\nネーミングY\n3.ネーミングZ\n以上です。';
    const expected2 = ['ネーミングX', 'ネーミングY', 'ネーミングZ'];
    assert.deepEqual(parseApiResponse(response2), expected2, 'TS-NS-005: 不規則なフォーマットを正しくパースできること');

    // TS-NS-006: 正常系（空文字）
    assert.deepEqual(parseApiResponse(''), [], 'TS-NS-006: レスポンスが空文字の場合、空配列を返すこと');

    // TS-NS-007: 正常系（null）
    assert.deepEqual(parseApiResponse(null), [], 'TS-NS-007: レスポンスがnullの場合、空配列を返すこと');

    // TS-NS-007: 正常系（undefined）
    assert.deepEqual(parseApiResponse(undefined), [], 'TS-NS-007: レスポンスがundefinedの場合、空配列を返すこと');
  });
}