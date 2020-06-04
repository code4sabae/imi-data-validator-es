import { assert } from "https://deno.land/std/testing/asserts.ts";
import charsets from "../lib/charsets.mjs";

const describe = (name, func) => func();

describe('imi-data-validator#charsets', () => {

  describe('数字 ISOIEC10646Annex-G-supplement-NUMERIC-compliant', () => {
    const uri = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646Annex-G-supplement-NUMERIC-compliant";
    Deno.test("定義", () => {
      assert(charsets[uri]);
    });
    const exp = new RegExp(`^${charsets[uri].moji}+$`);
    Deno.test("数字だけの文字列を valid と判定できること", () => {
      assert(exp.test("0123456789"));
    });
    Deno.test("数字以外を含む文字列を invalid と判定できること", () => {
      assert(exp.test("0123456789a") !== true);
    });
  });

  describe('カタカナ ISOIEC10646Annex-G-supplement-KATAKANA-compliant', () => {
    const uri = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646Annex-G-supplement-KATAKANA-compliant";
    Deno.test("定義", () => {
      assert(charsets[uri]);
    });
    const exp = new RegExp(`^${charsets[uri].moji}+$`);
    Deno.test("カタカナだけの文字列を valid と判定できること", () => {
      assert(exp.test("アイウエオカキケコ"));
    });
    Deno.test("カタカナ以外を含む文字列を invalid と判定できること", () => {
      assert(exp.test("0123456789a") !== true);
    });
  });

  describe('JISX0208 ISOIEC10646-CJK-JISX0208-1990-compliant', () => {
    const uri = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646-CJK-JISX0208-1990-compliant";
    Deno.test("定義", () => {
      assert(charsets[uri]);
    });
    const exp = new RegExp(`^${charsets[uri].moji}+$`);
    Deno.test("JISX0208だけの文字列を valid と判定できること", () => {
      assert(exp.test("山田太郎"));
    });
    Deno.test("JISX0208以外を含む文字列を invalid と判定できること", () => {
      assert(exp.test("𩸽") !== true);
    });
  });

  describe('JISX0212 ISOIEC10646-CJK-JISX0212-1990-compliant', () => {
    const uri = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646-CJK-JISX0212-1990-compliant";
    Deno.test("定義", () => {
      assert(charsets[uri]);
    });
    const exp = new RegExp(`^${charsets[uri].moji}+$`);
    Deno.test("JISX0212だけの文字列を valid と判定できること", () => {
      assert(exp.test("亖亗亝亯亹仃仐仚仛仠"));
    });
    Deno.test("JISX0212以外を含む文字列を invalid と判定できること", () => {
      assert(exp.test("一亖亗亝亯亹仃仐仚仛仠") !== true);
      assert(exp.test("𩸽亖亗亝亯亹仃仐仚仛仠") !== true);
      assert(exp.test("0123456789亖亗亝亯亹仃仐仚仛仠") !== true);
      assert(exp.test("アイウエオ亖亗亝亯亹仃仐仚仛仠") !== true);
    });
  });

  describe('JISX0213 ISOIEC10646-CJK-JISX0213-2004-compliant', () => {
    const uri = "https://imi.go.jp/CommonCharacterSets/ISOIEC10646-CJK-JISX0213-2004-compliant";
    Deno.test("定義", () => {
      assert(charsets[uri]);
    });
    const exp = new RegExp(`^(${charsets[uri].moji})+$`);
    Deno.test("JISX0213だけの文字列を valid と判定できること", () => {
      assert(exp.test("𩸽"));
    });
    Deno.test("JISX0208以外を含む文字列を invalid と判定できること", () => {
      assert(exp.test("山田太郎") !== true);
    });
  });
});
