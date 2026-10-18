import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { contentId, platform, scheduledTime } = await req.json();

    const client = await clientPromise;
    const db = client.db("commandai");
    const contentCollection = db.collection("content");
    const jobsCollection = db.collection("jobs");

    // Verify ownership before publishing
    const existingContent = await contentCollection.findOne({
      _id: new ObjectId(contentId),
      workspaceId: new ObjectId(session.user.id as string)
    });

    if (!existingContent) {
      return new NextResponse("Content not found or access denied", { status: 404 });
    }

    // Update content status to 'scheduled' or 'published'
    const result = await contentCollection.updateOne(
      { _id: new ObjectId(contentId), workspaceId: new ObjectId(session.user.id as string) },
      { 
        $set: { 
          status: scheduledTime ? 'scheduled' : 'published',
          publishedAt: scheduledTime ? new Date(scheduledTime) : new Date(),
          platform: platform
        } 
      }
    );

    // Log the job
    await jobsCollection.insertOne({
      workspaceId: new ObjectId(session.user.id as string),
      agentRole: 'social_manager',
      command: `Published content to ${platform}`,
      status: 'completed',
      createdAt: new Date()
    });

    return NextResponse.json({ message: "Content published successfully" });
  } catch (error) {
    console.error("Publish error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
