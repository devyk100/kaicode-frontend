// lib/redis.ts
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const client = createClient({
  url: redisUrl,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', (err) => console.error('Redis Client Error', err));

export async function getRedisClient() {
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}
