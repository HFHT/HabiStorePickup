import { fetchJson } from ".";

export async function fetchAll(collection: { url: string, init: { method: string, headers: any, body?: string } }[]) {
  const allData = await Promise.all(
    collection.map(({ url, init }: any) => fetchJson(url, init))
  );
  return allData
};