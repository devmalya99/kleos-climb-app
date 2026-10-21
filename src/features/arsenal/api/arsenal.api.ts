import { api } from "@/services/api";

import type { ArsenalData } from "../types/arsenal.types";

/** 403 while Arsenal is locked. */
export function getArsenalApi() {
  return api.get<ArsenalData>("/api/arsenal");
}
