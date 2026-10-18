import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse("Invalid email format", { status: 400 });
    }

    if (password.length < 8) {
      return new NextResponse("Password must be at least 8 characters", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("commandai");
    const collection = db.collection("users");

    // Check if user already exists
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return new NextResponse("Email already registered", { status: 400 });
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const result = await collection.insertOne({
      name,
      email,
      passwordHash,
      role: "user", // Default to standard user — admins must be promoted manually
      createdAt: new Date(),
    });

    return NextResponse.json({
      id: result.insertedId,
      name,
      email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
