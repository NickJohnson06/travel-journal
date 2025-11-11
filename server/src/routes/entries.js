import { Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Trip from "../models/Trip.js";
import Entry from "../models/Entry.js";

const r = Router();
r.use(requireAuth);

// Utility: confirm that the trip belongs to the logged-in user
async function assertTripOwner(userId, tripId) {
  const t = await Trip.findOne({ _id: tripId, userId });
  if (!t) throw Object.assign(new Error("Trip not found or not authorized"), { status: 404 });
}

// GET /api/entries?tripId=...
r.get("/", asyncHandler(async (req, res) => {
  const { tripId } = req.query;
  if (!tripId) return res.status(400).json({ error: "tripId query required" });
  await assertTripOwner(req.user.id, tripId);
  const entries = await Entry.find({ tripId }).sort({ date: -1 });
  res.json({ entries });
}));

// POST /api/entries
r.post("/", asyncHandler(async (req, res) => {
  const { tripId, title, content, date, photoUrl = "" } = req.body;
  if (!tripId || !title?.trim() || !content?.trim() || !date)
    return res.status(400).json({ error: "Missing required fields" });

  await assertTripOwner(req.user.id, tripId);

  const e = await Entry.create({
    tripId,
    title: title.trim(),
    content: content.trim(),
    date,
    photoUrl,
  });

  res.status(201).json({ entry: e });
}));

// GET /api/entries/:id
r.get("/:id", asyncHandler(async (req, res) => {
  const e = await Entry.findById(req.params.id);
  if (!e) return res.status(404).json({ error: "Entry not found" });
  await assertTripOwner(req.user.id, e.tripId);
  res.json({ entry: e });
}));

// PUT /api/entries/:id
r.put("/:id", asyncHandler(async (req, res) => {
  const e = await Entry.findById(req.params.id);
  if (!e) return res.status(404).json({ error: "Entry not found" });
  await assertTripOwner(req.user.id, e.tripId);

  const { title, content, date, photoUrl } = req.body;
  if (title) e.title = title.trim();
  if (content) e.content = content.trim();
  if (date) e.date = date;
  if (photoUrl) e.photoUrl = photoUrl;

  await e.save();
  res.json({ entry: e });
}));

// DELETE /api/entries/:id
r.delete("/:id", asyncHandler(async (req, res) => {
  const e = await Entry.findById(req.params.id);
  if (!e) return res.status(404).json({ error: "Entry not found" });
  await assertTripOwner(req.user.id, e.tripId);
  await e.deleteOne();
  res.json({ ok: true });
}));

export default r;