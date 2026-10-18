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
    const campaignsCollection = db.collection("campaigns");

    const campaigns = await campaignsCollection.find({ workspaceId: new ObjectId(session.user.id as string) }).toArray();

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
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
    const { name, platforms } = body;

    if (!name || !platforms) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("commandai");
    const campaignsCollection = db.collection("campaigns");

    const newCampaign = {
      workspaceId: new ObjectId(session.user.id as string),
      name,
      platforms,
      status: "draft",
      createdAt: new Date()
    };

    const result = await campaignsCollection.insertOne(newCampaign);

    return NextResponse.json({ ...newCampaign, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
