import { getStore } from "@netlify/blobs";

// Upserts a bracket entry into a single "entries" document (one entry per email).
// Using one document keeps reads strongly consistent, so the pot/leaderboard
// reflect a new submission immediately.
export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ ok: false, error: "Bad JSON" }, 400); }

  const name = (body?.name || "").toString().trim().slice(0, 60);
  const email = (body?.email || "").toString().trim().slice(0, 80);
  if (!name || !email) return json({ ok: false, error: "name and email are required" }, 400);

  const entry = {
    name,
    email,
    picks: body?.picks && typeof body.picks === "object" ? body.picks : {},
    potm: (body?.potm || "").toString().trim().slice(0, 50),
    scorer: (body?.scorer || "").toString().trim().slice(0, 50),
    mode: body?.mode === "fun" ? "fun" : "money",
    ts: Date.now(),
  };

  const norm = (s) => (s || "").toString().toLowerCase().replace(/\s+/g, "");
  const store = getStore("pool");
  let list = await store.get("entries", { type: "json" });
  if (!Array.isArray(list)) list = [];
  list = list.filter((e) => norm(e.email) !== norm(email)); // one entry per email (resubmit updates)
  list.push(entry);
  await store.setJSON("entries", list);

  return json({ ok: true, count: list.length });
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
