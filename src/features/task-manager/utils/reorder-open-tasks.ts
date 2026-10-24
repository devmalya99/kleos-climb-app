type OpenTask = {
  id: string;
  isCompleted: boolean;
};

function isIdPermutation(current: readonly string[], proposed: readonly string[]): boolean {
  if (current.length === 0 || current.length !== proposed.length) return false;
  const expected = new Set(current);
  if (expected.size !== current.length) return false;
  const seen = new Set<string>();
  for (const id of proposed) {
    if (!expected.has(id) || seen.has(id)) return false;
    seen.add(id);
  }
  return seen.size === current.length;
}

/** The suggested ids when they are exactly the open tasks. Otherwise null. */
export function openTaskOrder(tasks: readonly OpenTask[], taskIds: readonly string[]): string[] | null {
  const openIds = tasks.filter((task) => !task.isCompleted).map((task) => task.id);
  if (!isIdPermutation(openIds, taskIds)) return null;
  return [...taskIds];
}
