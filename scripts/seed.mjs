import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined. Make sure you run this script with --env-file=.env.local');
  process.exit(1);
}

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('commandai');

    // 1. Seed Users
    const users = db.collection('users');
    await users.deleteMany({}); // Clear existing
    const passwordHash = await bcrypt.hash('password123', 10);
    const defaultUser = await users.insertOne({
      name: 'Pixalified Admin',
      email: 'admin@pixalified.ai',
      passwordHash,
      role: 'admin',
      createdAt: new Date()
    });
    const workspaceId = defaultUser.insertedId;
    console.log('Seeded 1 user: admin@pixalified.ai / password123');

    // 2. Seed Agents
    const agents = db.collection('agents');
    await agents.deleteMany({});
    await agents.insertMany([
      {
        workspaceId,
        name: "Content Creator",
        role: "content_creator",
        description: "Generates stunning visuals, carousel designs, and video scripts for Instagram, TikTok, and YouTube.",
        emoji: "🎨",
        status: "active",
        createdAt: new Date()
      },
      {
        workspaceId,
        name: "Social Manager",
        role: "social_manager",
        description: "Schedules posts, manages community replies, and optimizes posting times across all platforms.",
        emoji: "📱",
        status: "active",
        createdAt: new Date()
      },
      {
        workspaceId,
        name: "Trend Scout",
        role: "trend_scout",
        description: "Monitors viral trends, hashtags, and competitor moves to trigger opportunistic campaigns.",
        emoji: "🔥",
        status: "idle",
        createdAt: new Date()
      }
    ]);
    console.log('Seeded 3 agents');

    // 3. Seed Campaigns
    const campaigns = db.collection('campaigns');
    await campaigns.deleteMany({});
    const campaignResult = await campaigns.insertOne({
      workspaceId,
      name: "Q3 SaaS Product Launch",
      status: "in_progress",
      platforms: ["Instagram", "Twitter", "LinkedIn"],
      createdAt: new Date()
    });
    console.log('Seeded 1 campaign');

    // 4. Seed Content
    const content = db.collection('content');
    await content.deleteMany({});
    await content.insertMany([
      {
        workspaceId,
        campaignId: campaignResult.insertedId,
        title: "Product Launch Reel",
        platform: "Instagram",
        status: "published",
        metrics: { reach: 45200, engagement: 12.4 },
        createdAt: new Date()
      },
      {
        workspaceId,
        campaignId: campaignResult.insertedId,
        title: "AI Marketing Thread",
        platform: "Twitter",
        status: "published",
        metrics: { reach: 18700, engagement: 6.8 },
        createdAt: new Date()
      }
    ]);
    console.log('Seeded 2 content pieces');

    // Seed Knowledge Base
    const knowledgeCollection = db.collection("knowledge");
    await knowledgeCollection.deleteMany({ workspaceId: workspaceId });
    await knowledgeCollection.insertMany([
      {
        workspaceId: workspaceId,
        name: "Brand_Voice_Guidelines_2024.pdf",
        type: "pdf",
        size: "2.4 MB",
        status: "Vectorized",
        createdAt: new Date()
      },
      {
        workspaceId: workspaceId,
        name: "Competitor_Analysis_Q3.csv",
        type: "data",
        size: "845 KB",
        status: "Vectorized",
        createdAt: new Date()
      },
      {
        workspaceId: workspaceId,
        name: "Product FAQ - Help Center",
        type: "url",
        size: "URL",
        status: "Vectorized",
        createdAt: new Date()
      }
    ]);
    console.log('Seeded 3 knowledge base items');

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seed().catch(console.dir);
