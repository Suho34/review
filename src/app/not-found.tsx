import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-6 max-w-md px-4">
                <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">404</h1>
                <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you are looking for might have been removed, had its name
                    changed, or is temporarily unavailable.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
