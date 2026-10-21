import AsyncStorage from "@react-native-async-storage/async-storage";
import { dehydrate, hydrate, type QueryClient } from "@tanstack/react-query";

const STORAGE_KEY = "kleos.query-cache.v1";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;
const PERSIST_DELAY_MS = 700;

type Snapshot = {
  savedAt: number;
  state: ReturnType<typeof dehydrate>;
};

let generation = 0;
let timer: ReturnType<typeof setTimeout> | null = null;

function shouldKeep(queryKey: readonly unknown[]) {
  const [root, second] = queryKey;
  if (root === "auth") return false;
  if (root === "taurus" && second === "conversation") return false;
  return true;
}

/** Restore the last successful server cache so screens can paint before the network. */
export async function restoreQueryCache(client: QueryClient) {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const snapshot = JSON.parse(raw) as Snapshot;
    if (!snapshot?.state || Date.now() - snapshot.savedAt > MAX_AGE_MS) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }
    hydrate(client, snapshot.state);
  } catch {
    await AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
  }
}

/** Drop the disk cache. Call this on logout so the next account cannot see it. */
export async function clearPersistedQueryCache() {
  generation += 1;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function watchQueryCache(client: QueryClient) {
  return client.getQueryCache().subscribe(() => {
    const gen = generation;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void writeCache(client, gen);
    }, PERSIST_DELAY_MS);
  });
}

async function writeCache(client: QueryClient, gen: number) {
  if (gen !== generation) return;
  try {
    const state = dehydrate(client, {
      shouldDehydrateQuery: (query) =>
        query.state.status === "success" && shouldKeep(query.queryKey),
    });
    if (gen !== generation) return;
    const snapshot: Snapshot = { savedAt: Date.now(), state };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // A failed write only costs the next cold start a network round trip.
  }
}
