import { api } from "@/services/api";

import type {
  PackResponse,
  PacksResponse,
  PickedPdf,
  RagPack,
  RagPackSummary,
} from "../types/ragQuiz.types";

const base = "/api/rag-quiz/packs";

export async function listPacksApi(): Promise<RagPackSummary[]> {
  const data = await api.get<PacksResponse>(base);
  return data.packs;
}

export async function getPackApi(packId: string): Promise<RagPack> {
  const data = await api.get<PackResponse>(`${base}/${packId}`);
  return data.pack;
}

export async function uploadPackApi(files: PickedPdf[]): Promise<RagPack> {
  const form = new FormData();
  for (const file of files) {
    // React Native accepts a `{ uri, name, type }` descriptor as a file part.
    form.append("files", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);
  }
  const data = await api.postForm<PackResponse>(base, form);
  return data.pack;
}

/** One stepped processing call. Repeat until the pack is `ready` or `failed`. */
export async function processPackApi(packId: string): Promise<RagPack> {
  const data = await api.post<PackResponse>(`${base}/${packId}/process`);
  return data.pack;
}

export async function deletePackApi(packId: string): Promise<void> {
  await api.delete(`${base}/${packId}`);
}
