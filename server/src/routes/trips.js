import { Router } from "express";
import Trip from "../models/Trip.js";
import requireAuth from "../middleware/requireAuth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const r = Router();
r.use(requireAuth);

// GET /api/trips — list current user trips
r.get("/", asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.user.id }).sort({ startDate: 1 });
  res.json({ trips });
}));

// POST /api/trips — create
r.post("/", asyncHandler(async (req, res) => {
  const { name, location, startDate, endDate, budget = 0, notes = "", imageUrl = "" } = req.body;
  if (!name?.trim() || !location?.trim() || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const t = await Trip.create({ userId: req.user.id, name: name.trim(), location: location.trim(), startDate, endDate, budget, notes, imageUrl });
  res.status(201).json({ trip: t });
}));

// GET /api/trips/:id — read one (must belong to user)
r.get("/:id", asyncHandler(async (req, res) => {
  const t = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!t) return res.status(404).json({ error: "Trip not found" });
  res.json({ trip: t });
}));

// PUT /api/trips/:id — update
r.put("/:id", asyncHandler(async (req, res) => {
  const update = req.body;
  const t = await Trip.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    update,
    { new: true, runValidators: true }
  );
  if (!t) return res.status(404).json({ error: "Trip not found" });
  res.json({ trip: t });
}));

// DELETE /api/trips/:id
r.delete("/:id", asyncHandler(async (req, res) => {
  const t = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!t) return res.status(404).json({ error: "Trip not found" });
  res.json({ ok: true });
}));

export default r;