/**
 * @file Utils.gsのテスト
 */

function Utils_Test() {
  QUnit.module('Utils');

  /**
   * trimAndClean関数のテスト
   */
  QUnit.test('trimAndClean', function (assert) {
    // TS-UT-001: 前後の空白除去
    assert.equal(trimAndClean('  hello world  '), 'hello world', 'TS-UT-001: 文字列の前後の空白が除去されること');

    // TS-UT-002: 連続する空白を単一に
    assert.equal(trimAndClean('hello   world'), 'hello world', 'TS-UT-002: 文字列中の連続する空白が単一のスペースに変換されること');

    // TS-UT-003: 改行コードをスペースに
    assert.equal(trimAndClean('hello\nworld'), 'hello world', 'TS-UT-003: 改行コードが単一のスペースに変換されること');

    // TS-UT-004: null入力
    assert.equal(trimAndClean(null), '', 'TS-UT-004: 入力値がnullの場合に空文字列を返すこと');
  });
}