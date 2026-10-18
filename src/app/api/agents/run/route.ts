import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { processCommand } from "@/lib/ai/orchestrator";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { command } = await req.json();

    if (!command) {
      return new NextResponse("Missing command", { status: 400 });
    }

    // Process using Orchestrator
    const result = await processCommand(command);

    // Log the job in the database
    const client = await clientPromise;
    const db = client.db("commandai");
    const jobsCollection = db.collection("jobs");

    const job = {
      workspaceId: new ObjectId(session.user.id as string),
      command,
      agentResponse: result.content,
      agentRole: result.agent,
      refinedTask: result.refinedTask,
      status: "completed",
      createdAt: new Date()
    };

    await jobsCollection.insertOne(job);

    // Also update the general feed? 
    // In a real app we might use SSE, for now the feed API reads from 'jobs'

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent execution error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
