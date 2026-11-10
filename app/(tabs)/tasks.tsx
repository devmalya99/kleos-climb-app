import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { ClutterSearchSheet } from "@/features/brain-clutter";
import { TasksScreen } from "@/features/task-manager";

export default function TasksTab() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string | string[] }>();
  const focusCategoryId = Array.isArray(categoryId) ? categoryId[0] : categoryId;
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  return (
    <>
      <TasksScreen
        focusCategoryId={selectedCategoryId ?? focusCategoryId ?? null}
        onSearch={() => setSearchOpen(true)}
      />
      <ClutterSearchSheet
        visible={searchOpen}
        scope="tasks"
        onClose={() => setSearchOpen(false)}
        onOpenNote={() => setSearchOpen(false)}
        onOpenTask={(id) => {
          setSearchOpen(false);
          setSelectedCategoryId(id);
        }}
      />
    </>
  );
}
