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
    const contentCollection = db.collection("content");

    // Fetch the 5 most recent or highest-reach content pieces
    const topContent = await contentCollection
      .find({ workspaceId: new ObjectId(session.user.id as string), status: "published" })
      .sort({ "metrics.reach": -1 }) // Sort by highest reach
      .limit(5)
      .toArray();

    // Map MongoDB documents to the format expected by the frontend Top Social Posts widget
    const formattedContent = topContent.map(post => ({
      id: post._id.toString(),
      title: post.title,
      platform: post.platform,
      views: post.metrics?.reach >= 1000 ? `${(post.metrics.reach / 1000).toFixed(1)}K` : post.metrics?.reach?.toString() || "0",
      likes: post.metrics?.likes >= 1000 ? `${(post.metrics.likes / 1000).toFixed(1)}K` : post.metrics?.likes?.toString() || "0",
      comments: post.metrics?.comments?.toString() || "0",
      shares: post.metrics?.shares >= 1000 ? `${(post.metrics.shares / 1000).toFixed(1)}K` : post.metrics?.shares?.toString() || "0",
      trend: `+${Math.floor(Math.random() * 100) + 10}%`, // Mock trend
    }));

    return NextResponse.json(formattedContent);
  } catch (error) {
    console.error("Failed to fetch top content:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
