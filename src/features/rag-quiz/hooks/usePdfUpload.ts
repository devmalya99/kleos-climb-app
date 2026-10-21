import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";

import { useSoftAction } from "@/shared/hooks/useSoftAction";

import { uploadPackApi } from "../api/packs.api";
import { PDF_MIME_TYPE, RAG_MIN_DOCS, RAG_QUERY_KEYS, ragHref } from "../constants/ragQuiz.constants";
import type { PickedPdf } from "../types/ragQuiz.types";
import { mergePickedPdfs } from "../utils/ragQuiz.utils";

/** Pick 1–3 PDFs, upload them as a pack, then open the pack screen to process it. */
export function usePdfUpload() {
  const queryClient = useQueryClient();
  const { error, run, clearError, fail } = useSoftAction();
  const [files, setFiles] = useState<PickedPdf[]>([]);
  const mutation = useMutation({ mutationFn: uploadPackApi });

  async function pickFiles() {
    clearError();
    const result = await run(
      () =>
        DocumentPicker.getDocumentAsync({
          type: PDF_MIME_TYPE,
          multiple: true,
          copyToCacheDirectory: true,
        }),
      "Could not open the file picker",
    );
    if (!result.ok || result.value.canceled) return;

    const picked: PickedPdf[] = result.value.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.name,
      size: asset.size ?? 0,
      mimeType: asset.mimeType ?? PDF_MIME_TYPE,
    }));
    const merged = mergePickedPdfs(files, picked);
    setFiles(merged.files);
    if (merged.error) fail(merged.error);
  }

  function removeFile(uri: string) {
    setFiles((current) => current.filter((file) => file.uri !== uri));
  }

  async function upload() {
    if (files.length < RAG_MIN_DOCS) {
      fail(`Select at least ${RAG_MIN_DOCS} PDF.`);
      return;
    }
    const result = await run(() => mutation.mutateAsync(files), "Upload failed");
    if (!result.ok) return;
    setFiles([]);
    queryClient.setQueryData(RAG_QUERY_KEYS.pack(result.value.id), result.value);
    router.push(ragHref.pack(result.value.id));
  }

  return {
    files,
    pickFiles,
    removeFile,
    upload,
    isUploading: mutation.isPending,
    error,
  };
}
