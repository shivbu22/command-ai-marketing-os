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
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ 
      _id: new ObjectId(session.user.id as string) 
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Return safe user settings
    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      settings: user.settings || {
        theme: "dark",
        notifications: true,
        openaiKey: user.settings?.openaiKey ? "****" : "" // Mask key
      }
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, settings } = body;

    const client = await clientPromise;
    const db = client.db("commandai");
    const usersCollection = db.collection("users");

    const updateData: { name?: string; settings?: Record<string, unknown> } = {};
    if (name) updateData.name = name;
    if (settings) {
      // Merge with existing settings
      const user = await usersCollection.findOne({ _id: new ObjectId(session.user.id as string) });
      updateData.settings = { ...(user?.settings || {}), ...settings };
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id as string) },
      { $set: updateData }
    );

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings PATCH error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
