import { api } from "@/services/api";

import { CLIMB_PATH } from "../constants/climb.constants";
import type { ClimbBoard } from "../types/climb.types";
import { climbBoardSchema, type ClimbAction, type ClimbSetupInput } from "../utils/climb.schemas";

function boardPath(id: string | null): string {
  if (!id) return CLIMB_PATH;
  return `${CLIMB_PATH}?id=${encodeURIComponent(id)}`;
}

export async function getClimbBoard(id: string | null): Promise<ClimbBoard> {
  const data = await api.get<unknown>(boardPath(id));
  return climbBoardSchema.parse(data);
}

export async function startClimbApi(input: ClimbSetupInput): Promise<ClimbBoard> {
  const data = await api.post<unknown>(CLIMB_PATH, input);
  return climbBoardSchema.parse(data);
}

export async function applyClimbActionApi(
  climbId: string,
  action: ClimbAction,
): Promise<ClimbBoard> {
  const data = await api.patch<unknown>(CLIMB_PATH, { climbId, action });
  return climbBoardSchema.parse(data);
}

export async function deleteClimbApi(id: string): Promise<ClimbBoard> {
  const data = await api.delete<unknown>(boardPath(id));
  return climbBoardSchema.parse(data);
}
