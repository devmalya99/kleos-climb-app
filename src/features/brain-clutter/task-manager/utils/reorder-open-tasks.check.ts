import assert from "node:assert/strict";

import { openTaskOrder } from "../../../task-manager/utils/reorder-open-tasks";

const tasks = [
  { id: "intro", isCompleted: true },
  { id: "trees", isCompleted: false },
  { id: "array", isCompleted: false },
];

assert.deepEqual(openTaskOrder(tasks, ["array", "trees"]), ["array", "trees"]);
assert.equal(openTaskOrder(tasks, ["trees", "array", "intro"]), null);
assert.equal(openTaskOrder(tasks, ["array"]), null);
assert.equal(openTaskOrder(tasks, ["array", "array"]), null);
assert.equal(openTaskOrder(tasks, ["array", "graphs"]), null);
assert.equal(openTaskOrder([], []), null);

console.log("reorder-open-tasks ok");
