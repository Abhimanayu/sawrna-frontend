import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalWithMongoose = global as typeof globalThis & { mongooseCache?: Cached };
const cached = globalWithMongoose.mongooseCache || { conn: null, promise: null };
globalWithMongoose.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  cached.promise ||= mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || "sawrna" });
  cached.conn = await cached.promise;
  return cached.conn;
}
