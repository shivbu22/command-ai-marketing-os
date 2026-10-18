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
    const knowledgeCollection = db.collection("knowledge");

    const assets = await knowledgeCollection.find({ workspaceId: new ObjectId(session.user.id as string) }).toArray();

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Failed to fetch knowledge assets:", error);
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
    const { name, type, size } = body;

    if (!name || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("commandai");
    const knowledgeCollection = db.collection("knowledge");

    const newAsset = {
      workspaceId: new ObjectId(session.user.id as string),
      name,
      type,
      size: size || "N/A",
      status: "Vectorized", // Mocking status for phase 2B
      createdAt: new Date()
    };

    const result = await knowledgeCollection.insertOne(newAsset);

    return NextResponse.json({ ...newAsset, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Failed to create knowledge asset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
