import assert from "node:assert/strict";

import {
  displayNameSchema,
  onboardingDeadlineSchema,
  onboardingGoalSchema,
  onboardingRequestSchema,
  onboardingTaskTitleSchema,
} from "./schemas";

assert.equal(displayNameSchema.parse("  Asha  "), "Asha");
assert.equal(displayNameSchema.safeParse("").success, false);
assert.equal(displayNameSchema.safeParse("   ").success, false);
assert.equal(displayNameSchema.safeParse("a").success, true);
assert.equal(displayNameSchema.safeParse("a".repeat(40)).success, true);
assert.equal(displayNameSchema.safeParse("a".repeat(41)).success, false);

assert.equal(onboardingGoalSchema.safeParse("ab").success, false);
assert.equal(onboardingGoalSchema.parse("  Finish DSA  "), "Finish DSA");
assert.equal(onboardingGoalSchema.safeParse("a".repeat(160)).success, true);
assert.equal(onboardingGoalSchema.safeParse("a".repeat(161)).success, false);

assert.equal(onboardingDeadlineSchema.parse("2027-01-22"), "2027-01-22");
assert.equal(onboardingDeadlineSchema.safeParse("01-22-2027").success, false);
assert.equal(onboardingDeadlineSchema.safeParse("2027-1-22").success, false);

assert.equal(onboardingTaskTitleSchema.parse("  Learn arrays  "), "Learn arrays");
assert.equal(onboardingTaskTitleSchema.safeParse("").success, false);
assert.equal(onboardingTaskTitleSchema.safeParse("a".repeat(120)).success, true);
assert.equal(onboardingTaskTitleSchema.safeParse("a".repeat(121)).success, false);

const request = onboardingRequestSchema.parse({
  displayName: " Asha ",
  goal: " Finish DSA ",
  deadline: "2027-01-22",
  taskTitle: " Learn arrays ",
});
assert.deepEqual(request, {
  displayName: "Asha",
  goal: "Finish DSA",
  deadline: "2027-01-22",
  taskTitle: "Learn arrays",
});

console.log("onboarding schemas ok");
