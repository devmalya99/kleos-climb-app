import assert from "node:assert/strict";

import type { Climb, ClimbLevel } from "../types/climb.types";
import { applyClimbAction, isIdPermutation, reorderPendingLevels } from "./climb-path";

function level(id: string, progress: number, completedAt: string | null): ClimbLevel {
  return { id, title: id, description: `${id} note`, progress, completedAt };
}

const clearedAt = "2026-01-02T00:00:00.000Z";
const climb: Climb = {
  id: "c",
  goal: "Finish DSA",
  deadline: "2027-01-22",
  createdAt: "2026-01-01T00:00:00.000Z",
  levels: [
    level("intro", 100, clearedAt),
    level("trees", 10, null),
    level("array", 20, null),
  ],
};

const next = reorderPendingLevels(climb, ["array", "trees"]);
assert.deepEqual(
  next.levels.map((item) => item.id),
  ["intro", "array", "trees"],
);
assert.equal(next.levels[0]?.completedAt, clearedAt);
assert.equal(next.levels[1]?.title, "array");
assert.equal(next.levels[1]?.progress, 20);
assert.equal(next.levels[1]?.description, "array note");
assert.equal(next.levels[2]?.title, "trees");
assert.equal(next.levels[2]?.progress, 10);

assert.equal(reorderPendingLevels(climb, ["array"]), climb);
assert.equal(reorderPendingLevels(climb, ["array", "trees", "graphs"]), climb);
assert.equal(reorderPendingLevels(climb, ["array", "array"]), climb);
assert.equal(reorderPendingLevels(climb, ["intro", "array"]), climb);
assert.equal(reorderPendingLevels(climb, ["trees", "array"]), climb);

const saved = applyClimbAction(
  climb,
  { type: "reorder", levelIds: ["array", "trees"] },
  new Date(),
  () => "unused",
);
assert.equal(saved.levels[1]?.id, "array");
assert.equal(isIdPermutation(["trees", "array"], ["array", "trees"]), true);
assert.equal(isIdPermutation(["trees"], ["trees", "array"]), false);

console.log("climb-path reorder ok");
