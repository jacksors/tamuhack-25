interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface TokenWindow {
  tokens: number;
  timestamp: number;
}

export class OpenAIRateLimiter {
  private static instance: OpenAIRateLimiter;
  private tokenWindows: TokenWindow[] = [];
  private readonly TOKENS_PER_MINUTE_LIMIT = 200_000;
  private readonly WINDOW_SIZE = 60_000; // 1 minute in milliseconds

  private constructor() {}

  static getInstance(): OpenAIRateLimiter {
    if (!OpenAIRateLimiter.instance) {
      OpenAIRateLimiter.instance = new OpenAIRateLimiter();
    }
    return OpenAIRateLimiter.instance;
  }

  private cleanOldWindows() {
    const now = Date.now();
    this.tokenWindows = this.tokenWindows.filter(
      (window) => now - window.timestamp < this.WINDOW_SIZE,
    );
  }

  private getCurrentTokens(): number {
    this.cleanOldWindows();
    return this.tokenWindows.reduce((sum, window) => sum + window.tokens, 0);
  }

  async checkLimit(estimatedTokens: number): Promise<boolean> {
    const currentTokens = this.getCurrentTokens();
    return currentTokens + estimatedTokens <= this.TOKENS_PER_MINUTE_LIMIT;
  }

  async recordUsage(usage: TokenUsage) {
    this.tokenWindows.push({
      tokens: usage.total_tokens,
      timestamp: Date.now(),
    });
    this.cleanOldWindows();
  }

  async getCurrentUsage(): Promise<number> {
    return this.getCurrentTokens();
  }

  async waitForCapacity(estimatedTokens: number): Promise<void> {
    while (!(await this.checkLimit(estimatedTokens))) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
