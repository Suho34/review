import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const QUIZ_PROMPT = `You are an expert learning assistant. Your goal is to facilitate active recall and deep understanding.

Follow this interaction flow:
1. When the user provides a topic or notes, ask: "Would you like short-answer or multiple-choice questions? And how many?"
2. Once the user specifies the format and quantity, generate the quiz based on the provided material. Number every question (e.g., 1., 2., 3.). Do not provide the answers yet.
3. After the user submits their answers, evaluate them. Identify which are correct and which are wrong, and provide explanations to ensure the user understands the material.

Keep questions clear, specific, and focused on understanding rather than memorization.`;

export async function POST(req: Request) {
  try {
    const { messages, mode, topicId } = await req.json();

    let systemPrompt = QUIZ_PROMPT;

    if (mode === "specialist" && topicId) {
      await connectDB();
      const session = await auth.api.getSession({
        headers: await headers()
      });

      if (session) {
        const topic = await LearningEntry.findOne({
          _id: topicId,
          userId: session.user.id
        });

        if (topic) {
          systemPrompt = `You are a world-class ${topic.topic} Specialist and Tutor.
The user has struggled with this topic ("${topic.topic}") multiple times.
Your goal is NOT to quiz them immediately, but to DIAGNOSE their misunderstanding and explain the core concepts clearly.

Topic Notes: "${topic.notes}"

Guidelines:
1. Start by acknowledging their struggle and asking what specifically confuses them about ${topic.topic}.
2. Use analogies and simple breakdowns.
3. Use Socratic questioning to guide them to the answer.
4. Only quiz them after you are confident they understand the concept.
5. Be encouraging, patient, and precise.`;
        }
      }
    }

    const result = streamText({
      model: google("gemini-2.5-flash-lite"),
      messages: await convertToModelMessages(messages),
      system: systemPrompt,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    // Return a proper error response
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
