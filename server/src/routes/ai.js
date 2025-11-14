import express from "express";
import { z } from "zod";
import OpenAI from "openai";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const itinerarySchema = z.object({
  destination: z.string().min(2),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  days: z.number().int().min(1).max(14).optional(),
  style: z
    .string()
    .optional(), // e.g. "food-focused", "budget traveler", "museum-heavy"
  budgetLevel: z
    .enum(["budget", "midrange", "luxury"])
    .optional()
    .default("midrange"),
});

router.post("/itinerary", requireAuth, async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "AI is not configured on the server.",
    });
  }

  const parse = itinerarySchema.safeParse({
    ...req.body,
    days:
      req.body.days !== undefined
        ? Number(req.body.days)
        : undefined,
  });

  if (!parse.success) {
    return res.status(400).json({
      error: "Invalid itinerary request.",
      details: parse.error.format(),
    });
  }

  const { destination, startDate, endDate, days, style, budgetLevel } =
    parse.data;

  const daysText =
    days ||
    (startDate && endDate
      ? `from ${startDate} to ${endDate}`
      : "for a 3–5 day trip");

  const styleText = style
    ? `The traveler prefers: ${style}.`
    : "The traveler has flexible interests.";

  const budgetText =
    budgetLevel === "budget"
      ? "They are on a budget."
      : budgetLevel === "luxury"
      ? "They prefer a more premium experience."
      : "They are midrange and price-conscious but flexible.";

  const prompt = `
You are a friendly travel planner for an app called RoamLog.

Create a daily itinerary for a trip to ${destination}, ${daysText}.
${styleText}
${budgetText}

Requirements:
- Organize the plan day-by-day.
- For each day, list 3–5 activities with short descriptions.
- Mix food, sightseeing, and local experiences.
- Keep the tone practical and concise.
- At the end, add 3 quick tips specific to ${destination}.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or any model the user chooses
      messages: [
        {
          role: "system",
          content: "You are an expert travel planner.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const text =
      completion.choices[0]?.message?.content?.trim() ||
      "I couldn't generate an itinerary. Please try again.";

    return res.json({ itinerary: text });
  } catch (err) {
    console.error("AI itinerary error:", err);
    return res.status(500).json({
      error: "Failed to generate itinerary.",
    });
  }
});

export default router;