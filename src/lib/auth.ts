import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

// Singleton pattern for MongoDB client to prevent multiple connections in dev
let dbClient: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClient) {
    (global as any)._mongoClient = client;
  }
  dbClient = (global as any)._mongoClient;
} else {
  dbClient = client;
}

const db = dbClient.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: dbClient,
  }),

  user: {
    additionalFields: {
      streak: {
        type: "number",
        defaultValue: 0,
      },
      lastStudyDate: {
        type: "date",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});
