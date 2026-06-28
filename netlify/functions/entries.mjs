import { getStore } from "@netlify/blobs";

// Returns all bracket entries as a JSON array. The leaderboard + pot fetch this.
export default async () => {
  const store = getStore("entries");
  const entries = [];
  try {
    const { blobs } = await store.list();
    for (const b of blobs) {
      const e = await store.get(b.key, { type: "json" });
      if (e) entries.push(e);
    }
  } catch (err) {
    return new Response(JSON.stringify([]), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  return new Response(JSON.stringify(entries), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};
