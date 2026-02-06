import type { paths } from "@/types/stravaTypes.ts";

export type StravaDetailedActivity =
  paths["/activities/{id}"]["get"]["responses"][200]["content"][
    "application/json"
  ];
