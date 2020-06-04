import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import Util from "../lib/util.mjs";

const describe = (name, func) => func();

describe('imi-data-validator#util', () => {
  describe('datatype', () => {
    describe('xsd:integer', () => {
      Deno.test('正常', () => {
        assertEquals(Util.datatype("xsd:integer", "-256"), {
          "種別": "INFO"
        });
      });
      Deno.test('異常', () => {
        assertEquals(Util.datatype("xsd:integer", "0256"), {
          "種別": "ERROR",
          "説明": "xsd:integer ではありません"
        });
      });
    });
    describe('xsd:nonNegativeInteger', () => {
      Deno.test('正常', () => {
        assertEquals(Util.datatype("xsd:nonNegativeInteger", "256"), {
          "種別": "INFO"
        });
      });
      Deno.test('異常', () => {
        assertEquals(Util.datatype("xsd:nonNegativeInteger", "-256"), {
          "種別": "ERROR",
          "説明": "xsd:nonNegativeInteger ではありません"
        });
      });
    });
    describe('xsd:date', () => {
      Deno.test('正常', () => {
        assertEquals(Util.datatype("xsd:date", "2019-12-31"), {
          "種別": "INFO"
        });
      });
      Deno.test('異常', () => {
        assertEquals(Util.datatype("xsd:date", "2019年12月31日"), {
          "種別": "ERROR",
          "説明": "xsd:date ではありません"
        });
      });
    });
  });
  describe('eq', () => {
    describe('文字列', () => {
      Deno.test('正常', () => {
        assertEquals(Util.eq("Hello", "Hello"), {
          "種別": "INFO"
        });
      });
      Deno.test('異常', () => {
        assertEquals(Util.eq("Hello", "World"), {
          "種別": "ERROR",
          "説明": "Hello でなければなりません"
        });
      });
    });
  });

  describe('lt', () => {
    describe('数値', () => {
      Deno.test('>', () => {
        assertEquals(Util.lt("5", "4"), {
          "種別": "INFO"
        });
      });
      Deno.test('=', () => {
        assertEquals(Util.lt("5", "5"), {
          "種別": "ERROR",
          "説明": "5 より小さくなければいけません"
        });
      });
      Deno.test('<', () => {
        assertEquals(Util.lt("5", "6"), {
          "種別": "ERROR",
          "説明": "5 より小さくなければいけません"
        });
      });
    });
    describe('非数値', () => {
      Deno.test('文字列', () => {
        assertEquals(Util.lt("5", "world"), {
          "種別": "ERROR",
          "説明": "数値ではありません"
        });
      });
    });
  });

  describe('le', () => {
    describe('数値', () => {
      Deno.test('>', () => {
        assertEquals(Util.le("5", "4"), {
          "種別": "INFO"
        });
      });
      Deno.test('=', () => {
        assertEquals(Util.le("5", "5"), {
          "種別": "INFO"
        });
      });
      Deno.test('<', () => {
        assertEquals(Util.le("5", "6"), {
          "種別": "ERROR",
          "説明": "5 以下でなければいけません"
        });
      });
    });
    describe('非数値', () => {
      Deno.test('文字列', () => {
        assertEquals(Util.le("5", "world"), {
          "種別": "ERROR",
          "説明": "数値ではありません"
        });
      });
    });
  });

  describe('gt', () => {
    describe('数値', () => {
      Deno.test('>', () => {
        assertEquals(Util.gt("5", "4"), {
          "種別": "ERROR",
          "説明": "5 より大きくなければいけません"
        });
      });
      Deno.test('=', () => {
        assertEquals(Util.gt("5", "5"), {
          "種別": "ERROR",
          "説明": "5 より大きくなければいけません"
        });
      });
      Deno.test('<', () => {
        assertEquals(Util.gt("5", "6"), {
          "種別": "INFO"
        });
      });
    });
    describe('非数値', () => {
      Deno.test('文字列', () => {
        assertEquals(Util.gt("5", "world"), {
          "種別": "ERROR",
          "説明": "数値ではありません"
        });
      });
    });
  });

  describe('ge', () => {
    describe('数値', () => {
      Deno.test('>', () => {
        assertEquals(Util.ge("5", "4"), {
          "種別": "ERROR",
          "説明": "5 以上でなければいけません"
        });
      });
      Deno.test('=', () => {
        assertEquals(Util.ge("5", "5"), {
          "種別": "INFO"
        });
      });
      Deno.test('<', () => {
        assertEquals(Util.ge("5", "6"), {
          "種別": "INFO"
        });
      });
    });
    describe('非数値', () => {
      Deno.test('文字列', () => {
        assertEquals(Util.ge("5", "world"), {
          "種別": "ERROR",
          "説明": "数値ではありません"
        });
      });
    });
  });

  describe('pattern', () => {
    Deno.test('正常', () => {
      assertEquals(Util.pattern("^[0-9]{5}$", "01234"), {
        "種別": "INFO"
      });
    });
    Deno.test('失敗', () => {
      assertEquals(Util.pattern("^[0-9]{5}$", "0123456789"), {
        "種別": "ERROR",
        "説明": "正規表現 ^[0-9]{5}$ に適合しません"
      });
    });
  });

  describe('charsets', () => {
    const KATAKANA = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646Annex-G-supplement-KATAKANA-compliant";
    const NUMERIC = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646Annex-G-supplement-NUMERIC-compliant";

    describe('全角カナ', () => {
      const uri = KATAKANA;
      Deno.test("正常", () => {
        assertEquals(Util.charset(uri, "アカサタナ"), {
          "種別": "INFO"
        });
      });
      Deno.test("異常", () => {
        assertEquals(Util.charset(uri, "アカサタナはまやらわ"), {
          "種別": "ERROR",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定されていない文字が使用されています"
        });
      });
      Deno.test("修復", () => {
        assertEquals(Util.charset(uri, "ｱｶｻﾀﾅ"), [{
          "種別": "ERROR",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定されていない文字が使用されています"
        }, {
          "種別": "WARNING",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定されていない文字が使用されていましたが、半角カナ／全角カナ変換によって修正されました",
          "値": "アカサタナ"
        }]);
      });
    });
    describe('数字', () => {
      const uri = NUMERIC;
      Deno.test("正常", () => {
        assertEquals(Util.charset(uri, "0123456789"), {
          "種別": "INFO"
        });
      });
      Deno.test("異常", () => {
        assertEquals(Util.charset(uri, "アカサタナはまやらわ"), {
          "種別": "ERROR",
          "説明": "[IMIユーティリティ文字セット－数字] で規定されていない文字が使用されています"
        });
      });
      Deno.test("修復", () => {
        assertEquals(Util.charset(uri, "０１２３４５6789"), [{
          "種別": "ERROR",
          "説明": "[IMIユーティリティ文字セット－数字] で規定されていない文字が使用されています"
        }, {
          "種別": "WARNING",
          "説明": "[IMIユーティリティ文字セット－数字] で規定されていない文字が使用されていましたが、全角数字／半角数字変換によって修正されました",
          "値": "0123456789"
        }]);
      });
    });
    describe('非推奨', () => {
      const uri = "[NotRecommended]" + KATAKANA;
      Deno.test("正常", () => {
        assertEquals(Util.charset(uri, "01234"), {
          "種別": "INFO"
        });
      });
      Deno.test("非推奨のみ", () => {
        assertEquals(Util.charset(uri, "アカサタナ"), {
          "種別": "WARNING",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定された非推奨文字が使用されています"
        });
      });
      Deno.test("混在", () => {
        assertEquals(Util.charset(uri, "01234アカサタナ"), {
          "種別": "WARNING",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定された非推奨文字が使用されています"
        });
      });
    });

    describe('推奨・非推奨混在', () => {
      const uri = NUMERIC + "|[NotRecommended]" + KATAKANA;
      Deno.test("推奨", () => {
        assertEquals(Util.charset(uri, "01234"), {
          "種別": "INFO"
        });
      });
      Deno.test("非推奨", () => {
        assertEquals(Util.charset(uri, "アカサタナ"), {
          "種別": "WARNING",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定された非推奨文字が使用されています"
        });
      });
      Deno.test("推奨・非推奨", () => {
        assertEquals(Util.charset(uri, "01234アカサタナ"), {
          "種別": "WARNING",
          "説明": "[IMIユーティリティ文字セット－カナ（全角）] で規定された非推奨文字が使用されています"
        });
      });
      Deno.test("推奨・禁止", () => {
        assertEquals(Util.charset(uri, "01234abcde"), {
          "種別": "ERROR",
          "説明": "[IMIユーティリティ文字セット－数字,IMIユーティリティ文字セット－カナ（全角）] で規定されていない文字が使用されています"
        });
      });
    });

  });
});
