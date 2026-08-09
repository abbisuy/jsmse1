import { Liveblocks } from "@liveblocks/node";

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

function createLiveblocksClient(): Liveblocks {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "LIVEBLOCKS_SECRET_KEY is not set. Add it to .env.local from https://liveblocks.io/dashboard/apikeys"
    );
  }
  return new Liveblocks({ secret });
}

// Lazy singleton: Liveblocks validates the secret key shape on construction,
// so we defer until first use. This lets `next build` succeed even when the
// developer hasn't added LIVEBLOCKS_SECRET_KEY to .env.local yet.
function getLiveblocks(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = createLiveblocksClient();
  }
  return globalForLiveblocks.liveblocks;
}

export const liveblocks = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getLiveblocks();
      const value = (client as unknown as Record<string | symbol, unknown>)[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
) as Liveblocks;

// Fixed 12-color palette tuned for visibility on the dark theme background.
const CURSOR_PALETTE = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#14b8a6",
  "#a855f7",
  "#84cc16",
] as const;

export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % CURSOR_PALETTE.length;
  return CURSOR_PALETTE[index];
}
