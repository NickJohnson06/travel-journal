import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Types.ObjectId,
    ref: "Trip",
    required: true,
    index: true,
  },
  title: { type: String, required: true, trim: true, minlength: 2 },
  content: { type: String, required: true, minlength: 10, trim: true },
  date: { type: String, required: true }, // store ISO date
  photoUrl: { type: String, default: "" },
}, { timestamps: true });

EntrySchema.index({ tripId: 1 });

export default mongoose.model("Entry", EntrySchema);