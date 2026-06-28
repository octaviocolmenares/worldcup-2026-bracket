import { getStore } from "@netlify/blobs";

// Returns all bracket entries (the single "entries" document) as a JSON array.
// The leaderboard + pot fetch this on load.
export default async () => {
  const store = getStore("pool");
  let list;
  try { list = await store.get("entries", { type: "json" }); } catch { list = []; }
  if (!Array.isArray(list)) list = [];
  return new Response(JSON.stringify(list), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};
