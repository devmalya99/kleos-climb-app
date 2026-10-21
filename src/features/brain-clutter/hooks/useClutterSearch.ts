import { useEffect, useState } from "react";

import { listCategoriesApi, listTasksApi } from "@/features/task-manager";
import { getErrorMessage } from "@/services/api";

import { getGroupApi, listGroupsApi } from "../api/groups.api";

export type NoteSearchHit = {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  content: string;
};

export type TaskSearchHit = {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  notes: string;
};

function matches(query: string, ...parts: string[]): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return false;
  return parts.join(" ").toLowerCase().includes(needle);
}

/** Loads every note and task once, then filters them by title and body text. */
export function useClutterSearch(enabled: boolean) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteSearchHit[]>([]);
  const [tasks, setTasks] = useState<TaskSearchHit[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [groups, categories] = await Promise.all([listGroupsApi(), listCategoriesApi()]);
        const [details, taskLists] = await Promise.all([
          Promise.all(groups.groups.map((group) => getGroupApi(group.id))),
          Promise.all(
            categories.map(async (category) => ({
              category,
              tasks: await listTasksApi(category.id),
            })),
          ),
        ]);
        if (cancelled) return;
        setNotes(
          details.flatMap((detail) =>
            detail.notes.map((note) => ({
              id: note.id,
              groupId: detail.group.id,
              groupName: detail.group.name,
              title: note.title,
              content: note.content,
            })),
          ),
        );
        setTasks(
          taskLists.flatMap((list) =>
            list.tasks.map((task) => ({
              id: task.id,
              categoryId: list.category.id,
              categoryName: list.category.name,
              title: task.title,
              notes: task.notes,
            })),
          ),
        );
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not search your clutter."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const noteResults = notes.filter((note) => matches(query, note.title, note.content));
  const taskResults = tasks.filter((task) => matches(query, task.title, task.notes));

  return { query, setQuery, loading, error, noteResults, taskResults };
}
