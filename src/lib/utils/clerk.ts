import { createClerkClient } from '@clerk/nextjs/server';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export async function getUser(userId: string) {
  try {
    return await clerk.users.getUser(userId);
  } catch (error) {
    console.error(`[Clerk Error] Failed to get user ${userId}:`, error);
    return null;
  }
}

export async function updateUserMetadata(userId: string, metadata: Record<string, unknown>) {
  try {
    return await clerk.users.updateUserMetadata(userId, {
      publicMetadata: metadata,
    });
  } catch (error) {
    console.error(`[Clerk Error] Failed to update metadata for ${userId}:`, error);
    return null;
  }
}
