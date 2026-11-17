import { describe, expect, it } from "vitest";
import { classifyComplexity, retrieveContext } from "./retrieval";
import { buildSystemPrompt } from "./prompt";

describe("classifyComplexity", () => {
  it("treats short everyday questions as simple", () => {
    expect(classifyComplexity("How can I sleep better?")).toBe("simple");
  });

  it("escalates safety-sensitive topics", () => {
    expect(classifyComplexity("Does turmeric interact with warfarin?")).toBe("complex");
    expect(classifyComplexity("Is ashwagandha safe in pregnancy?")).toBe("complex");
    expect(classifyComplexity("What is the dosage for tulasi?")).toBe("complex");
  });
});

describe("retrieveContext", () => {
  it("returns nothing for an empty query", () => {
    expect(retrieveContext("")).toBe("");
  });

  it("finds the matching plant and its toxicity note", () => {
    const context = retrieveContext("ashwagandha root for stress");
    expect(context).toContain("Withania somnifera");
    expect(context.toLowerCase()).toContain("toxicity");
  });

  it("finds a library entry by common name", () => {
    const context = retrieveContext("tulasi holy basil tea");
    expect(context.toLowerCase()).toContain("tulasi");
  });

  it("falls back to a clear instruction when nothing matches", () => {
    const context = retrieveContext("zzzz qqqq");
    expect(context).toContain("No specific entry");
  });

  it("keeps the prompt scoped to a question rather than the whole library", () => {
    const focused = buildSystemPrompt("What does the evidence say about ashwagandha?");
    const unrelated = buildSystemPrompt("zzzz qqqq");
    expect(focused.length).toBeGreaterThan(unrelated.length);
    expect(focused.length).toBeLessThan(6000);
  });
});
