import express from "express";
import { z } from "zod";
import OpenAI from "openai";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const itinerarySchema = z.object({
  destination: z.string().min(2),
  days: z.number().int().min(1).max(14).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  style: z.string().optional(),
  budgetLevel: z
    .enum(["budget", "midrange", "luxury"])
    .optional()
    .default("midrange"),
});

// POST /api/ai/itinerary
router.post("/itinerary", requireAuth, async (req, res) => {
  // Ensure API key exists
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      error: "AI is not configured on the server.",
    });
  }

  const parsed = itinerarySchema.safeParse({
    ...req.body,
    days:
      req.body.days !== undefined
        ? Number(req.body.days)
        : undefined,
  });

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid itinerary request.",
      details: parsed.error.format(),
    });
  }

  const { destination, startDate, endDate, days, style, budgetLevel } =
    parsed.data;

  const daysText =
    days ||
    (startDate && endDate
      ? `from ${startDate} to ${endDate}`
      : "for a 3–5 day trip");

  const prompt = `
You are an expert travel planner for an app called RoamLog.

Create a daily itinerary for a trip to ${destination}, ${daysText}.
Travel style: ${style || "general interests"}.
Budget level: ${budgetLevel} traveler.

Requirements:
- Organize the plan day-by-day.
- Write 3–5 activities per day.
- Include short descriptions.
- Mix food, sightseeing, culture, and unique experiences.
- End with 3 practical travel tips for visiting ${destination}.
`;

  try {
    // Initialize OpenRouter client instead of OpenAI
    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "RoamLog AI Planner",
      },
    });

    // Make AI request
    const completion = await client.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: "You are an expert travel planner." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Couldn't generate itinerary.";

    return res.json({ itinerary: text });
  } catch (err) {
    console.error("AI Planner Error:", err);

    const code = err?.error?.code;
    if (err?.status === 429 || code === "insufficient_quota") {
      return res.status(503).json({
        error:
          "AI planner is temporarily unavailable due to usage limits. Try again later.",
      });
    }

    return res.status(500).json({
      error: "Failed to generate itinerary.",
    });
  }
});

export default router;