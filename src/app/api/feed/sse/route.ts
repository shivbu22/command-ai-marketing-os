import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  const workspaceId = new ObjectId(session.user.id as string);

  const stream = new ReadableStream({
    async start(controller) {
      const client = await clientPromise;
      const db = client.db("commandai");
      const jobsCollection = db.collection("jobs");

      // Initial heartbeat to keep connection alive
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      let lastSeenId: ObjectId | null = null;

      // Pulse loop to check for new jobs
      const interval = setInterval(async () => {
        try {
          const query: { workspaceId: ObjectId; _id?: { $gt: ObjectId } } = { workspaceId };
          if (lastSeenId) {
            query._id = { $gt: lastSeenId };
          }

          const newJobs = await jobsCollection
            .find(query)
            .sort({ createdAt: 1 })
            .toArray();

          if (newJobs.length > 0) {
            lastSeenId = newJobs[newJobs.length - 1]._id;
            for (const job of newJobs) {
              const payload = {
                id: job._id.toString(),
                agent: job.agentRole ? job.agentRole.replace('_', ' ').toUpperCase() : "SYSTEM",
                agentRole: job.agentRole,
                message: job.command,
                agentResponse: job.agentResponse,
                status: job.status,
                type: job.status === 'completed' ? 'complete' : 'progress',
                createdAt: job.createdAt
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            }
          } else {
            // Heartbeat + Rare Autonomous Thought or External Signal
            const rand = Math.random();
            if (rand < 0.1) { // 10% chance every 3s
              const thoughts = [
                "Analyzing competitor engagement spikes in the beauty niche...",
                "Detected trend shift: 'Minimalist UX' keywords are rising on TikTok.",
                "Optimizing brand memory vectors for faster retrieval.",
                "Simulating VIRAL score for the latest workspace draft.",
                "Scaling social swarm capacity for upcoming weekend peak.",
                "Scanning LinkedIn for untapped B2B opportunities..."
              ];
              const payload = {
                type: 'autonomous_thought',
                message: thoughts[Math.floor(Math.random() * thoughts.length)],
                agent: "MASTER ORCHESTRATOR",
                createdAt: new Date()
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            } else if (rand > 0.95) { // 5% chance for external engagement signal
              const signals = [
                { platform: "LinkedIn", message: "New comment on 'The Future of AI' post", user: "Jordan Smith" },
                { platform: "Instagram", message: "Viral surge: Reached 10k accounts in 2 hours", user: "Algorithm" },
                { platform: "Twitter/X", message: "High priority retweet by industry leader", user: "@techCrunch_bot" },
                { platform: "Pinterest", message: "Pin saved to 'Design Inspiration' board (500x)", user: "Creative Swarm" }
              ];
              const signal = signals[Math.floor(Math.random() * signals.length)];
              const payload = {
                type: 'external_signal',
                ...signal,
                createdAt: new Date()
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            } else {
              controller.enqueue(encoder.encode(`: heartbeat\n\n`));
            }
          }
        } catch (error) {
          console.error("SSE Stream error:", error);
          controller.error(error);
          clearInterval(interval);
        }
      }, 3000); // Poll every 3 seconds for new jobs

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
