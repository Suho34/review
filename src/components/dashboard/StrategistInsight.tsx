"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BrainCircuit } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface StrategistResponse {
    insight: string;
    hasWeakTopics?: boolean;
    hasOverdue?: boolean;
}

export function StrategistInsight() {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasWeakTopics, setHasWeakTopics] = useState(false);

    useEffect(() => {
        async function fetchInsight() {
            try {
                const res = await fetch("/api/strategist", { method: "POST" });
                if (!res.ok) throw new Error("Failed to fetch");
                const data: StrategistResponse = await res.json();
                setInsight(data.insight);
                setHasWeakTopics(!!data.hasWeakTopics);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchInsight();
    }, []);

    if (error) return null;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Strategist Insight
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {insight}
                        </p>
                        {hasWeakTopics && (
                            <div className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-500 border border-amber-500/20">
                                <strong>Tip:</strong> You have several weak topics. Consistently reviewing them is key!
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
