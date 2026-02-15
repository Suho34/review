import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";
import User from "@/models/User";
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

    // Update statistics
    topic.totalReviews = (topic.totalReviews || 0) + 1;
    if (difficulty === "hard") {
      topic.consecutiveStruggles = (topic.consecutiveStruggles || 0) + 1;
    } else {
      topic.consecutiveStruggles = 0;
    }

    await topic.save();

    // 8. Update User Streak
    // We update the user streak *after* the topic is saved to ensure the review counts.
    // If this fails, it's not critical to the review itself, but we log the error.
    try {
      const user = await User.findById(session.user.id);

      if (user) {
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const lastStudyDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;

        let shouldUpdate = false;

        if (lastStudyDate) {
          lastStudyDate.setHours(0, 0, 0, 0);
          const diffTime = Math.abs(today.getTime() - lastStudyDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Consecutive day
            user.streak = (user.streak || 0) + 1;
            user.lastStudyDate = now;
            shouldUpdate = true;
          } else if (diffDays > 1) {
            // Broken streak
            user.streak = 1;
            user.lastStudyDate = now;
            shouldUpdate = true;
          }
          // If diffDays === 0, same day, do nothing (or update timestamp if we want precise last study time)
        } else {
          // First ever study
          user.streak = 1;
          user.lastStudyDate = now;
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await user.save();
        }
      }
    } catch (streakError) {
      console.error("Failed to update streak:", streakError);
      // We don't block the response here
    }

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
