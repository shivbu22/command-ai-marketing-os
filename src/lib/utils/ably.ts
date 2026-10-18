import Ably from 'ably';

const ably = new Ably.Realtime(process.env.ABLY_API_KEY || '');

export async function publishToChannel(channelName: string, eventName: string, data: unknown) {
  try {
    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
    return { success: true };
  } catch (error) {
    console.error(`[Ably Error] Failed to publish to ${channelName}:`, error);
    return { success: false, error };
  }
}

export function getAblyChannel(channelName: string) {
  return ably.channels.get(channelName);
}
