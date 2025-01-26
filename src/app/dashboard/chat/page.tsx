import { ChatContainer } from "@/components/chat/chat-container";

export default function ChatPage() {
  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Toyota AI Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Get instant answers about Toyota vehicles and your personalized
            recommendations
          </p>
        </div>
        <ChatContainer />
      </div>
    </main>
  );
}
