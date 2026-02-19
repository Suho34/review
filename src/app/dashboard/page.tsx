import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";
import { Plus, List, Clock, CheckCircle, BookOpen } from "lucide-react";
import { StrategistInsight } from "@/components/dashboard/StrategistInsight";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getDifficultyColor } from "@/lib/utils";

export default async function DashboardPage() {
  const [session] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    connectDB(),
  ]);

  if (!session) {
    redirect("/sign-in");
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  // Parallelize data fetching
  const [dueTopics, totalTopics, struggleTopics] = await Promise.all([
    LearningEntry.find({
      userId: session.user.id,
      nextReviewAt: {
        $lte: startOfTomorrow,
      },
    })
      .sort({ nextReviewAt: 1 })
      .lean(),
    LearningEntry.countDocuments({
      userId: session.user.id,
    }),
    LearningEntry.find({
      userId: session.user.id,
      consecutiveStruggles: { $gte: 2 }
    }).limit(3).lean()
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Process your daily reviews and manage your learning.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/topics/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Topics
            </CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTopics}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reviews Due
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueTopics.length}</div>
            <p className="text-xs text-muted-foreground">
              {dueTopics.length > 0 ? "Action required" : "All caught up"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Streak
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {session.user.streak || 0} Days
            </div>
            <p className="text-xs text-muted-foreground">
              {session.user.streak > 0 ? "Keep it up!" : "Start your streak today!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Reviews Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {dueTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="font-semibold text-lg mb-1">All caught up!</h3>
                <p className="text-muted-foreground max-w-sm mb-4">
                  You have no reviews due for today.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/topics/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Topic
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dueTopics.map((topic) => (
                  <div
                    key={topic._id.toString()}
                    className="flex items-center border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {topic.topic}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {topic.notes || "No notes provided."}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Badge variant={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/review/${topic._id}`}>Review</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <div className="col-span-3 space-y-4">
          <StrategistInsight />

          {struggleTopics.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <BookOpen className="h-4 w-4" />
                  Critical Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Topics you've struggled with recently. Our Specialist Agent can help you master them.
                </p>
                {struggleTopics.map(topic => (
                  <div key={topic._id.toString()} className="flex items-center justify-between bg-background/50 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/50">
                    <span className="font-medium text-sm truncate max-w-[120px]" title={topic.topic}>
                      {topic.topic}
                    </span>
                    <Button size="sm" variant="secondary" className="h-8 text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50" asChild>
                      <Link href={`/chat?mode=specialist&topicId=${topic._id}`}>
                        Consult Agent
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div >
  );
}
