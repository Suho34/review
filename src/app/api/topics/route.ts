import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { headers } from "next/headers";
import { LearningEntry } from "@/models/LearningEntity";
import { NextResponse } from "next/server";
import { calculateNextReviewDate } from "@/lib/scheduler";
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), // Pass the request headers to getSession
    });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 },
      );
    }

    await connectDB();

    const topics = await LearningEntry.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 }) // 1 = ascending (earliest first)
      .limit(20);
    return NextResponse.json({ topics, success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    const body = await request.json();
    const { topic, notes, difficulty } = body;

    if (!topic || !notes || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 },
      );
    }

    await connectDB();
    const newTopic = await LearningEntry.create({
      userId: session.user.id,
      topic,
      notes,
      difficulty,
      lastReviewed: new Date(),
      nextReviewAt: calculateNextReviewDate(difficulty),
    });
    return NextResponse.json(
      { topic: newTopic, success: true },
      { status: 201 },
    );
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Failed to create topic", success: false },
      { status: 500 },
    );
  }
}
