import { Card } from "@/components/ui/card";
import { Car } from "lucide-react";

export default function CallbackLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-4 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-primary/10">
          <Car className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Saving your preferences...</h1>
        <p className="text-muted-foreground">
          We're personalizing your Toyota experience. This will just take a
          moment.
        </p>
      </Card>
    </main>
  );
}
