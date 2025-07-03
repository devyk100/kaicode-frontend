import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let globalRedisClient: ReturnType<typeof createClient>;

declare global {
  var _redis: typeof globalRedisClient | undefined;
}

const client = global._redis ?? createClient({
  url: redisUrl,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

if (!global._redis) {
  global._redis = client;
}

export async function getRedisClient() {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      throw error;
    }
  }
  return client;
}
