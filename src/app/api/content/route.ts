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

    const content = await contentCollection.find({ 
      workspaceId: new ObjectId(session.user.id as string) 
    }).toArray();

    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, platform, body: contentBody, campaignId } = body;

    if (!title || !platform || !contentBody) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("commandai");
    const contentCollection = db.collection("content");

    const newContent = {
      workspaceId: new ObjectId(session.user.id as string),
      campaignId: campaignId || null,
      title,
      platform,
      body: contentBody,
      status: "draft",
      metrics: { reach: 0, engagement: 0, likes: 0, shares: 0, comments: 0 },
      createdAt: new Date()
    };

    const result = await contentCollection.insertOne(newContent);

    return NextResponse.json({ ...newContent, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to create content:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
