import { runAudit } from "./auditEngine.js";

describe("Audit Engine", () => {

  test("flags team plan with 1 seat as overkill", () => {
    const tools = [{ toolId: "claude", plan: "Team ($30/seat)", seats: 1 }];
    const result = runAudit(tools, 1, "coding");
    expect(result.results[0].savings).toBeGreaterThan(0);
    expect(result.results[0].status).toBe("savings");
  });

  test("flags seats exceeding team size", () => {
    const tools = [{ toolId: "cursor", plan: "Pro ($20/seat)", seats: 5 }];
    const result = runAudit(tools, 2, "coding");
    expect(result.results[0].savings).toBeGreaterThan(0);
    expect(result.results[0].recommendation).toMatch(/reduce/i);
  });

  test("detects coding tool overlap", () => {
    const tools = [
      { toolId: "cursor", plan: "Pro ($20/seat)", seats: 1 },
      { toolId: "copilot", plan: "Individual ($10/seat)", seats: 1 },
      { toolId: "windsurf", plan: "Pro ($15/seat)", seats: 1 },
    ];
    const result = runAudit(tools, 3, "coding");
    const codingTools = result.results.filter(r =>
      ["cursor", "copilot", "windsurf"].includes(r.toolId)
    );
    expect(codingTools.some(t => t.status === "warning")).toBe(true);
  });

  test("returns optimal for right-sized spend", () => {
    const tools = [{ toolId: "cursor", plan: "Pro ($20/seat)", seats: 2 }];
    const result = runAudit(tools, 2, "coding");
    expect(result.results[0].status).toBe("optimal");
    expect(result.results[0].savings).toBe(0);
  });

  test("calculates total savings correctly", () => {
    const tools = [
      { toolId: "claude", plan: "Team ($30/seat)", seats: 1 },
      { toolId: "chatgpt", plan: "Team ($30/seat)", seats: 1 },
    ];
    const result = runAudit(tools, 1, "writing");
    const manualTotal = result.results.reduce((sum, r) => sum + r.savings, 0);
    expect(result.totalSavings).toBe(manualTotal);
  });

});