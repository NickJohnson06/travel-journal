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
  const { name, location, startDate, endDate, budget, notes = "", imageUrl = "" } = req.body;

  // Basic required fields
  if (!name?.trim() || !location?.trim() || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields: name, location, startDate, endDate" });
  }

  // Date validation
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ error: "Invalid date format" });
  }
  if (end < start) {
    return res.status(400).json({ error: "End date cannot be before start date" });
  }

  // Budget validation
  let parsedBudget = Number(budget) || 0;
  if (parsedBudget < 0) parsedBudget = 0;

  // Create trip
  const trip = await Trip.create({
    userId: req.user.id,
    name: name.trim(),
    location: location.trim(),
    startDate,
    endDate,
    budget: parsedBudget,
    notes,
    imageUrl
  });

  res.status(201).json({ trip });
}));

// GET /api/trips/:id — read one (must belong to user)
r.get("/:id", asyncHandler(async (req, res) => {
  const t = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
  if (!t) return res.status(404).json({ error: "Trip not found" });
  res.json({ trip: t });
}));

// PUT /api/trips/:id — update
r.put("/:id", asyncHandler(async (req, res) => {
  const { name, location, startDate, endDate, budget, notes, imageUrl } = req.body;

  // Optional: validate dates only if provided
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (end < start) {
      return res.status(400).json({ error: "End date cannot be before start date" });
    }
  }

  // Budget validation if provided
  let parsedBudget = budget !== undefined ? Number(budget) : undefined;
  if (parsedBudget !== undefined && parsedBudget < 0) {
    parsedBudget = 0;
  }

  const updateFields = {
    ...(name && { name: name.trim() }),
    ...(location && { location: location.trim() }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(parsedBudget !== undefined && { budget: parsedBudget }),
    ...(notes && { notes }),
    ...(imageUrl && { imageUrl })
  };

  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updateFields,
    { new: true, runValidators: true }
  );

  if (!trip) return res.status(404).json({ error: "Trip not found" });
  res.json({ trip });
}));

// DELETE /api/trips/:id
r.delete("/:id", asyncHandler(async (req, res) => {
  const t = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!t) return res.status(404).json({ error: "Trip not found" });
  res.json({ ok: true });
}));

export default r;