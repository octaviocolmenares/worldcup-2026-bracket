import { getStore } from "@netlify/blobs";

// Stores one bracket entry, keyed by email so a person can only have one entry
// (re-submitting updates it). Powers the live pot + leaderboard.
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
    ts: Date.now(),
  };

  const key = email.toLowerCase().replace(/[^a-z0-9@._+-]/g, "") || `anon-${Date.now()}`;
  const store = getStore("entries");
  await store.setJSON(key, entry);

  return json({ ok: true });
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
