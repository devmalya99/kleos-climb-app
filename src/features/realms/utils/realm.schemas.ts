import { z } from "zod";

import {
  AUTOFILL_NOTES_MAX,
  AUTOFILL_NOTES_MIN,
  REALM_NAME_MAX,
} from "../constants/realms.constants";

export const realmNameSchema = z
  .string()
  .trim()
  .min(1, "Realm name is required")
  .max(REALM_NAME_MAX, `Keep it under ${REALM_NAME_MAX} characters`)
  .refine((name) => name !== "Uncategorized", "That name is reserved");

export const autofillNotesSchema = z
  .string()
  .trim()
  .min(AUTOFILL_NOTES_MIN, `Add at least ${AUTOFILL_NOTES_MIN} characters of notes`)
  .max(AUTOFILL_NOTES_MAX, `Keep notes under ${AUTOFILL_NOTES_MAX} characters`);
