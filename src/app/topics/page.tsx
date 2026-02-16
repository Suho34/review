import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { LearningEntry } from "@/models/LearningEntity";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

import { cn, getDifficultyColor } from "@/lib/utils";

export default async function TopicsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  await connectDB();

  // Fetch all topics, sorted by most recently created
  const topics = await LearningEntry.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Topics</h2>
          <p className="text-muted-foreground">
            Manage and review all your learning entries.
          </p>
        </div>
        <Button asChild>
          <Link href="/topics/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          className="pl-10 max-w-md"
          disabled
        />
      </div>

      {topics.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-background p-3 mb-4 ring-1 ring-border">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No topics yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven&apos;t added any learning topics yet. Start by
              creating your first entry!
            </p>
            <Button asChild>
              <Link href="/topics/new">
                <Plus className="mr-2 h-4 w-4" />
                Create First Topic
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Card
              key={topic._id.toString()}
              className="flex flex-col group hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant={getDifficultyColor(topic.difficulty)}>
                    {topic.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {topic.nextReviewAt < new Date() ? (
                      <span className="text-destructive font-medium">
                        Due now
                      </span>
                    ) : (
                      new Date(topic.nextReviewAt).toLocaleDateString()
                    )}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 mt-2 group-hover:text-primary transition-colors">
                  {topic.topic}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {topic.notes || "No notes provided."}
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  asChild
                >
                  <Link href={`/review/${topic._id}`}>
                    <span>Study Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
