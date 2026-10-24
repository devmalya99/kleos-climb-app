import { z } from "zod";

import {
  DISPLAY_NAME_MAX,
  GOAL_MAX_LENGTH,
  GOAL_MIN_LENGTH,
  TASK_TITLE_MAX,
} from "../constants/onboarding.constants";

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Enter your name")
  .max(DISPLAY_NAME_MAX, `Keep your name under ${DISPLAY_NAME_MAX} characters`);

export const onboardingGoalSchema = z
  .string()
  .trim()
  .min(GOAL_MIN_LENGTH, "Describe the expedition in a few words")
  .max(GOAL_MAX_LENGTH, `Keep the goal under ${GOAL_MAX_LENGTH} characters`);

export const onboardingDeadlineSchema = z.iso.date("Use a date like 2027-01-22");

export const onboardingTaskTitleSchema = z
  .string()
  .trim()
  .min(1, "Name the task")
  .max(TASK_TITLE_MAX, `Keep the task under ${TASK_TITLE_MAX} characters`);

export const onboardingRequestSchema = z.object({
  displayName: displayNameSchema,
  goal: onboardingGoalSchema,
  deadline: onboardingDeadlineSchema,
  taskTitle: onboardingTaskTitleSchema,
});

export type OnboardingRequest = z.infer<typeof onboardingRequestSchema>;
