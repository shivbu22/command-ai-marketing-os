import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("commandai");
    const jobsCollection = db.collection("jobs");
    const agentsCollection = db.collection("agents");

    // Fetch the 10 most recent jobs/activities
    const jobs = await jobsCollection
      .find({ workspaceId: new ObjectId(session.user.id as string) }) 
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Map jobs to the format expected by Dashboard's Agent Activity Feed.
    if (jobs.length > 0) {
      const feedItems = jobs.map(job => ({
        id: job._id.toString(),
        agent: job.agentRole ? job.agentRole.replace('_', ' ').toUpperCase() : "SYSTEM",
        agentRole: job.agentRole,
        message: job.command,
        agentResponse: job.agentResponse,
        status: job.status,
        type: job.status === 'completed' ? 'complete' : 'progress',
        createdAt: job.createdAt
      }));
      return NextResponse.json(feedItems);
    }

    // Fallback to mock data if no real jobs exist yet
    const mockFeed = [
      {
        id: "1",
        agent: "Trend Scout",
        agentRole: "trend_scout",
        message: "Identifying high-growth hashtags for #SaaSLaunch",
        status: "completed",
        type: "complete",
        createdAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: "2",
        agent: "Content Creator",
        agentRole: "content_creator",
        message: "Drafting 5 variations of Instagram Reels for coffee brand",
        status: "completed",
        type: "complete",
        createdAt: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: "3",
        agent: "Social Manager",
        agentRole: "social_manager",
        message: "Optimizing posting schedule for maximum reach",
        status: "in-progress",
        type: "progress",
        createdAt: new Date(Date.now() - 1000 * 60 * 2)
      }
    ];

    return NextResponse.json(mockFeed);
  } catch (error) {
    console.error("Feed error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
