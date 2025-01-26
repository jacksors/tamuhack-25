import { CarLogo } from "@/components/ui/car-logo";
import { SignInButton } from "@/components/ui/sign-in-button";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CarIcon } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <AnimatedGradient />
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2 pt-8">
          <CarIcon height={100} width={100} />
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-center text-muted-foreground">
            Sign in to TamuHack 2025 to continue your journey
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <SignInButton />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
