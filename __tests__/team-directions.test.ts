import { describe, expect, it } from "vitest";
import {
  DEFAULT_TEAM_GROUP,
  getRecruitGroupLabel,
  isRecruitDirectionKey,
  isResourceCategory,
  isTeamGroup,
  normalizeRecruitDirection,
  normalizeResourceCategory,
  normalizeTeamGroup,
} from "@/data/team-directions";
import { trainingTracks } from "@/data/tech-star";

describe("two-direction team model", () => {
  it("only accepts mechanical and electrical account groups", () => {
    expect(DEFAULT_TEAM_GROUP).toBe("电控组");
    expect(isTeamGroup("机械组")).toBe(true);
    expect(isTeamGroup("电控组")).toBe(true);
    expect(isTeamGroup("视觉组")).toBe(false);
    expect(normalizeTeamGroup("嵌入式组")).toBe("电控组");
  });

  it("accepts new recruitment directions and maps historic technical submissions", () => {
    expect(isRecruitDirectionKey("mechanical")).toBe(true);
    expect(isRecruitDirectionKey("electrical")).toBe(true);
    expect(isRecruitDirectionKey("vision")).toBe(false);
    expect(normalizeRecruitDirection("embedded")).toBe("electrical");
    expect(normalizeRecruitDirection("vision")).toBe("electrical");
    expect(normalizeRecruitDirection("algorithm")).toBe("electrical");
    expect(getRecruitGroupLabel("vision")).toBe("电控组");
    expect(getRecruitGroupLabel("operations")).toBe("历史报名（待分配）");
  });

  it("limits new resource categories and normalizes historical categories", () => {
    expect(isResourceCategory("机械")).toBe(true);
    expect(isResourceCategory("电控")).toBe(true);
    expect(isResourceCategory("视觉")).toBe(false);
    expect(normalizeResourceCategory("嵌入式")).toBe("电控");
    expect(normalizeResourceCategory("视觉")).toBe("电控");
    expect(normalizeResourceCategory("算法")).toBe("电控");
    expect(normalizeResourceCategory("运营")).toBe("电控");
  });

  it("provides complete growth paths for both technical groups", () => {
    expect(trainingTracks.map((track) => track.id)).toEqual(["mechanical", "electrical"]);
    expect(trainingTracks.every((track) => track.stages.length === 4)).toBe(true);
    expect(trainingTracks.every((track) => track.stages.every((stage) => stage.items.length >= 5))).toBe(true);

    const mechanical = trainingTracks.find((track) => track.id === "mechanical");
    const electrical = trainingTracks.find((track) => track.id === "electrical");

    expect(mechanical?.stages.flatMap((stage) => stage.items)).toContain("SolidWorks 基础建模");
    expect(electrical?.stages.flatMap((stage) => stage.items)).toContain("视觉自瞄上车");
  });
});
