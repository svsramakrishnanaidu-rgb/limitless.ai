import { describe, expect, it } from "vitest";
import { bmi, wellnessSummary, EMPTY_TRACKER } from "./health";
import { dateKey, prettyDate, shiftDate, shortDate } from "./store";
import { isTranslated, languageByCode, translate } from "./i18n";

describe("bmi", () => {
  it("returns a value and band for valid input", () => {
    const result = bmi(70, 175);
    expect(result?.value).toBeCloseTo(22.9, 1);
    expect(result?.band).toBe("Healthy range");
  });

  it("bands high and low values", () => {
    expect(bmi(45, 175)?.band).toBe("Below the healthy range");
    expect(bmi(85, 175)?.band).toBe("Above the healthy range");
    expect(bmi(100, 175)?.band).toBe("Well above the healthy range");
  });

  it("returns null when data is missing", () => {
    expect(bmi(0, 175)).toBeNull();
    expect(bmi(70, 0)).toBeNull();
  });
});

describe("wellnessSummary", () => {
  it("reports no data instead of a fabricated score", () => {
    const summary = wellnessSummary(EMPTY_TRACKER);
    expect(summary.hasData).toBe(false);
    expect(summary.score).toBe(0);
    expect(summary.loggedCount).toBe(0);
  });

  it("scores only the measures the user logged", () => {
    const today = dateKey();
    const summary = wellnessSummary({
      ...EMPTY_TRACKER,
      water: { [today]: 2000 },
      steps: { [today]: 8000 },
      sleep: [{ date: today, hours: 8 }],
      exercise: { [today]: 30 },
      mood: [{ date: today, mood: 5, note: "" }],
    });
    expect(summary.hasData).toBe(true);
    expect(summary.score).toBe(100);
    expect(summary.loggedCount).toBe(5);
  });

  it("partially scores logged measures", () => {
    const today = dateKey();
    const summary = wellnessSummary({ ...EMPTY_TRACKER, water: { [today]: 1000 } });
    expect(summary.loggedCount).toBe(1);
    expect(summary.score).toBe(50);
  });
});

describe("dates", () => {
  it("formats date keys deterministically for server and client", () => {
    expect(dateKey(new Date(2026, 10, 9))).toBe("2026-11-09");
    expect(shortDate("2026-11-09")).toBe("9 Nov");
    expect(prettyDate("2026-11-09")).toBe("9 Nov 2026");
  });

  it("shifts days across month boundaries", () => {
    expect(dateKey(shiftDate(1, new Date(2026, 10, 30)))).toBe("2026-12-01");
  });
});

describe("i18n", () => {
  it("falls back to English keys rather than rendering undefined", () => {
    expect(translate("fr", "nav.home")).toBe("Home");
    expect(translate("te", "nav.home")).toBe("హోమ్");
    expect(translate("en", "not-a-real-key")).toBe("not-a-real-key");
  });

  it("marks which locales are actually translated", () => {
    expect(isTranslated("hi")).toBe(true);
    expect(isTranslated("fr")).toBe(false);
  });

  it("resolves unknown language codes to English", () => {
    expect(languageByCode("zz").code).toBe("en");
    expect(languageByCode("ar").dir).toBe("rtl");
  });
});
