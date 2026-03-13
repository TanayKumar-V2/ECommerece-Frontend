import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;

    const message = String(e?.message || '');
    const looksLikeNetworkIssue =
      message.includes('Could not connect to any servers in your MongoDB Atlas cluster') ||
      message.includes('Server selection timed out') ||
      message.includes('querySrv ENOTFOUND') ||
      message.includes('ECONNREFUSED');

    if (looksLikeNetworkIssue) {
      throw new Error(
        [
          'MongoDB Atlas connection failed.',
          'Likely causes:',
          '1) Your current IP is not allowed in Atlas Network Access.',
          '2) Username/password in MONGODB_URI is wrong or needs URL encoding.',
          '3) DNS/network is blocking Atlas SRV resolution.',
          'Fix checklist:',
          '- Atlas -> Network Access: add your current IP (or 0.0.0.0/0 for temporary dev only).',
          '- Atlas -> Database Access: verify user credentials and permissions.',
          '- If password has special chars, URL-encode it in MONGODB_URI.',
        ].join(' ')
      );
    }

    throw e;
  }

  return cached.conn;
}

export default dbConnect;
