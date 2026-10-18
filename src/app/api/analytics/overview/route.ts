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
    
    // In a real app, these would be aggregated from the analytics_events collection.
    // For this implementation phase, we'll calculate them based on the 'content' collection metrics.
    const contentCollection = db.collection("content");
    const content = await contentCollection.find({ 
      workspaceId: new ObjectId(session.user.id as string) 
    }).toArray();

    const totalReach = content.reduce((sum, item) => sum + (item.metrics?.reach || 0), 0);
    const avgEngagement = content.length > 0
      ? content.reduce((sum, item) => sum + (item.metrics?.engagement || 0), 0) / content.length
      : 0;

    // Viral score (mock calculation for demo)
    const viralScore = Math.min(100, Math.round((totalReach / 1000) * (avgEngagement / 5)));

    return NextResponse.json({
      totalReach: {
        value: totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString(),
        trend: "+12% this week", // Mock trend
        isPositive: true
      },
      engagementRate: {
        value: `${avgEngagement.toFixed(1)}%`,
        trend: "+1.2% vs avg", // Mock trend
        isPositive: true
      },
      contentCreated: {
        value: content.length.toString(),
        trend: "+5 this week",
        isPositive: true
      },
      viralScore: {
        value: viralScore.toString(),
        trend: "Trending up",
        isPositive: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch analytics overview:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
