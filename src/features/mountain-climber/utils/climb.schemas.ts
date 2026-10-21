import { z } from "zod";

import {
  GOAL_MAX_LENGTH,
  GOAL_MIN_LENGTH,
  KEY_STEP_COUNT,
  LEVEL_DESCRIPTION_MAX_LENGTH,
  LEVEL_TITLE_MAX_LENGTH,
  MAX_LEVELS,
} from "../constants/climb.constants";

export const levelTitleSchema = z
  .string()
  .trim()
  .min(1, "Give this task a name")
  .max(LEVEL_TITLE_MAX_LENGTH, `Keep it under ${LEVEL_TITLE_MAX_LENGTH} characters`);

export const levelDescriptionSchema = z
  .string()
  .trim()
  .max(
    LEVEL_DESCRIPTION_MAX_LENGTH,
    `Keep the description under ${LEVEL_DESCRIPTION_MAX_LENGTH} characters`,
  );

const deadlineSchema = z.iso.date("Pick a valid date");

const keyStepSchema = z.object({
  title: levelTitleSchema,
  description: levelDescriptionSchema,
});

export const climbSetupSchema = z.object({
  goal: z
    .string()
    .trim()
    .min(GOAL_MIN_LENGTH, "Describe your summit in a few words")
    .max(GOAL_MAX_LENGTH),
  deadline: deadlineSchema,
  keySteps: z.array(keyStepSchema).length(KEY_STEP_COUNT),
});

export type ClimbSetupInput = z.infer<typeof climbSetupSchema>;

/** Validates API responses. A cleared level always reads as progress 100. */
const climbLevelSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1).max(LEVEL_TITLE_MAX_LENGTH),
    description: z.string().max(LEVEL_DESCRIPTION_MAX_LENGTH).default(""),
    progress: z.number().int().min(0).max(100).default(0),
    completedAt: z.iso.datetime().nullable(),
  })
  .transform((level) => ({
    ...level,
    progress: level.completedAt ? 100 : level.progress,
  }));

export const climbLevelsSchema = z.array(climbLevelSchema).min(1).max(MAX_LEVELS);

export const climbSchema = z.object({
  id: z.string().min(1),
  goal: z.string().min(1).max(GOAL_MAX_LENGTH),
  deadline: deadlineSchema,
  createdAt: z.iso.datetime(),
  levels: climbLevelsSchema,
});

export const climbSessionSchema = z.object({
  id: z.string().min(1),
  goal: z.string().min(1).max(GOAL_MAX_LENGTH),
  deadline: deadlineSchema,
  clearedLevels: z.number().int().nonnegative(),
  totalLevels: z.number().int().positive(),
  updatedAt: z.iso.datetime(),
});

export const climbBoardSchema = z.object({
  sessions: z.array(climbSessionSchema),
  climb: climbSchema.nullable(),
});

/*
 * The client sends intent, never a full climb. The server re-applies the
 * action to its own copy.
 */
export const climbActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("clear") }),
  z.object({ type: z.literal("undo") }),
  z.object({
    type: z.literal("add"),
    title: levelTitleSchema,
    description: levelDescriptionSchema,
  }),
  z.object({ type: z.literal("remove"), levelId: z.string().min(1) }),
  z.object({
    type: z.literal("edit"),
    levelId: z.string().min(1),
    title: levelTitleSchema,
    description: levelDescriptionSchema,
  }),
  z.object({
    type: z.literal("setProgress"),
    levelId: z.string().min(1),
    progress: z.number().int().min(0).max(100),
  }),
  z.object({
    type: z.literal("move"),
    activeId: z.string().min(1),
    overId: z.string().min(1),
  }),
]);

export type ClimbAction = z.infer<typeof climbActionSchema>;
