"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Check,
    Plus,
    AlertCircle,
    Loader2,
    Lightbulb,
} from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Define the form data structure
interface TopicFormData {
    topic: string;
    notes: string;
    difficulty: "easy" | "medium" | "hard";
}

export default function AddTopicPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState<TopicFormData>({
        topic: "",
        notes: "",
        difficulty: "medium",
    });

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear errors when user starts typing
        if (error) setError(null);
    };

    const setDifficulty = (difficulty: "easy" | "medium" | "hard") => {
        setFormData((prev) => ({ ...prev, difficulty }));
    };

    // Form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Basic validation
        if (!formData.topic.trim()) {
            setError("Topic name is required");
            setIsSubmitting(false);
            return;
        }

        if (formData.topic.length > 200) {
            setError("Topic name must be less than 200 characters");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch("/api/topics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create topic");
            }

            // Success!
            setSuccess(true);

            // Reset form
            setFormData({
                topic: "",
                notes: "",
                difficulty: "medium",
            });

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh(); // Refresh server components
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <Shell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md w-full border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10">
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                                <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                Topic Created!
                            </h2>
                            <p className="text-muted-foreground">
                                Redirecting you to the dashboard...
                            </p>
                            <div className="h-1 w-full bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 animate-[pulse_1s_ease-in-out_infinite]" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Shell>
        );
    }

    return (
        <Shell>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link
                        href="/topics"
                        className="flex items-center hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Topics
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Add Topic</span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Add New Topic</h1>
                    <p className="text-muted-foreground">
                        Create a new learning topic to track and review.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Topic Details</CardTitle>
                            <CardDescription>
                                Fill in the details about what you want to learn.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic Name *</Label>
                                <Input
                                    id="topic"
                                    name="topic"
                                    placeholder="e.g., React Hooks, MongoDB Indexing"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    maxLength={200}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Be specific for better recall.</span>
                                    <span
                                        className={
                                            formData.topic.length > 180 ? "text-amber-500" : ""
                                        }
                                    >
                                        {formData.topic.length}/200
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Initial Difficulty</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {(["easy", "medium", "hard"] as const).map((level) => (
                                        <div
                                            key={level}
                                            className={`
                        relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent
                        ${formData.difficulty === level
                                                    ? "border-primary bg-accent"
                                                    : "border-transparent bg-muted/50"
                                                }
                      `}
                                            onClick={() => setDifficulty(level)}
                                        >
                                            <Badge variant={level} className="mb-2 capitalize">
                                                {level}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground text-center">
                                                {level === "easy"
                                                    ? "7 days"
                                                    : level === "medium"
                                                        ? "3 days"
                                                        : "1 day"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                    <Lightbulb className="w-3 h-3" />
                                    <span>
                                        Difficulty determines the first review interval.
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes & Details</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Add examples, resources, or mnemonics..."
                                    value={formData.notes}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="min-h-[120px]"
                                    maxLength={5000}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                    <span
                                        className={
                                            formData.notes.length > 4500 ? "text-amber-500" : ""
                                        }
                                    >
                                        {formData.notes.length}/5000
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {error}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push("/topics")}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Topic
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </Shell>
    );
}
