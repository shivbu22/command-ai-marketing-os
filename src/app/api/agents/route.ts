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
    const agentsCollection = db.collection("agents");

    // Fetch agents for the current workspace
    const agents = await agentsCollection.find({ 
      workspaceId: new ObjectId(session.user.id as string) 
    }).toArray();

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
