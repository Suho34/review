import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";
import { calculateNextReviewDate, type Difficulty } from "@/lib/scheduler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const topic = await LearningEntry.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: topic,
    });
  } catch (error) {
    console.error("Fetch topic error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Get parameters and request data
    const { id } = await params;
    const body = await request.json();
    const { difficulty } = body;

    // 2. Validate difficulty
    if (!difficulty) {
      return NextResponse.json(
        { error: "Difficulty is required" },
        { status: 400 },
      );
    }

    const validDifficulties: Difficulty[] = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Difficulty must be: easy, medium, or hard" },
        { status: 400 },
      );
    }

    // 3. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Connect to database
    await connectDB();

    // 5. Find the topic first (needed for correct scheduling)
    const topic = await LearningEntry.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // 6. Calculate next review date using previous history
    const now = new Date();
    const nextReviewAt = calculateNextReviewDate(
      difficulty,
      topic.lastReviewedAt,
      now,
    );

    // 7. Update and save
    topic.lastReviewedAt = now;
    topic.nextReviewAt = nextReviewAt;
    topic.difficulty = difficulty;
    await topic.save();

    // 8. Return success
    return NextResponse.json(
      {
        message: "Review recorded successfully",
        topic,
        success: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 },
    );
  }
}
