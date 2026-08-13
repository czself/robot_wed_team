export const TEAM_GROUPS = ["机械组", "电控组"] as const;

export type TeamGroupName = (typeof TEAM_GROUPS)[number];

export const DEFAULT_TEAM_GROUP: TeamGroupName = "电控组";

export function isTeamGroup(value: string): value is TeamGroupName {
  return (TEAM_GROUPS as readonly string[]).includes(value);
}

export function normalizeTeamGroup(value: string): TeamGroupName {
  return value === "机械组" ? "机械组" : "电控组";
}

export const RECRUIT_DIRECTION_KEYS = ["mechanical", "electrical"] as const;

export type RecruitDirectionKey = (typeof RECRUIT_DIRECTION_KEYS)[number];

export const RECRUIT_GROUP_LABELS: Record<RecruitDirectionKey, TeamGroupName> = {
  mechanical: "机械组",
  electrical: "电控组",
};

export function isRecruitDirectionKey(value: string): value is RecruitDirectionKey {
  return (RECRUIT_DIRECTION_KEYS as readonly string[]).includes(value);
}

export function normalizeRecruitDirection(
  value: string
): RecruitDirectionKey | null {
  if (isRecruitDirectionKey(value)) return value;

  // Preserve historical submissions while presenting all former technical
  // directions as the current electrical-control direction.
  if (["embedded", "vision", "algorithm"].includes(value)) {
    return "electrical";
  }

  return null;
}

export function getRecruitGroupLabel(value: string): string {
  const direction = normalizeRecruitDirection(value);
  return direction ? RECRUIT_GROUP_LABELS[direction] : "历史报名（待分配）";
}

export const RESOURCE_CATEGORIES = ["机械", "电控"] as const;

export type TeamResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export function isResourceCategory(value: string): value is TeamResourceCategory {
  return (RESOURCE_CATEGORIES as readonly string[]).includes(value);
}

export function normalizeResourceCategory(value: string): TeamResourceCategory {
  if (value === "机械") return "机械";
  return "电控";
}
