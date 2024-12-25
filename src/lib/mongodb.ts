// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
  }
}
