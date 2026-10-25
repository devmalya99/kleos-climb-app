import { Directory, File, Paths } from "expo-file-system";

const STORE_DIRECTORY = "app-storage";

function storeDirectory(): Directory {
  const directory = new Directory(Paths.document, STORE_DIRECTORY);
  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }
  return directory;
}

function fileFor(key: string): File {
  return new File(storeDirectory(), encodeURIComponent(key));
}

export async function getItem(key: string): Promise<string | null> {
  const file = fileFor(key);
  if (!file.exists) return null;
  return file.text();
}

export async function setItem(key: string, value: string): Promise<void> {
  const file = fileFor(key);
  if (!file.exists) {
    file.create();
  }
  file.write(value);
}

export async function removeItem(key: string): Promise<void> {
  const file = fileFor(key);
  if (!file.exists) return;
  file.delete();
}
