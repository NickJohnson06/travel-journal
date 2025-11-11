import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', index: true, required: true },
  name: { type: String, required: true, trim: true, minlength: 2 },
  location: { type: String, required: true, trim: true },
  startDate: { type: String, required: true }, // ISO date string
  endDate: { type: String, required: true },   // ISO date string
  budget: { type: Number, default: 0, min: 0 },
  notes: { type: String, default: "" },
  imageUrl: { type: String, default: "" }
}, { timestamps: true });

TripSchema.index({ userId: 1 });

export default mongoose.model('Trip', TripSchema);