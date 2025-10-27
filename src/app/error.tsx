"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. You can try to recover from this error.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            {error.message && <p className="text-sm text-destructive">{error.message}</p>}
            <Button onClick={() => reset()}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
