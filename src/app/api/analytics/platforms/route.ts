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

    // Aggregate metrics by platform
    const platformData = await contentCollection.aggregate([
      { $match: { workspaceId: new ObjectId(session.user.id as string) } },
      { 
        $group: { 
          _id: "$platform", 
          totalReach: { $sum: "$metrics.reach" },
          totalEngagement: { $sum: "$metrics.engagement" },
          count: { $sum: 1 }
        } 
      }
    ]).toArray();

    // Map to frontend chart format (value is reach limit representation)
    const formattedData = platformData.map(p => ({
      name: p._id,
      value: p.totalReach,
      fill: getPlatformColor(p._id)
    }));

    // If no data, return mock for chart rendering
    if (formattedData.length === 0) {
      return NextResponse.json([
        { name: 'Instagram', value: 45, fill: '#E040FB' },
        { name: 'TikTok', value: 30, fill: '#FF6090' },
        { name: 'Twitter/X', value: 15, fill: '#1DA1F2' },
        { name: 'LinkedIn', value: 10, fill: '#0A66C2' },
      ]);
    }

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error("Failed to fetch platform analytics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function getPlatformColor(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram': return '#E040FB';
    case 'tiktok': return '#FF6090';
    case 'twitter':
    case 'twitter/x': return '#1DA1F2';
    case 'linkedin': return '#0A66C2';
    default: return '#FF9100';
  }
}
