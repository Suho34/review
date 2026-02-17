import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // 1. Fetch relevant data
        // - Weak topics: consecutiveStruggles >= 2 OR difficulty = 'hard'
        // - Decay/Overdue: nextReviewAt < now (significantly overdue?)
        // - Recent activity: lastReviewedAt sorted desc

        const weakTopics = await LearningEntry.find({
            userId: session.user.id,
            $or: [{ consecutiveStruggles: { $gte: 2 } }, { difficulty: "hard" }],
        })
            .limit(5)
            .select("topic difficulty consecutiveStruggles lastReviewedAt");

        const overdueTopics = await LearningEntry.find({
            userId: session.user.id,
            nextReviewAt: { $lt: new Date() },
        })
            .sort({ nextReviewAt: 1 }) // Most overdue first
            .limit(5)
            .select("topic nextReviewAt");

        const totalTopics = await LearningEntry.countDocuments({
            userId: session.user.id,
        });

        // If no data, return generic welcome
        if (totalTopics === 0) {
            return NextResponse.json({
                insight:
                    "Welcome! Start by adding some topics you want to learn. I'll help you track your progress and suggest what to review next.",
            });
        }

        if (weakTopics.length === 0 && overdueTopics.length === 0) {
            return NextResponse.json({
                insight:
                    "You're doing great! No immediate weak spots or overdue reviews detected. Keep adding new topics to expand your knowledge base.",
            });
        }

        // 2. Construct Prompt
        const prompt = `
      You are a "Personal Learning Strategist" agent.
      Analyze the user's current learning state and provide a single, concise, actionable recommendation.
      
      User Stats:
      - Total Topics: ${totalTopics}
      
      Weak Topics (struggling with these):
      ${weakTopics.map((t) => `- ${t.topic} (Struggles: ${t.consecutiveStruggles || 0})`).join("\n")}
      
      Overdue Topics (decay patterns detected):
      ${overdueTopics.map((t) => `- ${t.topic} (Due: ${new Date(t.nextReviewAt).toLocaleDateString()})`).join("\n")}
      
      Instructions:
      1. Prioritize addressing weak topics if they exist. Suggest a specific related concept to review (e.g., if weak in "Recursion", suggest "Tree Traversal").
      2. If no weak topics, focus on clearing the backlog of overdue items.
      3. Be encouraging but direct.
      4. MAX 2 sentences.
      5. Output ONLY the recommendation text.
    `;

        // 3. Call AI SDK
        const { text } = await generateText({
            model: google("gemini-3-flash-preview"),
            prompt: prompt,
        });

        return NextResponse.json({
            insight: text,
            hasWeakTopics: weakTopics.length > 0,
            hasOverdue: overdueTopics.length > 0
        });
    } catch (error) {
        console.error("Strategist error:", error);
        return NextResponse.json(
            { error: "Failed to generate strategist insight" },
            { status: 500 },
        );
    }
}
