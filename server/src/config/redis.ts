import { createClient } from 'redis';

export const subscriber = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
    }
});

export const publisher = createClient({ 
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379"),
    }
});

export async function connectRedis() {
    try {
        await subscriber.connect();
        await publisher.connect();
        console.log("✅ Redis clients connected.");
    } catch (error) {
        console.error("❌ Error connecting to Redis:", error);
    }
}