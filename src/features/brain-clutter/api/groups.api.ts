import { api } from "@/services/api";

import type {
  ClutterGroup,
  GroupDetailResponse,
  GroupResponse,
  GroupUpdateInput,
  GroupsResponse,
} from "../types/brainClutter.types";

const base = "/api/brain-clutter/groups";

export async function listGroupsApi(): Promise<GroupsResponse> {
  return api.get<GroupsResponse>(base);
}

export async function getGroupApi(groupId: string): Promise<GroupDetailResponse> {
  return api.get<GroupDetailResponse>(`${base}/${groupId}`);
}

export async function createGroupApi(name: string): Promise<ClutterGroup> {
  const data = await api.post<GroupResponse>(base, { name });
  return data.group;
}

export async function updateGroupApi(
  groupId: string,
  input: GroupUpdateInput,
): Promise<ClutterGroup> {
  const data = await api.patch<GroupResponse>(`${base}/${groupId}`, input);
  return data.group;
}

export async function deleteGroupApi(groupId: string): Promise<void> {
  await api.delete(`${base}/${groupId}`);
}
