import dotenv from "dotenv"

dotenv.config({
    path: "../../.env",
});

import { PrismaClient } from '../../../generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter });

export * from '../../../generated/prisma/enums.js';

