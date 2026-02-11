import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";

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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const topics = await LearningEntry.find({
      userId: session.user.id,
      nextReviewAt: {
        // $gte: startOfToday, // Greater than or equal to today midnight
        $lte: startOfTomorrow, // Less than tomorrow midnight
      },
    }).sort({ nextReviewAt: 1 });

    return NextResponse.json({ data: topics, success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch today's reviews" },
      { status: 500 },
    );
  }
}
